import type { RequestHandler } from 'express'
import { isPublicLibraryPath } from '../auth/file-policy.js'

const FILE_ROUTES = new Set(['/content', '/asset', '/file'])

/** Hidden, ignored and absolute paths answer 404 before any handler can touch the disk. */
export function libraryPathFilter(ignored: ReadonlySet<string>): RequestHandler {
  return (request, response, next) => {
    const requested = request.query.path
    if (FILE_ROUTES.has(request.path) && typeof requested === 'string' && !isPublicLibraryPath(requested, ignored)) {
      response.status(404).json({ message: 'That library file could not be found.' })
      return
    }
    next()
  }
}
