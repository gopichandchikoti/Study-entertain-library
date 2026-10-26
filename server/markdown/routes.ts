import { randomUUID } from 'node:crypto'
import { Router, type NextFunction, type Request, type Response } from 'express'
import type { AuthRepository } from '../auth/repository.js'

export const MAX_NAME_LENGTH = 100
// express.json() is capped at 1 MB; 300k UTF-16 units stay under it even at 3 bytes each.
export const MAX_CONTENT_LENGTH = 300_000
export const MAX_DOCUMENTS_PER_USER = 200

type DocumentRow = { id: string; name: string; content: string; created_at: string; updated_at: string }
type SummaryRow = Omit<DocumentRow, 'content'> & { size: number }

class MarkdownError extends Error {
  readonly status: number
  readonly code: string
  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const toDocument = (row: DocumentRow) => ({
  id: row.id,
  name: row.name,
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})
const toSummary = (row: SummaryRow) => ({
  id: row.id,
  name: row.name,
  size: row.size,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const bodyOf = (request: Request): Record<string, unknown> => {
  if (!request.is('application/json')) throw new MarkdownError(415, 'MARKDOWN_CONTENT_TYPE', 'Send the file as JSON.')
  const body: unknown = request.body
  if (!body || typeof body !== 'object' || Array.isArray(body))
    throw new MarkdownError(400, 'MARKDOWN_INVALID', 'The file data is invalid.')
  return body as Record<string, unknown>
}

const cleanName = (value: unknown): string => {
  if (typeof value !== 'string') throw new MarkdownError(400, 'MARKDOWN_INVALID_NAME', 'Give the file a name.')
  const name = value.trim()
  if (!name) throw new MarkdownError(400, 'MARKDOWN_INVALID_NAME', 'Give the file a name.')
  if (name.length > MAX_NAME_LENGTH)
    throw new MarkdownError(400, 'MARKDOWN_INVALID_NAME', `File names can be up to ${MAX_NAME_LENGTH} characters.`)
  if (
    [...name].some((character) => {
      const code = character.charCodeAt(0)
      return code < 32 || code === 127
    })
  )
    throw new MarkdownError(400, 'MARKDOWN_INVALID_NAME', 'File names cannot contain control characters.')
  return name
}

const cleanContent = (value: unknown): string => {
  if (typeof value !== 'string') throw new MarkdownError(400, 'MARKDOWN_INVALID_CONTENT', 'The Markdown content must be text.')
  if (value.length > MAX_CONTENT_LENGTH)
    throw new MarkdownError(
      413,
      'MARKDOWN_TOO_LARGE',
      `A file can hold up to ${MAX_CONTENT_LENGTH.toLocaleString('en-US')} characters.`,
    )
  return value
}

const isUniqueViolation = (error: unknown): boolean => error instanceof Error && /UNIQUE constraint failed/i.test(error.message)
const nameTaken = (): MarkdownError =>
  new MarkdownError(409, 'MARKDOWN_NAME_TAKEN', 'You already have a file with that name. Choose a different name.')

// Mount after the account guard: authentication, CSRF and verification are enforced there,
// and the account id comes only from `response.locals.authUserId`.
export function createMarkdownRouter(repository: AuthRepository, now: () => number = Date.now): Router {
  const router = Router()

  const owner = (response: Response): string => {
    const id: unknown = response.locals.authUserId
    if (typeof id !== 'string') throw new MarkdownError(401, 'AUTH_REQUIRED', 'Sign in to use your saved Markdown files.')
    return id
  }

  const documentId = (request: Request): string => {
    const id = String(request.params.id)
    if (!idPattern.test(id)) throw new MarkdownError(404, 'MARKDOWN_NOT_FOUND', 'That file could not be found.')
    return id
  }

  const find = (userId: string, id: string): DocumentRow => {
    const row = repository.one<DocumentRow>(
      'SELECT id,name,content,created_at,updated_at FROM markdown_documents WHERE id=? AND user_id=?',
      id,
      userId,
    )
    if (!row) throw new MarkdownError(404, 'MARKDOWN_NOT_FOUND', 'That file could not be found.')
    return row
  }

  // "Untitled 1", "Untitled 2", ... using the smallest number not already in use.
  const nextUntitledName = (userId: string): string => {
    const used = new Set<number>()
    for (const { name } of repository.all<{ name: string }>(
      "SELECT name FROM markdown_documents WHERE user_id=? AND name LIKE 'Untitled %'",
      userId,
    )) {
      const match = /^untitled (\d+)$/i.exec(name)
      if (match) used.add(Number(match[1]))
    }
    let number = 1
    while (used.has(number)) number += 1
    return `Untitled ${number}`
  }

  const ensureNameFree = (userId: string, name: string, exceptId?: string): void => {
    const clash = repository.one<{ id: string }>(
      'SELECT id FROM markdown_documents WHERE user_id=? AND name=? COLLATE NOCASE',
      userId,
      name,
    )
    if (clash && clash.id !== exceptId) throw nameTaken()
  }

  const handler =
    (run: (request: Request, response: Response) => void) =>
    (request: Request, response: Response, next: NextFunction): void => {
      try {
        run(request, response)
      } catch (error) {
        next(error)
      }
    }

  router.get(
    '/',
    handler((_request, response) => {
      const rows = repository.all<SummaryRow>(
        'SELECT id,name,length(CAST(content AS BLOB)) AS size,created_at,updated_at FROM markdown_documents WHERE user_id=? ORDER BY updated_at DESC, name COLLATE NOCASE',
        owner(response),
      )
      response.json({
        documents: rows.map(toSummary),
        limits: { maxDocuments: MAX_DOCUMENTS_PER_USER, maxNameLength: MAX_NAME_LENGTH, maxContentLength: MAX_CONTENT_LENGTH },
      })
    }),
  )

  router.get(
    '/:id',
    handler((request, response) => {
      response.json({ document: toDocument(find(owner(response), documentId(request))) })
    }),
  )

  router.post(
    '/',
    handler((request, response) => {
      const userId = owner(response)
      const body = bodyOf(request)
      const content = body.content === undefined ? '' : cleanContent(body.content)
      const requestedName = typeof body.name === 'string' && body.name.trim() === '' ? undefined : body.name
      const id = randomUUID()
      const stamp = new Date(now()).toISOString()
      try {
        repository.transaction(() => {
          const count =
            repository.one<{ total: number }>('SELECT COUNT(*) AS total FROM markdown_documents WHERE user_id=?', userId)
              ?.total ?? 0
          if (count >= MAX_DOCUMENTS_PER_USER)
            throw new MarkdownError(
              409,
              'MARKDOWN_LIMIT',
              `You can save up to ${MAX_DOCUMENTS_PER_USER} files. Delete one to make room.`,
            )
          const name = requestedName === undefined ? nextUntitledName(userId) : cleanName(requestedName)
          ensureNameFree(userId, name)
          repository.run(
            'INSERT INTO markdown_documents(id,user_id,name,content,created_at,updated_at) VALUES(?,?,?,?,?,?)',
            id,
            userId,
            name,
            content,
            stamp,
            stamp,
          )
        })
      } catch (error) {
        throw isUniqueViolation(error) ? nameTaken() : error
      }
      response.status(201).json({ document: toDocument(find(userId, id)) })
    }),
  )

  router.put(
    '/:id',
    handler((request, response) => {
      const userId = owner(response)
      const id = documentId(request)
      const body = bodyOf(request)
      if (body.name === undefined && body.content === undefined)
        throw new MarkdownError(400, 'MARKDOWN_INVALID', 'Send a name or content to save.')
      const current = find(userId, id)
      const name = body.name === undefined ? current.name : cleanName(body.name)
      const content = body.content === undefined ? current.content : cleanContent(body.content)
      ensureNameFree(userId, name, id)
      try {
        repository.run(
          'UPDATE markdown_documents SET name=?,content=?,updated_at=? WHERE id=? AND user_id=?',
          name,
          content,
          new Date(now()).toISOString(),
          id,
          userId,
        )
      } catch (error) {
        throw isUniqueViolation(error) ? nameTaken() : error
      }
      response.json({ document: toDocument(find(userId, id)) })
    }),
  )

  router.delete(
    '/:id',
    handler((request, response) => {
      const userId = owner(response)
      const id = documentId(request)
      find(userId, id)
      repository.run('DELETE FROM markdown_documents WHERE id=? AND user_id=?', id, userId)
      response.json({ ok: true })
    }),
  )

  router.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof MarkdownError) {
      response.status(error.status).json({ code: error.code, message: error.message })
      return
    }
    process.stderr.write(`Markdown route failed: ${error instanceof Error ? error.message : String(error)}\n`)
    response.status(500).json({ code: 'MARKDOWN_FAILED', message: 'Your Markdown files could not be updated. Try again.' })
  })

  return router
}
