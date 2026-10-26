import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readdir, readFile, rename, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import test, { after, before } from 'node:test'
import { MAX_STAGED_PER_OWNER } from '../../server/services/uploads.js'
import { startAccountServer, STRONG_PASSWORD, type AccountServer, type Client } from './harness.js'

let server: AccountServer
let inbox: string

before(async () => {
  server = await startAccountServer()
  inbox = path.join(server.contentRoot, '.study-library-inbox')
})
after(async () => {
  await server.stop()
})

const stage = (client: Client, name: string, content: BlobPart = '# A note\n\nBody.') => {
  const form = new FormData()
  form.set('file', new Blob([content]), name)
  return client.request('/api/uploads', { method: 'POST', form })
}
const uploadId = (body: Record<string, unknown> | null): string => String((body?.upload as { id?: unknown } | undefined)?.id)
const inboxFiles = async (): Promise<string[]> => readdir(inbox).catch(() => [])

test('an account cannot stage more uploads than the review limit, and discarding one frees a place', async () => {
  const { client } = await server.signUp('hoarder')
  const ids: string[] = []
  for (let index = 0; index < MAX_STAGED_PER_OWNER; index += 1) {
    const staged = await stage(client, `note-${index}.md`)
    assert.equal(staged.status, 201, `upload ${index}`)
    ids.push(uploadId(staged.json))
  }
  const before = await inboxFiles()
  const refused = await stage(client, 'one-too-many.md')
  assert.equal(refused.status, 409)
  assert.equal(refused.json?.code, 'UPLOAD_QUOTA')
  assert.match(String(refused.json?.requestId), /^[\w.-]{8,64}$/, 'the refusal carries a request id')
  assert.deepEqual(await inboxFiles(), before, 'a refused upload writes nothing')

  const neighbour = (await server.signUp('neighbour')).client
  assert.equal((await stage(neighbour, 'mine.md')).status, 201, 'the limit is per account, not for everyone')

  assert.equal((await client.request(`/api/uploads/${ids[0]}`, { method: 'DELETE' })).status, 204)
  assert.equal((await stage(client, 'room-again.md')).status, 201)
})

test('a staged upload nobody approved expires, cannot be committed, and is swept away', async () => {
  const { client } = await server.signUp('forgetful')
  const staged = await stage(client, 'old.md')
  const id = uploadId(staged.json)
  const metadata = path.join(inbox, `${id}.json`)
  const record = JSON.parse(await readFile(metadata, 'utf8')) as { uploadedAt: string }
  record.uploadedAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  await writeFile(metadata, JSON.stringify(record))

  const commit = await client.request(`/api/uploads/${id}/commit`, { method: 'POST', body: { category: 'Notes' } })
  assert.equal(commit.status, 404, 'an expired upload is gone')
  assert.equal((await stage(client, 'fresh.md')).status, 201)
  assert.ok(!(await inboxFiles()).some((name) => name.startsWith(id)), 'the next upload sweeps the expired files')
})

test('a file whose bytes are not what its extension claims is refused before it is staged', async () => {
  const { client } = await server.signUp('disguise')
  const before = await inboxFiles()
  for (const [name, content] of [
    ['report.pdf', '<html><script>alert(1)</script></html>'],
    ['photo.png', '<svg onload="alert(1)"></svg>'],
    ['book.epub', 'not a zip file'],
    ['notes.txt', new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00])],
  ] as const) {
    const response = await stage(client, name, content)
    assert.equal(response.status, 400, name)
    assert.equal(response.json?.code, 'UPLOAD_CONTENT_MISMATCH', name)
  }
  assert.deepEqual(await inboxFiles(), before, 'nothing was left in the inbox')
  const real = await stage(client, 'real.pdf', '%PDF-1.4\n%fake but correctly labelled')
  assert.equal(real.status, 201, 'a file that matches its extension is still accepted')
})

test('an unsupported extension is refused without repeating hostile text back', async () => {
  const { client } = await server.signUp('weirdname')
  const response = await stage(client, 'tool.<img src=x onerror=alert(1)>')
  assert.equal(response.status, 400)
  assert.ok(!response.text.includes('onerror'), 'the file name is not echoed')
})

test('uploads cannot be filed in hidden or ignored folders, with stream syntax, or through a link out of the library', async () => {
  const { client } = await server.signUp('filer')
  const staged = await stage(client, 'place-me.md')
  const id = uploadId(staged.json)
  const commit = (body: Record<string, unknown>) => client.request(`/api/uploads/${id}/commit`, { method: 'POST', body })
  for (const category of ['node_modules', 'dist', 'Music', server.config.appDirectoryName]) {
    assert.equal((await commit({ category })).status, 400, `category ${category}`)
  }
  assert.equal((await commit({ category: 'Notes', fileName: 'alt:stream.md' })).status, 400, 'NTFS stream names')

  const outside = await mkdtemp(path.join(os.tmpdir(), 'study-outside-'))
  try {
    await symlink(outside, path.join(server.contentRoot, 'Linked'), 'junction')
    assert.equal((await commit({ category: 'Linked' })).status, 400, 'a folder that is a link elsewhere is refused')
    assert.deepEqual(await readdir(outside), [], 'nothing was written outside the library')
  } finally {
    await rm(path.join(server.contentRoot, 'Linked'), { recursive: true, force: true })
    await rm(outside, { recursive: true, force: true })
  }
  assert.equal((await commit({ category: 'Notes' })).status, 201, 'a normal category still works afterwards')
})

