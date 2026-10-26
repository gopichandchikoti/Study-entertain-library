import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import { createAuthSystem } from '../../server/auth/routes.js'
import { loadAuthConfig } from '../../server/auth/config.js'
import {
  createMarkdownRouter,
  MAX_CONTENT_LENGTH,
  MAX_DOCUMENTS_PER_USER,
  MAX_NAME_LENGTH,
} from '../../server/markdown/routes.js'

const origin = 'http://localhost:4444'
const passphrase = 'A unique long test passphrase!'

async function fixture() {
  const system = createAuthSystem(loadAuthConfig({ AUTH_PUBLIC_ORIGIN: origin }), ':memory:')
  const app = express()
  app.use(express.json({ limit: '1mb' }))
  app.use('/api/auth', system.publicRouter)
  app.use('/api', system.guard)
  app.use('/api', system.protectedRouter)
  app.use('/api/markdown', createMarkdownRouter(system.repository))
  const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance))
  })
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('The test server did not start.')
  const base = `http://127.0.0.1:${address.port}`

  const client = () => {
    const jar = new Map<string, string>()
    let csrf = ''
    const request = async (path: string, method = 'GET', body?: unknown, headers: Record<string, string> = {}) => {
      const response = await fetch(base + '/api' + path, {
        method,
        headers: {
          origin,
          cookie: Array.from(jar)
            .map(([key, value]) => `${key}=${value}`)
            .join('; '),
          ...(csrf ? { 'x-csrf-token': csrf } : {}),
          ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      })
      for (const raw of response.headers.getSetCookie()) {
        const [key, value] = raw.split(';')[0].split('=')
        if (value) jar.set(key, value)
        else jar.delete(key)
      }
      const text = await response.text()
      let json: any = null
      try {
        json = JSON.parse(text)
      } catch {
        /* not JSON */
      }
      if (json?.csrfToken) csrf = json.csrfToken
      return { status: response.status, body: json }
    }
    return { request }
  }

  const signedIn = async (name: string) => {
    const session = client()
    await session.request('/auth/session')
    const created = await session.request('/auth/signup', 'POST', {
      email: `${name}@example.test`,
      username: name,
      firstName: 'Test',
      lastName: name,
      password: passphrase,
      confirmPassword: passphrase,
    })
    assert.equal(created.status, 201)
    return { ...session, id: created.body.user.id as string }
  }

  return {
    system,
    signedIn,
    client,
    async close() {
      system.close()
      await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
    },
  }
}

test('saved Markdown files require an account', async () => {
  const f = await fixture()
  try {
    const guest = f.client()
    assert.equal((await guest.request('/markdown')).status, 401)
    assert.equal((await guest.request('/markdown', 'POST', { content: '# hi' })).status, 401)
  } finally {
    await f.close()
  }
})

test('new files default to Untitled N, reusing the smallest free number', async () => {
  const f = await fixture()
  try {
    const user = await f.signedIn('asha')
    const first = await user.request('/markdown', 'POST', { content: '# one' })
    const second = await user.request('/markdown', 'POST', { name: '   ', content: '# two' })
    assert.equal(first.status, 201)
    assert.equal(first.body.document.name, 'Untitled 1')
    assert.equal(second.body.document.name, 'Untitled 2')
    assert.equal((await user.request(`/markdown/${first.body.document.id}`, 'DELETE')).status, 200)
    const third = await user.request('/markdown', 'POST', {})
    assert.equal(third.body.document.name, 'Untitled 1')
    assert.equal(third.body.document.content, '')
    const list = await user.request('/markdown')
    assert.deepEqual(list.body.documents.map((item: { name: string }) => item.name).sort(), ['Untitled 1', 'Untitled 2'])
    assert.equal(list.body.documents[0].content, undefined, 'the list does not carry file bodies')
  } finally {
    await f.close()
  }
})

test('files can be read back, renamed, edited and deleted; names are unique per user', async () => {
  const f = await fixture()
  try {
    const user = await f.signedIn('asha')
    const created = await user.request('/markdown', 'POST', { name: 'Trip notes', content: '# Lisbon\n\n- trams' })
    const id = created.body.document.id as string
    assert.equal((await user.request(`/markdown/${id}`)).body.document.content, '# Lisbon\n\n- trams')

    const renamed = await user.request(`/markdown/${id}`, 'PUT', { name: '  Lisbon trip  ' })
    assert.equal(renamed.body.document.name, 'Lisbon trip')
    assert.equal(renamed.body.document.content, '# Lisbon\n\n- trams', 'a rename alone keeps the content')

    const edited = await user.request(`/markdown/${id}`, 'PUT', { content: '# Porto' })
    assert.equal(edited.body.document.name, 'Lisbon trip')
    assert.equal(edited.body.document.content, '# Porto')

    const other = await user.request('/markdown', 'POST', { name: 'Shopping' })
    assert.equal((await user.request('/markdown', 'POST', { name: 'lisbon TRIP' })).status, 409)
    assert.equal((await user.request(`/markdown/${other.body.document.id}`, 'PUT', { name: 'LISBON trip' })).status, 409)
    assert.equal(
      (await user.request(`/markdown/${id}`, 'PUT', { name: 'Lisbon trip', content: '# Same name is fine for itself' })).status,
      200,
    )

    assert.equal((await user.request(`/markdown/${id}`, 'DELETE')).status, 200)
    assert.equal((await user.request(`/markdown/${id}`)).status, 404)
  } finally {
    await f.close()
  }
})

