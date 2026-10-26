import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import * as React from 'react'
import { JSDOM } from 'jsdom'
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost:4444', pretendToBeVisual: true })
Object.assign(globalThis, {
  React,
  window: dom.window,
  Window: dom.window.Window,
  document: dom.window.document,
  localStorage: dom.window.localStorage,
  HTMLElement: dom.window.HTMLElement,
  Element: dom.window.Element,
  Node: dom.window.Node,
  MutationObserver: dom.window.MutationObserver,
  DOMRect: dom.window.DOMRect,
  requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
  cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
  getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
  __API_ORIGIN__: '',
  IS_REACT_ACT_ENVIRONMENT: true,
})
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
dom.window.HTMLElement.prototype.scrollIntoView = function () {}
dom.window.Range.prototype.getClientRects = function () {
  return []
}
dom.window.Range.prototype.getBoundingClientRect = function () {
  return new dom.window.DOMRect()
}
const { render, fireEvent, waitFor, cleanup } = await import('@testing-library/react')
const { LearningLesson } = await import('../../src/features/learning/LearningLesson.js')
const { default: ReactMarkdown } = await import('react-markdown')
const { default: rehypeSanitize } = await import('rehype-sanitize')
const { remarkSectionAnchors } = await import('../../src/features/learning/sectionAnchors.js')
const { parseLessonExercises } = await import('../../src/features/learning/lessonExerciseParser.js')
const { PROGRESS_KEY } = await import('../../src/features/learning/learningProgress.js')
const markdown = await readFile('study-content/Java/01-learning-map.md', 'utf8'),
  quiz = parseLessonExercises(markdown).quiz!
const renderLesson = (text: string) => (
  <ReactMarkdown remarkPlugins={[remarkSectionAnchors]} rehypePlugins={[rehypeSanitize]}>
    {text}
  </ReactMarkdown>
)
test('read, submit, review, retry, practical pass, next lesson, and reload progress', async () => {
  localStorage.clear()
  let submittedSource = '',
    completed = 0
  const result = {
    runId: 'run-ui',
    status: 'completed',
    summary: { passed: 3, failed: 0, total: 3 },
    tests: [
      { id: 'decision', status: 'passed' },
      { id: 'explanation', status: 'passed' },
      { id: 'failure-plan', status: 'passed' },
    ],
    stdout: 'All required tests passed.',
    stderr: '',
    durationMs: 1,
    outputBytes: 26,
  }
  const oldFetch = globalThis.fetch
  globalThis.fetch = async (input, options) => {
    const url = String(input)
    if (url.endsWith('/capabilities'))
      return new Response(
        JSON.stringify({ languages: ['json', 'text'], codeExecution: false, message: 'Fixed structured checks' }),
      )
    if (options?.method === 'POST' && url.endsWith('/runs')) {
      submittedSource = String(options.body)
      return new Response(JSON.stringify({ runId: 'run-ui', status: 'queued' }), { status: 202 })
    }
    return new Response(JSON.stringify(result))
  }
  const props = {
    markdown,
    renderLesson,
    nextLesson: 'History',
    onNext: () => {},
    onComplete: () => {
      completed++
    },
  }
  let ui = render(<LearningLesson {...props} />)
  try {
    assert.equal((ui.getByRole('button', { name: 'Assignment 2/3' }) as HTMLButtonElement).disabled, true)
    assert.equal((ui.getByRole('button', { name: /Next lesson/ }) as HTMLButtonElement).disabled, true)
    fireEvent.click(ui.getByRole('button', { name: 'Mark lesson read' }))
    const submit = ui.getByRole('button', { name: 'Submit assignment' }) as HTMLButtonElement
    assert.equal(submit.disabled, true)
    quiz.questions.forEach((q, i) =>
      fireEvent.click(
        ui.container.querySelector(
          'input[name="' +
            q.id +
            '"][value="' +
            (i === 0 ? q.options.find((o) => o.id !== q.correctOptionId)!.id : q.correctOptionId) +
            '"]',
        )!,
      ),
    )
    assert.equal(submit.disabled, false)
    fireEvent.click(submit)
    assert.ok(ui.getByText('4 / 5 · 80%'))
    fireEvent.click(ui.getByRole('button', { name: 'Review concept 1' }))
    await waitFor(() => assert.equal(document.activeElement?.id, 'user-content-concept-1'))
    fireEvent.click(ui.getByRole('button', { name: 'Assignment 2/3' }))
    assert.ok(ui.getByText('4 / 5 · 80%'))
    fireEvent.click(ui.getByRole('button', { name: 'Retry assignment' }))
    quiz.questions.forEach((q) =>
      fireEvent.click(ui.container.querySelector('input[name="' + q.id + '"][value="' + q.correctOptionId + '"]')!),
    )
    fireEvent.click(ui.getByRole('button', { name: 'Submit assignment' }))
    assert.ok(ui.getByText('5 / 5 · 100%'))
    fireEvent.click(ui.getByRole('button', { name: 'Continue to practical' }))
    await waitFor(() => assert.equal((ui.getByRole('button', { name: 'Run' }) as HTMLButtonElement).disabled, false))
    fireEvent.click(ui.getByRole('button', { name: 'Run' }))
    await waitFor(() => assert.ok(ui.getByText('3 passed, 0 failed')))
    assert.ok(submittedSource.includes('challengeId'))
    fireEvent.click(ui.getByRole('button', { name: 'Submit solution' }))
    await waitFor(() => assert.equal((ui.getByRole('button', { name: /Next lesson/ }) as HTMLButtonElement).disabled, false))
    assert.equal(completed, 1)
    await waitFor(() =>
      assert.equal(JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}')[quiz.lessonId].practical.passed, true),
    )
    ui.unmount()
    ui = render(<LearningLesson {...props} />)
    assert.ok(ui.getByText('Complete'))
    assert.ok(ui.getByText(/best 5\/5/))
    assert.equal((ui.getByRole('button', { name: /Next lesson/ }) as HTMLButtonElement).disabled, false)
  } finally {
    cleanup()
    globalThis.fetch = oldFetch
  }
})
test('code runner unavailable leaves the reader and assignment usable', async () => {
  localStorage.clear()
  const source = await readFile('study-content/Java/04-variables-types-and-operators.md', 'utf8')
  const oldFetch = globalThis.fetch
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ languages: ['json', 'text'], codeExecution: false, message: 'No code execution' }))
  const ui = render(
    <LearningLesson
      markdown={source}
      renderLesson={renderLesson}
      nextLesson="Control flow"
      onNext={() => {}}
      onComplete={() => {}}
    />,
  )
  try {
    const q = parseLessonExercises(source).quiz!
    fireEvent.click(ui.getByRole('button', { name: 'Mark lesson read' }))
    q.questions.forEach((question) =>
      fireEvent.click(ui.container.querySelector('input[name="' + question.id + '"][value="' + question.correctOptionId + '"]')!),
    )
    fireEvent.click(ui.getByRole('button', { name: 'Submit assignment' }))
    fireEvent.click(ui.getByRole('button', { name: 'Continue to practical' }))
    await waitFor(() => assert.ok(ui.getByText(/Runner unavailable for java/)))
    assert.equal((ui.getByRole('button', { name: 'Run' }) as HTMLButtonElement).disabled, true)
    assert.equal((ui.getByRole('button', { name: /Next lesson/ }) as HTMLButtonElement).disabled, true)
    fireEvent.click(ui.getByRole('button', { name: 'Lesson 1/3' }))
    assert.ok(ui.getByRole('button', { name: 'Open assignment' }))
  } finally {
    cleanup()
    globalThis.fetch = oldFetch
  }
})
