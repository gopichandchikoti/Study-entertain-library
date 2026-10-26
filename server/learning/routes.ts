import { createHash } from 'node:crypto'
import { Router } from 'express'
import { loadChallengeRegistry } from './challenges.js'
import { PracticeService } from './runner.js'
import { PracticeError } from './schemas.js'
import { runnerCapabilities } from './sandbox.js'
export type PracticeRouterOptions = {
  /** Production refuses the local development origins. */
  production: boolean
  /** The separate web origin allowed to post runs, or null for same-origin only. */
  webOrigin: string | null
}
export async function createPracticeRouter({ production, webOrigin }: PracticeRouterOptions): Promise<Router> {
  const router = Router(),
    service = new PracticeService(await loadChallengeRegistry())
  // Account identity comes only from the preceding server session guard. Owner mode uses its legacy session + IP.
  router.use((request, response, next) => {
    response.setHeader('Cache-Control', 'no-store')
    if (request.method === 'POST' && request.headers.origin) {
      try {
        const origin = new URL(request.headers.origin)
        const trustedLocal = !production && ['http://localhost:4444', 'http://127.0.0.1:4444'].includes(origin.origin)
        const trustedWeb = webOrigin !== null && origin.origin === webOrigin
        if (origin.host !== request.headers.host && !trustedLocal && !trustedWeb) {
          response.status(403).json({ code: 'ORIGIN_REJECTED', message: 'Use the same-origin Study Library page.' })
          return
        }
      } catch {
        response.status(403).json({ code: 'ORIGIN_REJECTED', message: 'The request origin is invalid.' })
        return
      }
    }
    response.locals.practiceOwner = createHash('sha256')
      .update(
        typeof response.locals.authUserId === 'string'
          ? 'account:' + response.locals.authUserId
          : (request.ip ?? '') + ':' + (request.headers.cookie ?? ''),
      )
      .digest('hex')
    next()
  })
  router.get('/capabilities', (_request, response) => response.json(runnerCapabilities))
  router.post('/runs', (request, response, next) => {
    try {
      response.status(202).json(service.start(response.locals.practiceOwner as string, request.body))
    } catch (error) {
      next(error)
    }
  })
  router.get('/runs/:runId', (request, response, next) => {
    try {
      response.json(service.get(response.locals.practiceOwner as string, String(request.params.runId)))
    } catch (error) {
      next(error)
    }
  })
  router.post('/runs/:runId/cancel', (request, response, next) => {
    try {
      response.json(service.cancel(response.locals.practiceOwner as string, String(request.params.runId)))
    } catch (error) {
      next(error)
    }
  })
  router.use(
    (
      error: unknown,
      _request: import('express').Request,
      response: import('express').Response,
      _next: import('express').NextFunction,
    ) => {
      if (error instanceof PracticeError) response.status(error.status).json({ code: error.code, message: error.message })
      else response.status(500).json({ code: 'RUN_FAILED', message: 'The practice service could not complete this request.' })
    },
  )
  return router
}
