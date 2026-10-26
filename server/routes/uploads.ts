import { Router } from 'express'
import type { Services } from '../@types/services.js'
import { uploadsController } from '../controllers/uploads.js'
import { createRateLimiter } from '../middlewares/rate-limit.js'
import { uploadSingleFile } from '../middlewares/upload-file.js'

const MINUTE_MS = 60_000
const UPLOADS_PER_MINUTE = 30

/** The staged upload workflow: stage a file, then commit it to a category or discard it. */
export function uploadsRoutes(services: Services): Router {
  const controller = uploadsController(services)
  const router = Router()
  const limit = createRateLimiter({ windowMs: MINUTE_MS, limit: UPLOADS_PER_MINUTE })
  router.post('/uploads', limit, controller.checkQuota, uploadSingleFile(services.config), controller.create)
  router.post('/uploads/:id/commit', limit, controller.commit)
  router.delete('/uploads/:id', limit, controller.discard)
  return router
}
