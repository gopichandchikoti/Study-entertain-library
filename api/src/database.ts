import { createClient } from '@supabase/supabase-js'
import type { ApiConfig } from './config.js'
import type { Catalog, CatalogRow, UploadJob } from './gateways.js'
import { fetchWithTimeout } from './http.js'

const PAGE_SIZE = 1000
const BATCH_SIZE = 500

/** PostgreSQL catalog over Supabase. Every query is parameterised by the client library; the service role stays server-side. */
export function createCatalog(config: ApiConfig): Catalog {
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: (input, init) => fetchWithTimeout(typeof input === 'string' || input instanceof URL ? input : input.url, init) },
  })

  return {
    async listRows() {
      const rows: CatalogRow[] = []
      for (let offset = 0; ; offset += PAGE_SIZE) {
        const { data, error } = await supabase
          .from('library_items')
          .select('*')
          .order('storage_path', { ascending: true })
          .range(offset, offset + PAGE_SIZE - 1)
        if (error) throw new Error(`Catalog query failed: ${error.message}`)
        rows.push(...(data as CatalogRow[]))
        if (data.length < PAGE_SIZE) return rows
      }
    },
    async findRow(storagePath) {
      const { data, error } = await supabase.from('library_items').select('*').eq('storage_path', storagePath).maybeSingle()
      if (error) throw new Error(`Catalog lookup failed: ${error.message}`)
      return data as CatalogRow | null
    },
    async upsertRows(rows) {
      for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
        const { error } = await supabase.from('library_items').upsert(rows.slice(offset, offset + BATCH_SIZE), { onConflict: 'storage_path' })
        if (error) throw new Error(`Catalog upsert failed: ${error.message}`)
      }
    },
    async createUploadJob(job) {
      const { data, error } = await supabase.from('upload_jobs').insert(job).select('*').single()
      if (error) throw new Error(`Upload job creation failed: ${error.message}`)
      return data as UploadJob
    },
    async findUploadJob(id) {
      const { data, error } = await supabase.from('upload_jobs').select('*').eq('id', id).maybeSingle()
      if (error) throw new Error(`Upload job lookup failed: ${error.message}`)
      return data as UploadJob | null
    },
    async updateUploadJob(id, update) {
      const { data, error } = await supabase.from('upload_jobs').update(update).eq('id', id).select('*').single()
      if (error) throw new Error(`Upload job update failed: ${error.message}`)
      return data as UploadJob
    },
    async countStagedUploads() {
      const { count, error } = await supabase.from('upload_jobs').select('id', { count: 'exact', head: true }).eq('status', 'staged')
      if (error) throw new Error(`Upload job count failed: ${error.message}`)
      return count ?? 0
    },
    async listStaleUploads(cutoffIso, limit) {
      const { data, error } = await supabase
        .from('upload_jobs')
        .select('*')
        .eq('status', 'staged')
        .lt('created_at', cutoffIso)
        .order('created_at', { ascending: true })
        .limit(limit)
      if (error) throw new Error(`Upload job listing failed: ${error.message}`)
      return data as UploadJob[]
    },
  }
}
