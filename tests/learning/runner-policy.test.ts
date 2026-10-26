import test from 'node:test'
import assert from 'node:assert/strict'
import { loadChallengeRegistry } from '../../server/learning/challenges.js'
import { PracticeService, validateStructuredAnswer, RUN_TTL_MS } from '../../server/learning/runner.js'
import { validateRunRequest, PracticeError } from '../../server/learning/schemas.js'
import { codeSandboxAvailable } from '../../server/learning/sandbox.js'
const registry = await loadChallengeRegistry()
const entry = [...registry.values()].find((r) => r.challenge.language === 'json')!
const challenge = entry.challenge,
  answer = challenge.publicExamples[1].input
const body = { challengeId: challenge.challengeId, language: 'json', source: JSON.stringify(answer) }
test('structured tests validate happy, empty, malformed, and boundary inputs', () => {
  assert.ok(validateStructuredAnswer(entry, body.source).every((t) => t.status === 'passed'))
  assert.ok(validateStructuredAnswer(entry, '{}').every((t) => t.status === 'failed'))
  assert.ok(validateStructuredAnswer(entry, '{invalid').every((t) => t.status === 'failed'))
  const short = JSON.parse(body.source)
  short.justification = 'short'
  assert.equal(validateStructuredAnswer(entry, JSON.stringify(short)).find((t) => t.id === 'explanation')?.status, 'failed')
})
test('untrusted input cannot execute or access host files, environment, network', () => {
  const input = 'process.env.SECRET; require("node:fs").readFileSync("private.key"); fetch("https://attacker.invalid")'
  assert.ok(validateStructuredAnswer(entry, input).every((t) => t.status === 'failed'))
  for (const language of ['javascript', 'typescript', 'python', 'java'] as const)
    assert.equal(codeSandboxAvailable(language), false)
})
test('malformed, unknown, mismatched, oversized inputs return bounded failures', () => {
  assert.throws(
    () => validateRunRequest({ source: 'x' }),
    (e) => e instanceof PracticeError && e.status === 400,
  )
  assert.throws(
    () => validateRunRequest({ ...body, source: 'x'.repeat(50001) }),
    (e) => e instanceof PracticeError && e.status === 413,
  )
  assert.throws(
    () => validateRunRequest({ ...body, source: 'é'.repeat(25001) }),
    (e) => e instanceof PracticeError && e.status === 413,
  )
  const service = new PracticeService(registry)
  assert.throws(
    () => service.start('one', { ...body, challengeId: 'missing/challenge' }),
    (e) => e instanceof PracticeError && e.status === 404,
  )
  assert.throws(
    () => service.start('one', { ...body, language: 'java' }),
    (e) => e instanceof PracticeError && e.status === 400,
  )
  const code = [...registry.values()].find((r) => r.challenge.language !== 'json')!
  assert.throws(
    () =>
      service.start('one', {
        challengeId: code.challenge.challengeId,
        language: code.challenge.language,
        source: 'return true;',
      }),
    (e) => e instanceof PracticeError && e.status === 503,
  )
})
test('queued to complete is authoritative; submitted scores are ignored', () => {
  const tasks: (() => void)[] = []
  const service = new PracticeService(registry, (t) => tasks.push(t))
  const run = service.start('one', { ...body, score: 999, passed: true, tests: [] })
  assert.equal(service.get('one', run.runId).status, 'queued')
  tasks.shift()!()
  const result = service.get('one', run.runId)
  assert.equal(result.status, 'completed')
  assert.equal(result.summary.passed, result.summary.total)
  assert.throws(
    () => service.get('other', run.runId),
    (e) => e instanceof PracticeError && e.status === 404,
  )
})
test('cancellation is repeatable and prevents execution', () => {
  const tasks: (() => void)[] = []
  const service = new PracticeService(registry, (t) => tasks.push(t))
  const run = service.start('one', body)
  assert.equal(service.cancel('one', run.runId).status, 'cancelled')
  tasks.shift()!()
  assert.equal(service.cancel('one', run.runId).status, 'cancelled')
})
test('concurrency, queue bounds, rate limits, expiry, and cleanup', () => {
  let now = 0
  const tasks: (() => void)[] = []
  const service = new PracticeService(
    registry,
    (t) => tasks.push(t),
    () => now,
  )
  const first = service.start('one', body)
  assert.throws(
    () => service.start('one', body),
    (e) => e instanceof PracticeError && e.status === 429,
  )
  for (let i = 0; i < 9; i++) service.start('other-' + i, body)
  assert.throws(
    () => service.start('extra', body),
    (e) => e instanceof PracticeError && e.status === 429,
  )
  tasks.splice(0).forEach((t) => t())
  for (let i = 1; i < 20; i++) {
    service.start('one', body)
    tasks.shift()!()
  }
  assert.throws(
    () => service.start('one', body),
    (e) => e instanceof PracticeError && e.status === 429,
  )
  now = RUN_TTL_MS + 1
  assert.throws(
    () => service.get('one', first.runId),
    (e) => e instanceof PracticeError && e.status === 404,
  )
  assert.equal(service.start('one', body).status, 'queued')
})
test('outputs are bounded and never echo private request content', () => {
  const tasks: (() => void)[] = []
  const service = new PracticeService(registry, (t) => tasks.push(t))
  const secret = 'DO_NOT_ECHO_PRIVATE_INPUT'
  const run = service.start('one', { ...body, source: JSON.stringify({ ...answer, irrelevant: secret }) })
  tasks.shift()!()
  const result = service.get('one', run.runId)
  assert.ok(!JSON.stringify(result).includes(secret))
  assert.ok(result.outputBytes <= challenge.limits.outputBytes)
  assert.ok(!JSON.stringify(result).includes('E:\\'))
})
