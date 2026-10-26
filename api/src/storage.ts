import path from 'node:path'
import type { ApiConfig } from './config.js'
import type { Storage, StorageObject } from './gateways.js'
import { fetchWithTimeout } from './http.js'

type StorageEntry = {
  name: string
  id?: string | null
  updated_at?: string | null
  metadata?: {
    size?: number | string
    mimetype?: string
  } | null
}

const LIST_PAGE_SIZE = 1000

/** A relative object key with no way out of the bucket, or null. A bare ".." survives normalize(), so whole segments are tested. */
export const safeStoragePath = (filePath: string): string | null => {
  const normalized = path.posix.normalize(filePath.replace(/\\/g, '/'))
  const escapes = normalized.startsWith('/') || normalized.endsWith('/') || normalized.split('/').includes('..')
  if (!normalized || normalized === '.' || escapes || normalized.includes('\0')) return null
  return normalized
}

const encodedPath = (filePath: string): string => filePath.split('/').map((segment) => encodeURIComponent(segment)).join('/')

/** Private Supabase Storage. The service-role key never leaves this module. */
export function createStorage(config: ApiConfig): Storage {
  const base = `${config.supabaseUrl}/storage/v1`
  const bucket = encodeURIComponent(config.storageBucket)
  const headers = (extra: Record<string, string> = {}): Record<string, string> => ({
    apikey: config.supabaseServiceRoleKey,
    authorization: `Bearer ${config.supabaseServiceRoleKey}`,
    ...extra,
  })

  const request: Storage['request'] = async (filePath, init = {}) => {
    const safePath = safeStoragePath(filePath)
    if (!safePath) throw new Error('That storage path is not allowed.')
    return fetchWithTimeout(`${base}/object/${bucket}/${encodedPath(safePath)}`, {
      ...init,
      headers: headers((init.headers ?? {}) as Record<string, string>),
    })
  }

  const exists = async (filePath: string): Promise<boolean> => {
    const response = await request(filePath, { method: 'HEAD' })
    if (response.status === 404) return false
    if (response.ok) return true
    throw new Error(`Storage lookup failed with status ${response.status}.`)
  }

  const listPrefix = async (prefix: string, visited: Set<string>): Promise<StorageObject[]> => {
    if (visited.has(prefix)) return []
    visited.add(prefix)
    const objects: StorageObject[] = []
    for (let offset = 0; ; offset += LIST_PAGE_SIZE) {
      const response = await fetchWithTimeout(`${base}/object/list/${bucket}`, {
        method: 'POST',
        headers: headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({ prefix, limit: LIST_PAGE_SIZE, offset, sortBy: { column: 'name', order: 'asc' } }),
      })
      if (!response.ok) throw new Error(`Storage listing failed with status ${response.status}.`)
      const entries = (await response.json()) as StorageEntry[]
      for (const entry of entries) {
        const entryPath = prefix ? `${prefix}/${entry.name}` : entry.name
        // Hidden segments (the private upload inbox) never become part of the library.
        if (!entryPath || entryPath.split('/').some((segment) => !segment || segment.startsWith('.'))) continue
        if (!entry.id) {
          objects.push(...(await listPrefix(entryPath, visited)))
          continue
        }
        const rawSize = typeof entry.metadata?.size === 'string' ? Number(entry.metadata.size) : entry.metadata?.size
        objects.push({
          path: entryPath,
          size: Number.isFinite(rawSize) ? Number(rawSize) : 0,
          modifiedAt: entry.updated_at ?? new Date(0).toISOString(),
          mimeType: entry.metadata?.mimetype ?? 'application/octet-stream',
        })
      }
      if (entries.length < LIST_PAGE_SIZE) return objects
    }
  }

  return {
    request,
    async upload(filePath, content, mimeType) {
      const response = await request(filePath, {
        method: 'POST',
        headers: { 'content-type': mimeType, 'cache-control': '3600', 'x-upsert': 'false' },
        body: content as unknown as BodyInit,
      })
      if (!response.ok) throw new Error(`Storage upload failed with status ${response.status}.`)
    },
    async remove(filePath) {
      const response = await request(filePath, { method: 'DELETE' })
      if (!response.ok && response.status !== 404) throw new Error(`Storage deletion failed with status ${response.status}.`)
    },
    async move(sourcePath, destinationPath) {
      const source = safeStoragePath(sourcePath)
      const destination = safeStoragePath(destinationPath)
      if (!source || !destination) throw new Error('That storage move is not allowed.')
      const response = await fetchWithTimeout(`${base}/object/move`, {
        method: 'POST',
        headers: headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({ bucketId: config.storageBucket, sourceKey: source, destinationKey: destination }),
      })
      if (!response.ok) throw new Error(`Storage move failed with status ${response.status}.`)
    },
    async uniqueDestination(filePath) {
      const safePath = safeStoragePath(filePath)
      if (!safePath) throw new Error('That storage destination is not allowed.')
      const extension = path.posix.extname(safePath)
      const stem = extension ? safePath.slice(0, -extension.length) : safePath
      let candidate = safePath
      for (let suffix = 2; await exists(candidate); suffix += 1) candidate = `${stem}-${suffix}${extension}`
      return candidate
    },
    list: () => listPrefix('', new Set()),
  }
}
