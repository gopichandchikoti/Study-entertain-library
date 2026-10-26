import { Router } from 'express'
import type { Services } from '../@types/services.js'
import { ebooksController } from '../controllers/ebooks.js'
import { createRateLimiter } from '../middlewares/rate-limit.js'

const MINUTE_MS = 60_000
const EBOOKS_PER_MINUTE = 20

/** `POST /api/ebooks`: bundle Markdown and text notes into an EPUB under `Ebooks/`. */
export function ebooksRoutes(services: Services): Router {
  const controller = ebooksController(services)
  const router = Router()
  router.post('/ebooks', createRateLimiter({ windowMs: MINUTE_MS, limit: EBOOKS_PER_MINUTE }), controller.create)
  return router
}
