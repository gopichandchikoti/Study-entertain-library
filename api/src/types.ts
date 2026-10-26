export type FileKind = 'document' | 'image'
export type PreviewKind = 'markdown' | 'image' | 'pdf' | 'text' | 'epub' | 'download'

export type LibraryFile = {
  path: string
  name: string
  kind: FileKind
  category: string
  categoryPath: string
  folderPath: string
  extension: string
  title: string
  previewKind: PreviewKind
  mimeType: string
  size: number
  modifiedAt: string
}

export type FolderNode = {
  name: string
  path: string
  documents: LibraryFile[]
  images: LibraryFile[]
  children: FolderNode[]
}

export type CategorySummary = {
  name: string
  path: string
  documents: number
  images: number
  folders: number
}

export type LibraryResponse = {
  root: string
  generatedAt: string
  stats: {
    documents: number
    images: number
    folders: number
    categories: number
  }
  categories: CategorySummary[]
  folders: FolderNode[]
  files: LibraryFile[]
}

export type CatalogSyncResult = {
  scanned: number
  indexed: number
  skipped: number
  generatedAt: string
}
