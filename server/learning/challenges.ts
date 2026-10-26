import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { PracticalChallenge } from '../../src/features/learning/learningTypes.js'
export type ChallengeTest = {
  id: string
  field: string
  equals?: string | number | boolean
  includesWords?: string[]
  minLength?: number
  sectionId: string
}
export type RegisteredChallenge = { challenge: PracticalChallenge; tests: ChallengeTest[] }
export type ChallengeRegistry = Map<string, RegisteredChallenge>
export async function loadChallengeRegistry(): Promise<ChallengeRegistry> {
  const file = fileURLToPath(new URL('./course-registry.json', import.meta.url))
  const rows = JSON.parse(await readFile(file, 'utf8')) as RegisteredChallenge[]
  if (!Array.isArray(rows) || rows.length > 1000) throw new Error('Invalid challenge registry.')
  const registry: ChallengeRegistry = new Map()
  for (const row of rows) {
    if (
      !row.challenge ||
      !Array.isArray(row.tests) ||
      row.tests.length < 1 ||
      row.tests.length > 20 ||
      registry.has(row.challenge.challengeId)
    )
      throw new Error('Invalid registered challenge.')
    for (const t of row.tests)
      if (
        !/^[a-z][a-z0-9-]{0,99}$/.test(t.id) ||
        !/^[a-z][a-zA-Z0-9]{0,99}$/.test(t.field) ||
        (t.includesWords &&
          (!Array.isArray(t.includesWords) ||
            t.includesWords.length > 20 ||
            t.includesWords.some((w) => typeof w !== 'string' || w.length > 100)))
      )
        throw new Error('Invalid fixed test.')
    registry.set(row.challenge.challengeId, row)
  }
  return registry
}
