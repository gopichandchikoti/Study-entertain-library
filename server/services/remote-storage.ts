import path from 'node:path'
import { Readable } from 'node:stream'
import type { Request, Response } from 'express'
import type { RemoteObject, RemoteObjectEntry } from '../@types/library.js'
import type { RemoteStorageConfig } from '../config/index.js'
import { mimeTypeForExtension } from '../helpers/extensions.js'
import { fetchWithTimeout } from '../helpers/http.js'
import { encodeObjectPath, safeStoragePath } from '../helpers/paths.js'

type FetchHeaders = Record<string, string>

const LIST_PAGE_SIZE = 1000
// `cache-control` is not forwarded: the stored object says it may be cached publicly, but the reply is private to the reader.
const FORWARDED_HEADERS = ['content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']

/** Private Supabase Storage access. The service-role key never leaves this module. */
export class RemoteStorage {
  constructor(private readonly config: RemoteStorageConfig) {}

  get bucket(): string {
    return this.config.bucket
  }

  private base(): string {
    return `${this.config.url}/storage/v1`
  }

  private headers(extra: FetchHeaders = {}): FetchHeaders {
    return { apikey: this.config.serviceRoleKey, authorization: `Bearer ${this.config.serviceRoleKey}`, ...extra }
  }

  private async request(relativePath: string, init: RequestInit = {}): Promise<globalThis.Response> {
    const safePath = safeStoragePath(relativePath)
    if (!safePath) throw new Error('That storage path is not allowed.')
    const bucket = encodeURIComponent(this.config.bucket)
    return fetchWithTimeout(`${this.base()}/object/${bucket}/${encodeObjectPath(safePath)}`, {
      ...init,
      headers: this.headers((init.headers ?? {}) as FetchHeaders),
    })
  }

  /** The raw response for an object, used by readers that need the status (for example a 404). */
  fetchObject(relativePath: string): Promise<globalThis.Response> {
    return this.request(relativePath)
  }

  async read(relativePath: string): Promise<Buffer> {
    const response = await this.request(relativePath)
    if (!response.ok) throw new Error(`Remote object request failed with status ${response.status}.`)
    return Buffer.from(await response.arrayBuffer())
  }

  async upload(relativePath: string, content: Buffer, mimeType: string): Promise<void> {
    const response = await this.request(relativePath, {
      method: 'POST',
      headers: { 'content-type': mimeType, 'cache-control': '3600', 'x-upsert': 'false' },
      body: content as unknown as RequestInit['body'],
    })
    if (!response.ok) throw new Error(`Remote object upload failed with status ${response.status}.`)
  }

  async remove(relativePath: string): Promise<void> {
    const response = await this.request(relativePath, { method: 'DELETE' })
    if (!response.ok && response.status !== 404) {
      throw new Error(`Remote object deletion failed with status ${response.status}.`)
    }
  }

  async move(sourcePath: string, destinationPath: string): Promise<void> {
    if (!safeStoragePath(sourcePath) || !safeStoragePath(destinationPath)) {
      throw new Error('That storage move is not allowed.')
    }
    const response = await fetchWithTimeout(`${this.base()}/object/move`, {
      method: 'POST',
      headers: this.headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        bucketId: this.config.bucket,
        sourceKey: sourcePath,
        destinationKey: destinationPath,
      }),
    })
    if (!response.ok) throw new Error(`Remote object move failed with status ${response.status}.`)
  }

  private async exists(relativePath: string): Promise<boolean> {
    const response = await this.request(relativePath, { method: 'HEAD' })
    if (response.status === 404) return false
    if (response.ok) return true
    throw new Error(`Remote object lookup failed with status ${response.status}.`)
  }

  async uniqueDestination(relativePath: string): Promise<string> {
    const extension = path.posix.extname(relativePath)
    const stem = extension ? relativePath.slice(0, -extension.length) : relativePath
    let candidate = relativePath
    let suffix = 2
    while (await this.exists(candidate)) {
      candidate = `${stem}-${suffix}${extension}`
      suffix += 1
    }
    return candidate
  }

  /**
   * Streams an object to the client, forwarding range and validator headers. False when the object does not exist.
   * `mimeType` is chosen by the caller from the file's extension: the type stored with the object came from whoever
   * uploaded it, so it is never trusted (a `.txt` stored as `text/html` would otherwise run as a page).
   */
  async send(request: Request, response: Response, relativePath: string, mimeType: string): Promise<boolean> {
    const remote = await this.request(relativePath, {
      headers: request.headers.range ? { range: request.headers.range } : {},
    })
    if (remote.status === 404) return false
    if (!remote.ok) throw new Error(`Remote file request failed with status ${remote.status}.`)

    response.status(remote.status)
    response.setHeader('Content-Type', mimeType)
    for (const name of FORWARDED_HEADERS) {
      const value = remote.headers.get(name)
      if (value) response.setHeader(name, value)
    }
    if (remote.body) {
      Readable.fromWeb(remote.body as unknown as Parameters<typeof Readable.fromWeb>[0]).pipe(response)
    } else {
      response.end()
    }
    return true
  }

  /** The names directly under `prefix` (one level, first page). Used to count the private upload inbox, which `list` hides. */
  async listNames(prefix: string): Promise<string[]> {
    const entries = await this.listPage(prefix, 0)
    return entries.map((entry) => entry.name)
  }

  /** Every supported object below `prefix`, paged and de-duplicated. Hidden segments are skipped. */
  async list(prefix = '', visited = new Set<string>()): Promise<RemoteObject[]> {
    if (visited.has(prefix)) return []
    visited.add(prefix)
    const objects: RemoteObject[] = []
    let offset = 0
    for (;;) {
      const entries = await this.listPage(prefix, offset)
      if (entries.length === 0) break
      for (const entry of entries) objects.push(...(await this.expand(prefix, entry, visited)))
      if (entries.length < LIST_PAGE_SIZE) break
      offset += LIST_PAGE_SIZE
    }
    return objects
  }

  private async listPage(prefix: string, offset: number): Promise<RemoteObjectEntry[]> {
    const response = await fetchWithTimeout(`${this.base()}/object/list/${encodeURIComponent(this.config.bucket)}`, {
      method: 'POST',
      headers: this.headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ prefix, limit: LIST_PAGE_SIZE, offset, sortBy: { column: 'name', order: 'asc' } }),
    })
    if (!response.ok) throw new Error(`Remote library listing failed with status ${response.status}.`)
    return (await response.json()) as RemoteObjectEntry[]
  }

  private async expand(prefix: string, entry: RemoteObjectEntry, visited: Set<string>): Promise<RemoteObject[]> {
    const entryPath = prefix ? `${prefix}/${entry.name}` : entry.name
    if (!entryPath || entryPath.split('/').some((segment) => !segment || segment.startsWith('.'))) return []
    if (!entry.id) return this.list(entryPath, visited)
    const size = typeof entry.metadata?.size === 'string' ? Number(entry.metadata.size) : entry.metadata?.size
    const mimeType = entry.metadata?.mimetype
    return [
      {
        path: entryPath,
        size: Number.isFinite(size) ? Number(size) : 0,
        modifiedAt: entry.updated_at ?? new Date(0).toISOString(),
        mimeType: typeof mimeType === 'string' ? mimeType : mimeTypeForExtension(path.extname(entryPath).toLowerCase()),
      },
    ]
  }
}
