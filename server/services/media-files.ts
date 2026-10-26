import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { Dirent } from 'node:fs'
import type { LyricLine, MediaFile, SafeFile, SubtitleTrack } from '../@types/library.js'
import { resolveWithinRoot } from '../auth/file-policy.js'
import type { ServerConfig } from '../config/index.js'
import {
  isMediaFile,
  mediaBaseKey,
  mediaKindForExtension,
  mediaMimeTypeForExtension,
  mediaQualityForPath,
} from '../helpers/extensions.js'
import { toPosix } from '../helpers/paths.js'
import { parseLyrics } from '../helpers/text.js'
import type { PersonalCatalog, PersonalCatalogEntry } from '../personal-db.js'
import { confinedRealPath } from '../watch/root.js'

const nameCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
const MAX_LYRIC_CHARACTERS = 100_000

/** The first-generation media listing behind `GET /api/media`. The Watch and Music catalogs supersede it. */
export class MediaFileService {
  constructor(
    private readonly config: ServerConfig,
    private readonly ignored: ReadonlySet<string>,
    private readonly catalog: PersonalCatalog | null,
  ) {}

  /** A media file below the configured media root, after following every link, or null. */
  async safeFile(relativePath: string): Promise<SafeFile | null> {
    const { root, allowedDrive } = this.config.media
    const absolutePath = resolveWithinRoot(root, relativePath)
    if (!absolutePath || !confinedRealPath(root, absolutePath, allowedDrive)) return null
    try {
      const stats = await fs.stat(absolutePath)
      return stats.isFile() && isMediaFile(absolutePath) ? { absolutePath, stats } : null
    } catch {
      return null
    }
  }

  async list(): Promise<MediaFile[]> {
    const files = await this.collect(this.config.media.root)
    this.sync(files)
    return files
  }

  private sync(files: MediaFile[]): void {
    this.catalog?.sync(
      files.map(
        (file): PersonalCatalogEntry => ({
          path: file.path,
          title: file.title,
          kind: file.kind,
          mimeType: file.mimeType,
          size: file.size,
          modifiedAt: file.modifiedAt,
        }),
      ),
    )
  }

  private async readEntries(directory: string, relativeDirectory: string): Promise<Dirent[]> {
    try {
      return await fs.readdir(directory, { withFileTypes: true })
    } catch (error) {
      // A protected subfolder (for example on a whole drive) is skipped; a missing or unreadable configured root still fails loudly.
      const code = (error as NodeJS.ErrnoException).code
      if (relativeDirectory && (code === 'EACCES' || code === 'EPERM')) return []
      throw error
    }
  }

  private async collect(directory: string, relativeDirectory = ''): Promise<MediaFile[]> {
    const entries = await this.readEntries(directory, relativeDirectory)
    const files: MediaFile[] = []
    for (const entry of entries.sort((left, right) => nameCollator.compare(left.name, right.name))) {
      if (entry.name.startsWith('.')) continue
      const relativePath = relativeDirectory ? path.join(relativeDirectory, entry.name) : entry.name
      const absolutePath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        if (!this.ignored.has(entry.name)) files.push(...(await this.collect(absolutePath, relativePath)))
      } else if (entry.isFile() && isMediaFile(entry.name)) {
        files.push(await this.describe(entry.name, absolutePath, relativePath, entries))
      }
    }
    return relativeDirectory ? files : this.attachQualities(files)
  }

  private async describe(name: string, absolutePath: string, relativePath: string, siblings: Dirent[]): Promise<MediaFile> {
    const stats = await fs.stat(absolutePath)
    const extension = path.extname(name).toLowerCase()
    const baseName = name.slice(0, -extension.length)
    const kind = mediaKindForExtension(extension)
    // Leading digits are a track number on songs but part of the name on films ("12 Monkeys", "3 Idiots").
    const titleSource = kind === 'audio' ? baseName.replace(/^\d+[-_ ]*/, '') : baseName
    return {
      path: toPosix(relativePath),
      name,
      title: titleSource.replace(/[-_]+/g, ' '),
      kind,
      extension,
      mimeType: mediaMimeTypeForExtension(extension),
      size: stats.size,
      modifiedAt: stats.mtime.toISOString(),
      lyrics: await this.readLyrics(absolutePath, extension),
      qualities: [],
      subtitles: this.subtitleTracks(baseName, path.dirname(relativePath), siblings),
    }
  }

  private async readLyrics(absolutePath: string, extension: string): Promise<LyricLine[]> {
    try {
      const lyricPath = `${absolutePath.slice(0, -extension.length)}.lrc`
      return parseLyrics((await fs.readFile(lyricPath, 'utf8')).slice(0, MAX_LYRIC_CHARACTERS))
    } catch {
      return []
    }
  }

  private subtitleTracks(baseName: string, relativeDirectory: string, siblings: Dirent[]): SubtitleTrack[] {
    const folder = relativeDirectory === '.' ? '' : relativeDirectory
    return siblings
      .filter(
        (sibling) => sibling.isFile() && sibling.name.startsWith(`${baseName}.`) && sibling.name.toLowerCase().endsWith('.vtt'),
      )
      .map((sibling) => {
        const language = sibling.name.slice(baseName.length + 1, -4)
        return { label: language.toUpperCase(), language, path: toPosix(folder ? path.join(folder, sibling.name) : sibling.name) }
      })
  }

  /** Files that differ only by a resolution suffix ("Film 720p", "Film 1080p") are offered as one title with qualities. */
  private attachQualities(files: MediaFile[]): MediaFile[] {
    const groups = new Map<string, MediaFile[]>()
    for (const file of files) {
      const key = `${file.kind}:${mediaBaseKey(file.path)}`
      groups.set(key, [...(groups.get(key) ?? []), file])
    }
    return files.map((file) => ({
      ...file,
      qualities: (groups.get(`${file.kind}:${mediaBaseKey(file.path)}`) ?? []).map((candidate) => ({
        label: mediaQualityForPath(candidate.path) ?? 'Original',
        path: candidate.path,
        mimeType: candidate.mimeType,
      })),
    }))
  }
}