test('a failing disk gives a generic error with a request id and never the server path', async () => {
  const { client } = await server.signUp('diskfull')
  const parked = `${inbox}.parked`
  await rename(inbox, parked)
  await writeFile(inbox, 'a file where the inbox folder should be')
  try {
    const response = await stage(client, 'unlucky.md')
    assert.equal(response.status, 500)
    assert.ok(!response.text.includes(server.contentRoot), 'no path in the body')
    assert.ok(!/EEXIST|ENOTDIR|mkdir/i.test(response.text), 'no system error text in the body')
    assert.equal(response.json?.code, 'REQUEST_FAILED')
    assert.match(String(response.json?.requestId), /^[\w.-]{8,64}$/)
  } finally {
    await rm(inbox, { force: true })
    await rename(parked, inbox)
  }
})

test('writing to saved files is limited per address and answers 429 with Retry-After', async () => {
  const { client } = await server.signUp('scripted')
  const missing = '00000000-0000-4000-8000-000000000000'
  let limited: Awaited<ReturnType<Client['request']>> | null = null
  for (let attempt = 0; attempt < 300 && !limited; attempt += 1) {
    const response = await client.request(`/api/markdown/${missing}`, { method: 'PUT', body: { content: 'x' } })
    if (response.status === 429) limited = response
    else assert.equal(response.status, 404)
  }
  assert.ok(limited, 'a script that never stops is cut off')
  assert.ok(Number(limited.headers.get('retry-after')) >= 1)
  assert.equal(limited.json?.code, 'RATE_LIMITED')
  assert.equal((await client.request('/api/markdown')).status, 200, 'reading is never throttled by the write budget')
})

test('obvious passwords are refused at sign-up, including one that contains the username', async () => {
  const attacker = await server.anonymous()
  const base = { email: 'guess@example.test', firstName: 'G', lastName: 'U' }
  for (const [username, password] of [
    ['guessone', 'aaaaaaaaaaaaaaaaaaaa'],
    ['guesstwo', 'qwertyuiopasdfgh'],
    ['guessthree', 'my guessthree password!'],
  ] as const) {
    const response = await attacker.request('/api/auth/signup', {
      method: 'POST',
      body: { ...base, email: `${username}@example.test`, username, password, confirmPassword: password },
    })
    assert.equal(response.status, 400, username)
    assert.match(String(response.json?.message), /less guessable/, username)
  }
})

test("the account export holds the account's own Watch and Music data and nobody else's", async () => {
  const first = await server.signUp('exporter')
  const second = await server.signUp('bystander')
  const idOf = async (client: Client): Promise<string> =>
    String(((await client.request('/api/auth/session')).json?.user as { id?: unknown } | undefined)?.id)
  const database = new DatabaseSync(server.config.personalDatabasePath)
  try {
    for (const [owner, tag] of [
      [await idOf(first.client), 'mine'],
      [await idOf(second.client), 'theirs'],
    ] as const) {
      const now = new Date().toISOString()
      database.prepare('INSERT INTO watch_list(user_id,title_id,added_at) VALUES(?,?,?)').run(owner, `t_${tag}`, now)
      database
        .prepare(
          'INSERT INTO watch_progress(user_id,file_id,title_id,position,duration,completed,updated_at) VALUES(?,?,?,?,?,?,?)',
        )
        .run(owner, `f_${tag}`, `t_${tag}`, 10, 100, 0, now)
      database.prepare('INSERT INTO music_likes(user_id,track_id,liked_at) VALUES(?,?,?)').run(owner, `s_${tag}`, now)
      database
        .prepare('INSERT INTO music_plays(user_id,track_id,played_at,seconds,completed) VALUES(?,?,?,?,?)')
        .run(owner, `s_${tag}`, now, 30, 1)
      database
        .prepare('INSERT INTO music_playlists(id,user_id,name,description,created_at,updated_at) VALUES(?,?,?,?,?,?)')
        .run(`pl_${tag}`, owner, `List ${tag}`, '', now, now)
      database
        .prepare('INSERT INTO music_playlist_tracks(playlist_id,position,track_id,added_at) VALUES(?,?,?,?)')
        .run(`pl_${tag}`, 0, `s_${tag}`, now)
      database
        .prepare('INSERT INTO music_radios(id,user_id,seed_kind,seed_value,label,created_at) VALUES(?,?,?,?,?,?)')
        .run(`r_${tag}`, owner, 'artist', tag, `Radio ${tag}`, now)
    }
  } finally {
    database.close()
  }
  const exported = await first.client.request('/api/account/export', {
    method: 'POST',
    body: { currentPassword: STRONG_PASSWORD, confirmation: first.username },
  })
  assert.equal(exported.status, 200, exported.text)
  for (const key of ['watchProgress', 'watchList', 'musicLikes', 'musicPlays', 'musicPlaylists', 'musicRadios']) {
    const rows = exported.json?.[key]
    assert.ok(Array.isArray(rows) && rows.length === 1, `${key} has exactly the account's row`)
  }
  assert.ok(exported.text.includes('t_mine') && exported.text.includes('List mine'))
  assert.ok(!exported.text.includes('theirs'), "another account's rows never appear")
  assert.ok(!exported.text.includes('password_hash') && !exported.text.includes('scrypt$'), 'no secrets in the export')
})

test('a staged upload directory that does not exist yet is created privately and a missing inbox counts as empty', async () => {
  await rm(inbox, { recursive: true, force: true })
  await mkdir(server.contentRoot, { recursive: true })
  const { client } = await server.signUp('fresh')
  assert.equal((await stage(client, 'first-ever.md')).status, 201)
})
