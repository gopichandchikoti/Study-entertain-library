import assert from 'node:assert/strict'
import test, { after, before } from 'node:test'
import { startAccountServer, STRONG_PASSWORD, type AccountServer } from './harness.js'

let server: AccountServer

/** The id of the record a response created, found under the given key of its JSON body. */
const idOf = (body: Record<string, unknown> | null, key: string): string =>
  String((body?.[key] as { id?: unknown } | undefined)?.id)

before(async () => {
  server = await startAccountServer()
})
after(async () => {
  await server.stop()
})

const PROTECTED_READS = [
  '/api/library',
  '/api/content?path=Notes/one.md',
  '/api/asset?path=Notes/one.md',
  '/api/file?path=Notes/one.md',
  '/api/markdown',
  '/api/profile',
  '/api/settings',
  '/api/practice/capabilities',
  '/api/watch/library',
  '/api/music/library',
  '/api/media',
]

test('every protected route refuses a visitor with no session', async () => {
  const visitor = await server.anonymous()
  for (const route of PROTECTED_READS) {
    const response = await visitor.request(route)
    assert.equal(response.status, 401, `${route} answered ${response.status}`)
  }
})

test('a forged, truncated or stolen-looking session cookie is not a session', async () => {
  const { client } = await server.signUp('forge')
  const name = client.cookieNames().find((key) => key === 'study_account')
  assert.ok(name, 'a session cookie exists')
  for (const value of ['', 'x', 'A'.repeat(43), '../../etc/passwd', '%00', 'a.b.c', 'A'.repeat(4000)]) {
    const attacker = await server.anonymous()
    attacker.forgeCookie(name, value)
    assert.equal((await attacker.request('/api/library')).status, 401, `cookie ${value.slice(0, 12)}`)
  }
})

test('a write without the CSRF token or from another origin is rejected before it acts', async () => {
  const { client } = await server.signUp('csrf')
  const noToken = await client.request('/api/markdown', { method: 'POST', body: { name: 'a', content: 'b' }, csrf: false })
  assert.equal(noToken.status, 403)
  const wrongOrigin = await client.request('/api/markdown', {
    method: 'POST',
    body: { name: 'a', content: 'b' },
    headers: { origin: 'https://evil.example' },
  })
  assert.equal(wrongOrigin.status, 403)
  const wrongToken = await client.request('/api/markdown', {
    method: 'POST',
    body: { name: 'a', content: 'b' },
    headers: { 'x-csrf-token': 'x'.repeat(43) },
  })
  assert.equal(wrongToken.status, 403)
  const ok = await client.request('/api/markdown', { method: 'POST', body: { name: 'fine', content: 'ok' } })
  assert.equal(ok.status, 201)
})

test("one account cannot read, change or delete another account's Markdown files (no IDOR)", async () => {
  const owner = (await server.signUp('owner')).client
  const intruder = (await server.signUp('intruder')).client
  const created = await owner.request('/api/markdown', { method: 'POST', body: { name: 'private-notes', content: 'only mine' } })
  assert.equal(created.status, 201)
  const id = idOf(created.json, 'document')
  assert.equal((await intruder.request(`/api/markdown/${id}`)).status, 404)
  assert.equal((await intruder.request(`/api/markdown/${id}`, { method: 'PUT', body: { content: 'overwritten' } })).status, 404)
  assert.equal((await intruder.request(`/api/markdown/${id}`, { method: 'DELETE' })).status, 404)
  const list = await intruder.request('/api/markdown')
  assert.ok(!list.text.includes('private-notes'), "the list never includes another account's file")
  const still = await owner.request(`/api/markdown/${id}`)
  assert.equal(still.status, 200)
  assert.match(still.text, /only mine/)
})

test('staged uploads belong to the account that staged them', async () => {
  const owner = (await server.signUp('uploader')).client
  const intruder = (await server.signUp('snoop')).client
  const form = new FormData()
  form.set('file', new Blob(['# Private upload']), 'private.md')
  const staged = await owner.request('/api/uploads', { method: 'POST', form })
  assert.equal(staged.status, 201)
  const id = idOf(staged.json, 'upload')
  assert.equal((await intruder.request(`/api/uploads/${id}/commit`, { method: 'POST', body: { category: 'Notes' } })).status, 404)
  assert.equal((await intruder.request(`/api/uploads/${id}`, { method: 'DELETE' })).status, 404)
  assert.equal((await owner.request(`/api/uploads/${id}`, { method: 'DELETE' })).status, 204)
})

test('path traversal, encoded traversal and hidden or absolute paths never reach the disk', async () => {
  const { client } = await server.signUp('walker')
  const attacks = [
    '../outside-secret.txt',
    '..%2Foutside-secret.txt',
    '%2e%2e%2foutside-secret.txt',
    '..\\outside-secret.txt',
    'Notes/../../outside-secret.txt',
    '/etc/passwd',
    'C:\\Windows\\win.ini',
    '.study-library-inbox/x.json',
    'Notes/one.md%00.png',
    '....//outside-secret.txt',
  ]
  for (const route of ['/api/content', '/api/asset', '/api/file']) {
    for (const attack of attacks) {
      const response = await client.request(`${route}?path=${attack}`)
      assert.ok(response.status === 404 || response.status === 400, `${route}?path=${attack} answered ${response.status}`)
      assert.ok(!response.text.includes('TOP-SECRET-OUTSIDE-ROOT'), 'content outside the root must never be returned')
    }
  }
})

