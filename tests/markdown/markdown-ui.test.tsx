import test from 'node:test'
import assert from 'node:assert/strict'
import * as React from 'react'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost:4444', pretendToBeVisual: true })
Object.assign(globalThis, {
  React,
  window: dom.window,
  document: dom.window.document,
  location: dom.window.location,
  history: dom.window.history,
  HTMLElement: dom.window.HTMLElement,
  Element: dom.window.Element,
  Node: dom.window.Node,
  localStorage: dom.window.localStorage,
  __API_ORIGIN__: '',
  IS_REACT_ACT_ENVIRONMENT: true,
})
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })

const { render, fireEvent, waitFor, cleanup, within } = await import('@testing-library/react')
const { SplitEditor } = await import('../../src/features/markdown/SplitEditor.js')
const { GuestView } = await import('../../src/features/guest/GuestView.js')
const { MarkdownWorkspace } = await import('../../src/features/markdown/MarkdownWorkspace.js')
const { AuthGate } = await import('../../src/features/auth/AuthGate.js')

const reset = (): void => {
  cleanup()
  dom.window.localStorage.clear()
}

// jsdom has no PointerEvent, so build pointer events from MouseEvent (same clientX/button fields).
const pointer = (type: 'pointerdown' | 'pointermove' | 'pointerup', target: Element, init: { clientX?: number } = {}): void => {
  const event = new dom.window.MouseEvent(type, { bubbles: true, cancelable: true, button: 0, ...init })
  Object.defineProperty(event, 'pointerId', { value: 1 })
  fireEvent(target, event)
}

function Harness({
  initial = '',
  onTheme = () => {},
  theme = 'dark' as 'dark' | 'light',
  ...rest
}: {
  initial?: string
  onTheme?: () => void
  theme?: 'dark' | 'light'
  showThemeToggle?: boolean
}) {
  const [value, setValue] = React.useState(initial)
  return <SplitEditor value={value} onChange={setValue} theme={theme} onToggleTheme={onTheme} {...rest} />
}

const editorOf = (ui: ReturnType<typeof render>) => ui.getByLabelText('Markdown source') as HTMLTextAreaElement
const previewOf = (ui: ReturnType<typeof render>) => ui.getByRole('region', { name: 'Rendered preview' }) as HTMLDivElement
const dividerOf = (ui: ReturnType<typeof render>) => ui.getByRole('separator', { name: 'Resize editor and preview' })

test('typing Markdown renders it as formatted content, and unsafe HTML is removed', async () => {
  const ui = render(<Harness />)
  try {
    assert.ok(ui.getByText(/Nothing to preview yet/))
    fireEvent.change(editorOf(ui), {
      target: {
        value:
          '# Hello\n\nSome **bold** text and a [link](https://example.com).\n\n- [x] done\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n<script>alert(1)</script><img src="x" onerror="alert(2)">',
      },
    })
    await waitFor(() => assert.equal(previewOf(ui).querySelector('h1')?.textContent, 'Hello'))
    const preview = previewOf(ui)
    assert.equal(preview.querySelector('strong')?.textContent, 'bold')
    assert.equal(preview.querySelector('table td')?.textContent, '1')
    assert.ok(preview.querySelector('input[type="checkbox"]'))
    const link = preview.querySelector('a') as HTMLAnchorElement
    assert.equal(link.getAttribute('target'), '_blank')
    assert.match(link.getAttribute('rel') ?? '', /noopener/)
    assert.equal(preview.querySelector('script'), null)
    assert.equal(preview.querySelector('img')?.getAttribute('onerror') ?? null, null)
  } finally {
    reset()
  }
})

