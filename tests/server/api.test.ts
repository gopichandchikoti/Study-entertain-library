import assert from 'node:assert/strict'
import { access, readdir } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import test, { after, before } from 'node:test'
import { startTestServer, type TestServer } from './helpers.js'

let server: TestServer
let cookie: string

before(async () => {
  server = await startTestServer()
  cookie = await server.signIn()
})
after(async () => {
  await server.stop()
})

/** fetch adds Cache-Control: no-cache to a request that carries If-None-Match, which would defeat the 304 check. */
const rawGet = (route: string, headers: Record<string, string>): Promise<{ status: number }> =>
  new Promise((resolve, reject) => {
    http
      .get(`${server.url}${route}`, { headers }, (response) => {
        response.resume()
        response.on('end', () => resolve({ status: response.statusCode ?? 0 }))
      })
      .on('error', reject)
  })

const get = (route: string, headers: Record<string, string> = {}) =>
  fetch(`${server.url}${route}`, { headers: { cookie, ...headers } })

test('every response carries hardening headers and a request id', async () => {
  const response = await fetch(`${server.url}/api/health`)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true, storage: 'filesystem', authRequired: true })
  assert.match(response.headers.get('content-security-policy') ?? '', /default-src 'self'/)
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN')
  assert.equal(response.headers.get('cross-origin-opener-policy'), 'same-origin')
  assert.equal(response.headers.get('x-powered-by'), null)
  assert.match(response.headers.get('x-request-id') ?? '', /^[\w.-]{8,64}$/)
})

test('library routes refuse a visitor who has not signed in', async () => {
  for (const route of ['/api/library', '/api/content?path=root-note.md', '/api/asset?path=a.png', '/api/file?path=a.pdf']) {
    const response = await fetch(`${server.url}${route}`)
    assert.equal(response.status, 401, route)
    assert.equal((await response.json()).code, 'AUTH_REQUIRED')
  }
})

test('a wrong password is refused and a right one sets an HttpOnly SameSite cookie', async () => {
  const headers = { 'content-type': 'application/json', origin: 'http://localhost:4444', 'x-requested-with': 'StudyLibrary' }
  const wrong = await fetch(`${server.url}/api/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ password: 'nope' }),
  })
  assert.equal(wrong.status, 401)
  const missing = await fetch(`${server.url}/api/auth/login`, {
    method: 'POST',
    headers: { ...headers, 'content-type': 'text/plain' },
    body: 'x',
  })
  assert.equal(missing.status, 401, 'a body that is not JSON is a bad password, not a crash')
  const right = await fetch(`${server.url}/api/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ password: 'correct horse battery staple' }),
  })
  assert.equal(right.status, 200)
  assert.match(right.headers.getSetCookie()[0] ?? '', /HttpOnly; SameSite=Lax/)
})

test('a forged or tampered cookie is not a session', async () => {
  const forged = cookie.replace(/.$/, (last) => (last === 'A' ? 'B' : 'A'))
  assert.equal((await fetch(`${server.url}/api/library`, { headers: { cookie: forged } })).status, 401)
  assert.equal((await fetch(`${server.url}/api/library`, { headers: { cookie: 'study_library_session=%E0%A4%A' } })).status, 401)
})

test('the library lists notes, skips hidden folders and supports conditional requests', async () => {
  const response = await get('/api/library')
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'private, no-cache')
  const inventory = await response.json()
  const paths = inventory.files.map((file: { path: string }) => file.path)
  assert.ok(paths.includes('Python/01-intro.md') && paths.includes('root-note.md'))
  assert.ok(!paths.some((entry: string) => entry.includes('.hidden')), 'hidden folders are never indexed')
  assert.equal(inventory.files.find((file: { path: string }) => file.path === 'Python/01-intro.md').title, 'Intro to Python')
  const etag = response.headers.get('etag')
  assert.ok(etag)
  assert.equal((await rawGet('/api/library', { cookie, 'if-none-match': etag })).status, 304)
})

