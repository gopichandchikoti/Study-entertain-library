import { readFile } from 'node:fs/promises'
import { randomUUID, randomBytes } from 'node:crypto'
import assert from 'node:assert/strict'
const origin = 'http://localhost:4444'
function client() {
  const cookies = new Map()
  let csrf = ''
  return {
    async request(path, method = 'GET', body, extra = {}) {
      const response = await fetch(origin + path, {
        method,
        redirect: 'manual',
        headers: {
          Origin: origin,
          Cookie: Array.from(cookies)
            .map(([key, value]) => key + '=' + value)
            .join('; '),
          ...(csrf ? { 'x-csrf-token': csrf } : {}),
          ...(body !== undefined && !(body instanceof FormData) ? { 'content-type': 'application/json' } : {}),
          ...extra,
        },
        body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
      })
      for (const raw of response.headers.getSetCookie()) {
        const [key, value] = raw.split(';')[0].split('=')
        if (value) cookies.set(key, value)
        else cookies.delete(key)
      }
      const text = await response.text()
      let json = null
      try {
        json = JSON.parse(text)
      } catch {}
      if (json?.csrfToken) csrf = json.csrfToken
      return { status: response.status, body: json, headers: response.headers }
    },
  }
}
const user = client(),
  other = client(),
  password = randomBytes(32).toString('base64url'),
  username = 'fixture_' + randomUUID().replace(/-/g, '').slice(0, 12),
  otherName = username + '_b'
let created = false,
  otherCreated = false,
  uploadId = null
try {
  const root = await user.request('/')
  assert.equal(root.status, 200)
  assert.ok(root.headers.get('content-security-policy'))
  assert.equal((await user.request('/api/library')).status, 401)
  await user.request('/api/auth/session')
  const config = await user.request('/api/auth/config')
  assert.equal(config.body.mode, 'accounts')
  assert.equal(config.body.providers.length, 3)
  const signup = {
    email: username + '@example.test',
    username,
    firstName: 'Fixture',
    lastName: 'Account',
    password,
    confirmPassword: password,
  }
  const result = await user.request('/api/auth/signup', 'POST', signup)
  assert.equal(result.status, 201)
  created = true
  assert.equal((await user.request('/api/library')).status, 200)
  assert.equal((await user.request('/api/media')).status, 200)
  const profile = await user.request('/api/profile', 'PATCH', {
    firstName: 'Updated',
    lastName: 'Fixture',
    username,
    phoneNumber: null,
  })
  assert.equal(profile.status, 200)
  assert.equal(profile.body.firstName, 'Updated')
  assert.equal(profile.body.password_hash, undefined)
  assert.equal(
    (
      await user.request(
        '/api/profile',
        'PATCH',
        { firstName: 'Bad', lastName: 'Origin', username },
        { Origin: 'https://attacker.invalid' },
      )
    ).status,
    403,
  )
  assert.equal((await user.request('/api/file?path=..%2Fdata%2Fstudy-library.sqlite')).status, 404)
  assert.equal((await user.request('/api/file?path=.env')).status, 404)
  const settings = await user.request('/api/settings')
  assert.ok(settings.body.sessions.some((row) => row.current))
  const practice = await user.request('/api/practice/capabilities')
  assert.equal(practice.status, 200)
  const registry = JSON.parse(await readFile(new URL('../server/learning/course-registry.json', import.meta.url), 'utf8')),
    challenge = registry.find((row) => row.challenge.language === 'json').challenge
  const run = await user.request('/api/practice/runs', 'POST', {
    challengeId: challenge.challengeId,
    language: 'json',
    source: JSON.stringify(challenge.publicExamples.find((example) => example.expected.passed === true).input),
  })
  assert.equal(run.status, 202)
  const completed = await user.request('/api/practice/runs/' + run.body.runId)
  assert.equal(completed.status, 200)
  assert.equal(completed.body.summary.failed, 0)
  const multipart = new FormData()
  multipart.set('file', new Blob(['Temporary account authorization fixture.'], { type: 'text/plain' }), 'auth-fixture.txt')
  const uploaded = await user.request('/api/uploads', 'POST', multipart)
  assert.equal(uploaded.status, 201)
  uploadId = uploaded.body.upload.id
  await other.request('/api/auth/session')
  assert.equal(
    (await other.request('/api/auth/signup', 'POST', { ...signup, username: otherName, email: otherName + '@example.test' }))
      .status,
    201,
  )
  otherCreated = true
  assert.equal((await other.request('/api/practice/runs/' + run.body.runId)).status, 404)
  assert.equal(
    (await other.request('/api/uploads/' + uploadId + '/commit', 'POST', { category: 'Unsorted', fileName: 'auth-fixture.txt' }))
      .status,
    404,
  )
  assert.equal((await other.request('/api/uploads/' + uploadId, 'DELETE')).status, 404)
  assert.equal((await user.request('/api/uploads/' + uploadId, 'DELETE')).status, 204)
  uploadId = null
  await user.request('/api/auth/logout', 'POST', {})
  assert.equal((await user.request('/api/profile')).status, 401)
  assert.equal((await user.request('/api/auth/login', 'POST', { identifier: username, password })).status, 200)
  assert.equal((await user.request('/api/profile')).body.firstName, 'Updated')
  console.log(
    'PASS: live signup/login/profile/session, protected Study/Watch, structured practice ownership, CSRF/private paths, and staged-upload ownership.',
  )
  console.log('Provider availability: ' + config.body.providers.map((row) => row.provider + '=' + row.enabled).join(', '))
} finally {
  if (uploadId) await user.request('/api/uploads/' + uploadId, 'DELETE').catch(() => {})
  if (otherCreated) {
    const response = await other.request('/api/account', 'DELETE', { currentPassword: password, confirmation: otherName })
    assert.equal(response.status, 200)
  }
  if (created) {
    const response = await user.request('/api/account', 'DELETE', { currentPassword: password, confirmation: username })
    assert.equal(response.status, 200)
  }
  console.log('Temporary account fixtures removed.')
}
