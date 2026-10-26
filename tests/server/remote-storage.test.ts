import assert from 'node:assert/strict'
import http from 'node:http'
import type { AddressInfo } from 'node:net'
import test from 'node:test'
import express from 'express'
import { RemoteStorage } from '../../server/services/remote-storage.js'

const realFetch = globalThis.fetch

/** A route that streams one stored object through `RemoteStorage.send`, with Supabase replaced by a canned reply. */
const serveStored = async (stored: Response, mimeType: string) => {
  globalThis.fetch = (async () => stored) as typeof fetch
  const remote = new RemoteStorage({ url: 'https://example.supabase.co', serviceRoleKey: 'test-key', bucket: 'study-library' })
  const app = express()
  app.get('/file', async (request, response) => {
    response.setHeader('Cache-Control', 'private, no-cache')
    if (!(await remote.send(request, response, 'Notes/trojan.txt', mimeType))) response.status(404).end()
  })
  const server = await new Promise<http.Server>((resolve) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening))
  })
  try {
    const reply = await realFetch(`http://127.0.0.1:${(server.address() as AddressInfo).port}/file`)
    return { status: reply.status, headers: reply.headers, text: await reply.text() }
  } finally {
    globalThis.fetch = realFetch
    server.closeAllConnections()
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
}

test('a stored object is served as the type its extension implies, whatever was stored with it', async () => {
  const stored = new Response('<script>alert(1)</script>', {
    status: 200,
    headers: { 'content-type': 'text/html', 'content-length': '25', etag: '"v1"' },
  })
  const reply = await serveStored(stored, 'text/plain')
  assert.equal(reply.status, 200)
  assert.equal(reply.headers.get('content-type'), 'text/plain', 'the uploader-supplied text/html is ignored')
  assert.equal(reply.text, '<script>alert(1)</script>')
  assert.equal(reply.headers.get('etag'), '"v1"', 'validators are still forwarded')
})

test('a stored cache policy never makes a private library file publicly cacheable', async () => {
  const stored = new Response('x', {
    status: 200,
    headers: { 'content-type': 'text/plain', 'cache-control': 'public, max-age=3600' },
  })
  const reply = await serveStored(stored, 'text/plain')
  assert.equal(reply.headers.get('cache-control'), 'private, no-cache', "the route's own private policy stands")
})

test('a missing object is a plain not-found', async () => {
  const reply = await serveStored(new Response('missing', { status: 404 }), 'text/plain')
  assert.equal(reply.status, 404)
})
