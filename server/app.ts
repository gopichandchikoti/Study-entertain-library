import express, { type Express } from 'express'
import type { Services } from './@types/services.js'
import { createAuthSystem } from './auth/routes.js'
import type { ServerConfig } from './config/index.js'
import { accessController } from './controllers/access.js'
import { createPracticeRouter } from './learning/routes.js'
import { createMarkdownRouter } from './markdown/routes.js'
import { responseCompression } from './middlewares/compression.js'
import { libraryPathFilter } from './middlewares/library-path-filter.js'
import { ownerCsrfGuard, ownerSessionGuard } from './middlewares/owner-access.js'
import { createRateLimiter, skipSafeMethods } from './middlewares/rate-limit.js'
import { errorHandler, requestId } from './middlewares/request-context.js'
import { requireHttps, securityHeaders } from './middlewares/security-headers.js'
import { staticAssets } from './middlewares/static-assets.js'
import { configureTrustProxy } from './middlewares/trust-proxy.js'
import { openPersonalCatalog } from './personal-db.js'
import { ebooksRoutes } from './routes/ebooks.js'
import { mountEntertainment } from './routes/entertainment.js'
import { libraryRoutes } from './routes/library.js'
import { mediaRoutes } from './routes/media.js'
import { uploadsRoutes } from './routes/uploads.js'
import { UploadClassifier } from './services/classification.js'
import { EbookService } from './services/ebooks.js'
import { LibraryService } from './services/library.js'
import { MediaFileService } from './services/media-files.js'
import { OwnerSession } from './services/owner-session.js'
import { RemoteStorage } from './services/remote-storage.js'
import { UploadService } from './services/uploads.js'

const MINUTE_MS = 60_000
/** A flood guard, not a quota: a page of artwork plus several range requests stays far below it. */
const API_REQUESTS_PER_MINUTE = 2000
/** Saving a note, a playlist or a playback position: far above what one person does by hand, far below a script. */
const WRITES_PER_MINUTE = 240

export type RunningApp = { app: Express; close: () => void }

const createServices = (config: ServerConfig): { services: Services; closeCatalog: () => void } => {
  const remote = config.remote ? new RemoteStorage(config.remote) : null
  const catalog = remote ? null : openPersonalCatalog(config.personalDatabasePath)
  const library = new LibraryService(config, remote, catalog)
  const classifier = new UploadClassifier(config.ai, library)
  const services: Services = {
    config,
    remote,
    library,
    mediaFiles: new MediaFileService(config, library.ignoredDirectories, catalog),
    uploads: new UploadService(config, library, remote, classifier),
    ebooks: new EbookService(config, library, remote),
    ownerSession: new OwnerSession(config),
    accounts: config.accountsEnabled ? createAuthSystem(config.accounts, config.personalDatabasePath) : null,
  }
  return { services, closeCatalog: () => catalog?.close() }
}

/** Builds the Express application: hardening first, then sign-in, then the API routes, then the built client. */
export async function createApp(config: ServerConfig): Promise<RunningApp> {
  const { services, closeCatalog } = createServices(config)
  const { accounts, library, ownerSession } = services
  const access = accessController(services)
  if (config.media.refusal) process.stderr.write(`Watch is disabled: ${config.media.refusal}\n`)

  const app = express()
  app.disable('x-powered-by')
  app.use(requestId)
  app.use(securityHeaders(config))
  configureTrustProxy(app, config.trustProxy)
  app.use(requireHttps(config))
  app.use(responseCompression)
  app.use(
    '/api',
    createRateLimiter({ windowMs: MINUTE_MS, limit: API_REQUESTS_PER_MINUTE, skip: (request) => request.path === '/health' }),
  )
  app.use(express.json({ limit: '1mb' }))

  if (accounts) {
    app.use('/api/auth', accounts.publicRouter)
  } else {
    app.get('/api/auth/config', access.ownerConfig)
    app.use('/api', ownerCsrfGuard(config))
  }
  app.get('/api/health', access.health)
  app.get('/api/auth/session', access.session)
  app.post('/api/auth/login', access.login)
  app.post('/api/auth/logout', access.logout)

  if (accounts) {
    app.use('/api', (request, response, next) => {
      if (request.path === '/health') {
        next()
        return
      }
      response.setHeader('Cache-Control', 'no-store')
      accounts.guard(request, response, next)
    })
    app.use('/api', accounts.protectedRouter)
    app.use(
      '/api/markdown',
      createRateLimiter({ windowMs: MINUTE_MS, limit: WRITES_PER_MINUTE, skip: skipSafeMethods }),
      createMarkdownRouter(accounts.repository),
    )
  }
  app.use('/api', ownerSessionGuard(config, ownerSession))
  app.use('/api', libraryPathFilter(library.ignoredDirectories))
  app.use('/api/practice', await createPracticeRouter({ production: config.production, webOrigin: config.webOrigin }))
  await mountEntertainment(app, services)
  app.use('/api', libraryRoutes(services), mediaRoutes(services), uploadsRoutes(services), ebooksRoutes(services))
  app.use('/api', (_request, response) => {
    response.status(404).json({ code: 'NOT_FOUND', message: 'That API route is unavailable.' })
  })

  app.use(staticAssets(config.staticDirectory))
  app.use(errorHandler)
  return {
    app,
    close: () => {
      closeCatalog()
      accounts?.close()
    },
  }
}
