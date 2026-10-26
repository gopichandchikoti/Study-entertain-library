import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { LibraryFile, UploadRecord } from '../@types/library.js'
import { isContained } from '../auth/file-policy.js'
import type { ServerConfig } from '../config/index.js'
import { mimeTypeForExtension } from '../helpers/extensions.js'
import { uniqueLocalPath } from '../helpers/files.js'
import { isUploadId, safeStoragePath, toPosix } from '../helpers/paths.js'
import { matchesDeclaredType, SIGNATURE_BYTES } from '../helpers/signatures.js'
import type { UploadClassifier, UploadSource } from './classification.js'
import type { LibraryService } from './library.js'
import type { RemoteStorage } from './remote-storage.js'

const REMOTE_INBOX = '.study-library-inbox'
const PREVIEW_RESPONSE_LIMIT = 2400
/** One account can have this many uploads waiting for review, so staging cannot be used to fill the disk. */
export const MAX_STAGED_PER_OWNER = 10
/** A staged upload nobody approved within a day is deleted; it can no longer be committed. */
export const STAGED_TTL_MS = 24 * 60 * 60 * 1000

export type StagedUpload = { record: UploadRecord; previewText: string }
export type CommittedUpload = { path: string; file: LibraryFile | null }

/** The upload cannot be accepted as asked; the message is safe to show because it names no file or path. */
export class UploadRejected extends Error {}

/**
 * The staged upload workflow: stage, classify, review, then commit or discard. Nothing reaches the library until the
 * owner approves a destination, and AI output is only ever a suggestion.
 */
export class UploadService {
  constructor(
    private readonly config: ServerConfig,
    private readonly library: LibraryService,
    private readonly remote: RemoteStorage | null,
    private readonly classifier: UploadClassifier,
    private readonly now: () => number = Date.now,
  ) {}

  private isExpired(record: UploadRecord): boolean {
    return this.now() - Date.parse(record.uploadedAt) > STAGED_TTL_MS
  }

  private metadataPath(id: string): string {
    return path.join(this.config.uploads.directory, `${id}.json`)
  }

  private storedPath(record: UploadRecord): string {
    return path.join(this.config.uploads.directory, record.storedName)
  }

  private remoteStoredPath = (record: UploadRecord): string => `${REMOTE_INBOX}/${record.storedName}`

  private remoteMetadataPath = (id: string): string => `${REMOTE_INBOX}/${id}.json`

  /** The review record for a staged upload, or null when it is unknown, damaged or past its lifetime. */
  async read(id: string): Promise<UploadRecord | null> {
    const record = await this.readAnyAge(id)
    return record && !this.isExpired(record) ? record : null
  }

  private async readAnyAge(id: string): Promise<UploadRecord | null> {
    if (!isUploadId(id)) return null
    try {
      const content = this.remote
        ? (await this.remote.read(this.remoteMetadataPath(id))).toString('utf8')
        : await fs.readFile(this.metadataPath(id), 'utf8')
      const record = JSON.parse(content) as UploadRecord
      return record.id === id && path.basename(record.storedName) === record.storedName ? record : null
    } catch {
      return null
    }
  }

  /** Names of the files in the inbox: local directory entries, or the objects under the hosted inbox prefix. */
  private async inboxNames(): Promise<string[]> {
    if (this.remote) return this.remote.listNames(REMOTE_INBOX)
    return fs.readdir(this.config.uploads.directory).catch(() => [])
  }

  /**
   * How many uploads this account has waiting. Uploads past their lifetime, and stored files whose review record is gone,
   * are deleted on the way, so the inbox cannot grow without bound.
   */
  async stagedCount(ownerId: string | undefined): Promise<number> {
    const names = await this.inboxNames()
    const records = new Map<string, UploadRecord | null>()
    for (const name of names) {
      const id = name.endsWith('.json') ? name.slice(0, -'.json'.length) : ''
      if (isUploadId(id)) records.set(id, await this.readAnyAge(id))
    }
    let count = 0
    for (const record of records.values()) {
      if (!record) continue
      if (this.isExpired(record)) await this.discard(record)
      else if (record.ownerId === ownerId) count += 1
    }
    await this.removeOrphans(names, records)
    return count
  }

  /**
   * A stored file with no usable review record (left by a crash, or a damaged record) is deleted once it is older than a
   * staged upload may be. The age test keeps a file that is still being classified safe.
   */
  private async removeOrphans(names: string[], records: Map<string, UploadRecord | null>): Promise<void> {
    if (this.remote) return
    for (const name of names) {
      if (records.get(path.parse(name).name)) continue
      const target = path.join(this.config.uploads.directory, name)
      const stats = await fs.stat(target).catch(() => null)
      if (stats?.isFile() && this.now() - stats.mtimeMs > STAGED_TTL_MS) await fs.rm(target, { force: true })
    }
  }

