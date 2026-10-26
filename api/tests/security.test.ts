import assert from 'node:assert/strict'
import test, { after, before } from 'node:test'
import { formWith, PASSWORD, SERVICE_KEY, startApi, SYNC_TOKEN, WEB_ORIGIN, type Harness, type Reply } from './support.js'

let api: Harness
let cookie: string

before(async () => {
  api = await startApi()
  api.storage.seed('Notes/one.md', '# One\n\nBody of the first note.', 'text/markdown')
  api.storage.seed('Notes/two.md', '# Two\n\nSecond.', 'text/markdown')
  api.storage.seed('Notes/diagram.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>', 'image/svg+xml')
  api.storage.seed('Notes/page.html', '<html><script>alert(1)</script></html>', 'text/html')
  api.storage.seed('Notes/trojan.txt', '<html><script>alert(1)</script></html>', 'text/html')
  api.storage.seed('Books/book.pdf', '%PDF-1.4 a pretend book', 'application/pdf')
  api.storage.seed('.study-library-inbox/11111111-1111-4111-8111-111111111111.md', '# staged, not approved', 'text/markdown')
  await api.index()
  cookie = await api.signIn()
})
after(async () => {
  await api.stop()
})

const PROBLEM_KEYS = ['code', 'message', 'requestId']

const stagedId = (reply: Reply): string => {
  const upload = reply.json?.upload as { id?: string } | undefined
  assert.ok(upload?.id, `the upload was staged: ${reply.text}`)
  return upload.id
}

test('every route except sign-in and health refuses a visitor with no session, with the standard error body', async () => {
  const visitor = [
    ['GET', '/api/library'],
    ['GET', '/api/content?path=Notes/one.md'],
    ['GET', '/api/asset?path=Notes/diagram.svg'],
    ['GET', '/api/file?path=Books/book.pdf'],
    ['POST', '/api/uploads'],
    ['POST', '/api/uploads/11111111-1111-4111-8111-111111111111/commit'],
    ['DELETE', '/api/uploads/11111111-1111-4111-8111-111111111111'],
    ['POST', '/api/ebooks'],
  ] as const
  for (const [method, route] of visitor) {
    const reply = await api.request(route, { method })
    assert.equal(reply.status, 401, `${method} ${route}`)
    assert.deepEqual(Object.keys(reply.json ?? {}).sort(), PROBLEM_KEYS, route)
    assert.equal(reply.json?.code, 'AUTH_REQUIRED')
  }
  assert.equal((await api.request('/api/health')).status, 200)
  assert.equal((await api.request('/api/auth/session')).status, 200)
})

test('a forged, tampered, expired or duplicated session cookie is not a session', async () => {
  const name = api.config.cookie.name
  const [, issued, id, signature] = /^[^=]+=(\d+)\.([0-9a-f-]{36})\.(.+)$/.exec(cookie) ?? []
  const forged = [
    `${name}=`,
    `${name}=x`,
    `${name}=${issued}.${id}.${'A'.repeat(43)}`,
    `${name}=${Number(issued) - 1}.${id}.${signature}`,
    `${name}=${Date.now() + 86_400_000}.${id}.${signature}`,
    `${name}=../../etc/passwd`,
    `${name}=%00`,
    `${name}=${'A'.repeat(4000)}`,
    `${cookie}; ${cookie}`,
    `${name}=${issued}.${id}.${signature}; ${name}=${issued}.${id}.${'B'.repeat(43)}`,
  ]
  for (const attempt of forged) assert.equal((await api.request('/api/library', { cookie: attempt })).status, 401, attempt.slice(0, 40))
  assert.equal((await api.request('/api/library', { cookie })).status, 200, 'the genuine cookie works')
  api.clock.now += api.config.cookie.lifetimeMs + 1000
  assert.equal((await api.request('/api/library', { cookie })).status, 401, 'a session ends after its lifetime')
  api.clock.now = Date.now()
})

