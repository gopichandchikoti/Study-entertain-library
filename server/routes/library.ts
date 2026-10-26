import { Router } from 'express'
import type { Services } from '../@types/services.js'
import { libraryController } from '../controllers/library.js'
import { createRateLimiter } from '../middlewares/rate-limit.js'

const MINUTE_MS = 60_000
/** Building the inventory walks the whole content tree, so it is limited more tightly than ordinary reads. */
const INVENTORY_LIMIT_PER_MINUTE = 120

/** `GET /api/library`, `/api/content`, `/api/asset` and `/api/file`: the Study document routes. */
export function libraryRoutes(services: Services): Router {
  const controller = libraryController(services)
  const router = Router()
  router.get('/library', createRateLimiter({ windowMs: MINUTE_MS, limit: INVENTORY_LIMIT_PER_MINUTE }), controller.inventory)
  router.get('/content', controller.content)
  router.get('/asset', controller.asset)
  router.get('/file', controller.file)
  return router
}
