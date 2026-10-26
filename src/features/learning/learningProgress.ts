import { content as copy } from '../../content.js'
import { QUIZ_SIZE, SAFE_LESSON_ID } from './learningTypes.js'
import type { LessonProgress, LessonQuiz, QuizScore } from './learningTypes.js'
export let PROGRESS_KEY = 'study-library:learning-progress:v1'
export function setLearningProgressScope(userId: string | null): void {
  PROGRESS_KEY = 'study-library:learning-progress:v1' + (userId ? ':' + userId : '')
}
export const emptyProgress = (lessonId: string): LessonProgress => ({
  lessonId,
  readAt: null,
  quiz: { bestScore: 0, bestPercentage: 0, attempts: 0, passed: false, lastAttemptAt: null },
  practical: { lastRunId: null, passedTests: 0, totalTests: 0, passed: false, lastAttemptAt: null },
})
export function scoreQuiz(quiz: LessonQuiz, answers: Record<string, string>): QuizScore {
  const missed = quiz.questions.filter((q) => answers[q.id] !== q.correctOptionId)
  const points = QUIZ_SIZE - missed.length,
    percentage = Math.round((points / QUIZ_SIZE) * 100)
  return { points, percentage, passed: percentage >= quiz.passPercentage, missed }
}
export function recordQuiz(p: LessonProgress, score: QuizScore, now = new Date().toISOString()): LessonProgress {
  return {
    ...p,
    quiz: {
      bestScore: Math.max(p.quiz.bestScore, score.points),
      bestPercentage: Math.max(p.quiz.bestPercentage, score.percentage),
      attempts: p.quiz.attempts + 1,
      passed: p.quiz.passed || score.passed,
      lastAttemptAt: now,
    },
  }
}
const validDate = (v: unknown): boolean => v === null || (typeof v === 'string' && Number.isFinite(Date.parse(v)))
export function validateProgress(v: unknown): v is LessonProgress {
  if (!v || typeof v !== 'object') return false
  const p = v as LessonProgress
  if (typeof p.lessonId !== 'string' || !SAFE_LESSON_ID.test(p.lessonId) || !validDate(p.readAt) || !p.quiz || !p.practical)
    return false
  const q = p.quiz,
    c = p.practical
  return (
    Number.isInteger(q.bestScore) &&
    q.bestScore >= 0 &&
    q.bestScore <= 5 &&
    q.bestPercentage === q.bestScore * 20 &&
    Number.isInteger(q.attempts) &&
    q.attempts >= 0 &&
    q.attempts <= 100000 &&
    typeof q.passed === 'boolean' &&
    (!q.passed || q.bestScore >= 4) &&
    validDate(q.lastAttemptAt) &&
    Number.isInteger(c.passedTests) &&
    Number.isInteger(c.totalTests) &&
    c.passedTests >= 0 &&
    c.totalTests >= c.passedTests &&
    c.totalTests <= 20 &&
    typeof c.passed === 'boolean' &&
    (!c.passed || (c.totalTests > 0 && c.passedTests === c.totalTests)) &&
    validDate(c.lastAttemptAt) &&
    (c.lastRunId === null || (typeof c.lastRunId === 'string' && c.lastRunId.length <= 100))
  )
}
export function loadProgress(storage: Pick<Storage, 'getItem'>, key = PROGRESS_KEY): Record<string, LessonProgress> {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(key) ?? '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(Object.entries(parsed).filter(([id, p]) => validateProgress(p) && p.lessonId === id))
  } catch {
    return {}
  }
}
export const learningStage = (p: LessonProgress): string =>
  !p.readAt
    ? copy.learningProgress.notStarted
    : !p.quiz.passed
      ? copy.learningProgress.read
      : !p.practical.passed
        ? copy.learningProgress.quizPassed
        : copy.learningProgress.complete
export const lessonComplete = (p: LessonProgress): boolean => Boolean(p.readAt && p.quiz.passed && p.practical.passed)