test('writes need the web origin and the app marker; a cross-site page cannot ride the cookie', async () => {
  const form = () => formWith('note.md', '# Hello')
  const attempts: Array<[string, Parameters<Harness['request']>[1]]> = [
    ['no Origin at all', { method: 'POST', cookie, form: form(), origin: null }],
    ['another origin', { method: 'POST', cookie, form: form(), origin: 'https://evil.example' }],
    ['a look-alike origin', { method: 'POST', cookie, form: form(), origin: `${WEB_ORIGIN}.evil.example` }],
    ['no app marker', { method: 'POST', cookie, form: form(), marker: false }],
    ['DELETE from another origin', { method: 'DELETE', cookie, origin: 'https://evil.example' }],
  ]
  for (const [label, options] of attempts) {
    const route = options?.method === 'DELETE' ? '/api/uploads/11111111-1111-4111-8111-111111111111' : '/api/uploads'
    const reply = await api.request(route, options)
    assert.equal(reply.status, 403, label)
    assert.equal(reply.json?.code, 'CSRF_REJECTED', label)
  }
  assert.equal((await api.request('/api/uploads', { method: 'POST', cookie, form: form() })).status, 201, 'the real page still works')
  assert.equal((await api.request('/api/auth/login', { method: 'POST', body: { password: PASSWORD }, origin: 'https://evil.example' })).status, 403, 'login CSRF')
})

test('CORS allows exactly one origin and says so on preflights', async () => {
  const foreign = await api.request('/api/library', { cookie, origin: 'https://evil.example' })
  assert.equal(foreign.headers.get('access-control-allow-origin'), null)
  assert.equal(foreign.headers.get('access-control-allow-credentials'), null)
  assert.match(foreign.headers.get('vary') ?? '', /Origin/)
  const preflightEvil = await api.request('/api/uploads', { method: 'OPTIONS', origin: 'https://evil.example', marker: false })
  assert.equal(preflightEvil.status, 403)
  assert.equal(preflightEvil.headers.get('access-control-allow-origin'), null)
  const preflight = await api.request('/api/uploads', {
    method: 'OPTIONS',
    marker: false,
    headers: { 'access-control-request-method': 'POST', 'access-control-request-headers': 'x-requested-with, x-csrf-token, content-type' },
  })
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('access-control-allow-origin'), WEB_ORIGIN)
  assert.equal(preflight.headers.get('access-control-allow-credentials'), 'true')
  const allowed = (preflight.headers.get('access-control-allow-headers') ?? '').split(/,\s*/)
  for (const header of ['x-requested-with', 'x-csrf-token', 'content-type', 'range']) assert.ok(allowed.includes(header), `${header} is allowed`)
  assert.ok(!(preflight.headers.get('access-control-allow-methods') ?? '').includes('PUT'))
  const real = await api.request('/api/library', { cookie })
  assert.equal(real.headers.get('access-control-allow-origin'), WEB_ORIGIN)
  assert.notEqual(real.headers.get('access-control-allow-origin'), '*')
})

