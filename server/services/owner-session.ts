import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import type { Request } from 'express'
import type { ServerConfig } from '../config/index.js'

const COOKIE_NAME = 'study_library_session'
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_ATTEMPT_LIMIT = 10

type AttemptWindow = { count: number; resetAt: number }

/**
 * Shared-password ("owner") access used when AUTH_MODE=owner. Cookies are HMAC-signed, HttpOnly and SameSite=Lax,
 * password checks run in constant time, and failed sign-ins are rate limited per client address.
 */
export class OwnerSession {
  private readonly attempts = new Map<string, AttemptWindow>()

  constructor(private readonly config: ServerConfig) {}

  private sign(value: string): string {
    return createHmac('sha256', this.config.access.sessionSecret ?? '')
      .update(value)
      .digest('base64url')
  }

  private readCookie(request: Request): string | null {
    const cookies = request.headers.cookie?.split(';').map((cookie) => cookie.trim()) ?? []
    const cookie = cookies.find((candidate) => candidate.startsWith(`${COOKIE_NAME}=`))
    if (!cookie) return null
    try {
      return decodeURIComponent(cookie.slice(COOKIE_NAME.length + 1))
    } catch {
      return null
    }
  }

  isValid(request: Request): boolean {
    if (!this.config.access.enabled) return true
    const value = this.readCookie(request)
    const separator = value?.lastIndexOf('.') ?? -1
    if (!value || separator < 1) return false
    const payload = value.slice(0, separator)
    const signature = value.slice(separator + 1)
    const expected = this.sign(payload)
    const age = Date.now() - Number(payload.split('.')[0])
    if (signature.length !== expected.length || !Number.isFinite(age) || age > SESSION_LIFETIME_MS || age < 0) return false
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  }

  createCookie(): string {
    const payload = `${Date.now()}.${randomUUID()}`
    const secure = this.config.production ? '; Secure' : ''
    const value = encodeURIComponent(`${payload}.${this.sign(payload)}`)
    return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_LIFETIME_MS / 1000)}${secure}`
  }

  clearCookie(): string {
    return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  }

  isCorrectPassword(password: string): boolean {
    const secret = this.config.access.sessionSecret ?? ''
    const expected = createHmac('sha256', secret)
      .update(this.config.access.password ?? '')
      .digest()
    const actual = createHmac('sha256', secret).update(password).digest()
    return timingSafeEqual(actual, expected)
  }

  private key(request: Request): string {
    return request.ip || request.socket.remoteAddress || 'unknown'
  }

  canAttempt(request: Request): boolean {
    const now = Date.now()
    const key = this.key(request)
    const current = this.attempts.get(key)
    if (!current || current.resetAt <= now) {
      this.attempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS })
      return true
    }
    if (current.count >= LOGIN_ATTEMPT_LIMIT) return false
    current.count += 1
    return true
  }

  clearAttempts(request: Request): void {
    this.attempts.delete(this.key(request))
  }
}