test('content returns a note and rejects traversal, hidden and absolute paths', async () => {
  const note = await get(`/api/content?path=${encodeURIComponent('Python/01-intro.md')}`)
  assert.equal(note.status, 200)
  assert.match((await note.json()).content, /Hello\./)
  const attacks = [
    '../outside.md',
    '..%2F..%2Fetc%2Fpasswd',
    '.hidden/secret.md',
    'Python/../.hidden/secret.md',
    path.resolve('/etc/passwd'),
    'Python/01-intro.md%00.png',
  ]
  for (const attack of attacks) {
    const decoded = attack.includes('%') ? attack : encodeURIComponent(attack)
    assert.equal((await get(`/api/content?path=${decoded}`)).status, 404, attack)
  }
  assert.equal((await get('/api/content')).status, 400)
  assert.equal((await get('/api/content?path=a&path=b')).status, 400, 'a repeated parameter is not a path')
})

test('active documents are sandboxed and non-images are not served as assets', async () => {
  const svg = await get(`/api/asset?path=${encodeURIComponent('Python/diagram.svg')}`)
  assert.equal(svg.status, 200)
  assert.match(svg.headers.get('content-security-policy') ?? '', /sandbox/)
  assert.equal((await get(`/api/asset?path=${encodeURIComponent('Python/01-intro.md')}`)).status, 404)
  assert.equal((await get(`/api/file?path=${encodeURIComponent('Python/notes.txt')}`)).status, 200)
})

test('unknown API routes answer with a JSON 404 and unknown pages do not leak a stack', async () => {
  const missing = await get('/api/nothing-here')
  assert.equal(missing.status, 404)
  assert.equal((await missing.json()).code, 'NOT_FOUND')
})

test('a writing request without the app header is rejected before it reaches a handler', async () => {
  const response = await fetch(`${server.url}/api/ebooks`, {
    method: 'POST',
    headers: { cookie, 'content-type': 'application/json' },
    body: '{}',
  })
  assert.equal(response.status, 403)
  assert.equal((await response.json()).code, 'AUTH_CSRF_REJECTED')
})

test('uploads are staged, reviewed, then committed under a safe name', async () => {
  const form = new FormData()
  form.set('file', new Blob(['# Graphs\n\nA python note about graphs.']), 'graphs.md')
  const staged = await fetch(`${server.url}/api/uploads`, { method: 'POST', headers: server.writeHeaders(cookie), body: form })
  assert.equal(staged.status, 201)
  const { upload } = await staged.json()
  assert.equal(upload.classification.category, 'Python', 'the rules classifier picks the matching category')
  assert.equal(upload.previewKind, 'markdown')

  const json = { ...server.writeHeaders(cookie), 'content-type': 'application/json' }
  const traversal = await fetch(`${server.url}/api/uploads/${upload.id}/commit`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ category: '../escape' }),
  })
  assert.equal(traversal.status, 400)
  const wrongExtension = await fetch(`${server.url}/api/uploads/${upload.id}/commit`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ fileName: 'graphs.exe' }),
  })
  assert.equal(wrongExtension.status, 400)
  const committed = await fetch(`${server.url}/api/uploads/${upload.id}/commit`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ category: 'Python', fileName: 'graphs' }),
  })
  assert.equal(committed.status, 201)
  assert.equal((await committed.json()).path, 'Python/graphs.md')
  await access(path.join(server.root, 'Python', 'graphs.md'))
  assert.equal(
    (await fetch(`${server.url}/api/uploads/${upload.id}/commit`, { method: 'POST', headers: json, body: '{}' })).status,
    404,
    'a staged upload can be committed once',
  )
})

