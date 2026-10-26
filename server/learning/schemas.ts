import { PRACTICE_LANGUAGES, SAFE_LESSON_ID } from '../../src/features/learning/learningTypes.js'
import type { PracticeLanguage } from '../../src/features/learning/learningTypes.js'
export const MAX_SOURCE_BYTES = 50000
export class PracticeError extends Error {
  readonly status: number
  readonly code: string
  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}
export type RunRequest = { challengeId: string; language: PracticeLanguage; source: string }
export function validateRunRequest(body: unknown): RunRequest {
  if (!body || typeof body !== 'object' || Array.isArray(body))
    throw new PracticeError(400, 'INVALID_RUN', 'A challenge, language, and source are required.')
  const b = body as Record<string, unknown>
  if (
    typeof b.challengeId !== 'string' ||
    !SAFE_LESSON_ID.test(b.challengeId) ||
    !PRACTICE_LANGUAGES.includes(b.language as never) ||
    typeof b.source !== 'string' ||
    b.source.trim().length === 0
  )
    throw new PracticeError(400, 'INVALID_RUN', 'Check the challenge ID, supported language, and nonempty source.')
  if (Buffer.byteLength(b.source, 'utf8') > MAX_SOURCE_BYTES)
    throw new PracticeError(413, 'SOURCE_TOO_LARGE', 'Source is limited to 50,000 bytes.')
  return { challengeId: b.challengeId, language: b.language as PracticeLanguage, source: b.source }
}
