import { content as copy, formatContent } from '../../content.js'
import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw } from '../../components/icons'
import { cancelPracticeRun, fetchPracticeRun, fetchRunnerCapabilities, startPracticeRun } from '../../api'
import { CodeEditor } from './CodeEditor'
import { TestResults } from './TestResults'
import type { PracticalChallenge, PracticeRun, RunnerCapabilities } from './learningTypes'
export function PracticalPanel({
  challenge,
  source,
  onSource,
  onPass,
  onReview,
}: {
  challenge: PracticalChallenge
  source: string
  onSource: (source: string) => void
  onPass: (run: PracticeRun) => void
  onReview: (id: string) => void
}) {
  const [capabilities, setCapabilities] = useState<RunnerCapabilities | null>(null),
    [run, setRun] = useState<PracticeRun | null>(null),
    [error, setError] = useState<string | null>(null),
    [busy, setBusy] = useState(false)
  const controller = useRef<AbortController | null>(null),
    activeRunId = useRef<string | null>(null),
    mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    void fetchRunnerCapabilities()
      .then(setCapabilities)
      .catch(() => setError(copy.practicalPanel.runnerUnavailableTheApiCouldNotBeReached))
    return () => {
      mounted.current = false
      controller.current?.abort()
      if (activeRunId.current) void cancelPracticeRun(activeRunId.current).catch(() => {})
    }
  }, [])
  const available = Boolean(capabilities?.languages.includes(challenge.language))
  const execute = async (): Promise<void> => {
    setBusy(true)
    setError(null)
    setRun(null)
    const abort = new AbortController()
    controller.current = abort
    try {
      const queued = await startPracticeRun(challenge.challengeId, challenge.language, source, abort.signal)
      activeRunId.current = queued.runId
      if (!mounted.current) {
        void cancelPracticeRun(queued.runId)
        return
      }
      setRun({
        ...queued,
        summary: { passed: 0, failed: 0, total: 0 },
        tests: [],
        stdout: '',
        stderr: '',
        durationMs: 0,
        outputBytes: 0,
      })
      const deadline = Date.now() + 10000
      while (!abort.signal.aborted) {
        const result = await fetchPracticeRun(queued.runId, abort.signal)
        if (!mounted.current) return
        setRun(result)
        if (!['queued', 'running'].includes(result.status)) break
        if (Date.now() > deadline) {
          await cancelPracticeRun(queued.runId)
          throw new Error(copy.practicalPanel.runnerTimeoutTryAgainAfterCheckingTheService)
        }
        await new Promise((resolve) => setTimeout(resolve, 150))
      }
    } catch (e) {
      if (mounted.current && !abort.signal.aborted) setError(e instanceof Error ? e.message : copy.practicalPanel.theRunFailed)
    } finally {
      if (mounted.current) setBusy(false)
      activeRunId.current = null
    }
  }
  const canSubmit =
    run?.status === 'completed' &&
    run.summary.total > 0 &&
    run.summary.passed === run.summary.total &&
    run.tests.every((t) => t.status === 'passed')
  return (
    <section className="practical-panel" aria-label={copy.practicalPanel.practicalSession}>
      <h2>{challenge.title}</h2>
      <p>{challenge.instructions}</p>
      <p className="learning-hint">
        {copy.practicalPanel.language}
        {challenge.language}
        {copy.practicalPanel.text}
        {challenge.limits.timeMs}
        {copy.practicalPanel.ms}
        {challenge.limits.memoryMb}
        {copy.practicalPanel.mb}
        {challenge.limits.outputBytes}
        {copy.practicalPanel.outputBytes}
      </p>
      <details>
        <summary>{copy.practicalPanel.publicExamplesAndTests}</summary>
        <pre>{JSON.stringify(challenge.publicExamples, null, 2)}</pre>
        <p>{challenge.publicTestIds.join(', ')}</p>
      </details>
      <CodeEditor
        value={source}
        language={challenge.language}
        onChange={(v) => {
          onSource(v)
          setRun(null)
        }}
      />
      <div className="learning-actions">
        <button
          type="button"
          className="learning-primary"
          title={copy.practicalPanel.runThePracticalTests}
          onClick={() => void execute()}
          disabled={!available || busy || source.length > 50000}
        >
          <Play size={16} />
          {busy ? copy.practicalPanel.running : copy.practicalPanel.run}
        </button>
        <button
          type="button"
          onClick={() => {
            onSource(challenge.starterCode)
            setRun(null)
          }}
          disabled={busy}
        >
          <RotateCcw size={16} />
          {copy.practicalPanel.resetStarter}
        </button>
        {busy && (
          <button
            type="button"
            onClick={() => {
              controller.current?.abort()
              if (activeRunId.current) void cancelPracticeRun(activeRunId.current).then(setRun)
              setBusy(false)
            }}
          >
            {copy.practicalPanel.cancelRun}
          </button>
        )}
        {run && !busy && (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              if (canSubmit) onPass(run)
            }}
          >
            {copy.practicalPanel.submitSolution}
          </button>
        )}
      </div>
      {!available && (
        <p className="runner-unavailable" role="status">
          {capabilities
            ? formatContent(copy.practicalPanel.runnerUnavailable, { language: challenge.language })
            : copy.practicalPanel.checkingRunnerAvailability}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      {run && <TestResults run={run} onReview={onReview} />}
    </section>
  )
}
