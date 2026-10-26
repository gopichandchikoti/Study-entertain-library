import * as React from 'react'
Object.assign(globalThis, { React })
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { renderToStaticMarkup } from 'react-dom/server'
import { AssignmentPanel } from '../../src/features/learning/AssignmentPanel.js'
import { LessonStepper } from '../../src/features/learning/LessonStepper.js'
import { TestResults } from '../../src/features/learning/TestResults.js'
import { parseLessonExercises } from '../../src/features/learning/lessonExerciseParser.js'
import { scoreQuiz } from '../../src/features/learning/learningProgress.js'
const quiz = parseLessonExercises(await readFile('study-content/Java/01-learning-map.md', 'utf8')).quiz!
const noop = () => {}
test('stepper locks assignment and practical before prerequisites', () => {
  const html = renderToStaticMarkup(<LessonStepper stage="lesson" read={false} quizPassed={false} onStage={noop} />)
  assert.equal((html.match(/disabled/g) ?? []).length, 2)
  assert.ok(html.includes('aria-current="step"'))
  assert.ok(html.includes('Mark the lesson read first'))
})
test('assignment hides feedback and requires all five answers before submit', () => {
  const html = renderToStaticMarkup(
    <AssignmentPanel
      quiz={quiz}
      answers={{}}
      score={null}
      onAnswer={noop}
      onSubmit={noop}
      onRetry={noop}
      onReview={noop}
      onPractical={noop}
    />,
  )
  assert.equal((html.match(/type="radio"/g) ?? []).length, 20)
  assert.ok(!html.includes('Correct answer:'))
  assert.ok(html.includes('disabled=""'))
  assert.ok(html.includes('0 of 5 answered'))
})
test('score shows percentage and enabled review controls', () => {
  const answers = Object.fromEntries(quiz.questions.slice(1).map((q) => [q.id, q.correctOptionId]))
  const html = renderToStaticMarkup(
    <AssignmentPanel
      quiz={quiz}
      answers={answers}
      score={scoreQuiz(quiz, answers)}
      onAnswer={noop}
      onSubmit={noop}
      onRetry={noop}
      onReview={noop}
      onPractical={noop}
    />,
  )
  assert.ok(html.includes('4 / 5'))
  assert.ok(html.includes('80%'))
  assert.ok(html.includes('Correct answer:'))
  assert.ok(html.includes('Review concept 1'))
  assert.ok(!html.includes('<fieldset disabled'))
})
test('results announce states with text and review links', () => {
  const html = renderToStaticMarkup(
    <TestResults
      run={{
        runId: 'one',
        status: 'completed',
        summary: { passed: 1, failed: 1, total: 2 },
        tests: [
          { id: 'first', status: 'passed' },
          { id: 'second', status: 'failed' },
        ],
        stdout: 'Review the requirement',
        stderr: '',
        durationMs: 12,
        outputBytes: 22,
        reviewSectionId: 'concept-1',
      }}
      onReview={noop}
    />,
  )
  assert.ok(html.includes('aria-live="polite"'))
  assert.ok(html.includes('failed'))
  assert.ok(html.includes('12'))
  assert.ok(html.includes('Review this section'))
})
