import type { createAuthSystem } from '../auth/routes.js'
import type { ServerConfig } from '../config/index.js'
import type { EbookService } from '../services/ebooks.js'
import type { LibraryService } from '../services/library.js'
import type { MediaFileService } from '../services/media-files.js'
import type { OwnerSession } from '../services/owner-session.js'
import type { RemoteStorage } from '../services/remote-storage.js'
import type { UploadService } from '../services/uploads.js'

export type AccountSystem = ReturnType<typeof createAuthSystem>

/** Everything the controllers need, built once at start-up and passed in so tests can substitute any part. */
export type Services = {
  config: ServerConfig
  remote: RemoteStorage | null
  library: LibraryService
  mediaFiles: MediaFileService
  uploads: UploadService
  ebooks: EbookService
  ownerSession: OwnerSession
  accounts: AccountSystem | null
}
