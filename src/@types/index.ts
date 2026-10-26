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

export type ContentResponse = {
  path: string
  content: string
  modifiedAt: string
}

export type UploadClassification = {
  category: string
  suggestedFileName: string
  summary: string
  tags: string[]
  confidence: number
  source: 'ai' | 'rules'
}

export type UploadResponse = {
  upload: {
    id: string
    originalName: string
    extension: string
    mimeType: string
    previewKind: PreviewKind
    size: number
    uploadedAt: string
    classification: UploadClassification
    previewText: string
  }
}

export type UploadCommitResponse = {
  path: string
  file: LibraryFile | null
}

export type EbookResponse = {
  path: string
  fileName: string
  file: LibraryFile | null
}

export type AuthSessionResponse = import('../features/auth/authTypes').AccountSession

export type MarkdownSummary = {
  id: string
  name: string
  size: number
  createdAt: string
  updatedAt: string
}

export type MarkdownDocument = {
  id: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
}

export type MarkdownLimits = {
  maxDocuments: number
  maxNameLength: number
  maxContentLength: number
}

export type MarkdownListResponse = {
  documents: MarkdownSummary[]
  limits: MarkdownLimits
}

export type AppMode = 'study' | 'watch' | 'music' | 'markdown'
export type ReadingView = 'all' | 'bookmarked' | 'completed'
export type Theme = 'light' | 'dark'
export type ReadingScale = 'standard' | 'large'

export type { LessonQuiz, LessonProgress, PracticalChallenge, PracticeRun, QuizScore } from '../features/learning/learningTypes'
