import path from 'node:path'
import { extensionOf, mimeTypeForExtension, previewKindForExtension, supportedExtensions } from './files.js'
import type { Catalog, CatalogRow } from './gateways.js'
import type { CategorySummary, FileKind, FolderNode, LibraryFile, LibraryResponse } from './types.js'

const nameCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
const MAX_LIST_LIMIT = 10_000

const titleFromPath = (filePath: string, extension: string): string => {
  const fileName = path.posix.basename(filePath)
  return fileName.slice(0, -extension.length).replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ') || fileName
}

const rowToFile = (row: CatalogRow): LibraryFile | null => {
  const normalizedPath = row.storage_path.replace(/\\/g, '/')
  const extension = extensionOf(normalizedPath)
  if (!normalizedPath || !supportedExtensions.has(extension)) return null
  const segments = normalizedPath.split('/')
  const previewKind = previewKindForExtension(extension)
  const kind: FileKind = previewKind === 'image' ? 'image' : 'document'
  const categoryPath = segments.length > 1 ? segments[0] : ''
  return {
    path: normalizedPath,
    name: segments[segments.length - 1] ?? normalizedPath,
    kind,
    category: categoryPath || 'Library root',
    categoryPath,
    folderPath: segments.slice(0, -1).join('/'),
    extension,
    title: row.title || titleFromPath(normalizedPath, extension),
    previewKind,
    // The stored type is advisory only: what a browser is told always comes from the extension.
    mimeType: mimeTypeForExtension(extension),
    size: Number(row.size_bytes),
    modifiedAt: row.modified_at,
  }
}

const createFolder = (name: string, folderPath: string): FolderNode => ({ name, path: folderPath, documents: [], images: [], children: [] })

const addFileToTree = (root: FolderNode, file: LibraryFile): void => {
  const segments = file.folderPath ? file.folderPath.split('/') : []
  let current = root
  for (let index = 0; index < segments.length; index += 1) {
    const folderPath = segments.slice(0, index + 1).join('/')
    let child = current.children.find((candidate) => candidate.path === folderPath)
    if (!child) {
      child = createFolder(segments[index], folderPath)
      current.children.push(child)
    }
    current = child
  }
  if (file.kind === 'document') current.documents.push(file)
  else current.images.push(file)
}

const byPath = (left: { path: string }, right: { path: string }): number => nameCollator.compare(left.path, right.path)

const sortFolders = (folders: FolderNode[]): FolderNode[] =>
  [...folders].sort(byPath).map((folder) => ({
    ...folder,
    children: sortFolders(folder.children),
    documents: [...folder.documents].sort(byPath),
    images: [...folder.images].sort(byPath),
  }))

const buildResponse = (rows: CatalogRow[], root: string): LibraryResponse => {
  const files = rows
    .map(rowToFile)
    .filter((file): file is LibraryFile => file !== null)
    .sort(byPath)
  const rootFolder = createFolder(root, '')
  const categoryMap = new Map<string, CategorySummary>()
  for (const file of files) {
    addFileToTree(rootFolder, file)
    const existing = categoryMap.get(file.categoryPath) ?? { name: file.category, path: file.categoryPath, documents: 0, images: 0, folders: 0 }
    if (file.kind === 'document') existing.documents += 1
    else existing.images += 1
    categoryMap.set(file.categoryPath, existing)
  }
  for (const category of categoryMap.values()) {
    category.folders = new Set(files.filter((file) => file.categoryPath === category.path).map((file) => file.folderPath)).size
  }
  return {
    root,
    generatedAt: new Date().toISOString(),
    stats: {
      documents: files.filter((file) => file.kind === 'document').length,
      images: files.filter((file) => file.kind === 'image').length,
      folders: new Set(files.map((file) => file.folderPath).filter(Boolean)).size,
      categories: categoryMap.size,
    },
    categories: [...categoryMap.values()].sort((left, right) => nameCollator.compare(left.name, right.name)),
    folders: sortFolders(rootFolder.children),
    files,
  }
}

export type LibraryQuery = { search?: string; category?: string; limit?: number; offset?: number }

export type Library = {
  getLibrary: (query: LibraryQuery) => Promise<LibraryResponse>
  getCatalogFile: (storagePath: string) => Promise<LibraryFile | null>
}

export const isInlineFile = (file: LibraryFile): boolean => file.previewKind === 'markdown' || file.previewKind === 'text'

export function createLibrary(catalog: Catalog): Library {
  return {
    async getLibrary(query) {
      const rows = await catalog.listRows()
      const search = query.search?.trim().toLowerCase() ?? ''
      const category = query.category?.trim() ?? ''
      const matching = rows.filter((row) => {
        const file = rowToFile(row)
        if (!file) return false
        const matchesCategory = !category || file.categoryPath === category
        const matchesSearch = !search || [file.title, file.name, file.folderPath].some((value) => value.toLowerCase().includes(search))
        return matchesCategory && matchesSearch
      })
      const offset = Math.max(0, query.offset ?? 0)
      const limit = Math.min(MAX_LIST_LIMIT, Math.max(1, query.limit ?? MAX_LIST_LIMIT))
      return buildResponse(matching.slice(offset, offset + limit), 'study-library')
    },
    async getCatalogFile(storagePath) {
      const row = await catalog.findRow(storagePath)
      return row ? rowToFile(row) : null
    },
  }
}