test('responses carry hardening headers, no framework name, and private answers are never cached', async () => {
  const reply = await api.request('/api/library', { cookie })
  assert.match(reply.headers.get('content-security-policy') ?? '', /default-src 'none'/)
  assert.match(reply.headers.get('content-security-policy') ?? '', new RegExp(`frame-ancestors ${WEB_ORIGIN}`))
  assert.equal(reply.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(reply.headers.get('referrer-policy'), 'no-referrer')
  assert.equal(reply.headers.get('cross-origin-opener-policy'), 'same-origin')
  assert.ok(reply.headers.get('permissions-policy'))
  assert.equal(reply.headers.get('x-powered-by'), null)
  assert.equal(reply.headers.get('cache-control'), 'no-store')
  assert.match(reply.headers.get('x-request-id') ?? '', /^[\w.-]{8,64}$/)
  assert.ok(reply.headers.get('ratelimit-limit'), 'rate-limit headers are published')
  assert.equal(reply.headers.get('strict-transport-security'), null, 'HSTS is for production only')
})

test('production adds HSTS, __Host- cookies and refuses plain HTTP', async () => {
  const live = await startApi({ NODE_ENV: 'production', SESSION_SECRET: 'p'.repeat(48) }, true)
  const plain = await startApi({ NODE_ENV: 'production', SESSION_SECRET: 'p'.repeat(48) }, false)
  try {
    const login = await live.request('/api/auth/login', { method: 'POST', body: { password: PASSWORD } })
    assert.equal(login.status, 200)
    assert.match(login.headers.get('strict-transport-security') ?? '', /max-age=31536000/)
    const setCookie = login.headers.getSetCookie()[0]
    assert.match(setCookie, /^__Host-study_library_session=/)
    for (const flag of ['HttpOnly', 'Secure', 'SameSite=None', 'Path=/', 'Max-Age=604800']) assert.ok(setCookie.includes(flag), flag)
    assert.ok(!/Domain=/i.test(setCookie), 'a __Host- cookie has no Domain')
    const refused = await plain.request('/api/library')
    assert.equal(refused.status, 426)
    assert.equal(refused.json?.code, 'HTTPS_REQUIRED')
    assert.equal((await plain.request('/api/health')).status, 200, 'the proxy health probe is allowed')
  } finally {
    await live.stop()
    await plain.stop()
  }
})

test('the sign-in cookie is HttpOnly and SameSite, and a wrong password reveals nothing', async () => {
  const good = await api.request('/api/auth/login', { method: 'POST', body: { password: PASSWORD } })
  const setCookie = good.headers.getSetCookie()[0]
  for (const flag of ['HttpOnly', 'SameSite=Lax', 'Max-Age=604800']) assert.ok(setCookie.includes(flag), flag)
  const bad = await api.request('/api/auth/login', { method: 'POST', body: { password: `${PASSWORD} nope` } })
  assert.equal(bad.status, 401)
  assert.equal(bad.json?.code, 'AUTH_INVALID_CREDENTIALS')
  for (const body of [undefined, {}, { password: 42 }, { password: ['a'] }, { password: 'x'.repeat(5000) }]) {
    assert.equal((await api.request('/api/auth/login', { method: 'POST', body })).status, 401, JSON.stringify(body)?.slice(0, 30))
  }
  const out = await api.request('/api/auth/logout', { method: 'POST', cookie })
  assert.match(out.headers.getSetCookie()[0], /Max-Age=0/)
})

test('repeated wrong passwords end in 429 with Retry-After, per client address', async () => {
  const attacker = '10.99.99.1'
  let limited = null as Awaited<ReturnType<Harness['request']>> | null
  for (let attempt = 0; attempt < 30 && !limited; attempt += 1) {
    const reply = await api.request('/api/auth/login', { method: 'POST', body: { password: `guess ${attempt}` }, address: attacker })
    if (reply.status === 429) limited = reply
  }
  assert.ok(limited, 'guessing is cut off')
  assert.ok(Number(limited.headers.get('retry-after')) >= 1)
  assert.equal(limited.json?.code, 'LOGIN_RATE_LIMITED')
  assert.equal((await api.request('/api/auth/login', { method: 'POST', body: { password: PASSWORD }, address: '10.99.99.2' })).status, 200, 'another address is unaffected')
})

test('files are served by their extension, never by the type stored or claimed, and active documents are sandboxed', async () => {
  const trojan = await api.request('/api/file?path=Notes/trojan.txt', { cookie })
  assert.equal(trojan.status, 200)
  assert.equal(trojan.headers.get('content-type'), 'text/plain', 'a .txt stored as text/html is still text')
  assert.equal(trojan.headers.get('x-content-type-options'), 'nosniff')
  for (const route of ['/api/file?path=Notes/page.html', '/api/file?path=Notes/diagram.svg', '/api/asset?path=Notes/diagram.svg']) {
    const reply = await api.request(route, { cookie })
    assert.equal(reply.status, 200, route)
    assert.match(reply.headers.get('content-security-policy') ?? '', /^sandbox;/, route)
    assert.match(reply.headers.get('content-security-policy') ?? '', /default-src 'none'/, route)
  }
  const pdf = await api.request('/api/file?path=Books/book.pdf', { cookie })
  assert.equal(pdf.headers.get('content-type'), 'application/pdf')
  assert.match(pdf.headers.get('content-security-policy') ?? '', new RegExp(`frame-ancestors ${WEB_ORIGIN}`))
  assert.ok(!(pdf.headers.get('content-security-policy') ?? '').includes('sandbox'), 'the PDF viewer keeps working')
  assert.equal(pdf.headers.get('cache-control'), 'private, max-age=300', 'authenticated files are never public-cacheable')
  const ranged = await api.request('/api/file?path=Books/book.pdf', { cookie, headers: { range: 'bytes=0-3' } })
  assert.equal(ranged.status, 206)
  assert.equal(ranged.text, '%PDF')
  const multi = await api.request('/api/file?path=Books/book.pdf', { cookie, headers: { range: 'bytes=0-1,5-9' } })
  assert.equal(multi.status, 200, 'an unsupported multi-range request is served whole, not forwarded')
})

test('path traversal, hidden folders and unindexed files are never reachable', async () => {
  const attacks = [
    '..',
    '../package.json',
    '..%2Fpackage.json',
    '%2e%2e%2fpackage.json',
    '..\\package.json',
    'Notes/../../x.md',
    '/etc/passwd',
    'C:\\Windows\\win.ini',
    '.study-library-inbox/11111111-1111-4111-8111-111111111111.md',
    'Notes/one.md%00.png',
    'Notes/missing.md',
    'x'.repeat(2000),
  ]
  for (const route of ['/api/content', '/api/asset', '/api/file']) {
    for (const attack of attacks) {
      const reply = await api.request(`${route}?path=${attack}`, { cookie })
      assert.ok([400, 404].includes(reply.status), `${route}?path=${attack.slice(0, 30)} answered ${reply.status}`)
      assert.ok(!reply.text.includes('staged, not approved'), 'a staged upload is never readable')
    }
  }
  assert.equal((await api.request('/api/library', { cookie })).text.includes('study-library-inbox'), false, 'the inbox is not listed')
  assert.equal((await api.request('/api/library?q=' + 'x'.repeat(500), { cookie })).status, 400)
})

test('uploads are staged privately, reviewed, then committed under a safe name', async () => {
  const address = '10.81.0.1'
  const staged = await api.request('/api/uploads', {
    method: 'POST',
    cookie,
    form: formWith('graphs.md', '# Graphs\n\nAbout notes.', 'text/html'),
    address,
  })
  assert.equal(staged.status, 201)
  const upload = staged.json?.upload as { id: string; mimeType: string; classification: { category: string } }
  assert.equal(upload.mimeType, 'text/plain', 'the type is derived from the extension, not the uploader (who claimed text/html)')
  assert.equal(upload.classification.category, 'Notes', 'the rules classifier picks the matching category')
  assert.ok(api.storage.objects.has(`.study-library-inbox/${upload.id}.md`), 'staged under the private inbox')
  assert.ok(!(await api.request('/api/library', { cookie })).text.includes('graphs'), 'a staged upload is not in the library')

  const commit = (body: unknown) => api.request(`/api/uploads/${upload.id}/commit`, { method: 'POST', cookie, body, address })
  for (const category of ['../escape', '.hidden', 'a/b', 'a\\b', '..', 'x\u0000y']) {
    assert.equal((await commit({ category })).status, 400, `category ${JSON.stringify(category)}`)
  }
  assert.equal((await commit({ fileName: 'graphs.exe' })).status, 400)
  assert.equal((await commit({ fileName: '../graphs.md' })).status, 400)
  const done = await commit({ category: 'Notes', fileName: 'graphs' })
  assert.equal(done.status, 201)
  assert.equal(done.json?.path, 'Notes/graphs.md')
  assert.ok(api.storage.objects.has('Notes/graphs.md'))
  assert.equal((await commit({})).status, 404, 'a staged upload is committed once')
  const stored = await api.request('/api/file?path=Notes/graphs.md', { cookie })
  assert.equal(stored.headers.get('content-type'), 'text/plain')
})

test('upload checks: type, size, real content, a ceiling on what waits for review, and quiet errors', async () => {
  const refuse = async (form: FormData, status: number, code: string) => {
    const reply = await api.request('/api/uploads', { method: 'POST', cookie, form })
    assert.equal(reply.status, status, `${code}: ${reply.text}`)
    assert.equal(reply.json?.code, code)
    assert.deepEqual(Object.keys(reply.json ?? {}).sort(), PROBLEM_KEYS)
    return reply
  }
  const before = api.storage.objects.size
  const weird = await refuse(formWith('tool.<img src=x onerror=alert(1)>', 'x'), 400, 'UPLOAD_TYPE_UNSUPPORTED')
  assert.ok(!weird.text.includes('onerror'), 'the file name is not echoed')
  await refuse(formWith('tool.exe', 'MZ'), 400, 'UPLOAD_TYPE_UNSUPPORTED')
  await refuse(formWith('big.txt', new Uint8Array(8192)), 413, 'UPLOAD_TOO_LARGE')
  await refuse(formWith('report.pdf', '<html><script>alert(1)</script>'), 400, 'UPLOAD_CONTENT_MISMATCH')
  await refuse(formWith('photo.png', '<svg onload=alert(1)>'), 400, 'UPLOAD_CONTENT_MISMATCH')
  await refuse(new FormData(), 400, 'UPLOAD_MISSING')
  assert.equal(api.storage.objects.size, before, 'refused uploads wrote nothing')

  const hoarder = await startApi()
  try {
    const own = await hoarder.signIn()
    for (let index = 0; index < 25; index += 1) {
      const reply = await hoarder.request('/api/uploads', { method: 'POST', cookie: own, form: formWith(`n${index}.md`, '# n'), address: `10.50.${index}.1` })
      assert.equal(reply.status, 201, `upload ${index}`)
    }
    const full = await hoarder.request('/api/uploads', { method: 'POST', cookie: own, form: formWith('last.md', '# n'), address: '10.50.200.1' })
    assert.equal(full.status, 409)
    assert.equal(full.json?.code, 'UPLOAD_QUOTA')
    hoarder.clock.now += 25 * 60 * 60 * 1000
    const later = await hoarder.request('/api/uploads', { method: 'POST', cookie: own, form: formWith('later.md', '# n'), address: '10.50.201.1' })
    assert.equal(later.status, 201, 'stale uploads are swept, freeing the places')
    assert.equal([...hoarder.storage.objects.keys()].filter((key) => key.startsWith('.study-library-inbox/')).length, 1, 'and their files are deleted')
  } finally {
    await hoarder.stop()
  }
})

test('discarding is idempotent, ignores bad ids, and a stale upload cannot be committed', async () => {
  const address = '10.82.0.1'
  const call = (route: string, method: string, body?: unknown) => api.request(route, { method, cookie, body, address })
  const staged = await api.request('/api/uploads', { method: 'POST', cookie, form: formWith('scratch.txt', 'temp'), address })
  const id = stagedId(staged)
  assert.equal((await call(`/api/uploads/${id}`, 'DELETE')).status, 204)
  assert.ok(!api.storage.objects.has(`.study-library-inbox/${id}.txt`))
  assert.equal((await call(`/api/uploads/${id}`, 'DELETE')).status, 204)
  assert.equal((await call('/api/uploads/not-an-id', 'DELETE')).status, 204)
  assert.equal((await call('/api/uploads/not-an-id/commit', 'POST', {})).status, 404)

  const old = await api.request('/api/uploads', { method: 'POST', cookie, form: formWith('old.md', '# old'), address })
  const oldId = stagedId(old)
  api.clock.now += 2 * 24 * 60 * 60 * 1000
  assert.equal((await call(`/api/uploads/${oldId}/commit`, 'POST', {})).status, 404)
  api.clock.now = Date.now()
})

test('errors are generic: no provider text, key, path or stack, only a code and a request id', async () => {
  const broken = await startApi()
  try {
    const own = await broken.signIn()
    broken.storage.seed('Notes/one.md', '# One', 'text/markdown')
    await broken.index()
    broken.storage.failure = new Error(`fetch failed: https://example.supabase.co/storage/v1/object/study-library apikey=${SERVICE_KEY}`)
    const logged: string[] = []
    const originalWrite = process.stderr.write.bind(process.stderr)
    process.stderr.write = ((chunk: string | Uint8Array) => {
      logged.push(String(chunk))
      return true
    }) as typeof process.stderr.write
    try {
      for (const route of ['/api/content?path=Notes/one.md', '/api/file?path=Notes/one.md']) {
        const reply = await broken.request(route, { cookie: own })
        assert.equal(reply.status, 500, route)
        assert.deepEqual(Object.keys(reply.json ?? {}).sort(), PROBLEM_KEYS)
        assert.equal(reply.json?.code, 'REQUEST_FAILED')
        for (const secret of [SERVICE_KEY, 'supabase', 'apikey', 'storage/v1', 'Error:', ' at ']) {
          assert.ok(!reply.text.includes(secret), `${route} must not contain ${secret}`)
        }
      }
      const upload = await broken.request('/api/uploads', { method: 'POST', cookie: own, form: formWith('a.md', '# a') })
      assert.equal(upload.status, 500)
      assert.ok(!upload.text.includes(SERVICE_KEY))
    } finally {
      process.stderr.write = originalWrite
    }
    assert.ok(logged.some((line) => line.includes('"requestId"') && line.includes('[redacted]')), 'the failure is logged for the operator')
    assert.ok(!logged.join('').includes(SERVICE_KEY), 'but a secret never reaches the log')
  } finally {
    await broken.stop()
  }
  const raw = await fetch(`${api.url}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: WEB_ORIGIN, 'x-requested-with': 'StudyLibrary', 'x-forwarded-for': '10.77.0.1' },
    body: '{"password":',
  })
  assert.equal(raw.status, 400)
  const body = await raw.text()
  assert.ok(!/SyntaxError|JSON|at .*\(.*:\d+/i.test(body), 'a malformed body is a plain 400')
  const huge = await fetch(`${api.url}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: WEB_ORIGIN, 'x-requested-with': 'StudyLibrary', 'x-forwarded-for': '10.77.0.2' },
    body: JSON.stringify({ password: 'x'.repeat(100_000) }),
  })
  assert.equal(huge.status, 413)
  const unknown = await api.request('/api/nothing-here', { cookie })
  assert.equal(unknown.status, 404)
  assert.equal(unknown.json?.code, 'NOT_FOUND')
})

