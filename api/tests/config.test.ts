import assert from 'node:assert/strict'
import test from 'node:test'
import { loadConfig } from '../src/config.js'
import { LoginThrottle } from '../src/rate-limit.js'
import { safeStoragePath } from '../src/storage.js'
import { matchesDeclaredType } from '../src/signatures.js'
import { baseEnvironment, PASSWORD, SECRET, WEB_ORIGIN } from './support.js'

const production = (overrides: Record<string, string | undefined> = {}): NodeJS.ProcessEnv => ({
  ...baseEnvironment(),
  NODE_ENV: 'production',
  ...overrides,
})

test('production refuses to start without the secrets that protect the library', () => {
  assert.throws(() => loadConfig(production({ LIBRARY_ACCESS_PASSWORD: undefined })), /LIBRARY_ACCESS_PASSWORD is required/)
  assert.throws(() => loadConfig(production({ LIBRARY_ACCESS_PASSWORD: 'short' })), /at least 12 characters/)
  assert.throws(() => loadConfig(production({ SESSION_SECRET: undefined })), /SESSION_SECRET must be at least 32 bytes/)
  assert.throws(() => loadConfig(production({ SESSION_SECRET: 'too short' })), /SESSION_SECRET must be at least 32 bytes/)
  assert.throws(() => loadConfig(production({ SESSION_SECRET: PASSWORD.padEnd(40, 'x'), LIBRARY_ACCESS_PASSWORD: PASSWORD.padEnd(40, 'x') })), /different from the access password/)
  assert.throws(() => loadConfig(production({ WEB_ORIGIN: undefined })), /WEB_ORIGIN is required/)
  assert.throws(() => loadConfig(production({ SUPABASE_SERVICE_ROLE_KEY: undefined })), /SUPABASE_SERVICE_ROLE_KEY is required/)
  const config = loadConfig(production())
  assert.equal(config.cookie.name, '__Host-study_library_session')
  assert.equal(config.cookie.sameSite, 'none')
  assert.equal(config.trustProxyHops, 1)
})

test('development may run open, but a configured password still needs a real secret or a restart-scoped one', () => {
  const open = loadConfig(baseEnvironment({ LIBRARY_ACCESS_PASSWORD: '', SESSION_SECRET: '' }))
  assert.equal(open.accessPassword, undefined)
  assert.ok(open.sessionSecret.length >= 48, 'a random secret is generated when none is given')
  assert.equal(open.cookie.sameSite, 'lax')
  assert.equal(open.cookie.name, 'study_library_session')
  assert.equal(loadConfig(baseEnvironment()).sessionSecret, SECRET)
})

test('origins, ports and numbers are validated and never guessed', () => {
  for (const bad of ['http://library.example.com', 'https://library.example.com/app', 'library.example.com', 'https://user:pw@library.example.com']) {
    assert.throws(() => loadConfig(production({ WEB_ORIGIN: bad })), /WEB_ORIGIN/, bad)
  }
  assert.throws(() => loadConfig(production({ SUPABASE_URL: 'http://example.supabase.co' })), /SUPABASE_URL/)
  assert.equal(loadConfig(baseEnvironment({ WEB_ORIGIN: 'http://localhost:4444' })).webOrigin, 'http://localhost:4444')
  assert.throws(() => loadConfig(baseEnvironment({ PORT: '99999' })), /PORT/)
  assert.throws(() => loadConfig(baseEnvironment({ PORT: 'abc' })), /PORT/)
  assert.throws(() => loadConfig(baseEnvironment({ TRUST_PROXY_HOPS: '50' })), /TRUST_PROXY_HOPS/)
  assert.throws(() => loadConfig(baseEnvironment({ MAX_UPLOAD_BYTES: '-1' })), /MAX_UPLOAD_BYTES/)
  assert.throws(() => loadConfig(baseEnvironment({ API_COOKIE_SAMESITE: 'whenever' })), /API_COOKIE_SAMESITE/)
  assert.throws(() => loadConfig(baseEnvironment({ CATALOG_SYNC_TOKEN: 'short' })), /CATALOG_SYNC_TOKEN/)
  assert.equal(loadConfig(production({ WEB_ORIGIN })).webOrigin, WEB_ORIGIN)
  assert.equal(loadConfig(production({ API_COOKIE_SAMESITE: 'Lax' })).cookie.sameSite, 'lax')
})

test('the sign-in throttle counts attempts, resets on success and its memory stays bounded', () => {
  let now = 1_000
  const throttle = new LoginThrottle(3, 60_000, 4, () => now)
  assert.ok(throttle.allow('a') && throttle.allow('a') && throttle.allow('a'))
  assert.equal(throttle.allow('a'), false)
  assert.ok(throttle.retryAfterSeconds('a') >= 1)
  throttle.reset('a')
  assert.ok(throttle.allow('a'))
  for (let index = 0; index < 100; index += 1) throttle.allow(`attacker-${index}`)
  assert.ok(throttle.size <= 4, `size ${throttle.size} stays at the capacity`)
  now += 61_000
  assert.ok(throttle.allow('attacker-99'), 'a new window starts once the old one ends')
})

test('storage keys cannot climb out of the bucket, including a bare ".."', () => {
  for (const hostile of ['..', '../x.png', 'a/../..', '/abs.png', '\\..\\x.png', 'a\0b.png', '', '.', './']) {
    assert.equal(safeStoragePath(hostile), null, JSON.stringify(hostile))
  }
  assert.equal(safeStoragePath('Notes/one.md'), 'Notes/one.md')
})

test('a file must start the way its extension says', () => {
  assert.ok(matchesDeclaredType('.pdf', Buffer.from('%PDF-1.7')))
  assert.ok(!matchesDeclaredType('.pdf', Buffer.from('<html>')))
  assert.ok(matchesDeclaredType('.md', Buffer.from('# Title')))
  assert.ok(!matchesDeclaredType('.txt', Buffer.from([0x4d, 0x5a, 0x90, 0x00])))
  assert.ok(!matchesDeclaredType('.png', Buffer.from('<svg onload=alert(1)>')))
})
