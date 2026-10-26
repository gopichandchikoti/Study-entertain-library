import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import type { AddressInfo } from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { createApp } from '../../server/app.js'
import { loadServerConfig, type ServerConfig } from '../../server/config/index.js'

export const PASSWORD = 'correct horse battery staple'
export const ORIGIN = 'http://localhost:4444'

export type TestServer = {
  url: string
  root: string
  config: ServerConfig
  /** Sign in as the owner and return a `Cookie` header value. */
  signIn: () => Promise<string>
  /** Headers every write must carry in owner mode. */
  writeHeaders: (cookie: string) => Record<string, string>
  stop: () => Promise<void>
}

/** A real server on a random port with a throw-away content root, owner-password sign-in and Watch switched off. */
export async function startTestServer(overrides: Record<string, string> = {}): Promise<TestServer> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'study-library-test-'))
  const content = path.join(root, 'content')
  await mkdir(path.join(content, 'Python'), { recursive: true })
  await writeFile(path.join(content, 'Python', '01-intro.md'), '# Intro to Python\n\nHello.\n')
  await writeFile(path.join(content, 'Python', '02-loops.md'), '# Loops\n\nfor x in y.\n')
  await writeFile(path.join(content, 'Python', 'diagram.svg'), '<svg xmlns="http://www.w3.org/2000/svg"><script>1</script></svg>')
  await writeFile(path.join(content, 'Python', 'notes.txt'), 'plain text')
  await mkdir(path.join(content, '.hidden'), { recursive: true })
  await writeFile(path.join(content, '.hidden', 'secret.md'), '# Secret')
  await writeFile(path.join(content, 'root-note.md'), '# Root note')

  const env: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    AUTH_MODE: 'owner',
    LIBRARY_ACCESS_PASSWORD: PASSWORD,
    SESSION_SECRET: 's'.repeat(48),
    AUTH_PUBLIC_ORIGIN: ORIGIN,
    STUDY_CONTENT_DIR: content,
    PERSONAL_DB_PATH: path.join(root, 'personal.sqlite'),
    MAX_UPLOAD_BYTES: '4096',
    ...overrides,
  }
  const loaded = loadServerConfig(env)
  const config: ServerConfig = {
    ...loaded,
    media: { root: path.join(root, 'media'), allowedDrive: null, refusal: 'Watch is switched off for tests.' },
  }
  const { app, close } = await createApp(config)
  const server = await new Promise<import('node:http').Server>((resolve) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening))
  })
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`

  const writeHeaders = (cookie: string): Record<string, string> => ({
    cookie,
    origin: ORIGIN,
    'x-requested-with': 'StudyLibrary',
  })
  const signIn = async (): Promise<string> => {
    const response = await fetch(`${url}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: ORIGIN, 'x-requested-with': 'StudyLibrary' },
      body: JSON.stringify({ password: PASSWORD }),
    })
    const cookie = response.headers.getSetCookie()[0]?.split(';')[0]
    if (!cookie) throw new Error(`Sign-in failed with status ${response.status}.`)
    return cookie
  }
  const stop = async (): Promise<void> => {
    await new Promise<void>((resolve) => {
      server.closeAllConnections()
      server.close(() => resolve())
    })
    close()
    await rm(root, { recursive: true, force: true })
  }
  return { url, root: content, config, signIn, writeHeaders, stop }
}
