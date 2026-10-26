import path from 'node:path'
import { markdownExtensions, previewKindForExtension, textExtensions } from './files.js'
import type { Library } from './library.js'

export type UploadClassification = {
  category: string
  suggestedFileName: string
  summary: string
  tags: string[]
  confidence: number
  source: 'rules'
}

export const UNSORTED_CATEGORY = 'Unsorted'
const MAX_STEM_LENGTH = 140
const PREVIEW_CHARACTERS = 16_000

/** One folder or file name: no separators, no dot-prefix, no parent references, no control characters. */
export const isSafeSegment = (value: string): boolean => {
  const trimmed = value.trim()
  return (
    Boolean(trimmed) &&
    trimmed !== '.' &&
    trimmed !== '..' &&
    !trimmed.startsWith('.') &&
    !trimmed.includes('/') &&
    !trimmed.includes('\\') &&
    !trimmed.includes('..') &&
    ![...trimmed].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
  )
}

export const normalizeFileName = (value: string, fallback: string, extension: string): string => {
  const cleaned = value
    .trim()
    .replace(/[\\/]/g, '-')
    .replace(/[^\p{L}\p{N}._ -]/gu, '_')
    .replace(/\s+/g, ' ')
  const candidate = cleaned || fallback
  const candidateExtension = path.posix.extname(candidate).toLowerCase()
  const stem = candidateExtension ? candidate.slice(0, -candidateExtension.length) : candidate
  return `${stem.slice(0, MAX_STEM_LENGTH)}${extension}`
}

/** Suggests a category and file name for a staged upload from its name and text. A suggestion only: the owner approves it. */
export function createClassifier(library: Library) {
  return async (originalName: string, buffer: Buffer, extension: string): Promise<{ classification: UploadClassification; previewText: string }> => {
    const previewKind = previewKindForExtension(extension)
    const readable = previewKind === 'markdown' || previewKind === 'text' || markdownExtensions.has(extension) || textExtensions.has(extension)
    const previewText = readable ? buffer.toString('utf8').slice(0, PREVIEW_CHARACTERS) : ''
    const existing = await library.getLibrary({})
    const categories = [...new Set([...existing.categories.filter((category) => category.path).map((category) => category.name), UNSORTED_CATEGORY])]
    const searchable = `${originalName}\n${previewText}`.toLowerCase()
    const category = categories.find((candidate) => candidate !== UNSORTED_CATEGORY && searchable.includes(candidate.toLowerCase())) ?? UNSORTED_CATEGORY
    const title = originalName
      .slice(0, originalName.length - (path.posix.extname(originalName).length || 0))
      .replace(/^\d+[-_ ]*/, '')
      .replace(/[-_]+/g, ' ')
      .trim()
    return {
      previewText,
      classification: {
        category,
        suggestedFileName: normalizeFileName(originalName, `untitled${extension}`, extension),
        summary: title ? `Ready to review: ${title}.` : 'Ready to review this upload.',
        tags: [],
        confidence: category === UNSORTED_CATEGORY ? 0.25 : 0.45,
        source: 'rules',
      },
    }
  }
}
