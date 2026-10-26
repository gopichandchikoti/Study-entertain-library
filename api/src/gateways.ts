/** The two outside systems the API talks to, described as plain interfaces so tests can stand in for Supabase. */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type StorageObject = {
  path: string
  size: number
  modifiedAt: string
  mimeType: string
}

/** Private object storage. Paths are relative keys; the implementation refuses anything that could leave the bucket. */
export type Storage = {
  request: (filePath: string, init?: RequestInit) => Promise<globalThis.Response>
  upload: (filePath: string, content: Buffer, mimeType: string) => Promise<void>
  remove: (filePath: string) => Promise<void>
  move: (sourcePath: string, destinationPath: string) => Promise<void>
  uniqueDestination: (filePath: string) => Promise<string>
  list: () => Promise<StorageObject[]>
}

export type CatalogRow = {
  id: string
  storage_path: string
  title: string
  extension: string
  preview_kind: string
  mime_type: string
  size_bytes: number
  category_path: string
  folder_path: string
  modified_at: string
  metadata: Json
  created_at: string
  updated_at: string
}

export type CatalogInsert = Omit<CatalogRow, 'id' | 'created_at' | 'updated_at' | 'metadata'> & { metadata?: Json }

export type UploadStatus = 'staged' | 'committed' | 'discarded' | 'failed'

export type UploadJob = {
  id: string
  user_id: string | null
  storage_path: string
  original_name: string
  status: UploadStatus
  classification: Json
  created_at: string
  committed_at: string | null
}

export type UploadJobInsert = {
  id?: string
  user_id?: string | null
  storage_path: string
  original_name: string
  status?: UploadStatus
  classification?: Json
  committed_at?: string | null
}

/** The catalog (PostgreSQL): indexed library rows and the review state of staged uploads. */
export type Catalog = {
  listRows: () => Promise<CatalogRow[]>
  findRow: (storagePath: string) => Promise<CatalogRow | null>
  upsertRows: (rows: CatalogInsert[]) => Promise<void>
  createUploadJob: (job: UploadJobInsert) => Promise<UploadJob>
  findUploadJob: (id: string) => Promise<UploadJob | null>
  updateUploadJob: (id: string, update: Partial<UploadJobInsert>) => Promise<UploadJob>
  countStagedUploads: () => Promise<number>
  /** Staged uploads created before `cutoffIso`, oldest first, at most `limit` of them. */
  listStaleUploads: (cutoffIso: string, limit: number) => Promise<UploadJob[]>
}
