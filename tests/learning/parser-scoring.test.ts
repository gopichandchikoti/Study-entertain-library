import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { parseLessonExercises } from '../../src/features/learning/lessonExerciseParser.js'
import {
  scoreQuiz,
  emptyProgress,
  recordQuiz,
  loadProgress,
  lessonComplete,
} from '../../src/features/learning/learningProgress.js'
import { remarkSectionAnchors } from '../../src/features/learning/sectionAnchors.js'
const source = await readFile('study-content/Java/01-learning-map.md', 'utf8')
const exercise = parseLessonExercises(source)
assert.equal(exercise.error, null)
const quiz = exercise.quiz!
const answers = Object.fromEntries(quiz.questions.map((q) => [q.id, q.correctOptionId]))
const replaceQuiz = (update: (q: typeof quiz) => void): string => {
  const q = structuredClone(quiz)
  update(q)
  return source.replace(JSON.stringify(quiz, null, 2), JSON.stringify(q, null, 2))
}
test('valid fences parse without exposing exercise metadata in the reader', () => {
  assert.equal(exercise.quiz?.questions.length, 5)
  assert.equal(exercise.practical?.language, 'json')
  assert.ok(!exercise.markdown.includes('study-quiz'))
  assert.ok(exercise.markdown.includes('mermaid'))
})
for (const count of [0, 4, 6])
  test('reject ' + count + ' questions', () => {
    assert.ok(
      parseLessonExercises(
        replaceQuiz((q) => {
          q.questions = Array.from({ length: count }, (_, i) => ({ ...q.questions[i % 5], id: 'q' + i }))
        }),
      ).error,
    )
  })
test('duplicate question and option IDs, missing section, invalid answer key are rejected', () => {
  for (const change of [
    (q: typeof quiz) => {
      q.questions[1].id = q.questions[0].id
    },
    (q: typeof quiz) => {
      q.questions[0].options[1].id = q.questions[0].options[0].id
    },
    (q: typeof quiz) => {
      q.questions[0].sectionId = 'missing-section'
    },
    (q: typeof quiz) => {
      q.questions[0].correctOptionId = 'unknown'
    },
  ])
    assert.ok(parseLessonExercises(replaceQuiz(change)).error)
})
test('unsupported language, version, malformed JSON, duplicate and unclosed fences fail safely', () => {
  assert.ok(parseLessonExercises(source.replace('"language": "json"', '"language": "shell"')).error)
  assert.ok(parseLessonExercises(source.replace('"schemaVersion": 1', '"schemaVersion": 9')).error)
  assert.ok(parseLessonExercises(source.replace('"questions": [', '"questions": nope')).error)
  const fence = String.fromCharCode(96).repeat(3)
  assert.ok(parseLessonExercises(source + '\n' + fence + 'study-quiz\n{}\n' + fence).error)
  assert.ok(parseLessonExercises(source + '\n' + fence + 'study-practical\n{}').error)
})
test('examples nested in a longer fence are not exercise data', () => {
  const fence = String.fromCharCode(96).repeat(4)
  const result = parseLessonExercises(
    fence + 'text\n' + String.fromCharCode(96).repeat(3) + 'study-quiz\n{}\n' + String.fromCharCode(96).repeat(3) + '\n' + fence,
  )
  assert.equal(result.quiz, null)
  assert.equal(result.error, null)
})
test('score 0/5, 4/5, and 5/5; map missed answers to review sections', () => {
  assert.equal(scoreQuiz(quiz, {}).points, 0)
  const four = { ...answers }
  delete four[quiz.questions[0].id]
  const result = scoreQuiz(quiz, four)
  assert.equal(result.points, 4)
  assert.equal(result.percentage, 80)
  assert.equal(result.passed, true)
  assert.equal(result.missed[0].sectionId, quiz.questions[0].sectionId)
  assert.equal(scoreQuiz(quiz, answers).percentage, 100)
})
test('retry preserves best score and completion gate', () => {
  let p = emptyProgress(quiz.lessonId)
  assert.equal(lessonComplete(p), false)
  p = { ...p, readAt: new Date().toISOString() }
  p = recordQuiz(p, scoreQuiz(quiz, answers))
  p = recordQuiz(p, scoreQuiz(quiz, {}))
  assert.equal(p.quiz.bestScore, 5)
  assert.equal(p.quiz.attempts, 2)
  assert.equal(p.quiz.passed, true)
  assert.equal(lessonComplete(p), false)
  p.practical = { lastRunId: 'run-1', passedTests: 3, totalTests: 3, passed: true, lastAttemptAt: new Date().toISOString() }
  assert.equal(lessonComplete(p), true)
})
test('corrupt progress resets while good records survive', () => {
  assert.deepEqual(loadProgress({ getItem: () => '{bad' }), {})
  const p = emptyProgress(quiz.lessonId)
  assert.deepEqual(loadProgress({ getItem: () => JSON.stringify({ [p.lessonId]: p, broken: { quiz: { passed: true } } }) }), {
    [p.lessonId]: p,
  })
})
test('heading IDs remove markers and reject unsafe identifiers', () => {
  const heading = {
    type: 'heading',
    children: [{ type: 'text', value: 'HTTP methods {#http-methods}' }],
    data: { hProperties: {} },
  }
  remarkSectionAnchors()({ type: 'root', children: [heading] })
  assert.equal(heading.children[0].value, 'HTTP methods')
  assert.equal((heading.data.hProperties as Record<string, string>).id, 'http-methods')
  const bad = { type: 'heading', children: [{ type: 'text', value: 'Unsafe {#__proto__}' }] }
  remarkSectionAnchors()({ type: 'root', children: [bad] })
  assert.ok(bad.children[0].value.includes('__proto__'))
})