test("one account cannot see, change or delete another account's files", async () => {
  const f = await fixture()
  try {
    const asha = await f.signedIn('asha')
    const ravi = await f.signedIn('ravi')
    const secret = await asha.request('/markdown', 'POST', { name: 'Private', content: 'only asha' })
    const id = secret.body.document.id as string
    assert.equal((await ravi.request(`/markdown/${id}`)).status, 404)
    assert.equal((await ravi.request(`/markdown/${id}`, 'PUT', { content: 'overwritten' })).status, 404)
    assert.equal((await ravi.request(`/markdown/${id}`, 'DELETE')).status, 404)
    assert.deepEqual((await ravi.request('/markdown')).body.documents, [])
    // The same name is free for a different account.
    assert.equal((await ravi.request('/markdown', 'POST', { name: 'Private' })).status, 201)
    assert.equal((await asha.request(`/markdown/${id}`)).body.document.content, 'only asha')
  } finally {
    await f.close()
  }
})

test('invalid names, oversized content, bad ids, wrong content type and missing CSRF are rejected', async () => {
  const f = await fixture()
  try {
    const user = await f.signedIn('asha')
    assert.equal((await user.request('/markdown', 'POST', { name: 'x'.repeat(MAX_NAME_LENGTH + 1) })).status, 400)
    assert.equal((await user.request('/markdown', 'POST', { name: 'bad\u0000name' })).status, 400)
    assert.equal((await user.request('/markdown', 'POST', { name: 42 })).status, 400)
    assert.equal((await user.request('/markdown', 'POST', { content: 42 })).status, 400)
    assert.equal((await user.request('/markdown', 'POST', { content: 'a'.repeat(MAX_CONTENT_LENGTH + 1) })).status, 413)
    assert.equal((await user.request('/markdown', 'POST', { content: 'a'.repeat(MAX_CONTENT_LENGTH) })).status, 201)
    assert.equal((await user.request('/markdown/not-a-uuid')).status, 404)
    assert.equal((await user.request('/markdown/00000000-0000-4000-8000-000000000000')).status, 404)
    assert.equal((await user.request('/markdown', 'POST', undefined, { 'content-type': 'text/plain' })).status, 415)
    assert.equal((await user.request('/markdown', 'POST', { content: 'x' }, { 'x-csrf-token': '' })).status, 403)
    assert.equal((await user.request('/markdown', 'POST', { content: 'x' }, { origin: 'https://attacker.invalid' })).status, 403)
    const created = await user.request('/markdown', 'POST', { name: 'Keep' })
    assert.equal((await user.request(`/markdown/${created.body.document.id}`, 'PUT', {})).status, 400)
  } finally {
    await f.close()
  }
})

test('an account can store a limited number of files, and deleting the account removes them', async () => {
  const f = await fixture()
  try {
    const user = await f.signedIn('asha')
    for (let index = 0; index < MAX_DOCUMENTS_PER_USER; index += 1) {
      f.system.repository.run(
        'INSERT INTO markdown_documents(id,user_id,name,content,created_at,updated_at) VALUES(?,?,?,?,?,?)',
        `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
        user.id,
        `Seed ${index}`,
        '',
        'x',
        'x',
      )
    }
    assert.equal((await user.request('/markdown', 'POST', { name: 'One too many' })).status, 409)
    assert.equal(
      f.system.repository.one<{ total: number }>('SELECT COUNT(*) AS total FROM markdown_documents')?.total,
      MAX_DOCUMENTS_PER_USER,
    )
    f.system.repository.run('DELETE FROM users WHERE id=?', user.id)
    assert.equal(f.system.repository.one<{ total: number }>('SELECT COUNT(*) AS total FROM markdown_documents')?.total, 0)
  } finally {
    await f.close()
  }
})

test("the account data export includes saved Markdown files, and only the owner's", async () => {
  const f = await fixture()
  try {
    const asha = await f.signedIn('asha')
    const ravi = await f.signedIn('ravi')
    await asha.request('/markdown', 'POST', { name: 'Trip', content: '# Lisbon' })
    await ravi.request('/markdown', 'POST', { name: 'Secret', content: 'ravi only' })
    const exported = await asha.request('/account/export', 'POST', { currentPassword: passphrase, confirmation: 'asha' })
    assert.equal(exported.status, 200)
    assert.deepEqual(
      exported.body.markdownDocuments.map((item: { name: string; content: string }) => [item.name, item.content]),
      [['Trip', '# Lisbon']],
    )
  } finally {
    await f.close()
  }
})
