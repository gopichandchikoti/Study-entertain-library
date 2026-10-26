import type { PracticeRun, RunnerCapabilities } from '../features/learning/learningTypes'
import { apiEndpoint, jsonBody, requestJson } from './client'

const runUrl = (runId: string): string => apiEndpoint(`/api/practice/runs/${encodeURIComponent(runId)}`)

// Local learning attempts stay in the browser; run results are server-authoritative.
export const fetchRunnerCapabilities = (): Promise<RunnerCapabilities> =>
  requestJson<RunnerCapabilities>(apiEndpoint('/api/practice/capabilities'))

export const startPracticeRun = (
  challengeId: string,
  language: string,
  source: string,
  signal?: AbortSignal,
): Promise<{ runId: string; status: 'queued' }> =>
  requestJson(apiEndpoint('/api/practice/runs'), { method: 'POST', ...jsonBody({ challengeId, language, source }), signal })

export const fetchPracticeRun = (runId: string, signal?: AbortSignal): Promise<PracticeRun> =>
  requestJson<PracticeRun>(runUrl(runId), { signal })

export const cancelPracticeRun = (runId: string): Promise<PracticeRun> =>
  requestJson<PracticeRun>(`${runUrl(runId)}/cancel`, { method: 'POST' })
