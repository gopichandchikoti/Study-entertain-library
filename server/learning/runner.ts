import { randomUUID } from 'node:crypto'
import type { PracticeRun, PracticeTest } from '../../src/features/learning/learningTypes.js'
import type { ChallengeRegistry, RegisteredChallenge } from './challenges.js'
import { PracticeError, validateRunRequest } from './schemas.js'
import { codeSandboxAvailable } from './sandbox.js'
export const RUN_TTL_MS = 10 * 60 * 1000
export const MAX_RUNS = 500
export const MAX_QUEUE = 10
export function validateStructuredAnswer(registered: RegisteredChallenge, source: string): PracticeTest[] {
  let answer: Record<string, unknown>
  try {
    const data: unknown = registered.challenge.language === 'json' ? JSON.parse(source) : { answer: source }
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('object required')
    answer = data as Record<string, unknown>
  } catch {
    return registered.tests.map((t) => ({
      id: t.id,
      status: 'failed',
      message: 'Use a valid JSON object matching the task contract.',
      durationMs: 0,
    }))
  }
  return registered.tests.map((t) => {
    const value = Object.hasOwn(answer, t.field) ? answer[t.field] : undefined
    const passed =
      (t.equals === undefined || value === t.equals) &&
      (!t.includesWords ||
        (typeof value === 'string' && t.includesWords.every((w) => value.toLowerCase().includes(w.toLowerCase())))) &&
      (!t.minLength || (typeof value === 'string' && value.trim().length >= t.minLength))
    return {
      id: t.id,
      status: passed ? 'passed' : 'failed',
      message: passed ? 'Requirement satisfied.' : 'Review the ' + t.field + ' requirement in the task.',
      durationMs: 0,
    }
  })
}
type StoredRun = { owner: string; createdAt: number; result: PracticeRun; source: string | null; registered: RegisteredChallenge }
export class PracticeService {
  private runs = new Map<string, StoredRun>()
  private rates = new Map<string, { started: number; count: number }>()
  constructor(
    private registry: ChallengeRegistry,
    private schedule: (task: () => void) => void = (task) => {
      setImmediate(task)
    },
    private now: () => number = Date.now,
  ) {}
  private clean(): void {
    for (const [id, run] of this.runs) if (this.now() - run.createdAt > RUN_TTL_MS) this.runs.delete(id)
    for (const [key, rate] of this.rates) if (this.now() - rate.started > 60000) this.rates.delete(key)
  }
  start(owner: string, body: unknown): { runId: string; status: 'queued' } {
    this.clean()
    const request = validateRunRequest(body),
      registered = this.registry.get(request.challengeId)
    if (!registered) throw new PracticeError(404, 'CHALLENGE_NOT_FOUND', 'That challenge was not found.')
    if (registered.challenge.language !== request.language)
      throw new PracticeError(400, 'LANGUAGE_MISMATCH', 'Use the language declared by this challenge.')
    if (!['json', 'text'].includes(request.language) && !codeSandboxAvailable(request.language))
      throw new PracticeError(
        503,
        'RUNNER_UNAVAILABLE',
        'Code execution requires an isolated runner. Reading and assignments remain available.',
      )
    const rate = this.rates.get(owner) ?? { started: this.now(), count: 0 }
    if (rate.count >= 20 || (this.rates.size >= 1000 && !this.rates.has(owner)))
      throw new PracticeError(429, 'RUN_RATE_LIMIT', 'Too many runs. Wait one minute and retry.')
    const active = [...this.runs.values()].filter((r) => ['queued', 'running'].includes(r.result.status))
    if (active.length >= MAX_QUEUE || active.some((r) => r.owner === owner) || this.runs.size >= MAX_RUNS)
      throw new PracticeError(429, 'RUN_QUEUE_FULL', 'The run queue is full. Retry after the current run finishes.')
    this.rates.set(owner, { ...rate, count: rate.count + 1 })
    const runId = randomUUID()
    const result: PracticeRun = {
      runId,
      status: 'queued',
      summary: { passed: 0, failed: 0, total: registered.tests.length },
      tests: [],
      stdout: '',
      stderr: '',
      durationMs: 0,
      outputBytes: 0,
    }
    const stored: StoredRun = { owner, createdAt: this.now(), result, source: request.source, registered }
    this.runs.set(runId, stored)
    this.schedule(() => {
      if (!this.runs.has(runId) || stored.result.status === 'cancelled') return
      stored.result.status = 'running'
      const started = this.now()
      try {
        const tests = validateStructuredAnswer(registered, stored.source ?? '')
        const passed = tests.filter((t) => t.status === 'passed').length,
          failedTest = tests.find((t) => t.status === 'failed')
        const stdout = (
          passed === tests.length
            ? 'All required tests passed. Submit your solution to complete this lesson.'
            : 'Some requirements need review. Edit your answer and run again.'
        ).slice(0, registered.challenge.limits.outputBytes)
        stored.result = {
          ...result,
          status: 'completed',
          summary: { passed, failed: tests.length - passed, total: tests.length },
          tests,
          stdout,
          durationMs: Math.max(0, this.now() - started),
          outputBytes: Buffer.byteLength(stdout),
          reviewSectionId: failedTest ? registered.tests.find((t) => t.id === failedTest.id)?.sectionId : undefined,
        }
      } catch {
        stored.result = { ...result, status: 'failed', stderr: 'Structured validation failed. Retry the run.', outputBytes: 42 }
      } finally {
        stored.source = null
      }
    })
    return { runId, status: 'queued' }
  }
  get(owner: string, id: string): PracticeRun {
    this.clean()
    const row = this.runs.get(id)
    if (!row || row.owner !== owner) throw new PracticeError(404, 'RUN_NOT_FOUND', 'That run was not found or has expired.')
    return row.result
  }
  cancel(owner: string, id: string): PracticeRun {
    this.get(owner, id)
    const row = this.runs.get(id)!
    if (['queued', 'running'].includes(row.result.status)) {
      row.result = { ...row.result, status: 'cancelled' }
      row.source = null
    }
    return row.result
  }
}
