import assert from 'node:assert/strict'
import test from 'node:test'
import { loadServerConfig } from '../../server/config/index.js'
import { matchesDeclaredType } from '../../server/helpers/signatures.js'
import { safeStoragePath } from '../../server/helpers/paths.js'

test('storage keys cannot climb out of the bucket, including a bare ".." that normalize() leaves behind', () => {
  for (const hostile of ['..', '../x.png', 'a/../..', 'a/b/../../..', '/abs.png', '\\..\\x.png', 'a\0b.png', '', '.', './']) {
    assert.equal(safeStoragePath(hostile), null, JSON.stringify(hostile))
  }
  assert.equal(safeStoragePath('Notes/one.md'), 'Notes/one.md')
  assert.equal(safeStoragePath('Notes/./two/../one.md'), 'Notes/one.md')
  assert.equal(
    safeStoragePath('.study-library-inbox/abc.json'),
    '.study-library-inbox/abc.json',
    'the private inbox stays reachable',
  )
})

const bytes = (...values: number[]): Buffer => Buffer.from(values)
const text = (value: string): Buffer => Buffer.from(value, 'utf8')

test('a file must start the way its extension says', () => {
  assert.ok(matchesDeclaredType('.pdf', text('%PDF-1.7\n')))
  assert.ok(!matchesDeclaredType('.pdf', text('<html><script>alert(1)</script>')))
  assert.ok(matchesDeclaredType('.png', bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0)))
  assert.ok(!matchesDeclaredType('.png', text('<svg onload=alert(1)>')))
  assert.ok(matchesDeclaredType('.jpg', bytes(0xff, 0xd8, 0xff, 0xe0)))
  assert.ok(matchesDeclaredType('.gif', text('GIF89a')))
  assert.ok(matchesDeclaredType('.webp', Buffer.concat([text('RIFF'), bytes(1, 2, 3, 4), text('WEBP')])))
  assert.ok(!matchesDeclaredType('.webp', Buffer.concat([text('RIFF'), bytes(1, 2, 3, 4), text('WAVE')])))
  assert.ok(matchesDeclaredType('.avif', Buffer.concat([bytes(0, 0, 0, 0x1c), text('ftypavif')])))
  for (const extension of ['.docx', '.xlsx', '.pptx', '.epub', '.odt']) {
    assert.ok(matchesDeclaredType(extension, bytes(0x50, 0x4b, 0x03, 0x04, 0x14)), extension)
    assert.ok(!matchesDeclaredType(extension, text('MZ\u0090\u0000')), extension)
  }
  assert.ok(matchesDeclaredType('.mobi', bytes(1, 2, 3)), 'Kindle formats have no fixed header, so only the extension is checked')
})

test('text types refuse binary content but allow UTF-16 with a byte order mark', () => {
  assert.ok(matchesDeclaredType('.md', text('# Title\n\nBody')))
  assert.ok(matchesDeclaredType('.svg', text('<svg xmlns="http://www.w3.org/2000/svg"/>')))
  assert.ok(!matchesDeclaredType('.txt', bytes(0x4d, 0x5a, 0x90, 0x00, 0x03)))
  assert.ok(!matchesDeclaredType('.svg', bytes(0x89, 0x50, 0x4e, 0x47, 0x00)))
  assert.ok(matchesDeclaredType('.txt', bytes(0xff, 0xfe, 0x41, 0x00, 0x42, 0x00)))
})

const OWNER_PRODUCTION = {
  NODE_ENV: 'production',
  AUTH_MODE: 'owner',
  AUTH_PUBLIC_ORIGIN: 'https://library.example.com',
  AUTH_SESSION_SECRET: 'a'.repeat(48),
  LIBRARY_ACCESS_PASSWORD: 'a long shared passphrase',
}

test('production owner mode needs its own strong signing secret, never the password', () => {
  assert.throws(() => loadServerConfig(OWNER_PRODUCTION), /SESSION_SECRET of at least 32 bytes/)
  assert.throws(() => loadServerConfig({ ...OWNER_PRODUCTION, SESSION_SECRET: 'short' }), /SESSION_SECRET of at least 32 bytes/)
  const password = 'p'.repeat(40)
  assert.throws(
    () => loadServerConfig({ ...OWNER_PRODUCTION, LIBRARY_ACCESS_PASSWORD: password, SESSION_SECRET: password }),
    /not the access password/,
  )
  const config = loadServerConfig({ ...OWNER_PRODUCTION, SESSION_SECRET: 's'.repeat(40) })
  assert.equal(config.access.sessionSecret, 's'.repeat(40))
})

test('WEB_ORIGIN must be a plain origin, and the encoder setting is read once', () => {
  const base = { NODE_ENV: 'test', AUTH_MODE: 'accounts', AUTH_PUBLIC_ORIGIN: 'http://localhost:4444' }
  assert.equal(loadServerConfig(base).webOrigin, null)
  assert.equal(loadServerConfig({ ...base, WEB_ORIGIN: 'https://library.example.com/' }).webOrigin, 'https://library.example.com')
  assert.throws(() => loadServerConfig({ ...base, WEB_ORIGIN: 'https://library.example.com/app' }), /WEB_ORIGIN/)
  assert.throws(() => loadServerConfig({ ...base, WEB_ORIGIN: 'not a url' }))
  assert.equal(loadServerConfig(base).watch.encoder, 'x264')
  assert.equal(loadServerConfig({ ...base, WATCH_ENCODER: 'amf' }).watch.encoder, 'amf')
  assert.equal(loadServerConfig({ ...base, WATCH_ENCODER: 'anything-else' }).watch.encoder, 'x264')
})
