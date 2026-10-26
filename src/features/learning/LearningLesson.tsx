import { content as copy } from '../../content.js'
import { Suspense, lazy, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowRight } from '../../components/icons'
import { parseLessonExercises } from './lessonExerciseParser'
import {
  emptyProgress,
  learningStage,
  lessonComplete,
  loadProgress,
  PROGRESS_KEY,
  recordQuiz,
  scoreQuiz,
} from './learningProgress'
import { sectionDomId } from './sectionAnchors'
import { LessonStepper } from './LessonStepper'
import { AssignmentPanel } from './AssignmentPanel'
const PracticalPanel = lazy(() => import('./PracticalPanel').then((module) => ({ default: module.PracticalPanel })))
import type { LessonProgress, LessonStage, PracticeRun, QuizScore } from './learningTypes'
export function LearningLesson({
  markdown,
  renderLesson,
  nextLesson,
  onNext,
  onComplete,
}: {
  markdown: string
  renderLesson: (markdown: string) => ReactNode
  nextLesson: string | null
  onNext: () => void
  onComplete: () => void
}) {
  const exercise = useMemo(() => parseLessonExercises(markdown), [markdown]),
    quiz = exercise.quiz,
    practical = exercise.practical
  const [progressKey] = useState(() => PROGRESS_KEY)
  const [progress, setProgress] = useState<LessonProgress>(() => {
    const id = quiz?.lessonId ?? 'plain-note'
    return loadProgress(localStorage, progressKey)[id] ?? emptyProgress(id)
  })
  const [stage, setStage] = useState<LessonStage>('lesson'),
    [answers, setAnswers] = useState<Record<string, string>>({}),
    [score, setScore] = useState<QuizScore | null>(null),
    [source, setSource] = useState(practical?.starterCode ?? ''),
    [storageError, setStorageError] = useState(false),
    [reviewTarget, setReviewTarget] = useState<string | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!quiz) return
    try {
      const all = loadProgress(localStorage, progressKey)
      all[quiz.lessonId] = progress
      localStorage.setItem(progressKey, JSON.stringify(all))
      queueMicrotask(() => setStorageError(false))
    } catch {
      queueMicrotask(() => setStorageError(true))
    }
  }, [progress, quiz, progressKey])
  useEffect(() => {
    if (reviewTarget && stage === 'lesson') {
      const heading = panel.current?.querySelector<HTMLElement>('#' + sectionDomId(reviewTarget))
      if (heading) {
        heading.tabIndex = -1
        heading.scrollIntoView({ block: 'start', behavior: 'auto' })
        heading.focus({ preventScroll: true })
        queueMicrotask(() => setReviewTarget(null))
      }
    }
  }, [reviewTarget, stage])
  const review = (id: string): void => {
    setStage('lesson')
    setReviewTarget(id)
  }
  const changeStage = (next: LessonStage): void => {
    setStage(next)
    requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }))
  }
  const practicalPassed = (run: PracticeRun): void => {
    setProgress((p) => ({
      ...p,
      practical: {
        lastRunId: run.runId,
        passedTests: run.summary.passed,
        totalTests: run.summary.total,
        passed: true,
        lastAttemptAt: new Date().toISOString(),
      },
    }))
    onComplete()
  }
  if (!quiz || !practical)
    return (
      <>
        {exercise.error && (
          <p className="exercise-error" role="alert">
            {copy.learningLesson.assignmentsUnavailable}
            {exercise.error}
          </p>
        )}
        {renderLesson(exercise.markdown)}
      </>
    )
  return (
    <section className="learning-lesson">
      <LessonStepper stage={stage} read={Boolean(progress.readAt)} quizPassed={progress.quiz.passed} onStage={changeStage} />
      <div className="learning-status">
        <strong>{learningStage(progress)}</strong>
        <span>
          {copy.learningLesson.savedOnThisBrowserBest}
          {progress.quiz.bestScore}
          {copy.learningLesson.text5}
        </span>
      </div>
      {storageError && <p role="alert">{copy.learningLesson.browserStorageIsUnavailableProgressWillLastOnlyForThis}</p>}
      <div className="learning-panel" ref={panel} tabIndex={-1}>
        {stage === 'lesson' && (
          <>
            {renderLesson(exercise.markdown)}
            <div className="learning-actions">
              <button
                className="learning-primary"
                type="button"
                onClick={() => {
                  setProgress((p) => ({ ...p, readAt: p.readAt ?? new Date().toISOString() }))
                  changeStage('assignment')
                }}
              >
                {progress.readAt ? copy.learningLesson.openAssignment : copy.learningLesson.markLessonRead}
              </button>
              <span>
                {copy.learningLesson.fiveQuestions}
                {quiz.passPercentage}
                {copy.learningLesson.toPass}
              </span>
            </div>
          </>
        )}
        {stage === 'assignment' && (
          <AssignmentPanel
            quiz={quiz}
            answers={answers}
            score={score}
            onAnswer={(q, o) => setAnswers((a) => ({ ...a, [q]: o }))}
            onSubmit={() => {
              const result = scoreQuiz(quiz, answers)
              setScore(result)
              setProgress((p) => recordQuiz(p, result))
            }}
            onRetry={() => {
              setAnswers({})
              setScore(null)
            }}
            onReview={review}
            onPractical={() => changeStage('practical')}
          />
        )}
        {stage === 'practical' && (
          <Suspense fallback={<p role="status">{copy.learningLesson.openingPracticalSession}</p>}>
            <PracticalPanel
              challenge={practical}
              source={source}
              onSource={setSource}
              onPass={practicalPassed}
              onReview={review}
            />
          </Suspense>
        )}
      </div>
      <div className="learning-next">
        <p>
          {lessonComplete(progress)
            ? nextLesson
              ? copy.learningLesson.readyFor + nextLesson
              : copy.learningLesson.courseCompleteRevisitAnyLessonToReview
            : !progress.readAt
              ? copy.learningLesson.readTheLessonToUnlockAssignment
              : !progress.quiz.passed
                ? copy.learningLesson.passTheAssignmentToUnlockPractical
                : copy.learningLesson.passEveryPracticalTestAndSubmitToUnlockTheNext}
        </p>
        {nextLesson && (
          <button type="button" disabled={!lessonComplete(progress)} onClick={onNext}>
            {copy.learningLesson.nextLesson}
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </section>
  )
}
