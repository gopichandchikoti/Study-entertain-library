import type { Express, Request, Response } from 'express'
import type { Services } from '../@types/services.js'
import { createRateLimiter, skipSafeMethods } from '../middlewares/rate-limit.js'
import { MusicLibrary } from '../music/library.js'
import { createMusicRouter } from '../music/routes.js'
import { MusicStore } from '../music/store.js'
import { findMediaTools } from '../watch/ffmpeg.js'
import { WatchLibrary } from '../watch/library.js'
import { WatchStore } from '../watch/progress.js'
import { createWatchRouter } from '../watch/routes.js'

const MINUTE_MS = 60_000
const WRITES_PER_MINUTE = 240

const unavailable = (code: string, message: string) => (_request: Request, response: Response) => {
  response.status(501).json({ code, message })
}

/**
 * Mounts Watch and Music. They read local media only: a media folder outside the allowed drive refuses every request,
 * and hosted Storage mode does not serve them yet.
 */
export async function mountEntertainment(app: Express, services: Services): Promise<void> {
  const { config, accounts } = services
  const { media } = config
  if (media.refusal) {
    const refuse = (_request: Request, response: Response): void => {
      response.status(403).json({ code: 'WATCH_DRIVE_NOT_ALLOWED', message: media.refusal })
    }
    app.use('/api/watch', refuse)
    app.use('/api/music', refuse)
    app.use('/api/media', refuse)
    return
  }
  if (config.remote) {
    app.use('/api/watch', unavailable('WATCH_UNAVAILABLE', 'Watch is not enabled in hosted Storage mode yet.'))
    app.use('/api/music', unavailable('MUSIC_UNAVAILABLE', 'Music is not enabled in hosted Storage mode yet.'))
    return
  }
  const watchLibrary = new WatchLibrary({
    mediaRoot: media.root,
    allowedDrive: media.allowedDrive,
    catalogDirectory: config.watch.catalogDirectory,
    ignored: services.library.ignoredDirectories,
    tools: await findMediaTools(config.appDirectory),
    maxStreams: config.watch.maxStreams,
    pregeneratePreviews: config.watch.pregeneratePreviews,
    encoder: config.watch.encoder,
  })
  watchLibrary
    .load()
    .then(() => watchLibrary.rescan())
    .catch((error: unknown) => {
      process.stderr.write(`Watch catalog could not start: ${error instanceof Error ? error.message : String(error)}\n`)
    })
  // Progress saves arrive every few seconds while playing, so the budget is generous; it only stops a runaway script.
  const writes = createRateLimiter({ windowMs: MINUTE_MS, limit: WRITES_PER_MINUTE, skip: skipSafeMethods })
  app.use(
    '/api/watch',
    writes,
    createWatchRouter({ library: watchLibrary, store: accounts ? new WatchStore(accounts.repository) : null }),
  )
  app.use(
    '/api/music',
    writes,
    createMusicRouter({ library: new MusicLibrary(watchLibrary), store: accounts ? new MusicStore(accounts.repository) : null }),
  )
}
