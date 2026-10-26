import path from 'node:path'
import type { UploadRecord } from '../@types/library.js'
import { isSafeSegment, toPosix } from '../helpers/paths.js'
import { UNSORTED_CATEGORY } from '../services/classification.js'

export type CommitRequest = { relativeDestination: string }
export type Rejection = { message: string }

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

/** Checks the owner's category and file name for an approved upload and returns the relative destination. */
export function parseCommitRequest(body: unknown, record: UploadRecord): CommitRequest | Rejection {
  const input = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  const category = text(input.category) || UNSORTED_CATEGORY
  if (!isSafeSegment(category)) return { message: 'Choose one safe folder name for the upload.' }

  const requestedName = text(input.fileName) || record.classification.suggestedFileName
  if (!isSafeSegment(requestedName)) {
    return { message: 'Choose a filename without path separators or traversal segments.' }
  }

  const requestedExtension = path.extname(requestedName).toLowerCase()
  if (requestedExtension && requestedExtension !== record.extension) {
    return { message: `The filename must keep the ${record.extension} extension.` }
  }

  const stem = requestedExtension ? requestedName.slice(0, -requestedExtension.length) : requestedName
  return { relativeDestination: toPosix(path.join(category, `${stem}${record.extension}`)) }
}

export const isRejection = (value: CommitRequest | Rejection): value is Rejection => 'message' in value
