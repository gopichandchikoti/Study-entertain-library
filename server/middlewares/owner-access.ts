import type { RequestHandler } from 'express'
import type { ServerConfig } from '../config/index.js'
import type { OwnerSession } from '../services/owner-session.js'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const OPEN_PATHS = new Set(['/health', '/auth/session', '/auth/login', '/auth/logout'])

/** Owner mode has no per-session CSRF token, so writes must come from the configured origin with the app's own header. */
export function ownerCsrfGuard(config: ServerConfig): RequestHandler {
  return (request, response, next) => {
    const fromApp = request.get('origin') === config.accounts.origin && request.get('x-requested-with') === 'StudyLibrary'
    if (!SAFE_METHODS.has(request.method) && !fromApp) {
      response.status(403).json({ code: 'AUTH_CSRF_REJECTED', message: 'Use the same-origin library page.' })
      return
    }
    next()
  }
}

/** In owner mode every library route needs the signed owner cookie; account mode has its own guard. */
export function ownerSessionGuard(config: ServerConfig, session: OwnerSession): RequestHandler {
  return (request, response, next) => {
    if (config.accountsEnabled || !config.access.enabled || OPEN_PATHS.has(request.path) || session.isValid(request)) {
      next()
      return
    }
    response.status(401).json({ code: 'AUTH_REQUIRED', message: 'Sign in to access this study library.' })
  }
}