  /** The leading bytes of the file that was just received, enough to recognise its real type. */
  private async headOf(file: Express.Multer.File): Promise<Buffer> {
    if (file.buffer) return file.buffer.subarray(0, SIGNATURE_BYTES)
    const handle = await fs.open(file.path, 'r')
    try {
      const { bytesRead, buffer } = await handle.read(Buffer.alloc(SIGNATURE_BYTES), 0, SIGNATURE_BYTES, 0)
      return buffer.subarray(0, bytesRead)
    } finally {
      await handle.close()
    }
  }

  private async write(record: UploadRecord): Promise<void> {
    const content = Buffer.from(JSON.stringify(record, null, 2), 'utf8')
    if (this.remote) await this.remote.upload(this.remoteMetadataPath(record.id), content, 'application/json')
    else await fs.writeFile(this.metadataPath(record.id), content)
  }

  async discard(record: UploadRecord): Promise<void> {
    if (this.remote) {
      await Promise.all([
        this.remote.remove(this.remoteStoredPath(record)),
        this.remote.remove(this.remoteMetadataPath(record.id)),
      ])
      return
    }
    await Promise.all([fs.rm(this.storedPath(record), { force: true }), fs.rm(this.metadataPath(record.id), { force: true })])
  }

  /** Stores the multer file, classifies it and writes its review record. Partial writes are cleaned up. */
  async stage(file: Express.Multer.File, ownerId: string | undefined): Promise<StagedUpload> {
    const extension = path.extname(file.originalname).toLowerCase()
    const id = this.remote ? randomUUID() : path.basename(file.filename, extension)
    const storedName = this.remote ? `${id}${extension}` : file.filename
    // What the uploader's browser claimed is ignored: a stored type is only ever derived from the extension.
    const mimeType = mimeTypeForExtension(extension)
    let stagedRemotePath: string | null = null
    try {
      if (!matchesDeclaredType(extension, await this.headOf(file))) {
        throw new UploadRejected('The file contents do not match its extension, so it was not accepted.')
      }
      if (this.remote) {
        if (!file.buffer) throw new Error('The hosted upload buffer is unavailable.')
        stagedRemotePath = `${REMOTE_INBOX}/${storedName}`
        await this.remote.upload(stagedRemotePath, file.buffer, mimeType)
      }
      const source: UploadSource = this.remote ? { buffer: file.buffer } : { path: file.path }
      const { classification, previewText } = await this.classifier.classify(file.originalname, source, extension)
      const record: UploadRecord = {
        ownerId,
        id,
        originalName: file.originalname,
        storedName,
        extension,
        mimeType,
        size: file.size,
        uploadedAt: new Date(this.now()).toISOString(),
        classification,
      }
      await this.write(record)
      return { record, previewText: previewText.slice(0, PREVIEW_RESPONSE_LIMIT) }
    } catch (error) {
      if (this.remote && stagedRemotePath) await this.remote.remove(stagedRemotePath).catch(() => undefined)
      if (!this.remote && file.path) await fs.rm(file.path, { force: true }).catch(() => undefined)
      throw error
    }
  }

  /** The validated destination: an object key in hosted mode, an absolute path under the content root locally. */
  resolveDestination(relativeDestination: string): string | null {
    return this.remote ? safeStoragePath(relativeDestination) : this.library.resolveContentPath(relativeDestination)
  }

  async commit(record: UploadRecord, destination: string): Promise<CommittedUpload> {
    const finalPath = this.remote ? await this.commitRemote(record, destination) : await this.commitLocal(record, destination)
    const library = await this.library.buildFresh()
    return { path: finalPath, file: library.files.find((file) => file.path === finalPath) ?? null }
  }

  private async commitRemote(record: UploadRecord, destination: string): Promise<string> {
    const remote = this.remote
    if (!remote) throw new Error('Hosted storage is not configured.')
    const finalPath = await remote.uniqueDestination(destination)
    await remote.move(this.remoteStoredPath(record), finalPath)
    await remote.remove(this.remoteMetadataPath(record.id))
    return finalPath
  }

  /** Creates the target folder, then proves it is really inside the content root: a folder that is a link elsewhere is refused. */
  private async ensureDestinationDirectory(destination: string): Promise<void> {
    const directory = path.dirname(destination)
    await fs.mkdir(directory, { recursive: true })
    const [realRoot, realDirectory] = await Promise.all([fs.realpath(this.config.contentRoot), fs.realpath(directory)])
    if (realDirectory !== realRoot && !isContained(realRoot, realDirectory)) {
      throw new UploadRejected('That destination is not allowed.')
    }
  }

  private async commitLocal(record: UploadRecord, destination: string): Promise<string> {
    const stagedPath = this.storedPath(record)
    await fs.access(stagedPath)
    await this.ensureDestinationDirectory(destination)
    const finalDestination = await uniqueLocalPath(destination)
    await fs.rename(stagedPath, finalDestination)
    await fs.rm(this.metadataPath(record.id), { force: true })
    return toPosix(path.relative(this.config.contentRoot, finalDestination))
  }
}
