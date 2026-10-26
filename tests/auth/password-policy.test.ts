import assert from 'node:assert/strict'
import test from 'node:test'
import * as v from '../../server/auth/validation.js'
import { AuthError } from '../../server/auth/types.js'

const refused = (value: unknown, avoid: readonly string[] = []): boolean => {
  try {
    v.password(value, avoid)
    return false
  } catch (error) {
    return error instanceof AuthError && error.status === 400
  }
}

test('length is still 15 to 128 characters', () => {
  assert.ok(refused('short one 1'))
  assert.ok(refused('x'.repeat(129)))
  assert.ok(refused(42))
  assert.equal(v.password('a perfectly fine passphrase 2026'), 'a perfectly fine passphrase 2026')
})

test('repeated characters, counting runs and keyboard runs are refused', () => {
  assert.ok(refused('a'.repeat(20)))
  assert.ok(refused('abababababababab'))
  assert.ok(refused('1234567890123456'))
  assert.ok(refused('abcdefghijklmnop'))
  assert.ok(refused('qwertyuiopasdfgh'))
  assert.ok(refused('zyxwvutsrqponmlk'))
})

test('well-known long passwords are refused whatever their spacing or case', () => {
  assert.ok(refused('Password Password'))
  assert.ok(refused('PASSWORD-password'))
  assert.ok(refused('correct horse battery staple'))
  assert.ok(refused('I Love You I Love You'))
})

test("a password may not contain the person's own username or email name", () => {
  assert.ok(refused('maple-river-2026-clouds', ['river']))
  assert.ok(refused('My Name Is Gopichand!!', ['gopichand', 'g']))
  assert.equal(v.password('maple-river-2026-clouds', ['ab']), 'maple-river-2026-clouds', 'very short names are not matched')
  assert.equal(v.password('maple-river-2026-clouds', ['someoneelse']), 'maple-river-2026-clouds')
})