test('the divider starts at 50/50 and resizes with the keyboard, double-click and dragging', async () => {
  const ui = render(<Harness initial="# Text" />)
  try {
    const divider = dividerOf(ui)
    const panes = divider.parentElement as HTMLElement
    const value = () => Number(divider.getAttribute('aria-valuenow'))
    assert.equal(value(), 50)
    assert.equal(panes.style.getPropertyValue('--md-left'), '50fr')

    fireEvent.keyDown(divider, { key: 'ArrowRight' })
    assert.equal(value(), 52)
    fireEvent.keyDown(divider, { key: 'ArrowLeft', shiftKey: true })
    assert.equal(value(), 42)
    fireEvent.keyDown(divider, { key: 'Home' })
    assert.equal(value(), 20)
    fireEvent.keyDown(divider, { key: 'ArrowLeft', shiftKey: true })
    assert.equal(value(), 20, 'the left pane cannot be squeezed below 20%')
    fireEvent.keyDown(divider, { key: 'End' })
    assert.equal(value(), 80)
    assert.equal(panes.style.getPropertyValue('--md-left'), '80fr')
    assert.equal(panes.style.getPropertyValue('--md-right'), '20fr')
    fireEvent.doubleClick(divider)
    assert.equal(value(), 50)

    // Drag: a 1014px wide area has 1000px of usable width, so x = 7 + 250 is 25%.
    panes.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 1014,
      bottom: 600,
      width: 1014,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    pointer('pointerdown', divider, { clientX: 507 })
    pointer('pointermove', divider, { clientX: 257 })
    assert.equal(value(), 25)
    assert.ok(ui.container.querySelector('.md-split.is-dragging'))
    pointer('pointermove', divider, { clientX: -500 })
    assert.equal(value(), 20)
    pointer('pointerup', divider)
    assert.equal(ui.container.querySelector('.md-split.is-dragging'), null)
    pointer('pointermove', divider, { clientX: 700 })
    assert.equal(value(), 20, 'moving after the drag has ended does nothing')
    assert.equal(JSON.parse(dom.window.localStorage.getItem('study-library:markdown-prefs')!).split, 20)
  } finally {
    reset()
  }
})

test('scroll sync mirrors scrolling both ways, can be switched off, and does not echo back', async () => {
  const ui = render(<Harness initial={'line\n'.repeat(200)} />)
  try {
    const editor = editorOf(ui)
    const preview = previewOf(ui)
    const size = (element: HTMLElement, scrollHeight: number, clientHeight: number) => {
      Object.defineProperty(element, 'scrollHeight', { value: scrollHeight, configurable: true })
      Object.defineProperty(element, 'clientHeight', { value: clientHeight, configurable: true })
    }
    size(editor, 2000, 500) // 1500 scrollable
    size(preview, 4000, 500) // 3500 scrollable
    const toggle = ui.getByRole('button', { name: /Scroll sync/ })
    assert.equal(toggle.getAttribute('aria-pressed'), 'true')

    editor.scrollTop = 750 // half way
    fireEvent.scroll(editor)
    assert.equal(preview.scrollTop, 1750)
    // The preview's own scroll event, caused by the line above, must not move the editor again.
    editor.scrollTop = 750
    fireEvent.scroll(preview)
    assert.equal(editor.scrollTop, 750)

    preview.scrollTop = 3500 // bottom of the preview, a genuine user scroll
    fireEvent.scroll(preview)
    assert.equal(editor.scrollTop, 1500)

    fireEvent.click(toggle)
    assert.equal(toggle.getAttribute('aria-pressed'), 'false')
    assert.match(toggle.textContent ?? '', /Off/)
    editor.scrollTop = 0
    fireEvent.scroll(editor)
    assert.equal(preview.scrollTop, 3500, 'nothing follows while sync is off')

    editor.scrollTop = 300
    fireEvent.click(toggle) // switching back on lines the preview up with the editor straight away
    assert.equal(preview.scrollTop, 700)
    assert.equal(JSON.parse(dom.window.localStorage.getItem('study-library:markdown-prefs')!).scrollSync, true)
  } finally {
    reset()
  }
})

test('the theme button reports the mode it will switch to and calls back; it can be hidden', async () => {
  let toggled = 0
  const ui = render(
    <Harness
      theme="dark"
      onTheme={() => {
        toggled += 1
      }}
    />,
  )
  try {
    fireEvent.click(ui.getByRole('button', { name: 'Switch to light mode' }))
    assert.equal(toggled, 1)
    ui.rerender(
      <Harness
        theme="light"
        onTheme={() => {
          toggled += 1
        }}
      />,
    )
    assert.ok(ui.getByRole('button', { name: 'Switch to dark mode' }))
    ui.rerender(<Harness theme="light" showThemeToggle={false} />)
    assert.equal(ui.queryByRole('button', { name: /Switch to/ }), null)
  } finally {
    reset()
  }
})

