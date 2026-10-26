import path from 'node:path'

export const toPosix = (filePath: string): string => filePath.split(path.sep).join('/')

/** Validates a key for private object storage: relative, normalized, no traversal and no NUL bytes. */
export const safeStoragePath = (filePath: string): string | null => {
  const normalized = path.posix.normalize(filePath.replace(/\\/g, '/'))
  // normalize() leaves a lone ".." (and "a/../..") as ".." with no slash after it, so test whole segments. A key that
  // ends in "/" names a folder, not an object.
  const escapes = normalized.startsWith('/') || normalized.endsWith('/') || normalized.split('/').includes('..')
  if (!normalized || normalized === '.' || escapes || normalized.includes('\0')) return null
  return normalized
}

export const encodeObjectPath = (relativePath: string): string =>
  relativePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

export const isUploadId = (value: string): boolean => /^[0-9a-f-]{36}$/i.test(value)

/** One folder or file name: no separators, no dot-prefix and no parent references. */
export const isSafeSegment = (value: string): boolean => {
  const trimmed = value.trim()
  const hasSeparator = trimmed.includes('/') || trimmed.includes('\\')
  return Boolean(trimmed) && !trimmed.startsWith('.') && !hasSeparator && !trimmed.includes('..')
}

const MAX_STEM_LENGTH = 140

export const normalizeFileName = (value: string, fallback: string, extension: string): string => {
  const cleaned = value
    .trim()
    .replace(/[\\/]/g, '-')
    .replace(/[^\p{L}\p{N}._ -]/gu, '_')
    .replace(/\s+/g, ' ')
  const candidate = cleaned || fallback
  const candidateExtension = path.extname(candidate).toLowerCase()
  const stem = candidateExtension ? candidate.slice(0, -candidateExtension.length) : candidate
  return `${stem.slice(0, MAX_STEM_LENGTH)}${extension}`
}
