import { createHash, randomUUID, timingSafeEqual } from 'node:crypto'
import path from 'node:path'
import { pipeline, Readable } from 'node:stream'
import express, { type Express, type Request, type RequestHandler } from 'express'
import multer from 'multer'
import type { ApiConfig } from './config.js'
import { createEpub, EbookError } from './ebooks.js'
import { extensionOf, isActiveDocument, mimeTypeForExtension, previewKindForExtension, supportedExtensions } from './files.js'
import type { Catalog, Storage, UploadJob } from './gateways.js'
import { createLibrary, isInlineFile } from './library.js'
import { createRateLimiter, LoginThrottle } from './rate-limit.js'
import { cors, createErrorHandler, csrfGuard, HttpProblem, requestId, requireHttps, securityHeaders, sendProblem } from './security.js'
import { Sessions } from './session.js'
import { matchesDeclaredType, SIGNATURE_BYTES } from './signatures.js'
import { syncCatalog } from './sync.js'
import type { LibraryFile } from './types.js'
import { createClassifier, isSafeSegment, normalizeFileName, UNSORTED_CATEGORY } from './uploads.js'

const MINUTE_MS = 60_000
/** A flood guard, not a quota: a page of artwork plus several range requests stays far below it. */
const API_REQUESTS_PER_MINUTE = 600
const UPLOADS_PER_MINUTE = 20
const EBOOKS_PER_MINUTE = 10
const SYNCS_PER_MINUTE = 6
/** Uploads are held in memory while they are checked, so only a few may be in flight at once. */
const CONCURRENT_UPLOADS = 2
const MAX_STAGED_UPLOADS = 25
const STAGED_TTL_MS = 24 * 60 * 60 * 1000
const STALE_SWEEP_BATCH = 25
const MAX_INLINE_BYTES = 5 * 1024 * 1024
const MAX_QUERY_LENGTH = 200
const MAX_PATH_LENGTH = 1024
const MAX_EBOOK_FILES = 30
const MAX_TITLE_LENGTH = 200
const MAX_ORIGINAL_NAME = 255
const JSON_BODY_LIMIT = '64kb'
const PREVIEW_RESPONSE_LIMIT = 2400
const STAGING_PREFIX = '.study-library-inbox'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const SINGLE_RANGE = /^bytes=\d*-\d*$/
const PUBLIC_PATHS: ReadonlySet<string> = new Set(['/health', '/auth/session', '/auth/login', '/auth/logout', '/catalog/sync'])
const FORWARDED_HEADERS = ['content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']

export type ApiDependencies = { storage: Storage; catalog: Catalog; now?: () => number }

const queryText = (value: unknown, maxLength = MAX_QUERY_LENGTH): string | undefined => {
  if (value === undefined) return undefined
  if (typeof value !== 'string' || value.length > maxLength) throw new HttpProblem(400, 'REQUEST_INVALID', 'A search or path value is invalid.')
  return value
}

const wholeNumber = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'string' ? Number(value) : Number.NaN
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

const bodyOf = (request: Request): Record<string, unknown> => {
  const body: unknown = request.body
  return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {}
}

const digest = (value: string): Buffer => createHash('sha256').update(value).digest()

/** The policy a file is served under: active documents are sandboxed; everything else may be framed only by the web origin. */
const filePolicy = (extension: string, webOrigin: string): string =>
  isActiveDocument(extension)
    ? "sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'"
    : `base-uri 'none'; form-action 'none'; frame-ancestors ${webOrigin}`