test('catalog sync needs its token, works without a session, and is rate limited', async () => {
  const withToken = (token?: string, address = '10.60.0.1') =>
    api.request('/api/catalog/sync', { method: 'POST', origin: null, marker: false, headers: token ? { 'x-catalog-sync-token': token } : {}, address })
  assert.equal((await withToken()).status, 401)
  assert.equal((await withToken('wrong')).status, 401)
  assert.equal((await withToken(SYNC_TOKEN.slice(0, -1))).status, 401)
  const ok = await withToken(SYNC_TOKEN)
  assert.equal(ok.status, 200, 'the token alone is enough: no session, no browser headers')
  assert.ok(typeof ok.json?.indexed === 'number')
  let limited = false
  for (let attempt = 0; attempt < 10 && !limited; attempt += 1) limited = (await withToken('wrong', '10.60.0.2')).status === 429
  assert.ok(limited, 'token guessing is cut off')
  const unconfigured = await startApi({ CATALOG_SYNC_TOKEN: '' })
  try {
    assert.equal((await unconfigured.request('/api/catalog/sync', { method: 'POST', origin: null, marker: false })).status, 503)
  } finally {
    await unconfigured.stop()
  }
})

test('ebooks: only indexed notes, bounded input, no raw HTML carried in, no path echoed', async () => {
  api.storage.seed('Notes/scripted.md', '# Scripted\n\n<script>alert(1)</script>\n\nText.', 'text/markdown')
  await api.index()
  const post = (body: unknown) => api.request('/api/ebooks', { method: 'POST', cookie, body, address: `10.61.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` })
  const made = await post({ paths: ['Notes/one.md', 'Notes/scripted.md'], title: 'Bundle' })
  assert.equal(made.status, 201, made.text)
  assert.equal(made.json?.path, 'Ebooks/Bundle.epub')
  const book = api.storage.objects.get('Ebooks/Bundle.epub')
  assert.ok(book && book.content.subarray(0, 2).toString() === 'PK', 'an EPUB archive was stored')
  assert.ok(!book.content.toString('latin1').includes('<script>alert'), 'script tags are not stored as markup (the archive is compressed, so this is a smoke check)')
  const svg = await post({ paths: ['Notes/diagram.svg'] })
  assert.equal(svg.status, 400)
  assert.match(String(svg.json?.message), /Only Markdown and text files/)
  assert.ok(!svg.text.includes('diagram.svg'), 'the requested path is not echoed back')
  assert.equal((await post({})).status, 400)
  assert.equal((await post({ paths: ['../../etc/passwd'] })).status, 400)
  assert.equal((await post({ paths: [42, null, {}] })).status, 400)
})

test('the health probe reveals nothing about the storage behind it', async () => {
  const health = await api.request('/api/health')
  assert.deepEqual(health.json, { ok: true, service: 'study-library-api', authRequired: true })
  assert.ok(!health.text.includes('study-library"'), 'no bucket name')
})

test('the whole API is rate limited per client and answers 429 with Retry-After', async () => {
  const flooded = await startApi()
  try {
    let limited = null as Awaited<ReturnType<Harness['request']>> | null
    for (let attempt = 0; attempt < 700 && !limited; attempt += 1) {
      const reply = await flooded.request('/api/auth/session', { address: '10.70.0.1' })
      if (reply.status === 429) limited = reply
    }
    assert.ok(limited, 'a flood is cut off')
    assert.ok(Number(limited.headers.get('retry-after')) >= 1)
    assert.deepEqual(Object.keys(limited.json ?? {}).sort(), PROBLEM_KEYS)
    assert.equal((await flooded.request('/api/health', { address: '10.70.0.1' })).status, 200, 'the health probe is never throttled')
    assert.equal((await flooded.request('/api/auth/session', { address: '10.70.0.2' })).status, 200, 'another client is unaffected')
  } finally {
    await flooded.stop()
  }
})
