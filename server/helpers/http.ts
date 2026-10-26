const HEADER_TIMEOUT_MS = 15_000

/**
 * `fetch` that gives up when the other side has not answered with headers in time, so a stalled provider cannot hold a
 * request open for ever. The timer stops once headers arrive: a large download that follows is not cut short.
 */
export async function fetchWithTimeout(
  input: string | URL,
  init: RequestInit = {},
  timeoutMs = HEADER_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}