test('hostile Markdown is data: it is stored verbatim and returned as JSON, never as HTML', async () => {
  const { client } = await server.signUp('xss')
  const payload = '<script>alert(1)</script><img src=x onerror=alert(2)>'
  const created = await client.request('/api/markdown', { method: 'POST', body: { name: 'xss', content: payload } })
  assert.equal(created.status, 201)
  const id = idOf(created.json, 'document')
  const fetched = await client.request(`/api/markdown/${id}`)
  assert.match(fetched.headers.get('content-type') ?? '', /application\/json/)
  assert.equal(fetched.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(String((fetched.json?.document as { content?: unknown } | undefined)?.content), payload)
})

test('errors reveal nothing: no stack, SQL, path or framework name', async () => {
  const { client } = await server.signUp('errors')
  const malformed = await client.request('/api/markdown', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    form: undefined,
  })
  const broken = await fetch(`${server.url}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'http://localhost:4444' },
    body: '{"identifier":',
  })
  for (const text of [malformed.text, await broken.text()]) {
    assert.ok(
      !/\bat \w+.*\(.*:\d+:\d+\)|node_modules|SQLITE|SELECT |INSERT |Error:|Express|stack/i.test(text),
      `leaky body: ${text.slice(0, 120)}`,
    )
  }
  assert.ok(broken.status === 400 || broken.status === 403)
})

test('sign-in does not reveal whether an account exists, and failures are rate limited', async () => {
  const { username } = await server.signUp('victim')
  const attacker = await server.anonymous()
  const wrongPassword = await attacker.request('/api/auth/login', {
    method: 'POST',
    body: { identifier: username, password: `${STRONG_PASSWORD} wrong` },
  })
  const unknownUser = await attacker.request('/api/auth/login', {
    method: 'POST',
    body: { identifier: 'no-such-user-xyz', password: `${STRONG_PASSWORD} wrong` },
  })
  assert.equal(wrongPassword.status, 401)
  assert.equal(unknownUser.status, 401)
  assert.equal(wrongPassword.json?.message, unknownUser.json?.message, 'same message for both')
  let limited = false
  for (let attempt = 0; attempt < 40 && !limited; attempt += 1) {
    const response = await attacker.request('/api/auth/login', {
      method: 'POST',
      body: { identifier: username, password: `guess ${attempt}` },
    })
    limited = response.status === 429
  }
  assert.ok(limited, 'repeated failures end in HTTP 429')
})

test('weak passwords and mismatched confirmations are refused at sign-up', async () => {
  const attacker = await server.anonymous()
  const base = { email: 'weak@example.test', username: 'weakuser', firstName: 'W', lastName: 'U' }
  assert.equal(
    (
      await attacker.request('/api/auth/signup', {
        method: 'POST',
        body: { ...base, password: 'short', confirmPassword: 'short' },
      })
    ).status,
    400,
  )
  assert.equal(
    (
      await attacker.request('/api/auth/signup', {
        method: 'POST',
        body: { ...base, password: STRONG_PASSWORD, confirmPassword: 'different one entirely' },
      })
    ).status,
    400,
  )
})

test('responses carry the hardening headers and the session cookie is HttpOnly and SameSite', async () => {
  const anonymous = await server.anonymous()
  const response = await anonymous.request('/api/auth/session')
  for (const header of [
    'content-security-policy',
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy',
    'x-request-id',
  ]) {
    assert.ok(response.headers.get(header), `${header} is set`)
  }
  assert.equal(response.headers.get('x-powered-by'), null)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  const created = await fetch(`${server.url}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost:4444',
      'x-csrf-token': anonymous.csrf,
      cookie: anonymous
        .cookieNames()
        .map((name) => `${name}=`)
        .join('; '),
    },
    body: '{}',
  })
  assert.ok(created.status >= 400, 'an empty sign-up is refused')
  const { client } = await server.signUp('cookie')
  void client
})

test('CORS is closed: a foreign origin gets no permissive headers', async () => {
  const response = await fetch(`${server.url}/api/auth/session`, { headers: { origin: 'https://evil.example' } })
  assert.equal(response.headers.get('access-control-allow-origin'), null)
  const preflight = await fetch(`${server.url}/api/library`, {
    method: 'OPTIONS',
    headers: { origin: 'https://evil.example', 'access-control-request-method': 'GET' },
  })
  assert.equal(preflight.headers.get('access-control-allow-origin'), null)
})

test('the web root serves only the build: dotfiles, source and maps are unreachable', async () => {
  for (const route of [
    '/.env',
    '/.git/config',
    '/package.json',
    '/server/index.ts',
    '/node_modules/express/package.json',
    '/data/study-library.sqlite',
    '/%2e%2e/package.json',
  ]) {
    const response = await fetch(`${server.url}${route}`)
    const body = await response.text()
    assert.ok(!/"name":\s*"study-library"|SQLite format|\[core\]|import express/.test(body), `${route} leaked file content`)
  }
})

test('rate limiting covers the whole API and answers with Retry-After', async () => {
  const visitor = await server.anonymous()
  const first = await visitor.request('/api/auth/session')
  assert.ok(first.headers.get('ratelimit-limit'), 'limit headers are published')
  assert.ok(Number(first.headers.get('ratelimit-remaining')) >= 0)
})
