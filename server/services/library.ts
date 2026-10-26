import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { CategorySummary, FileKind, FolderNode, LibraryFile, LibraryInventory, SafeFile } from '../@types/library.js'
import { isContained, isPublicLibraryPath, resolveWithinRoot } from '../auth/file-policy.js'
import type { ServerConfig } from '../config/index.js'
import {
  baseIgnoredDirectoryNames,
  isSupportedFile,
  mimeTypeForExtension,
  previewKindForExtension,
} from '../helpers/extensions.js'
import { toPosix } from '../helpers/paths.js'
import { stripExtension, titleFromFileName, titleFromMarkdown } from '../helpers/text.js'
import type { PersonalCatalog, PersonalCatalogEntry } from '../personal-db.js'
import type { RemoteStorage } from './remote-storage.js'

const nameCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
const LIBRARY_ROOT_CATEGORY = 'Library root'

const sortFiles = (files: LibraryFile[]): LibraryFile[] =>
  [...files].sort((left, right) => nameCollator.compare(left.path, right.path))

const sortFolders = (folders: FolderNode[]): FolderNode[] =>
  [...folders]
    .sort((left, right) => nameCollator.compare(left.path, right.path))
    .map((folder) => ({
      ...folder,
      children: sortFolders(folder.children),
      documents: sortFiles(folder.documents),
      images: sortFiles(folder.images),
    }))

const createFolder = (name: string, folderPath: string): FolderNode => ({
  name,
  path: folderPath,
  documents: [],
  images: [],
  children: [],
})

const addFileToTree = (root: FolderNode, file: LibraryFile): void => {
  const segments = file.folderPath ? file.folderPath.split('/') : []
  let current = root
  segments.forEach((segment, index) => {
    const folderPath = segments.slice(0, index + 1).join('/')
    let child = current.children.find((candidate) => candidate.path === folderPath)
    if (!child) {
      child = createFolder(segment, folderPath)
      current.children.push(child)
    }
    current = child
  })
  if (file.kind === 'document') current.documents.push(file)
  else current.images.push(file)
}

const summarizeCategories = (files: LibraryFile[]): CategorySummary[] => {
  const categories = new Map<string, CategorySummary>()
  const folderSets = new Map<string, Set<string>>()
  for (const file of files) {
    const key = file.categoryPath
    const summary = categories.get(key) ?? { name: file.category, path: key, documents: 0, images: 0, folders: 0 }
    if (file.kind === 'document') summary.documents += 1
    else summary.images += 1
    categories.set(key, summary)
    const folders = folderSets.get(key) ?? new Set<string>()
    folders.add(file.folderPath)
    folderSets.set(key, folders)
  }
  for (const [key, summary] of categories) summary.folders = folderSets.get(key)?.size ?? 0
  return [...categories.values()].sort((left, right) => nameCollator.compare(left.name, right.name))
}

type FileParts = { normalizedPath: string; name: string; extension: string; folderPath: string; categoryPath: string }

const splitPath = (relativePath: string): FileParts => {
  const normalizedPath = toPosix(relativePath)
  const segments = normalizedPath.split('/')
  const name = segments[segments.length - 1] ?? normalizedPath
  return {
    normalizedPath,
    name,
    extension: path.extname(name).toLowerCase(),
    folderPath: segments.slice(0, -1).join('/'),
    categoryPath: segments.length > 1 ? segments[0] : '',
  }
}

const toLibraryFile = (
  parts: FileParts,
  details: { title: string; mimeType: string; size: number; modifiedAt: string },
): LibraryFile => {
  const previewKind = previewKindForExtension(parts.extension)
  const kind: FileKind = previewKind === 'image' ? 'image' : 'document'
  return {
    path: parts.normalizedPath,
    name: parts.name,
    kind,
    category: parts.categoryPath || LIBRARY_ROOT_CATEGORY,
    categoryPath: parts.categoryPath,
    folderPath: parts.folderPath,
    extension: parts.extension,
    previewKind,
    ...details,
  }
}

/** Indexes the study content root (or the private bucket) into the inventory the reader navigates. */
export class LibraryService {
  readonly ignoredDirectories: ReadonlySet<string>

  constructor(
    private readonly config: ServerConfig,
    private readonly remote: RemoteStorage | null,
    private readonly catalog: PersonalCatalog | null,
  ) {
    this.ignoredDirectories = new Set([config.appDirectoryName, ...baseIgnoredDirectoryNames])
  }

