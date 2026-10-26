import path from 'node:path'
import type { PreviewKind } from './types.js'

/** One place that says which files the library holds and how each is served. */

export const markdownExtensions: ReadonlySet<string> = new Set(['.md', '.markdown', '.mdx'])
export const imageExtensions: ReadonlySet<string> = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'])
export const textExtensions: ReadonlySet<string> = new Set([
  '.c', '.cc', '.cpp', '.css', '.csv', '.go', '.h', '.hpp', '.html', '.java', '.js', '.json', '.jsx', '.mjs', '.py', '.rs', '.sh', '.sql',
  '.tex', '.toml', '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml',
])
export const supportedExtensions: ReadonlySet<string> = new Set([
  ...markdownExtensions,
  ...imageExtensions,
  ...textExtensions,
  '.pdf', '.azw', '.azw3', '.docx', '.epub', '.mobi', '.odp', '.ods', '.odt', '.pptx', '.xlsx',
])

export const extensionOf = (filePath: string): string => path.posix.extname(filePath).toLowerCase()

export const previewKindForExtension = (extension: string): PreviewKind => {
  if (markdownExtensions.has(extension)) return 'markdown'
  if (imageExtensions.has(extension)) return 'image'
  if (extension === '.pdf') return 'pdf'
  if (textExtensions.has(extension)) return 'text'
  if (extension === '.epub') return 'epub'
  return 'download'
}

const documentTypes: Readonly<Record<string, string>> = {
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

/**
 * The type a file is served as. It comes from the extension, never from what was stored with the object or what the
 * uploader's browser claimed: otherwise a `.txt` sent as `text/html` would run as a web page on this origin.
 */
export const mimeTypeForExtension = (extension: string): string => {
  if (extension === '.svg') return 'image/svg+xml'
  if (extension === '.avif') return 'image/avif'
  if (imageExtensions.has(extension)) return `image/${extension === '.jpg' ? 'jpeg' : extension.slice(1)}`
  const known = documentTypes[extension]
  if (known) return known
  return textExtensions.has(extension) || markdownExtensions.has(extension) ? 'text/plain' : 'application/octet-stream'
}

/** SVG, HTML and XML can carry script, so they are served sandboxed. */
export const isActiveDocument = (extension: string): boolean => ['.svg', '.html', '.htm', '.xml', '.xhtml'].includes(extension)
