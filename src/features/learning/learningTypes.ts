export const QUIZ_SIZE = 5
export const DEFAULT_PASS_PERCENTAGE = 80
export const SAFE_ID = /^[a-z][a-z0-9-]{0,99}$/
export const SAFE_LESSON_ID = /^[a-z0-9][a-z0-9/-]{0,199}$/
export const PRACTICE_LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'json', 'text'] as const
export type PracticeLanguage = (typeof PRACTICE_LANGUAGES)[number]
export type LessonStage = 'lesson' | 'assignment' | 'practical' | 'complete'
export type QuizStatus = 'locked' | 'available' | 'in-progress' | 'submitted' | 'passed'
export type PracticalStatus = 'locked' | 'available' | 'running' | 'failed' | 'passed' | 'unavailable'
export type QuizQuestion = {
  id: string
  sectionId: string
  prompt: string
  options: { id: string; text: string; explanation?: string }[]
  correctOptionId: string
  explanation: string
  reviewLabel: string
}
export type LessonQuiz = { schemaVersion: 1; lessonId: string; title: string; passPercentage: number; questions: QuizQuestion[] }
export type PracticalChallenge = {
  schemaVersion: 1
  challengeId: string
  lessonId: string
  title: string
  language: PracticeLanguage
  mode: 'function' | 'structured'
  instructions: string
  starterCode: string
  entryPoint: string
  publicExamples: { input: unknown; expected: unknown }[]
  publicTestIds: string[]
  reviewSections: Record<string, string>
  limits: { timeMs: number; memoryMb: number; outputBytes: number }
}
export type LessonExercise = {
  markdown: string
  quiz: LessonQuiz | null
  practical: PracticalChallenge | null
  error: string | null
}
export type QuizScore = { points: number; percentage: number; passed: boolean; missed: QuizQuestion[] }
export type LessonProgress = {
  lessonId: string
  readAt: string | null
  quiz: { bestScore: number; bestPercentage: number; attempts: number; passed: boolean; lastAttemptAt: string | null }
  practical: { lastRunId: string | null; passedTests: number; totalTests: number; passed: boolean; lastAttemptAt: string | null }
}
export type PracticeTest = { id: string; status: 'passed' | 'failed' | 'blocked'; message?: string; durationMs?: number }
export type PracticeRun = {
  runId: string
  status: 'queued' | 'running' | 'completed' | 'cancelled' | 'unavailable' | 'failed'
  summary: { passed: number; failed: number; total: number }
  tests: PracticeTest[]
  stdout: string
  stderr: string
  durationMs: number
  outputBytes: number
  reviewSectionId?: string
}
export type RunnerCapabilities = { languages: PracticeLanguage[]; codeExecution: false; message: string }
