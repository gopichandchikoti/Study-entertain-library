import { randomUUID } from 'node:crypto'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { createApp } from '../src/app.js'
import { loadConfig, type ApiConfig } from '../src/config.js'
import type { Catalog, CatalogInsert, CatalogRow, Storage, StorageObject, UploadJob } from '../src/gateways.js'
import { safeStoragePath } from '../src/storage.js'
import { syncCatalog } from '../src/sync.js'

export const WEB_ORIGIN = 'https://library.example.com'
export const PASSWORD = 'a shared passphrase for the tests'
export const SECRET = 's'.repeat(48)
export const SYNC_TOKEN = 't'.repeat(40)
export const SERVICE_KEY = 'service-role-key-that-must-never-appear-in-a-reply'

export const baseEnvironment = (overrides: Record<string, string> = {}): NodeJS.ProcessEnv => ({
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY,
  WEB_ORIGIN,
  LIBRARY_ACCESS_PASSWORD: PASSWORD,
  SESSION_SECRET: SECRET,
  CATALOG_SYNC_TOKEN: SYNC_TOKEN,
  TRUST_PROXY_HOPS: '1',
  MAX_UPLOAD_BYTES: '4096',
  ...overrides,
})

type StoredObject = { content: Buffer; mimeType: string; modifiedAt: string }

/** An in-memory bucket. It stores whatever content type it is given, like the real one, so tests can prove the API ignores it. */
export class FakeStorage implements Storage {
  readonly objects = new Map<string, StoredObject>()
  /** Set to make every call fail the way an unreachable provider does. */
  failure: Error | null = null

  seed(filePath: string, content: string | Buffer, mimeType = 'application/octet-stream'): void {
    this.objects.set(filePath, { content: Buffer.from(content), mimeType, modifiedAt: new Date(0).toISOString() })
  }

  private guard(filePath: string): string {
    if (this.failure) throw this.failure
    const safe = safeStoragePath(filePath)
    if (!safe) throw new Error('That storage path is not allowed.')
    return safe
  }

  async request(filePath: string, init: RequestInit = {}): Promise<globalThis.Response> {
    const key = this.guard(filePath)
    const found = this.objects.get(key)
    if (!found) return new Response('missing', { status: 404 })
    if ((init.method ?? 'GET') === 'HEAD') return new Response(null, { status: 200 })
    const range = new Headers(init.headers).get('range')
    const headers = { 'content-type': found.mimeType, etag: '"v1"', 'cache-control': 'max-age=3600', 'accept-ranges': 'bytes' }
    const match = range ? /^bytes=(\d*)-(\d*)$/.exec(range) : null
    if (match) {
      const start = match[1] ? Number(match[1]) : 0
      const end = match[2] ? Number(match[2]) : found.content.length - 1
      const slice = found.content.subarray(start, end + 1)
      return new Response(new Uint8Array(slice), {
        status: 206,
        headers: { ...headers, 'content-range': `bytes ${start}-${end}/${found.content.length}` },
      })
    }
    return new Response(new Uint8Array(found.content), { status: 200, headers })
  }

  async upload(filePath: string, content: Buffer, mimeType: string): Promise<void> {
    const key = this.guard(filePath)
    this.objects.set(key, { content, mimeType, modifiedAt: new Date().toISOString() })
  }

  async remove(filePath: string): Promise<void> {
    this.objects.delete(this.guard(filePath))
  }

  async move(sourcePath: string, destinationPath: string): Promise<void> {
    const source = this.guard(sourcePath)
    const destination = this.guard(destinationPath)
    const found = this.objects.get(source)
    if (!found) throw new Error('Storage move failed with status 404.')
    this.objects.delete(source)
    this.objects.set(destination, found)
  }

  async uniqueDestination(filePath: string): Promise<string> {
    const safe = this.guard(filePath)
    const dot = safe.lastIndexOf('.')
    const stem = dot > safe.lastIndexOf('/') ? safe.slice(0, dot) : safe
    const extension = dot > safe.lastIndexOf('/') ? safe.slice(dot) : ''
    let candidate = safe
    for (let suffix = 2; this.objects.has(candidate); suffix += 1) candidate = `${stem}-${suffix}${extension}`
    return candidate
  }

  async list(): Promise<StorageObject[]> {
    if (this.failure) throw this.failure
    return [...this.objects]
      .filter(([key]) => !key.split('/').some((segment) => segment.startsWith('.')))
      .map(([key, value]) => ({ path: key, size: value.content.length, modifiedAt: value.modifiedAt, mimeType: value.mimeType }))
  }
}

export class FakeCatalog implements Catalog {
  readonly rows = new Map<string, CatalogRow>()
  readonly jobs = new Map<string, UploadJob>()

  async listRows(): Promise<CatalogRow[]> {
    return [...this.rows.values()]
  }

  async findRow(storagePath: string): Promise<CatalogRow | null> {
    return this.rows.get(storagePath) ?? null
  }

