import type { RequestHandler } from 'express'
import type { Services } from '../@types/services.js'

/** Health probe and the shared-password ("owner") sign-in endpoints. Account mode answers `/api/auth/*` itself first. */
export function accessController({ config, ownerSession }: Services) {
  const required = config.access.enabled

  const health: RequestHandler = (_request, response) => {
    response.json({ ok: true, storage: config.storageMode, authRequired: required })
  }

  const session: RequestHandler = (request, response) => {
    response.json({ authenticated: ownerSession.isValid(request), required })
  }

  const login: RequestHandler = (request, response) => {
    if (!required) {
      response.json({ authenticated: true, required: false })
      return
    }
    if (!ownerSession.canAttempt(request)) {
      response.status(429).json({ message: 'Too many sign-in attempts. Try again later.' })
      return
    }
    const body = request.body as { password?: unknown } | undefined
    if (typeof body?.password !== 'string' || !ownerSession.isCorrectPassword(body.password)) {
      response.status(401).json({ message: 'The access password is incorrect.' })
      return
    }
    ownerSession.clearAttempts(request)
    response.setHeader('Set-Cookie', ownerSession.createCookie())
    response.json({ authenticated: true, required: true })
  }

  const logout: RequestHandler = (_request, response) => {
    response.setHeader('Set-Cookie', ownerSession.clearCookie())
    response.json({ authenticated: false, required })
  }

  const ownerConfig: RequestHandler = (_request, response) => {
    response.json({
      mode: 'owner',
      providers: [],
      development: !config.accounts.production,
      emailDelivery: false,
      signupEnabled: false,
    })
  }

  return { health, session, login, logout, ownerConfig }
}
