import { content as copy } from '../../content.js'
import { DEFAULT_PASS_PERCENTAGE, PRACTICE_LANGUAGES, QUIZ_SIZE, SAFE_ID, SAFE_LESSON_ID } from './learningTypes.js'
import type { LessonExercise, LessonQuiz, PracticalChallenge } from './learningTypes.js'
const record = (v: unknown): v is Record<string, unknown> => Boolean(v && typeof v === 'object' && !Array.isArray(v))
const text = (v: unknown, max = 2000): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= max
const id = (v: unknown): v is string => text(v, 100) && SAFE_ID.test(v)
const lessonId = (v: unknown): v is string => text(v, 200) && SAFE_LESSON_ID.test(v)
const unique = (ids: string[]): boolean => new Set(ids).size === ids.length
export function validateQuiz(v: unknown, sections: Set<string>): LessonQuiz {
  if (
    !record(v) ||
    v.schemaVersion !== 1 ||
    !lessonId(v.lessonId) ||
    !text(v.title) ||
    !Number.isInteger(v.passPercentage) ||
    Number(v.passPercentage) < DEFAULT_PASS_PERCENTAGE ||
    Number(v.passPercentage) > 100 ||
    !Array.isArray(v.questions) ||
    v.questions.length !== QUIZ_SIZE
  )
    throw new Error(copy.lessonExerciseParser.assignmentMustHaveFiveQuestionsAndAPassingScoreOf)
  for (const q of v.questions) {
    if (
      !record(q) ||
      !id(q.id) ||
      !id(q.sectionId) ||
      !sections.has(q.sectionId) ||
      !text(q.prompt) ||
      !text(q.explanation) ||
      !text(q.reviewLabel, 200) ||
      !Array.isArray(q.options) ||
      q.options.length !== 4
    )
      throw new Error(copy.lessonExerciseParser.questionHasInvalidFieldsOrAMissingReviewSection)
    if (
      !q.options.every((o) => record(o) && id(o.id) && text(o.text) && (o.explanation === undefined || text(o.explanation))) ||
      !unique(q.options.map((o) => o.id)) ||
      !q.options.some((o) => o.id === q.correctOptionId)
    )
      throw new Error(copy.lessonExerciseParser.questionOptionsOrAnswerKeyAreInvalid)
  }
  if (!unique(v.questions.map((q) => q.id))) throw new Error(copy.lessonExerciseParser.questionIdsMustBeUnique)
  return v as unknown as LessonQuiz
}
export function validatePractical(v: unknown, sections: Set<string>): PracticalChallenge {
  if (
    !record(v) ||
    v.schemaVersion !== 1 ||
    !lessonId(v.lessonId) ||
    !lessonId(v.challengeId) ||
    !v.challengeId.startsWith(v.lessonId + '/') ||
    !text(v.title) ||
    !PRACTICE_LANGUAGES.includes(v.language as never) ||
    !['function', 'structured'].includes(String(v.mode)) ||
    !text(v.instructions, 10000) ||
    !text(v.starterCode, 50000) ||
    !id(v.entryPoint) ||
    !Array.isArray(v.publicExamples) ||
    v.publicExamples.length > 10 ||
    !v.publicExamples.every((e) => record(e) && 'input' in e && 'expected' in e) ||
    !Array.isArray(v.publicTestIds) ||
    v.publicTestIds.length < 1 ||
    v.publicTestIds.length > 20 ||
    !v.publicTestIds.every(id) ||
    !unique(v.publicTestIds) ||
    !record(v.reviewSections) ||
    !Object.entries(v.reviewSections).every(([key, val]) => id(key) && id(val) && sections.has(val)) ||
    !record(v.limits)
  )
    throw new Error(copy.lessonExerciseParser.practicalMetadataIsInvalid)
  const l = v.limits
  if (
    ![l.timeMs, l.memoryMb, l.outputBytes].every(Number.isInteger) ||
    Number(l.timeMs) < 1 ||
    Number(l.timeMs) > 5000 ||
    Number(l.memoryMb) < 1 ||
    Number(l.memoryMb) > 256 ||
    Number(l.outputBytes) < 1 ||
    Number(l.outputBytes) > 20000
  )
    throw new Error(copy.lessonExerciseParser.practicalLimitsAreInvalid)
  if (v.mode === 'structured' && !['json', 'text'].includes(String(v.language)))
    throw new Error(copy.lessonExerciseParser.structuredChallengesMustUseJsonOrText)
  return v as unknown as PracticalChallenge
}
export function parseLessonExercises(source: string): LessonExercise {
  if (source.length > 2_000_000)
    return { markdown: source, quiz: null, practical: null, error: copy.lessonExerciseParser.lessonIsTooLargeForAssignments }
  const lines = source.split(/\r?\n/),
    visible: string[] = [],
    blocks: Record<string, string[]> = {},
    sections = new Set<string>()
  let fence: { char: string; size: number; exercise: string | null } | null = null
  let failure: string | null = null
  for (const line of lines) {
    if (fence) {
      const closing = line.match(/^ {0,3}(\x60{3,}|~{3,})\s*$/)
      if (closing && closing[1][0] === fence.char && closing[1].length >= fence.size) {
        if (!fence.exercise) visible.push(line)
        fence = null
        continue
      }
      if (fence.exercise) blocks[fence.exercise].push(line)
      else visible.push(line)
      continue
    }
    const opening = line.match(/^ {0,3}(\x60{3,}|~{3,})(.*)$/)
    if (opening) {
      const label = opening[2].trim(),
        exercise = ['study-quiz', 'study-practical'].includes(label) ? label : null
      fence = { char: opening[1][0], size: opening[1].length, exercise }
      if (exercise) {
        if (blocks[exercise]) failure = copy.lessonExerciseParser.duplicateExerciseBlock
        blocks[exercise] = []
      } else visible.push(line)
      continue
    }
    const heading = line.match(/^#{1,6} .+ \{#([a-z][a-z0-9-]{0,99})\}\s*$/)
    if (heading) {
      if (sections.has(heading[1])) failure = copy.lessonExerciseParser.duplicateSectionId
      sections.add(heading[1])
    }
    visible.push(line)
  }
  try {
    if (failure || fence?.exercise) throw new Error(failure ?? copy.lessonExerciseParser.unclosedExerciseBlock)
    const quiz = blocks['study-quiz'] ? validateQuiz(JSON.parse(blocks['study-quiz'].join('\n')), sections) : null
    const practical = blocks['study-practical']
      ? validatePractical(JSON.parse(blocks['study-practical'].join('\n')), sections)
      : null
    if ((quiz && !practical) || (!quiz && practical) || (quiz && practical && quiz.lessonId !== practical.lessonId))
      throw new Error(copy.lessonExerciseParser.lessonAssignmentAndPracticalMustShareALessonId)
    return { markdown: visible.join('\n'), quiz, practical, error: null }
  } catch (e) {
    return {
      markdown: visible.join('\n'),
      quiz: null,
      practical: null,
      error:
        e instanceof SyntaxError
          ? copy.lessonExerciseParser.exerciseJsonIsInvalid
          : e instanceof Error
            ? e.message
            : copy.lessonExerciseParser.exerciseMetadataIsInvalid,
    }
  }
}