test('the sign-in screen offers "Continue as guest" only when a guest handler exists', async () => {
  const config = { mode: 'accounts', providers: [], development: true, emailDelivery: false, signupEnabled: true, csrfToken: 't' }
  const old = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify(config))
  let guests = 0
  const ui = render(
    <AuthGate
      onSession={() => {}}
      onGuest={() => {
        guests += 1
      }}
    />,
  )
  try {
    fireEvent.click(await ui.findByRole('button', { name: 'Continue as guest' }))
    assert.equal(guests, 1)
    ui.rerender(<AuthGate onSession={() => {}} />)
    assert.equal(ui.queryByRole('button', { name: 'Continue as guest' }), null)
  } finally {
    reset()
    globalThis.fetch = old
  }
})

test('guest view: features first, then a working Markdown tab with the same controls and a sign-in path', async () => {
  let signIn = 0,
    themed = 0
  const ui = render(
    <GuestView
      theme="dark"
      onToggleTheme={() => {
        themed += 1
      }}
      onSignIn={() => {
        signIn += 1
      }}
    />,
  )
  try {
    assert.equal(ui.getByRole('tab', { name: 'Features' }).getAttribute('aria-selected'), 'true')
    assert.ok(ui.getByRole('heading', { name: 'Study library' }))
    assert.equal(ui.queryByLabelText('Markdown source'), null)

    fireEvent.click(ui.getByRole('tab', { name: 'Markdown preview' }))
    assert.equal(ui.getByRole('tab', { name: 'Markdown preview' }).getAttribute('aria-selected'), 'true')
    await waitFor(() => assert.equal(previewOf(ui).querySelector('h1')?.textContent, 'Welcome to the Markdown preview'))
    assert.ok(ui.getByRole('button', { name: /Scroll sync/ }))
    assert.ok(dividerOf(ui))
    assert.equal(ui.queryByRole('button', { name: /^Save/ }), null, 'guests cannot save')

    fireEvent.change(editorOf(ui), { target: { value: '## My draft' } })
    await waitFor(() => assert.equal(previewOf(ui).querySelector('h2')?.textContent, 'My draft'))
    await waitFor(() => assert.equal(dom.window.localStorage.getItem('study-library:guest-markdown'), '## My draft'))

    assert.equal(ui.getAllByRole('button', { name: 'Switch to light mode' }).length, 1, 'one theme button, not two')
    fireEvent.click(ui.getByRole('button', { name: 'Switch to light mode' }))
    assert.equal(themed, 1)
    fireEvent.click(ui.getByRole('button', { name: 'Sign in to save files' }))
    fireEvent.click(ui.getByRole('button', { name: 'Sign in' }))
    assert.equal(signIn, 2)
  } finally {
    reset()
  }
})

// ---- Signed-in workspace against an in-memory server ----

type Doc = { id: string; name: string; content: string; createdAt: string; updatedAt: string }

function fakeServer(initial: Doc[] = []) {
  const docs = new Map(initial.map((doc) => [doc.id, doc]))
  const calls: { method: string; path: string; body?: any }[] = []
  let clock = 1_800_000_000
  let nextId = 1
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })
  const fetcher = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const method = init?.method ?? 'GET'
    const path = new URL(String(input), 'http://localhost').pathname
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined
    calls.push({ method, path, body })
    const id = path.split('/')[3]
    const stamp = () => new Date(++clock * 1000).toISOString()
    const taken = (name: string, except?: string) =>
      [...docs.values()].some((doc) => doc.name.toLowerCase() === name.toLowerCase() && doc.id !== except)
    if (path === '/api/markdown' && method === 'GET')
      return json({
        documents: [...docs.values()].map(({ content, ...rest }) => ({ ...rest, size: content.length })),
        limits: { maxDocuments: 200, maxNameLength: 100, maxContentLength: 300000 },
      })
    if (path === '/api/markdown' && method === 'POST') {
      if (taken(body.name))
        return json(
          { code: 'MARKDOWN_NAME_TAKEN', message: 'You already have a file with that name. Choose a different name.' },
          409,
        )
      const doc = { id: `doc-${nextId++}`, name: body.name, content: body.content, createdAt: stamp(), updatedAt: stamp() }
      docs.set(doc.id, doc)
      return json({ document: doc }, 201)
    }
    const doc = docs.get(id)
    if (!doc) return json({ code: 'MARKDOWN_NOT_FOUND', message: 'That file could not be found.' }, 404)
    if (method === 'GET') return json({ document: doc })
    if (method === 'PUT') {
      if (taken(body.name ?? doc.name, doc.id))
        return json(
          { code: 'MARKDOWN_NAME_TAKEN', message: 'You already have a file with that name. Choose a different name.' },
          409,
        )
      Object.assign(doc, { name: body.name ?? doc.name, content: body.content ?? doc.content, updatedAt: stamp() })
      return json({ document: doc })
    }
    if (method === 'DELETE') {
      docs.delete(id)
      return json({ ok: true })
    }
    return json({}, 405)
  }
  return { docs, calls, fetcher }
}

