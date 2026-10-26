import test from 'node:test'
import assert from 'node:assert/strict'
import * as React from 'react'
import { JSDOM } from 'jsdom'
import { renderToStaticMarkup } from 'react-dom/server'
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost:4444', pretendToBeVisual: true })
Object.assign(globalThis, {
  React,
  window: dom.window,
  document: dom.window.document,
  location: dom.window.location,
  history: dom.window.history,
  HTMLElement: dom.window.HTMLElement,
  HTMLDialogElement: dom.window.HTMLDialogElement,
  Element: dom.window.Element,
  Node: dom.window.Node,
  localStorage: dom.window.localStorage,
  __API_ORIGIN__: '',
  IS_REACT_ACT_ENVIRONMENT: true,
})
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
dom.window.HTMLDialogElement.prototype.showModal = function () {
  this.open = true
}
dom.window.HTMLDialogElement.prototype.close = function () {
  this.open = false
}
const { render, fireEvent, waitFor, cleanup } = await import('@testing-library/react')
const { AuthGate } = await import('../../src/features/auth/AuthGate.js')
const { ProfileMenu } = await import('../../src/features/auth/ProfileMenu.js')
const { AuthMascot } = await import('../../src/features/auth/AuthMascot.js')
const { setLearningProgressScope, loadProgress, emptyProgress } = await import('../../src/features/learning/learningProgress.js')
const config = {
  mode: 'accounts',
  providers: ['google', 'microsoft', 'facebook'].map((provider) => ({ provider, enabled: false })),
  development: true,
  emailDelivery: false,
  signupEnabled: true,
  csrfToken: 'test-csrf',
}
const user = {
  id: 'test-account',
  username: 'asha',
  firstName: 'Asha',
  lastName: 'Rao',
  displayName: 'Asha Rao',
  email: 'asha@example.test',
  emailVerified: false,
  phoneNumber: null,
  avatarUrl: null,
  providers: ['password'],
  createdAt: new Date().toISOString(),
  lastLoginAt: null,
}
test('signup validation, disabled provider buttons, password masking, CSRF request and successful account handoff', async () => {
  const old = globalThis.fetch
  let submitted: any = null,
    headers: Headers | undefined,
    signedIn = false
  globalThis.fetch = async (input, options) => {
    if (String(input).endsWith('/config')) return new Response(JSON.stringify(config))
    submitted = JSON.parse(String(options?.body))
    headers = options?.headers as Headers
    return new Response(
      JSON.stringify({ authenticated: true, required: true, user, csrfToken: 'rotated-csrf', verification: 'offline' }),
      { status: 201 },
    )
  }
  const ui = render(
    <AuthGate
      onSession={() => {
        signedIn = true
      }}
    />,
  )
  try {
    await waitFor(() => assert.ok(ui.getByRole('button', { name: 'Continue with google' })))
    assert.equal((ui.getByRole('button', { name: 'Continue with google' }) as HTMLButtonElement).disabled, true)
    assert.equal((ui.getByRole('button', { name: 'Continue with facebook' }) as HTMLButtonElement).disabled, true)
    assert.equal((ui.getByRole('button', { name: 'Continue with microsoft' }) as HTMLButtonElement).disabled, true)
    fireEvent.click(ui.getByRole('button', { name: 'Create an account' }))
    const set = (name: string, value: string) =>
      fireEvent.change(ui.container.querySelector('input[name="' + name + '"]')!, { target: { value } })
    set('firstName', 'Asha')
    set('lastName', 'Rao')
    set('username', 'asha')
    set('email', 'asha@example.test')
    set('password', 'A long unique passphrase!')
    set('confirmPassword', 'different')
    const password = ui.container.querySelector('input[name="password"]') as HTMLInputElement
    fireEvent.focus(password)
    assert.ok(ui.container.querySelector('.mascot-password'))
    assert.equal(password.type, 'password')
    fireEvent.click(ui.getByRole('button', { name: 'Show password' }))
    assert.equal(password.type, 'text')
    assert.ok(!ui.container.querySelector('.auth-mascot')!.innerHTML.includes(password.value))
    fireEvent.submit(ui.container.querySelector('form')!)
    assert.ok(ui.getByRole('alert').textContent?.includes('passwords must match'))
    set('confirmPassword', 'A long unique passphrase!')
    fireEvent.submit(ui.container.querySelector('form')!)
    await waitFor(() => assert.equal(signedIn, true))
    assert.equal(submitted.username, 'asha')
    assert.equal(headers?.get('x-csrf-token'), 'test-csrf')
    assert.ok(ui.getByText(/Verification and password reset emails cannot be sent/))
  } finally {
    cleanup()
    globalThis.fetch = old
  }
})
test('production omits unconfigured providers and reset links are removed from browser history', async () => {
  const old = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify({ ...config, development: false }))
  history.replaceState(null, '', '/#reset-password=' + 'a'.repeat(43))
  const ui = render(<AuthGate onSession={() => {}} />)
  try {
    await waitFor(() => assert.ok(ui.getByRole('button', { name: 'Update password' })))
    assert.equal(location.hash, '')
    assert.equal(ui.queryByRole('button', { name: 'Continue with google' }), null)
  } finally {
    cleanup()
    globalThis.fetch = old
    history.replaceState(null, '', '/')
  }
})
test('profile menu supports keyboard focus, Escape return, profile save and conflict feedback', async () => {
  const old = globalThis.fetch
  let saved = false,
    reject = true
  globalThis.fetch = async (input, options) => {
    if (String(input).endsWith('/config')) return new Response(JSON.stringify(config))
    if (options?.method === 'PATCH') {
      if (reject)
        return new Response(JSON.stringify({ code: 'PROFILE_USERNAME_CONFLICT', message: 'That username is unavailable.' }), {
          status: 409,
        })
      return new Response(JSON.stringify({ ...user, firstName: 'Ash' }))
    }
    return new Response(JSON.stringify(user))
  }
  const ui = render(
    <ProfileMenu
      user={user}
      onUser={() => {
        saved = true
      }}
      onLogout={() => {}}
      theme="dark"
      readingScale="standard"
      onPreferences={() => {}}
    />,
  )
  try {
    const trigger = ui.getByRole('button', { name: /Asha/ })
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    await waitFor(() => assert.equal(document.activeElement, ui.getByRole('menuitem', { name: 'My profile' })))
    fireEvent.keyDown(ui.getByRole('menuitem', { name: 'My profile' }), { key: 'ArrowDown' })
    assert.equal(document.activeElement, ui.getByRole('menuitem', { name: 'Settings' }))
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    assert.equal(document.activeElement, trigger)
    // The menu plays its exit animation before it unmounts (components/Presence.tsx), so it goes away shortly after Escape.
    await waitFor(() => assert.equal(ui.queryByRole('menu') === null, true, 'the menu is removed'))
    fireEvent.click(trigger)
    fireEvent.click(ui.getByRole('menuitem', { name: 'My profile' }))
    await waitFor(() => assert.ok(ui.getByRole('heading', { name: 'My profile' })))
    assert.equal(
      fireEvent.keyDown(ui.getByLabelText('First name'), { key: 'Escape', cancelable: true }),
      true,
      'dialog Escape must reach the native cancel behavior',
    )
    fireEvent.change(ui.getByLabelText('First name'), { target: { value: 'Ash' } })
    fireEvent.click(ui.getByRole('button', { name: 'Save profile' }))
    await waitFor(() => assert.ok(ui.getByRole('alert').textContent?.includes('username is unavailable')))
    reject = false
    fireEvent.click(ui.getByRole('button', { name: 'Save profile' }))
    await waitFor(() => assert.equal(saved, true))
    fireEvent.click(ui.getByRole('button', { name: 'Close profile' }))
    assert.equal(document.activeElement, trigger)
    fireEvent.click(trigger)
    fireEvent.pointerDown(document.body)
    await waitFor(() => assert.equal(ui.queryByRole('menu') === null, true, 'the menu is removed'))
  } finally {
    cleanup()
    globalThis.fetch = old
  }
})
test('mascot states are decorative and account progress does not reuse another account namespace', () => {
  for (const state of ['idle', 'username', 'email', 'password', 'ready', 'error', 'success'] as const) {
    const html = renderToStaticMarkup(<AuthMascot state={state} />)
    assert.ok(html.includes('aria-hidden="true"'))
    assert.ok(html.includes('mascot-' + state))
    assert.ok(!html.includes('<script'))
  }
  localStorage.clear()
  setLearningProgressScope('account-a')
  const progress = emptyProgress('java/lesson')
  progress.readAt = new Date().toISOString()
  localStorage.setItem('study-library:learning-progress:v1:account-a', JSON.stringify({ 'java/lesson': progress }))
  setLearningProgressScope('account-b')
  assert.deepEqual(loadProgress(localStorage), {})
  setLearningProgressScope('account-a')
  assert.equal(loadProgress(localStorage)['java/lesson'].readAt, progress.readAt)
  setLearningProgressScope(null)
})

