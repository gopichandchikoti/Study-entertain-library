import type { Request, RequestHandler } from 'express'
import { sendProblem } from './security.js'

export type RateLimitOptions = {
  /** Length of one counting window. */
  windowMs: number
  /** Requests allowed per client in one window. */
  limit: number
  /** Most clients tracked at once; the oldest entry is dropped first, so memory stays bounded. */
  capacity?: number
  skip?: (request: Request) => boolean
  now?: () => number
}

type Window = { count: number; resetAt: number }

const DEFAULT_CAPACITY = 5000

const clientKey = (request: Request): string => request.ip ?? request.socket.remoteAddress ?? 'unknown'

/** Fixed-window limiter per client address. Answers 429 with `Retry-After` and publishes the standard `RateLimit-*` headers. */
export function createRateLimiter({ windowMs, limit, capacity = DEFAULT_CAPACITY, skip, now = Date.now }: RateLimitOptions): RequestHandler {
  const windows = new Map<string, Window>()
  return (request, response, next) => {
    if (skip?.(request)) {
      next()
      return
    }
    const time = now()
    const key = clientKey(request)
    let current = windows.get(key)
    if (!current || current.resetAt <= time) {
      windows.delete(key)
      if (windows.size >= capacity) windows.delete(windows.keys().next().value as string)
      current = { count: 0, resetAt: time + windowMs }
      windows.set(key, current)
    }
    current.count += 1
    const resetSeconds = Math.max(1, Math.ceil((current.resetAt - time) / 1000))
    response.setHeader('RateLimit-Limit', String(limit))
    response.setHeader('RateLimit-Remaining', String(Math.max(0, limit - current.count)))
    response.setHeader('RateLimit-Reset', String(resetSeconds))
    if (current.count > limit) {
      response.setHeader('Retry-After', String(resetSeconds))
      sendProblem(response, 429, 'RATE_LIMITED', 'Too many requests. Try again shortly.')
      return
    }
    next()
  }
}

const LOGIN_ATTEMPTS = 10
const LOGIN_WINDOW_MS = 15 * 60_000

/** Failed-sign-in counter per client address. Memory is bounded: expired entries go first, then the oldest. */
export class LoginThrottle {
  private readonly windows = new Map<string, Window>()

  constructor(
    private readonly limit = LOGIN_ATTEMPTS,
    private readonly windowMs = LOGIN_WINDOW_MS,
    private readonly capacity = DEFAULT_CAPACITY,
    private readonly now: () => number = Date.now,
  ) {}

  /** Counts one attempt and says whether it may go ahead. */
  allow(key: string): boolean {
    const time = this.now()
    let current = this.windows.get(key)
    if (!current || current.resetAt <= time) {
      if (this.windows.size >= this.capacity) this.prune(time)
      current = { count: 0, resetAt: time + this.windowMs }
      this.windows.set(key, current)
    }
    current.count += 1
    return current.count <= this.limit
  }

  /** Seconds until the window for `key` ends, for `Retry-After`. */
  retryAfterSeconds(key: string): number {
    const current = this.windows.get(key)
    return current ? Math.max(1, Math.ceil((current.resetAt - this.now()) / 1000)) : 1
  }

  reset(key: string): void {
    this.windows.delete(key)
  }

  get size(): number {
    return this.windows.size
  }

  private prune(time: number): void {
    for (const [key, window] of this.windows) if (window.resetAt <= time) this.windows.delete(key)
    while (this.windows.size >= this.capacity) this.windows.delete(this.windows.keys().next().value as string)
  }
}
