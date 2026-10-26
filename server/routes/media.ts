import { Router } from 'express'
import type { Services } from '../@types/services.js'
import { mediaController } from '../controllers/media.js'

/** `GET /api/media`, `/api/media/stream` and `/api/media/subtitle`: local media stays off the document routes. */
export function mediaRoutes(services: Services): Router {
  const controller = mediaController(services)
  const router = Router()
  router.get('/media', controller.list)
  router.get('/media/stream', controller.stream)
  router.get('/media/subtitle', controller.subtitle)
  return router
}