  /** Resolves a request path under the content root, or null when it would leave the root. */
  resolveContentPath(relativePath: string): string | null {
    return resolveWithinRoot(this.config.contentRoot, relativePath)
  }

  private pending: Promise<LibraryInventory> | null = null

  /** The inventory. Callers that ask while a scan is already running share it instead of walking the tree again. */
  build(): Promise<LibraryInventory> {
    this.pending ??= this.buildFresh().finally(() => {
      this.pending = null
    })
    return this.pending
  }

  /** A new scan that never reuses one already in flight; needed right after a write so the new file is in the result. */
  async buildFresh(): Promise<LibraryInventory> {
    const files = this.remote
      ? await this.collectRemoteFiles(this.remote)
      : sortFiles(await this.collectFiles(this.config.contentRoot))
    this.catalog?.sync(
      files.map(
        (file): PersonalCatalogEntry => ({
          path: file.path,
          title: file.title,
          kind: file.kind,
          mimeType: file.mimeType,
          size: file.size,
          modifiedAt: file.modifiedAt,
        }),
      ),
    )
    const root = createFolder(this.remote ? this.remote.bucket : path.basename(this.config.contentRoot), '')
    for (const file of files) addFileToTree(root, file)
    const categories = summarizeCategories(files)
    return {
      root: path.basename(this.config.contentRoot),
      generatedAt: new Date().toISOString(),
      stats: {
        documents: files.filter((file) => file.kind === 'document').length,
        images: files.filter((file) => file.kind === 'image').length,
        folders: new Set(files.map((file) => file.folderPath).filter(Boolean)).size,
        categories: categories.length,
      },
      categories,
      folders: sortFolders(root.children),
      files,
    }
  }

  /** A real file inside the content root that is not hidden or ignored, after following every link. */
  async safeFile(relativePath: string): Promise<SafeFile | null> {
    if (!isPublicLibraryPath(relativePath, this.ignoredDirectories)) return null
    const absolutePath = this.resolveContentPath(relativePath)
    if (!absolutePath) return null
    try {
      const realRoot = await fs.realpath(this.config.contentRoot)
      const realFile = await fs.realpath(absolutePath)
      const relativeReal = toPosix(path.relative(realRoot, realFile))
      if (!isContained(realRoot, realFile) || !isPublicLibraryPath(relativeReal, this.ignoredDirectories)) return null
      const stats = await fs.stat(realFile)
      return stats.isFile() ? { absolutePath: realFile, stats } : null
    } catch {
      return null
    }
  }

  private async collectRemoteFiles(remote: RemoteStorage): Promise<LibraryFile[]> {
    const objects = await remote.list()
    return sortFiles(
      objects
        .filter((object) => isSupportedFile(object.path))
        .map((object) => {
          const parts = splitPath(object.path)
          return toLibraryFile(parts, {
            title: titleFromFileName(parts.name, parts.extension),
            mimeType: mimeTypeForExtension(parts.extension),
            size: object.size,
            modifiedAt: object.modifiedAt,
          })
        }),
    )
  }

  private async collectFiles(directory: string, relativeDirectory = ''): Promise<LibraryFile[]> {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    const files: LibraryFile[] = []
    for (const entry of entries.sort((left, right) => nameCollator.compare(left.name, right.name))) {
      if (entry.name.startsWith('.')) continue
      const relativePath = relativeDirectory ? path.join(relativeDirectory, entry.name) : entry.name
      const absolutePath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        if (!this.ignoredDirectories.has(entry.name)) files.push(...(await this.collectFiles(absolutePath, relativePath)))
        continue
      }
      if (entry.isFile() && isSupportedFile(entry.name)) files.push(await this.describeLocalFile(absolutePath, relativePath))
    }
    return files
  }

  private async describeLocalFile(absolutePath: string, relativePath: string): Promise<LibraryFile> {
    const parts = splitPath(relativePath)
    const stats = await fs.stat(absolutePath)
    const isMarkdown = previewKindForExtension(parts.extension) === 'markdown'
    const title = isMarkdown
      ? titleFromMarkdown(await fs.readFile(absolutePath, 'utf8'), parts.name)
      : stripExtension(parts.name, parts.extension)
    return toLibraryFile(parts, {
      title,
      mimeType: mimeTypeForExtension(parts.extension),
      size: stats.size,
      modifiedAt: stats.mtime.toISOString(),
    })
  }
}