/** Builds the API: hardening first, then sign-in, then the library, upload and ebook routes. It does not listen. */
export function createApp(config: ApiConfig, { storage, catalog, now = Date.now }: ApiDependencies): Express {
  const app = express()
  const sessions = new Sessions(config, now)
  const throttle = new LoginThrottle(undefined, undefined, undefined, now)
  const library = createLibrary(catalog)
  const classify = createClassifier(library)

  app.disable('x-powered-by')
  app.set('trust proxy', config.trustProxyHops)
  app.use(requestId)
  app.use(securityHeaders(config))
  app.use(cors(config))
  app.use(requireHttps(config))
  app.use('/api', (_request, response, next) => {
    // Answers are private to the signed-in person; the file routes below replace this with a short private cache.
    response.setHeader('Cache-Control', 'no-store')
    next()
  })
  app.use('/api', createRateLimiter({ windowMs: MINUTE_MS, limit: API_REQUESTS_PER_MINUTE, skip: (request) => request.path === '/health', now }))
  app.use(csrfGuard(config))
  app.use(express.json({ limit: JSON_BODY_LIMIT }))

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true, service: 'study-library-api', authRequired: sessions.required })
  })
  app.get('/api/auth/session', (request, response) => {
    response.json({ authenticated: sessions.isValid(request), required: sessions.required })
  })
  app.post('/api/auth/login', (request, response) => {
    if (!sessions.required) {
      response.json({ authenticated: true, required: false })
      return
    }
    const key = request.ip ?? request.socket.remoteAddress ?? 'unknown'
    if (!throttle.allow(key)) {
      response.setHeader('Retry-After', String(throttle.retryAfterSeconds(key)))
      sendProblem(response, 429, 'LOGIN_RATE_LIMITED', 'Too many sign-in attempts. Try again later.')
      return
    }
    const password = bodyOf(request).password
    if (typeof password !== 'string' || !sessions.passwordMatches(password)) {
      sendProblem(response, 401, 'AUTH_INVALID_CREDENTIALS', 'The access password is incorrect.')
      return
    }
    throttle.reset(key)
    response.setHeader('Set-Cookie', sessions.createCookie())
    response.json({ authenticated: true, required: true })
  })
  app.post('/api/auth/logout', (_request, response) => {
    response.setHeader('Set-Cookie', sessions.clearCookie())
    response.json({ authenticated: false, required: sessions.required })
  })

  app.post('/api/catalog/sync', createRateLimiter({ windowMs: MINUTE_MS, limit: SYNCS_PER_MINUTE, now }), async (request, response) => {
    if (!config.catalogSyncToken) throw new HttpProblem(503, 'SYNC_UNAVAILABLE', 'Catalog sync is not configured for this service.')
    const supplied = request.get('x-catalog-sync-token') ?? ''
    if (!timingSafeEqual(digest(supplied), digest(config.catalogSyncToken))) {
      throw new HttpProblem(401, 'SYNC_TOKEN_INVALID', 'The catalog sync token is not correct.')
    }
    response.json(await syncCatalog(catalog, storage))
  })

  app.use('/api', (request, response, next) => {
    if (PUBLIC_PATHS.has(request.path) || sessions.isValid(request)) {
      next()
      return
    }
    sendProblem(response, 401, 'AUTH_REQUIRED', 'Sign in to access this study library.')
  })

  app.get('/api/library', async (request, response) => {
    response.json(
      await library.getLibrary({
        search: queryText(request.query.q),
        category: queryText(request.query.category),
        limit: wholeNumber(request.query.limit, 10_000),
        offset: wholeNumber(request.query.offset, 0),
      }),
    )
  })

  /** The catalog entry a `path` query names, or null. Hidden folders (the upload inbox) and anything unindexed are never found. */
  const catalogFile = async (request: Request): Promise<LibraryFile | null> => {
    const requested = queryText(request.query.path, MAX_PATH_LENGTH)
    const normalized = requested ? path.posix.normalize(requested.replace(/\\/g, '/')) : ''
    const unsafe =
      !normalized || normalized.startsWith('/') || normalized.includes('\0') || normalized.split('/').some((part) => part === '..' || part.startsWith('.'))
    return unsafe ? null : library.getCatalogFile(normalized)
  }

  /** Streams an object with the type its extension implies. What was stored with the object, or claimed by an uploader, is ignored. */
  const sendObject = async (request: Request, response: express.Response, file: LibraryFile): Promise<boolean> => {
    const range = request.get('range')
    const upstream = await storage.request(file.path, { headers: range && SINGLE_RANGE.test(range) ? { range } : {} })
    if (upstream.status === 404) return false
    if (!upstream.ok) throw new Error(`Storage request failed with status ${upstream.status}.`)
    response.status(upstream.status)
    response.setHeader('Content-Type', mimeTypeForExtension(file.extension))
    response.setHeader('Content-Security-Policy', filePolicy(file.extension, config.webOrigin))
    response.setHeader('Cache-Control', 'private, max-age=300')
    for (const name of FORWARDED_HEADERS) {
      const value = upstream.headers.get(name)
      if (value) response.setHeader(name, value)
    }
    if (!upstream.body) {
      response.end()
      return true
    }
    pipeline(Readable.fromWeb(upstream.body as unknown as Parameters<typeof Readable.fromWeb>[0]), response, () => undefined)
    return true
  }

  app.get('/api/content', async (request, response) => {
    const file = await catalogFile(request)
    if (!file || !isInlineFile(file)) throw new HttpProblem(404, 'NOT_FOUND', 'That study note could not be found.')
    if (file.size > MAX_INLINE_BYTES) throw new HttpProblem(413, 'FILE_TOO_LARGE', 'That note is too large to open here. Download it instead.')
    const upstream = await storage.request(file.path)
    if (!upstream.ok) throw new HttpProblem(404, 'NOT_FOUND', 'That study note could not be found.')
    response.json({ path: file.path, content: await upstream.text(), modifiedAt: file.modifiedAt })
  })

  app.get('/api/asset', async (request, response) => {
    const file = await catalogFile(request)
    if (!file || file.previewKind !== 'image' || !(await sendObject(request, response, file))) {
      throw new HttpProblem(404, 'NOT_FOUND', 'That visual could not be found.')
    }
  })

  app.get('/api/file', async (request, response) => {
    const file = await catalogFile(request)
    if (!file || !(await sendObject(request, response, file))) throw new HttpProblem(404, 'NOT_FOUND', 'That study file could not be found.')
  })

  // --- uploads: stage, review, commit or discard ---------------------------------------------------------------------------------

  const isStale = (job: UploadJob): boolean => now() - Date.parse(job.created_at) > STAGED_TTL_MS

  /** Staged uploads nobody approved within a day are deleted, so the inbox cannot fill the bucket. */
  const sweepStale = async (): Promise<void> => {
    for (const job of await catalog.listStaleUploads(new Date(now() - STAGED_TTL_MS).toISOString(), STALE_SWEEP_BATCH)) {
      await storage.remove(job.storage_path).catch(() => undefined)
      await catalog.updateUploadJob(job.id, { status: 'discarded' })
    }
  }

  let activeUploads = 0
  const limitConcurrentUploads: RequestHandler = (_request, response, next) => {
    if (activeUploads >= CONCURRENT_UPLOADS) {
      response.setHeader('Retry-After', '5')
      sendProblem(response, 429, 'UPLOAD_BUSY', 'Other uploads are being processed. Try again in a moment.')
      return
    }
    activeUploads += 1
    response.once('close', () => {
      activeUploads -= 1
    })
    next()
  }

  const checkQuota: RequestHandler = async (_request, _response, next) => {
    await sweepStale()
    if ((await catalog.countStagedUploads()) >= MAX_STAGED_UPLOADS) {
      throw new HttpProblem(409, 'UPLOAD_QUOTA', `${MAX_STAGED_UPLOADS} uploads are waiting for review. Add or discard some, then try again.`)
    }
    next()
  }

  const receiveFile = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: config.maxUploadBytes, files: 1, fields: 10, fieldSize: 10_000 },
    fileFilter: (_request, file, callback) => {
      if (supportedExtensions.has(extensionOf(file.originalname))) callback(null, true)
      else callback(new HttpProblem(400, 'UPLOAD_TYPE_UNSUPPORTED', 'That file type is not supported.'))
    },
  }).single('file')

  const acceptFile: RequestHandler = (request, response, next) => {
    receiveFile(request, response, (error: unknown) => {
      if (!error) {
        next()
        return
      }
      if (error instanceof HttpProblem) next(error)
      else if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        next(new HttpProblem(413, 'UPLOAD_TOO_LARGE', 'The file is larger than the upload limit.'))
      } else next(new HttpProblem(400, 'UPLOAD_INVALID', 'The upload could not be accepted. Send one file in the "file" field.'))
    })
  }

  const uploadLimiter = createRateLimiter({ windowMs: MINUTE_MS, limit: UPLOADS_PER_MINUTE, now })

  app.post('/api/uploads', uploadLimiter, limitConcurrentUploads, checkQuota, acceptFile, async (request, response) => {
    const file = request.file
    if (!file) throw new HttpProblem(400, 'UPLOAD_MISSING', 'Choose a textbook, note, image, or supported study file first.')
    const extension = extensionOf(file.originalname)
    if (!matchesDeclaredType(extension, file.buffer.subarray(0, SIGNATURE_BYTES))) {
      throw new HttpProblem(400, 'UPLOAD_CONTENT_MISMATCH', 'The file contents do not match its extension, so it was not accepted.')
    }
    const id = randomUUID()
    const stagedPath = `${STAGING_PREFIX}/${id}${extension}`
    // Served and stored by what the extension says, never by the content type the uploader's browser claimed.
    const mimeType = mimeTypeForExtension(extension)
    const originalName = file.originalname.slice(0, MAX_ORIGINAL_NAME)
    try {
      const { classification, previewText } = await classify(originalName, file.buffer, extension)
      await storage.upload(stagedPath, file.buffer, mimeType)
      await catalog.createUploadJob({
        id,
        storage_path: stagedPath,
        original_name: originalName,
        classification: { ...classification, extension, mimeType, size: file.size, previewText: previewText.slice(0, PREVIEW_RESPONSE_LIMIT) },
      })
      response.status(201).json({
        upload: {
          id,
          originalName,
          extension,
          mimeType,
          previewKind: previewKindForExtension(extension),
          size: file.size,
          uploadedAt: new Date(now()).toISOString(),
          classification,
          previewText: previewText.slice(0, PREVIEW_RESPONSE_LIMIT),
        },
      })
    } catch (error) {
      await storage.remove(stagedPath).catch(() => undefined)
      throw error
    }
  })

  const stagedJob = async (id: string): Promise<UploadJob | null> => {
    const job = UUID.test(id) ? await catalog.findUploadJob(id) : null
    return job && job.status === 'staged' && !isStale(job) ? job : null
  }

  app.post('/api/uploads/:id/commit', uploadLimiter, async (request, response) => {
    const job = await stagedJob(String(request.params.id))
    if (!job) throw new HttpProblem(404, 'NOT_FOUND', 'That staged upload is no longer available.')
    // The extension comes from the key this server chose when it staged the file, not from anything stored in the row's JSON.
    const extension = extensionOf(job.storage_path)
    const stored = job.classification && typeof job.classification === 'object' && !Array.isArray(job.classification) ? job.classification : {}
    const suggestion = typeof stored.suggestedFileName === 'string' ? stored.suggestedFileName : normalizeFileName(job.original_name, `untitled${extension}`, extension)
    const body = bodyOf(request)
    const category = typeof body.category === 'string' && body.category.trim() ? body.category.trim() : UNSORTED_CATEGORY
    const requestedName = typeof body.fileName === 'string' && body.fileName.trim() ? body.fileName.trim() : suggestion
    if (!isSafeSegment(category) || !isSafeSegment(requestedName)) {
      throw new HttpProblem(400, 'DESTINATION_INVALID', 'Choose a safe folder and filename without path separators or traversal segments.')
    }
    const requestedExtension = extensionOf(requestedName)
    if (requestedExtension && requestedExtension !== extension) {
      throw new HttpProblem(400, 'EXTENSION_MISMATCH', `The filename must keep the ${extension} extension.`)
    }
    const stem = requestedExtension ? requestedName.slice(0, -requestedExtension.length) : requestedName
    const destination = await storage.uniqueDestination(path.posix.join(category, `${stem}${extension}`))
    await storage.move(job.storage_path, destination)
    await catalog.updateUploadJob(job.id, { status: 'committed', committed_at: new Date(now()).toISOString() })
    await syncCatalog(catalog, storage)
    response.status(201).json({ path: destination, file: await library.getCatalogFile(destination) })
  })

  app.delete('/api/uploads/:id', uploadLimiter, async (request, response) => {
    const id = String(request.params.id)
    const job = UUID.test(id) ? await catalog.findUploadJob(id) : null
    if (job?.status === 'staged') {
      await storage.remove(job.storage_path)
      await catalog.updateUploadJob(job.id, { status: 'discarded' })
    }
    response.status(204).end()
  })

  // --- ebooks --------------------------------------------------------------------------------------------------------------------

  app.post('/api/ebooks', createRateLimiter({ windowMs: MINUTE_MS, limit: EBOOKS_PER_MINUTE, now }), async (request, response) => {
    const body = bodyOf(request)
    const requested = Array.isArray(body.paths)
      ? body.paths.filter((value): value is string => typeof value === 'string' && value.length <= MAX_PATH_LENGTH)
      : typeof body.path === 'string'
        ? [body.path]
        : []
    const relativePaths = [...new Set(requested)].slice(0, MAX_EBOOK_FILES)
    if (relativePaths.length === 0) {
      throw new HttpProblem(400, 'EBOOK_INVALID', 'Choose at least one Markdown or text file to create an ebook.')
    }
    const title = typeof body.title === 'string' ? body.title.slice(0, MAX_TITLE_LENGTH) : ''
    const result = await createEpub(catalog, storage, relativePaths, title).catch((error: unknown) => {
      throw error instanceof EbookError ? new HttpProblem(400, 'EBOOK_INVALID', error.message) : error
    })
    const destination = await storage.uniqueDestination(result.path)
    await storage.upload(destination, result.archive, 'application/epub+zip')
    await syncCatalog(catalog, storage)
    response.status(201).json({ path: destination, fileName: path.posix.basename(destination), file: await library.getCatalogFile(destination) })
  })

  app.use((_request, response) => {
    sendProblem(response, 404, 'NOT_FOUND', 'That route is unavailable.')
  })
  app.use(createErrorHandler([config.supabaseServiceRoleKey, config.accessPassword, config.sessionSecret, config.catalogSyncToken]))
  return app
}