const doc = (id: string, name: string, content: string, updated: number): Doc => ({
  id,
  name,
  content,
  createdAt: new Date((1_700_000_000 + updated) * 1000).toISOString(),
  updatedAt: new Date((1_700_000_000 + updated) * 1000).toISOString(),
})
const nameInput = (ui: ReturnType<typeof render>) => ui.getByRole('textbox', { name: 'File name' }) as HTMLInputElement

async function mountWorkspace(server: ReturnType<typeof fakeServer>, onUnauthorized = () => {}) {
  globalThis.fetch = server.fetcher as typeof fetch
  const ui = render(<MarkdownWorkspace theme="dark" onToggleTheme={() => {}} onUnauthorized={onUnauthorized} />)
  await waitFor(() => assert.ok(ui.queryByLabelText('Markdown source')))
  return ui
}

test('a new account starts on "Untitled 1", saves it, and the next new file is "Untitled 2"', async () => {
  const old = globalThis.fetch
  const server = fakeServer()
  const ui = await mountWorkspace(server)
  try {
    assert.equal(nameInput(ui).value, 'Untitled 1')
    assert.ok(ui.getByText('Not saved yet', { selector: '.md-status' }))
    const save = ui.getByRole('button', { name: /^Save/ }) as HTMLButtonElement
    fireEvent.change(editorOf(ui), { target: { value: '# First note' } })
    assert.ok(ui.getByText('Unsaved changes'))
    fireEvent.click(save)
    await waitFor(() => assert.ok(ui.getByText('All changes saved')))
    assert.deepEqual(server.calls.find((call) => call.method === 'POST')?.body, { name: 'Untitled 1', content: '# First note' })
    assert.ok(within(ui.getByRole('complementary', { name: 'Your Markdown files' })).getByText('Untitled 1'))

    fireEvent.click(ui.getByRole('button', { name: 'New file' }))
    assert.equal(nameInput(ui).value, 'Untitled 2')
    assert.equal(editorOf(ui).value, '')
  } finally {
    reset()
    globalThis.fetch = old
  }
})

test('signing in again shows saved files; the latest opens, others open on click, rename and edit save with PUT', async () => {
  const old = globalThis.fetch
  const server = fakeServer([doc('a', 'Old notes', 'old text', 10), doc('b', 'Recent notes', 'recent text', 20)])
  const ui = await mountWorkspace(server)
  try {
    assert.equal(nameInput(ui).value, 'Recent notes')
    assert.equal(editorOf(ui).value, 'recent text')
    const files = within(ui.getByRole('complementary', { name: 'Your Markdown files' }))
    assert.ok(files.getByText('Old notes'))

    fireEvent.click(files.getByRole('button', { name: /^Old notes/ }))
    await waitFor(() => assert.equal(editorOf(ui).value, 'old text'))
    assert.equal(nameInput(ui).value, 'Old notes')

    fireEvent.change(nameInput(ui), { target: { value: 'Renamed notes' } })
    fireEvent.change(editorOf(ui), { target: { value: 'old text, edited' } })
    fireEvent.keyDown(editorOf(ui), { key: 's', ctrlKey: true })
    await waitFor(() => assert.ok(ui.getByText('All changes saved')))
    assert.deepEqual(server.calls.find((call) => call.method === 'PUT')?.body, {
      name: 'Renamed notes',
      content: 'old text, edited',
    })
    assert.equal(server.docs.get('a')?.name, 'Renamed notes')
    assert.ok(files.getByText('Renamed notes'))
  } finally {
    reset()
    globalThis.fetch = old
  }
})

