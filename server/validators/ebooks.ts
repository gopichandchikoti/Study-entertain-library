const MAX_NOTES_PER_EBOOK = 30

export type EbookRequest = { paths: string[]; title: string }

/** One or many note paths (de-duplicated, capped) and an optional title. Anything else is ignored. */
export function parseEbookRequest(body: unknown): EbookRequest {
  const input = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
  const requested = Array.isArray(input.paths)
    ? input.paths.filter((value): value is string => typeof value === 'string')
    : typeof input.path === 'string'
      ? [input.path]
      : []
  return {
    paths: [...new Set(requested)].slice(0, MAX_NOTES_PER_EBOOK),
    title: typeof input.title === 'string' ? input.title : '',
  }
}
