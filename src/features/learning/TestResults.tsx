import { content as copy, formatContent } from '../../content.js'
import type { PracticeRun } from './learningTypes'
export function TestResults({ run, onReview }: { run: PracticeRun; onReview: (id: string) => void }) {
  return (
    <section className="practice-result" aria-label={copy.testResults.practicalResults}>
      <div className="learning-terminal" role="status" aria-live="polite">
        <strong>
          {run.status === 'completed'
            ? formatContent(copy.testResults.summary, { passed: run.summary.passed, failed: run.summary.failed })
            : copy.testResults.status[run.status]}
        </strong>
        <pre>{run.stdout || run.stderr || copy.testResults.noProgramOutput}</pre>
        <small>
          {run.durationMs}
          {copy.testResults.ms}
          {run.outputBytes}
          {copy.testResults.outputBytes}
        </small>
      </div>
      <ul className="practice-tests">
        {run.tests.map((test) => (
          <li key={test.id}>
            <span>{test.id}</span>
            <strong>{copy.testResults.status[test.status]}</strong>
            {test.message && <p>{test.message}</p>}
          </li>
        ))}
      </ul>
      {run.reviewSectionId && (
        <button type="button" onClick={() => onReview(run.reviewSectionId!)}>
          {copy.testResults.reviewThisSection}
        </button>
      )}
    </section>
  )
}