test('a discarded upload leaves nothing behind and discarding twice is harmless', async () => {
  const form = new FormData()
  form.set('file', new Blob(['temporary']), 'scratch.txt')
  const { upload } = await (
    await fetch(`${server.url}/api/uploads`, { method: 'POST', headers: server.writeHeaders(cookie), body: form })
  ).json()
  const inbox = path.join(server.root, '.study-library-inbox')
  assert.ok((await readdir(inbox)).some((name) => name.startsWith(upload.id)))
  assert.equal(
    (await fetch(`${server.url}/api/uploads/${upload.id}`, { method: 'DELETE', headers: server.writeHeaders(cookie) })).status,
    204,
  )
  assert.ok(!(await readdir(inbox)).some((name) => name.startsWith(upload.id)))
  assert.equal(
    (await fetch(`${server.url}/api/uploads/${upload.id}`, { method: 'DELETE', headers: server.writeHeaders(cookie) })).status,
    204,
  )
  assert.equal(
    (await fetch(`${server.url}/api/uploads/not-an-id`, { method: 'DELETE', headers: server.writeHeaders(cookie) })).status,
    204,
  )
})

test('unsupported and oversized uploads are refused without writing a file', async () => {
  const unsupported = new FormData()
  unsupported.set('file', new Blob(['MZ']), 'tool.exe')
  assert.equal(
    (await fetch(`${server.url}/api/uploads`, { method: 'POST', headers: server.writeHeaders(cookie), body: unsupported }))
      .status,
    400,
  )
  const huge = new FormData()
  huge.set('file', new Blob([new Uint8Array(8192)]), 'big.txt')
  assert.equal(
    (await fetch(`${server.url}/api/uploads`, { method: 'POST', headers: server.writeHeaders(cookie), body: huge })).status,
    413,
  )
  const empty = await fetch(`${server.url}/api/uploads`, {
    method: 'POST',
    headers: server.writeHeaders(cookie),
    body: new FormData(),
  })
  assert.equal(empty.status, 400)
})

test('ebooks bundle notes and report bad input without leaking server paths', async () => {
  const json = { ...server.writeHeaders(cookie), 'content-type': 'application/json' }
  const made = await fetch(`${server.url}/api/ebooks`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ paths: ['Python/01-intro.md', 'Python/02-loops.md'], title: 'Python Basics' }),
  })
  assert.equal(made.status, 201)
  const body = await made.json()
  assert.equal(body.path, 'Ebooks/Python Basics.epub')
  await access(path.join(server.root, 'Ebooks', 'Python Basics.epub'))

  const rejected = await fetch(`${server.url}/api/ebooks`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ paths: ['Python/diagram.svg'] }),
  })
  assert.equal(rejected.status, 400)
  const message = (await rejected.json()).message as string
  assert.match(message, /Only Markdown and text files/)
  assert.ok(!message.includes(server.root), 'the message must not reveal where the library lives')
  const none = await fetch(`${server.url}/api/ebooks`, { method: 'POST', headers: json, body: '{}' })
  assert.equal(none.status, 400)
})

test('a malformed JSON body is a 400 with a request id, never a stack trace', async () => {
  const response = await fetch(`${server.url}/api/ebooks`, {
    method: 'POST',
    headers: { ...server.writeHeaders(cookie), 'content-type': 'application/json' },
    body: '{not json',
  })
  assert.equal(response.status, 400)
  const body = await response.json()
  assert.equal(body.code, 'REQUEST_FAILED')
  assert.ok(body.requestId)
  assert.ok(!JSON.stringify(body).includes('SyntaxError'))
})

test('large JSON is compressed when the client accepts it', async () => {
  const response = await get('/api/library', { 'accept-encoding': 'gzip' })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-encoding'), 'gzip')
  assert.match(response.headers.get('vary') ?? '', /Accept-Encoding/i)
})

test('watch and music refuse every request when the media folder is not allowed', async () => {
  for (const route of ['/api/watch/library', '/api/music/library', '/api/media']) {
    const response = await get(route)
    assert.equal(response.status, 403, route)
    assert.equal((await response.json()).code, 'WATCH_DRIVE_NOT_ALLOWED')
  }
})
