import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadAuthConfig, type AuthConfig } from '../auth/config.js'
import { resolveMediaRoot, type MediaRoot } from '../watch/root.js'

const DEFAULT_MAX_UPLOAD_BYTES = 100 * 1024 * 1024
const MIN_SECRET_BYTES = 32
const DEFAULT_BUCKET = 'study-library'

export type RemoteStorageConfig = {
  url: string
  serviceRoleKey: string
  bucket: string
}

export type AiClassifierConfig = {
  apiKey: string | undefined
  baseUrl: string | undefined
  model: string | undefined
}

export type ServerConfig = {
  production: boolean
  appDirectory: string
  appDirectoryName: string
  contentRoot: string
  staticDirectory: string
  port: number
  host: string
  storageMode: string
  /** Set only when STORAGE_MODE=supabase; credentials stay on the server. */
  remote: RemoteStorageConfig | null
  /** Shared owner password mode (no accounts). */
  access: { password: string | undefined; sessionSecret: string | undefined; enabled: boolean }
  accounts: AuthConfig
  accountsEnabled: boolean
  media: MediaRoot
  personalDatabasePath: string
  uploads: { directory: string; maxBytes: number }
  watch: { catalogDirectory: string; maxStreams: number; pregeneratePreviews: boolean; encoder: 'x264' | 'amf' }
  /** The separate web origin allowed to post to the practice runner (split deployment), or null for same-origin only. */
  webOrigin: string | null
  trustProxy: string | undefined
  ai: AiClassifierConfig
}

const positiveInteger = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value ?? fallback)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

const loadRemoteStorage = (env: NodeJS.ProcessEnv): RemoteStorageConfig | null => {
  if ((env.STORAGE_MODE ?? 'filesystem') !== 'supabase') return null
  const url = env.SUPABASE_URL?.replace(/\/$/, '')
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('STORAGE_MODE=supabase requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }
  return { url, serviceRoleKey, bucket: env.SUPABASE_STORAGE_BUCKET ?? DEFAULT_BUCKET }
}

/** An empty value means "not configured"; anything else must be a plain origin, so a typo fails at start-up. */
const loadWebOrigin = (value: string | undefined): string | null => {
  if (!value) return null
  const origin = new URL(value)
  if (origin.origin === 'null' || origin.origin !== value.replace(/\/$/, '')) {
    throw new Error('WEB_ORIGIN must be an origin such as https://library.example.com, with no path.')
  }
  return origin.origin
}

/** Reads every environment setting once, so the rest of the server never touches `process.env`. */
export function loadServerConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  const appDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
  const accounts = loadAuthConfig(env)
  const accountsEnabled = accounts.mode === 'accounts'
  const password = env.LIBRARY_ACCESS_PASSWORD
  const sessionSecret = env.SESSION_SECRET ?? password
  const accessEnabled = accountsEnabled || Boolean(password)
  const production = env.NODE_ENV === 'production'
  if (!accountsEnabled && accessEnabled && !sessionSecret) {
    throw new Error('LIBRARY_ACCESS_PASSWORD requires SESSION_SECRET or a stable password-derived session secret.')
  }
  // The cookie signing key must not be the password itself: anyone who sees one cookie could then guess the password offline.
  const weakSecret = Buffer.byteLength(env.SESSION_SECRET ?? '') < MIN_SECRET_BYTES || env.SESSION_SECRET === password
  if (!accountsEnabled && accessEnabled && production && weakSecret) {
    throw new Error('Owner mode in production needs a SESSION_SECRET of at least 32 bytes that is not the access password.')
  }
  const contentRoot = path.resolve(env.STUDY_CONTENT_DIR ?? path.join(appDirectory, '..'))
  return {
    production,
    appDirectory,
    appDirectoryName: path.basename(appDirectory),
    contentRoot,
    staticDirectory: path.join(appDirectory, 'dist'),
    port: Number(env.PORT ?? (production ? 4444 : 4445)),
    host: env.STUDY_SERVER_HOST ?? (accounts.production ? '0.0.0.0' : '127.0.0.1'),
    storageMode: env.STORAGE_MODE ?? 'filesystem',
    remote: loadRemoteStorage(env),
    access: { password, sessionSecret, enabled: accessEnabled },
    accounts,
    accountsEnabled,
    media: resolveMediaRoot(env, appDirectory),
    personalDatabasePath: path.resolve(env.PERSONAL_DB_PATH ?? path.join(appDirectory, 'data', 'study-library.sqlite')),
    uploads: {
      directory: path.join(contentRoot, '.study-library-inbox'),
      maxBytes: positiveInteger(env.MAX_UPLOAD_BYTES, DEFAULT_MAX_UPLOAD_BYTES),
    },
    watch: {
      catalogDirectory: path.resolve(env.WATCH_CATALOG_DIR ?? path.join(appDirectory, 'data', 'watch-catalog')),
      maxStreams: Math.max(1, Math.min(8, Number(env.WATCH_MAX_STREAMS) || 3)),
      pregeneratePreviews: env.WATCH_PREVIEWS !== 'lazy',
      encoder: env.WATCH_ENCODER === 'amf' ? 'amf' : 'x264',
    },
    webOrigin: loadWebOrigin(env.WEB_ORIGIN),
    trustProxy: env.AUTH_TRUST_PROXY,
    ai: { apiKey: env.AI_API_KEY, baseUrl: env.AI_BASE_URL, model: env.AI_MODEL },
  }
}
