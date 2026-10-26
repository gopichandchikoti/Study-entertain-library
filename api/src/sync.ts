import path from 'node:path'
import { extensionOf, mimeTypeForExtension, previewKindForExtension, supportedExtensions } from './files.js'
import type { Catalog, CatalogInsert, Storage } from './gateways.js'
import type { CatalogSyncResult } from './types.js'

const deriveTitle = (storagePath: string, extension: string): string =>
  path.posix.basename(storagePath, extension).replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ')

/** Lists the private bucket and upserts the supported objects into the catalog. Safe to repeat. */
export async function syncCatalog(catalog: Catalog, storage: Storage): Promise<CatalogSyncResult> {
  const objects = await storage.list()
  const rows: CatalogInsert[] = []
  for (const object of objects) {
    const extension = extensionOf(object.path)
    if (!supportedExtensions.has(extension)) continue
    const segments = object.path.split('/')
    rows.push({
      storage_path: object.path,
      title: deriveTitle(object.path, extension),
      extension,
      preview_kind: previewKindForExtension(extension),
      // Whatever was stored with the object is ignored: the type a file is served as comes from its extension.
      mime_type: mimeTypeForExtension(extension),
      size_bytes: object.size,
      category_path: segments.length > 1 ? segments[0] : '',
      folder_path: segments.slice(0, -1).join('/'),
      modified_at: object.modifiedAt,
      metadata: {},
    })
  }
  await catalog.upsertRows(rows)
  return { scanned: objects.length, indexed: rows.length, skipped: objects.length - rows.length, generatedAt: new Date().toISOString() }
}