test('a taken name is reported, unsaved work is protected, and deleting a file asks first', async () => {
  const old = globalThis.fetch
  const answers: boolean[] = []
  dom.window.confirm = () => answers.shift() ?? false
  const server = fakeServer([doc('a', 'Alpha', 'alpha', 10), doc('b', 'Beta', 'beta', 20)])
  const ui = await mountWorkspace(server)
  try {
    const files = within(ui.getByRole('complementary', { name: 'Your Markdown files' }))
    fireEvent.change(nameInput(ui), { target: { value: 'alpha' } }) // Beta is open; "alpha" clashes with Alpha
    fireEvent.click(ui.getByRole('button', { name: /^Save/ }))
    await waitFor(() => assert.match(ui.getByRole('alert').textContent ?? '', /already have a file with that name/))
    assert.equal(server.docs.get('b')?.name, 'Beta')

    fireEvent.change(editorOf(ui), { target: { value: 'beta, unsaved edit' } })
    answers.push(false) // "Keep editing"
    fireEvent.click(files.getByRole('button', { name: /^Alpha/ }))
    assert.equal(editorOf(ui).value, 'beta, unsaved edit')
    assert.equal(server.calls.filter((call) => call.path === '/api/markdown/a' && call.method === 'GET').length, 0)

    answers.push(true) // "Discard"
    fireEvent.click(files.getByRole('button', { name: /^Alpha/ }))
    await waitFor(() => assert.equal(editorOf(ui).value, 'alpha'))

    fireEvent.click(files.getByRole('button', { name: 'Delete Alpha' }))
    fireEvent.click(files.getByRole('button', { name: 'Keep' }))
    assert.equal(server.docs.has('a'), true)
    fireEvent.click(files.getByRole('button', { name: 'Delete Alpha' }))
    fireEvent.click(files.getByRole('button', { name: 'Delete' }))
    await waitFor(() => assert.equal(server.docs.has('a'), false))
    await waitFor(() => assert.equal(nameInput(ui).value, 'Beta'), { timeout: 2000 })
    assert.equal(files.queryByText('Alpha'), null)
  } finally {
    reset()
    globalThis.fetch = old
  }
})

test('an expired session sends the user back to sign-in', async () => {
  const old = globalThis.fetch
  let expired = 0
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ code: 'AUTH_REQUIRED', message: 'Sign in to access your study library.' }), { status: 401 })
  const ui = render(
    <MarkdownWorkspace
      theme="dark"
      onToggleTheme={() => {}}
      onUnauthorized={() => {
        expired += 1
      }}
    />,
  )
  try {
    await waitFor(() => assert.equal(expired, 1))
  } finally {
    reset()
    globalThis.fetch = old
  }
  void ui
})

test('on a large document the preview waits for a pause in typing, but a paste shows straight away', async () => {
  const big = '# Big\n\n' + 'filler line of text\n\n'.repeat(400) // about 8,000 characters
  const ui = render(<Harness initial={big} />)
  try {
    await waitFor(() => assert.equal(previewOf(ui).querySelector('h1')?.textContent, 'Big'))
    fireEvent.change(editorOf(ui), { target: { value: big.replace('# Big', '# Bigger') } }) // one character typed
    assert.equal(
      previewOf(ui).querySelector('h1')?.textContent,
      'Big',
      'a single keystroke does not re-render a large document immediately',
    )
    await waitFor(() => assert.equal(previewOf(ui).querySelector('h1')?.textContent, 'Bigger'))

    fireEvent.change(editorOf(ui), { target: { value: '# Pasted\n\n' + 'another long pasted paragraph\n\n'.repeat(60) } })
    await waitFor(() => assert.equal(previewOf(ui).querySelector('h1')?.textContent, 'Pasted'), { timeout: 50 })
  } finally {
    reset()
  }
})