  async upsertRows(rows: CatalogInsert[]): Promise<void> {
    const stamp = new Date(0).toISOString()
    for (const row of rows) {
      this.rows.set(row.storage_path, { id: randomUUID(), created_at: stamp, updated_at: stamp, metadata: {}, ...row })
    }
  }

  async createUploadJob(job: Parameters<Catalog['createUploadJob']>[0]): Promise<UploadJob> {
    const created: UploadJob = {
      id: job.id ?? randomUUID(),
      user_id: job.user_id ?? null,
      storage_path: job.storage_path,
      original_name: job.original_name,
      status: job.status ?? 'staged',
      classification: job.classification ?? {},
      created_at: new Date().toISOString(),
      committed_at: null,
    }
    this.jobs.set(created.id, created)
    return created
  }

  async findUploadJob(id: string): Promise<UploadJob | null> {
    return this.jobs.get(id) ?? null
  }

  async updateUploadJob(id: string, update: Partial<Parameters<Catalog['createUploadJob']>[0]>): Promise<UploadJob> {
    const current = this.jobs.get(id)
    if (!current) throw new Error('Upload job update failed: not found')
    const next: UploadJob = { ...current, ...update, id: current.id, user_id: update.user_id ?? current.user_id } as UploadJob
    this.jobs.set(id, next)
    return next
  }

  async countStagedUploads(): Promise<number> {
    return [...this.jobs.values()].filter((job) => job.status === 'staged').length
  }

  async listStaleUploads(cutoffIso: string, limit: number): Promise<UploadJob[]> {
    return [...this.jobs.values()].filter((job) => job.status === 'staged' && job.created_at < cutoffIso).slice(0, limit)
  }
}

export type RequestOptions = {
  method?: string
  body?: unknown
  form?: FormData
  headers?: Record<string, string>
  cookie?: string
  /** The Origin header: the web origin by default, `null` to send none. */
  origin?: string | null
  marker?: boolean
  address?: string
}

export type Reply = { status: number; headers: Headers; text: string; json: Record<string, unknown> | null }

export type Harness = {
  url: string
  config: ApiConfig
  storage: FakeStorage
  catalog: FakeCatalog
  clock: { now: number }
  request: (route: string, options?: RequestOptions) => Promise<Reply>
  signIn: (address?: string) => Promise<string>
  /** Index everything in the fake bucket into the fake catalog, as `catalog:sync` does. */
  index: () => Promise<void>
  stop: () => Promise<void>
}

let addressCounter = 0
const freshAddress = (): string => {
  addressCounter += 1
  return `10.${Math.floor(addressCounter / 250) % 250}.${addressCounter % 250}.9`
}

/** The real application on a random port, with in-memory stand-ins for Supabase. */
export async function startApi(environment: Record<string, string> = {}, secure = false): Promise<Harness> {
  const config = loadConfig(baseEnvironment(environment))
  const storage = new FakeStorage()
  const catalog = new FakeCatalog()
  const clock = { now: Date.now() }
  const app = createApp(config, { storage, catalog, now: () => clock.now })
  const server = await new Promise<Server>((resolve) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening))
  })
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
  const defaultAddress = freshAddress()

  const request = async (route: string, options: RequestOptions = {}): Promise<Reply> => {
    const { method = 'GET', body, form, headers = {}, cookie, origin = WEB_ORIGIN, marker = true, address = defaultAddress } = options
    const response = await fetch(`${url}${route}`, {
      method,
      redirect: 'manual',
      headers: {
        'x-forwarded-for': address,
        ...(secure ? { 'x-forwarded-proto': 'https' } : {}),
        ...(origin ? { origin } : {}),
        ...(marker ? { 'x-requested-with': 'StudyLibrary' } : {}),
        ...(cookie ? { cookie } : {}),
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...headers,
      },
      body: form ?? (body === undefined ? undefined : JSON.stringify(body)),
    })
    const text = await response.text()
    let json: Record<string, unknown> | null = null
    try {
      json = JSON.parse(text) as Record<string, unknown>
    } catch {
      json = null
    }
    return { status: response.status, headers: response.headers, text, json }
  }

  const signIn = async (address = freshAddress()): Promise<string> => {
    const reply = await request('/api/auth/login', { method: 'POST', body: { password: PASSWORD }, address })
    const setCookie = reply.headers.getSetCookie()[0]
    if (reply.status !== 200 || !setCookie) throw new Error(`sign-in failed with ${reply.status}: ${reply.text}`)
    return setCookie.split(';')[0]
  }

  return {
    url,
    config,
    storage,
    catalog,
    clock,
    request,
    signIn,
    index: async () => {
      await syncCatalog(catalog, storage)
    },
    stop: async () => {
      await new Promise<void>((resolve) => {
        server.closeAllConnections()
        server.close(() => resolve())
      })
    },
  }
}

export const formWith = (name: string, content: BlobPart, type = ''): FormData => {
  const form = new FormData()
  form.set('file', new Blob([content], { type }), name)
  return form
}