test('discarding uploads reports server failures and accepts an empty 204 response', async () => {
  const { discardUpload, ApiError } = await import('../../src/api/index.js')
  const old = globalThis.fetch
  try {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ message: 'Upload belongs to another account.', code: 'NOT_FOUND' }), { status: 404 })
    await assert.rejects(
      discardUpload('other-upload'),
      (error: unknown) => error instanceof ApiError && error.status === 404 && error.code === 'NOT_FOUND',
    )
    globalThis.fetch = async () => new Response(null, { status: 204 })
    await discardUpload('own-upload')
  } finally {
    globalThis.fetch = old
  }
})
test('a stale CSRF token is refreshed and the write is retried once, without looping', async () => {
  const { authRequest, ApiError } = await import('../../src/api/index.js')
  const old = globalThis.fetch
  const calls: { path: string; method: string; token: string | null }[] = []
  let serverToken = 'token-after-restart'
  globalThis.fetch = async (input, options) => {
    const path = String(input),
      headers = options?.headers as Headers,
      method = options?.method ?? 'GET'
    calls.push({ path, method, token: headers.get('x-csrf-token') })
    if (path.endsWith('/auth/session'))
      return new Response(JSON.stringify({ authenticated: false, required: true, csrfToken: serverToken }))
    if (headers.get('x-csrf-token') !== serverToken)
      return new Response(JSON.stringify({ code: 'AUTH_CSRF_REJECTED', message: 'Refresh the page and try again.' }), {
        status: 403,
      })
    return new Response(JSON.stringify({ authenticated: true }))
  }
  try {
    await authRequest('/auth/session')
    serverToken = 'token-after-restart-2'
    const result = await authRequest<{ authenticated: boolean }>('/auth/login', 'POST', { identifier: 'asha', password: 'x' })
    assert.equal(result.authenticated, true)
    assert.deepEqual(
      calls.filter((call) => call.method === 'POST').map((call) => call.token),
      ['token-after-restart', 'token-after-restart-2'],
    )
    calls.length = 0
    serverToken = 'never-matches-because-session-keeps-returning-a-new-one'
    globalThis.fetch = async (input, options) => {
      const path = String(input)
      calls.push({ path, method: options?.method ?? 'GET', token: null })
      return path.endsWith('/auth/session')
        ? new Response(JSON.stringify({ authenticated: false, required: true, csrfToken: 'x' }))
        : new Response(JSON.stringify({ code: 'AUTH_CSRF_REJECTED', message: 'Open the app at http://localhost:4444.' }), {
            status: 403,
          })
    }
    await assert.rejects(
      authRequest('/auth/login', 'POST', {}),
      (error: unknown) => error instanceof ApiError && error.status === 403 && error.message.startsWith('Open the app'),
    )
    assert.equal(calls.filter((call) => call.method === 'POST').length, 2)
  } finally {
    globalThis.fetch = old
  }
})
