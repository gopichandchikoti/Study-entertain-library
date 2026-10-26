import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import type { Request } from 'express'
import type { ApiConfig } from './config.js'

const PAYLOAD = /^(\d{10,16})\.([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.([A-Za-z0-9_-]{43})$/
const MAX_PASSWORD_LENGTH = 256

/** The value of a cookie that appears exactly once; two cookies of one name (cookie tossing) are treated as none. */
const singleCookie = (request: Request, name: string): string | null => {
  const matches = (request.headers.cookie ?? '')
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.startsWith(`${name}=`))
  return matches.length === 1 ? matches[0].slice(name.length + 1) : null
}

const sameLength = (left: Buffer, right: Buffer): boolean => left.length === right.length && timingSafeEqual(left, right)

/**
 * The shared-password session: a signed, expiring cookie. It holds nothing about a person, so it cannot be revoked one
 * by one; changing SESSION_SECRET ends every session at once. The password is compared in constant time.
 */
export class Sessions {
  constructor(
    private readonly config: ApiConfig,
    private readonly now: () => number = Date.now,
  ) {}

  /** False only when no access password is configured (development), which leaves the API open. */
  get required(): boolean {
    return Boolean(this.config.accessPassword)
  }

  private sign(value: string): string {
    return createHmac('sha256', this.config.sessionSecret).update(value).digest('base64url')
  }

  isValid(request: Request): boolean {
    if (!this.required) return true
    const raw = singleCookie(request, this.config.cookie.name)
    const parts = raw ? PAYLOAD.exec(decodeURIComponentSafe(raw)) : null
    if (!parts) return false
    const [, issuedAt, id, signature] = parts
    const age = this.now() - Number(issuedAt)
    if (age < 0 || age > this.config.cookie.lifetimeMs) return false
    return sameLength(Buffer.from(signature), Buffer.from(this.sign(`${issuedAt}.${id}`)))
  }

  private attributes(maxAgeSeconds: number): string {
    const sameSite = this.config.cookie.sameSite
    const secure = this.config.production ? '; Secure' : ''
    return `Path=/; HttpOnly; SameSite=${sameSite[0].toUpperCase()}${sameSite.slice(1)}; Max-Age=${maxAgeSeconds}${secure}`
  }

  createCookie(): string {
    const payload = `${this.now()}.${randomUUID()}`
    return `${this.config.cookie.name}=${payload}.${this.sign(payload)}; ${this.attributes(Math.floor(this.config.cookie.lifetimeMs / 1000))}`
  }

  clearCookie(): string {
    return `${this.config.cookie.name}=; ${this.attributes(0)}`
  }

  passwordMatches(password: string): boolean {
    if (!this.config.accessPassword || password.length > MAX_PASSWORD_LENGTH) return false
    // Hashing both sides first makes the comparison the same length and time for any input.
    const digest = (value: string): Buffer => createHmac('sha256', this.config.sessionSecret).update(value).digest()
    return sameLength(digest(password), digest(this.config.accessPassword))
  }
}

const decodeURIComponentSafe = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return ''
  }
}
