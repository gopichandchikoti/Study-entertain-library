import { randomBytes } from 'node:crypto'

const DEFAULT_PORT = 4450
const DEFAULT_UPLOAD_BYTES = 100 * 1024 * 1024
const MIN_SECRET_BYTES = 32
const MIN_PASSWORD_LENGTH = 12
const MAX_PROXY_HOPS = 5
const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000

export type SameSitePolicy = 'lax' | 'strict' | 'none'

export type ApiConfig = {
  production: boolean
  port: number
  /** How many reverse proxies sit in front of the service; `request.ip` is the client address that many hops back. */
  trustProxyHops: number
  supabaseUrl: string
  supabaseServiceRoleKey: string
  storageBucket: string
  /** The one browser origin allowed to call this API with credentials. */
  webOrigin: string
  /** Shared access password. Absent only outside production, where the API is then open. */
  accessPassword: string | undefined
  sessionSecret: string
  catalogSyncToken: string | undefined
  maxUploadBytes: number
  cookie: { name: string; sameSite: SameSitePolicy; lifetimeMs: number }
}

const required = (env: NodeJS.ProcessEnv, name: string): string => {
  const value = env[name]
  if (!value) throw new Error(`${name} is required.`)
  return value
}

/** A plain origin (scheme, host, port) and nothing else. Production needs https; loopback http is allowed while developing. */
const parseOrigin = (name: string, value: string, production: boolean): string => {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${name} must be an origin such as https://library.example.com.`)
  }
  const plain = url.origin !== 'null' && url.origin === value.replace(/\/$/, '')
  const loopback = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
  const secure = url.protocol === 'https:' || (!production && url.protocol === 'http:' && loopback)
  if (!plain || !secure) {
    throw new Error(`${name} must be an https origin with no path${production ? '' : ' (http is allowed for localhost)'}.`)
  }
  return url.origin
}

const integerInRange = (name: string, value: string, min: number, max: number): number => {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new Error(`${name} must be a whole number from ${min} to ${max}.`)
  return parsed
}

const sameSitePolicy = (value: string | undefined, production: boolean): SameSitePolicy => {
  const policy = (value ?? (production ? 'none' : 'lax')).toLowerCase()
  if (policy !== 'lax' && policy !== 'strict' && policy !== 'none') throw new Error('API_COOKIE_SAMESITE must be lax, strict or none.')
  return policy
}

/** Reads every setting once and refuses to start when a production secret is missing or weak. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const production = env.NODE_ENV === 'production'
  const accessPassword = env.LIBRARY_ACCESS_PASSWORD || undefined
  if (production && !accessPassword) {
    throw new Error('LIBRARY_ACCESS_PASSWORD is required in production: the library must not be open to everyone.')
  }
  if (production && accessPassword && accessPassword.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`LIBRARY_ACCESS_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`)
  }
  const suppliedSecret = env.SESSION_SECRET || undefined
  const weakSecret = !suppliedSecret || Buffer.byteLength(suppliedSecret) < MIN_SECRET_BYTES || suppliedSecret === accessPassword
  if (production && weakSecret) {
    throw new Error(`SESSION_SECRET must be at least ${MIN_SECRET_BYTES} bytes and different from the access password.`)
  }
  const catalogSyncToken = env.CATALOG_SYNC_TOKEN || undefined
  if (catalogSyncToken && Buffer.byteLength(catalogSyncToken) < MIN_SECRET_BYTES) {
    throw new Error(`CATALOG_SYNC_TOKEN must be at least ${MIN_SECRET_BYTES} bytes.`)
  }
  const webOrigin = production ? required(env, 'WEB_ORIGIN') : (env.WEB_ORIGIN ?? 'http://localhost:4444')
  return {
    production,
    port: integerInRange('PORT', env.PORT ?? String(DEFAULT_PORT), 1, 65_535),
    trustProxyHops: integerInRange('TRUST_PROXY_HOPS', env.TRUST_PROXY_HOPS ?? (production ? '1' : '0'), 0, MAX_PROXY_HOPS),
    supabaseUrl: parseOrigin('SUPABASE_URL', required(env, 'SUPABASE_URL'), production),
    supabaseServiceRoleKey: required(env, 'SUPABASE_SERVICE_ROLE_KEY'),
    storageBucket: env.SUPABASE_STORAGE_BUCKET ?? 'study-library',
    webOrigin: parseOrigin('WEB_ORIGIN', webOrigin, production),
    accessPassword,
    // Outside production a missing secret just means sessions end when the process restarts.
    sessionSecret: suppliedSecret ?? randomBytes(48).toString('base64url'),
    catalogSyncToken,
    maxUploadBytes: env.MAX_UPLOAD_BYTES ? integerInRange('MAX_UPLOAD_BYTES', env.MAX_UPLOAD_BYTES, 1, Number.MAX_SAFE_INTEGER) : DEFAULT_UPLOAD_BYTES,
    cookie: {
      name: production ? '__Host-study_library_session' : 'study_library_session',
      sameSite: sameSitePolicy(env.API_COOKIE_SAMESITE, production),
      lifetimeMs: SESSION_LIFETIME_MS,
    },
  }
}
