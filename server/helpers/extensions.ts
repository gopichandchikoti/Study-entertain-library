import path from 'node:path'
import type { MediaKind, PreviewKind } from '../@types/library.js'

export const markdownExtensions: ReadonlySet<string> = new Set(['.md', '.markdown', '.mdx'])
export const imageExtensions: ReadonlySet<string> = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'])
export const pdfExtensions: ReadonlySet<string> = new Set(['.pdf'])
export const videoExtensions: ReadonlySet<string> = new Set(['.mp4', '.m4v', '.webm', '.mov', '.mkv'])
export const audioExtensions: ReadonlySet<string> = new Set(['.mp3', '.m4a', '.aac', '.ogg', '.opus', '.wav', '.flac'])
export const textExtensions: ReadonlySet<string> = new Set([
  '.c',
  '.cc',
  '.cpp',
  '.css',
  '.csv',
  '.go',
  '.h',
  '.hpp',
  '.html',
  '.java',
  '.js',
  '.json',
  '.jsx',
  '.mjs',
  '.py',
  '.rs',
  '.sh',
  '.sql',
  '.toml',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
])
export const textbookExtensions: ReadonlySet<string> = new Set([
  '.azw',
  '.azw3',
  '.docx',
  '.epub',
  '.mobi',
  '.odp',
  '.ods',
  '.odt',
  '.pptx',
  '.xlsx',
])
export const supportedExtensions: ReadonlySet<string> = new Set([
  ...markdownExtensions,
  ...imageExtensions,
  ...pdfExtensions,
  ...textExtensions,
  ...textbookExtensions,
])

/** Folders that are never indexed. The app's own folder name is added at run time. */
export const baseIgnoredDirectoryNames: readonly string[] = [
  '.git',
  '.idea',
  '.vscode',
  'node_modules',
  'dist',
  'build',
  'coverage',
  'Music',
  'Music Library.musiclibrary',
  '$RECYCLE.BIN',
  'System Volume Information',
]

const qualitySuffix = /(?:[-_. ](360p|480p|720p|1080p|1440p|2160p|4k))$/i

export const isSupportedFile = (filePath: string): boolean => supportedExtensions.has(path.extname(filePath).toLowerCase())

export const isMediaFile = (filePath: string): boolean => {
  const extension = path.extname(filePath).toLowerCase()
  return videoExtensions.has(extension) || audioExtensions.has(extension)
}

export const previewKindForExtension = (extension: string): PreviewKind => {
  if (markdownExtensions.has(extension)) return 'markdown'
  if (imageExtensions.has(extension)) return 'image'
  if (pdfExtensions.has(extension)) return 'pdf'
  if (textExtensions.has(extension)) return 'text'
  if (extension === '.epub') return 'epub'
  return 'download'
}

const documentMimeTypes: Readonly<Record<string, string>> = {
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.csv': 'text/csv',
  '.html': 'text/html',
  '.xml': 'application/xml',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.epub': 'application/epub+zip',
}

export const mimeTypeForExtension = (extension: string): string => {
  if (imageExtensions.has(extension)) {
    if (extension === '.svg') return 'image/svg+xml'
    if (extension === '.avif') return 'image/avif'
    return `image/${extension.slice(1) === 'jpg' ? 'jpeg' : extension.slice(1)}`
  }
  const known = documentMimeTypes[extension]
  if (known) return known
  return textExtensions.has(extension) ? 'text/plain' : 'application/octet-stream'
}

export const mediaKindForExtension = (extension: string): MediaKind => (audioExtensions.has(extension) ? 'audio' : 'video')

const mediaMimeTypes: Readonly<Record<string, string>> = {
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.ogg': 'audio/ogg',
  '.opus': 'audio/ogg',
  '.wav': 'audio/wav',
}

export const mediaMimeTypeForExtension = (extension: string): string => mediaMimeTypes[extension] ?? 'audio/flac'

export const mediaQualityForPath = (filePath: string): string | null => {
  const stem = path.basename(filePath, path.extname(filePath))
  return stem.match(qualitySuffix)?.[1]?.toUpperCase() ?? null
}

export const mediaBaseKey = (filePath: string): string => {
  const extension = path.extname(filePath)
  return filePath.slice(0, -extension.length).replace(qualitySuffix, '').toLowerCase()
}
