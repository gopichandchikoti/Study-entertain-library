import { randomUUID } from 'node:crypto'
import type { ErrorRequestHandler, RequestHandler, Response } from 'express'
import type { ApiConfig } from './config.js'

const HSTS_MAX_AGE_SECONDS = 31_536_000
const PREFLIGHT_MAX_AGE_SECONDS = 600
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._-]{8,64}$/
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
/** The marker the web client adds to every write. A cross-site form cannot set it, and a cross-site script needs a preflight to. */
export const APP_MARKER = 'StudyLibrary'

export const ALLOWED_HEADERS = ['content-type', 'range', 'x-requested-with', 'x-csrf-token', 'x-catalog-sync-token']
const EXPOSED_HEADERS = ['content-range', 'accept-ranges', 'retry-after', 'x-request-id', 'ratelimit-limit', 'ratelimit-remaining', 'ratelimit-reset']

/** A refusal the caller may be told about as it is: it names no file, path or provider. */
export class HttpProblem extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
  }
}

/** The one error body every route uses: a stable code, a plain-language message and the request id for the server log. */
export const sendProblem = (response: Response, status: number, code: string, message: string): void => {
  response.status(status).json({ code, message, requestId: String(response.locals.requestId ?? '') })
}

/** Gives every request an id, echoed in `X-Request-Id` and in error bodies, so one failure can be traced in the log. */
export const requestId: RequestHandler = (request, response, next) => {
  const supplied = request.get('x-request-id')
  const id = supplied && REQUEST_ID_PATTERN.test(supplied) ? supplied : randomUUID()
  response.locals.requestId = id
  response.setHeader('X-Request-Id', id)
  next()
}

/**
 * Hardening headers for every response. The API returns JSON and file bytes, never pages, so the default policy blocks
 * everything; only the one web origin may frame a file (the PDF preview).
 */
export function securityHeaders(config: ApiConfig): RequestHandler {
  const policy = `default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors ${config.webOrigin}`
  return (_request, response, next) => {
    response.setHeader('Content-Security-Policy', policy)
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Referrer-Policy', 'no-referrer')
    response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()')
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    // The web client loads images from here, so other origins may embed responses; credentials still never go with them.
    response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    response.setHeader('X-Permitted-Cross-Domain-Policies', 'none')
    if (config.production) response.setHeader('Strict-Transport-Security', `max-age=${HSTS_MAX_AGE_SECONDS}`)
    next()
  }
}

/** In production every request except the health probe must arrive over HTTPS (the proxy tells us which). */
export function requireHttps(config: ApiConfig): RequestHandler {
  return (request, response, next) => {
    if (!config.production || request.secure || request.path === '/api/health') {
      next()
      return
    }
    sendProblem(response, 426, 'HTTPS_REQUIRED', 'Use the HTTPS address of this service.')
  }
}

/** Exactly one origin may call with credentials. Every other origin gets no CORS headers at all, so its browser refuses the reply. */
export function cors(config: ApiConfig): RequestHandler {
  return (request, response, next) => {
    response.vary('Origin')
    const allowed = request.get('origin') === config.webOrigin
    if (allowed) {
      response.setHeader('Access-Control-Allow-Origin', config.webOrigin)
      response.setHeader('Access-Control-Allow-Credentials', 'true')
      response.setHeader('Access-Control-Expose-Headers', EXPOSED_HEADERS.join(', '))
    }
    if (request.method !== 'OPTIONS') {
      next()
      return
    }
    if (!allowed) {
      sendProblem(response, 403, 'CORS_REJECTED', 'This origin may not use the API.')
      return
    }
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '))
    response.setHeader('Access-Control-Max-Age', String(PREFLIGHT_MAX_AGE_SECONDS))
    response.status(204).end()
  }
}

/**
 * A request that changes something must come from the web origin and carry the app marker. The session cookie can be
 * sent cross-site, so without this a hostile page could post a form (an upload) as the signed-in person.
 * The catalog-sync route is exempt: it uses a token and no cookie.
 */
export function csrfGuard(config: ApiConfig): RequestHandler {
  return (request, response, next) => {
    const exempt = request.path === '/api/catalog/sync'
    const fromApp = request.get('origin') === config.webOrigin && request.get('x-requested-with') === APP_MARKER
    if (SAFE_METHODS.has(request.method) || exempt || fromApp) {
      next()
      return
    }
    sendProblem(response, 403, 'CSRF_REJECTED', 'Use the Study Library web page.')
  }
}

const errorStatus = (error: unknown): number => {
  const status = error && typeof error === 'object' && 'status' in error ? Number(error.status) : 500
  return status === 413 || status === 400 ? status : 500
}

const MESSAGES: Readonly<Record<number, string>> = {
  400: 'The request body is invalid.',
  413: 'The request is too large.',
  500: 'The study library could not complete that request.',
}

/**
 * The last handler: a stable body with no stack, SQL, path or provider detail. The detail goes to the server log only,
 * and any configured secret that a provider's message happens to repeat is blanked out of it first.
 */
export function createErrorHandler(secrets: ReadonlyArray<string | undefined>): ErrorRequestHandler {
  const redact = (text: string): string => secrets.reduce<string>((clean, secret) => (secret ? clean.split(secret).join('[redacted]') : clean), text)
  return (error: unknown, request, response, _next) => {
    if (error instanceof HttpProblem) {
      sendProblem(response, error.status, error.code, error.message)
      return
    }
    const status = errorStatus(error)
    if (status === 500) {
      const detail = error instanceof Error ? { name: error.name, message: redact(error.message).slice(0, 300) } : {}
      process.stderr.write(
        `${JSON.stringify({ level: 'error', requestId: response.locals.requestId, method: request.method, path: request.path, ...detail })}\n`,
      )
    }
    if (response.headersSent) {
      response.end()
      return
    }
    sendProblem(response, status, status === 500 ? 'REQUEST_FAILED' : 'REQUEST_INVALID', MESSAGES[status])
  }
}
