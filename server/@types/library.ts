import type { Stats } from 'node:fs'

export type FileKind = 'document' | 'image'
export type PreviewKind = 'markdown' | 'image' | 'pdf' | 'text' | 'epub' | 'download'
export type ClassificationSource = 'ai' | 'rules'
export type MediaKind = 'video' | 'audio'

export type MediaQuality = {
  label: string
  path: string
  mimeType: string
}

export type SubtitleTrack = {
  label: string
  language: string
  path: string
}

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

export type LibraryInventory = {
  root: string
  generatedAt: string
  stats: { documents: number; images: number; folders: number; categories: number }
  categories: CategorySummary[]
  folders: FolderNode[]
  files: LibraryFile[]
}

export type UploadClassification = {
  category: string
  suggestedFileName: string
  summary: string
  tags: string[]
  confidence: number
  source: ClassificationSource
}

export type UploadRecord = {
  ownerId?: string
  id: string
  originalName: string
  storedName: string
  extension: string
  mimeType: string
  size: number
  uploadedAt: string
  classification: UploadClassification
}

export type LyricLine = {
  time: number
  text: string
}

export type MediaFile = {
  path: string
  name: string
  title: string
  kind: MediaKind
  extension: string
  mimeType: string
  size: number
  modifiedAt: string
  lyrics: LyricLine[]
  qualities: MediaQuality[]
  subtitles: SubtitleTrack[]
}

export type RemoteObjectEntry = {
  name: string
  id?: string | null
  updated_at?: string | null
  metadata?: {
    size?: number | string
    mimetype?: string
  } | null
}

export type RemoteObject = {
  path: string
  size: number
  modifiedAt: string
  mimeType: string
}

export type SafeFile = {
  absolutePath: string
  stats: Stats
}
