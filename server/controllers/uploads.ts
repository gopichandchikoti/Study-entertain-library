import type { Request, RequestHandler } from 'express'
import type { Services } from '../@types/services.js'
import { isPublicLibraryPath } from '../auth/file-policy.js'
import { previewKindForExtension } from '../helpers/extensions.js'
import { sendProblem } from '../middlewares/request-context.js'
import { MAX_STAGED_PER_OWNER, UploadRejected } from '../services/uploads.js'
import { isRejection, parseCommitRequest } from '../validators/uploads.js'

const NO_LONGER_AVAILABLE = 'That staged upload is no longer available.'

export function uploadsController({ accounts, library, uploads }: Services) {
  const currentUserId = (request: Request): string | undefined => accounts?.sessions.read(request)?.user.id

  /** Uploads belong to whoever staged them; in account mode nobody else may see, commit or discard one. */
  const ownedRecord = async (request: Request) => {
    const record = await uploads.read(String(request.params.id))
    return record && (!accounts || record.ownerId === currentUserId(request)) ? record : null
  }

  /** Runs before the file is received: an account with a full inbox is told to review it first, and nothing is written. */
  const checkQuota: RequestHandler = async (request, response, next) => {
    if ((await uploads.stagedCount(currentUserId(request))) >= MAX_STAGED_PER_OWNER) {
      sendProblem(
        response,
        409,
        'UPLOAD_QUOTA',
        `You have ${MAX_STAGED_PER_OWNER} uploads waiting for review. Add or discard some, then try again.`,
      )
      return
    }
    next()
  }

  const create: RequestHandler = async (request, response) => {
    if (!request.file) {
      response.status(400).json({ message: 'Choose a textbook, note, image, or supported study file first.' })
      return
    }
    try {
      const { record, previewText } = await uploads.stage(request.file, currentUserId(request))
      response.status(201).json({
        upload: {
          id: record.id,
          originalName: record.originalName,
          extension: record.extension,
          mimeType: record.mimeType,
          previewKind: previewKindForExtension(record.extension),
          size: record.size,
          uploadedAt: record.uploadedAt,
          classification: record.classification,
          previewText,
        },
      })
    } catch (error) {
      if (!(error instanceof UploadRejected)) throw error
      sendProblem(response, 400, 'UPLOAD_CONTENT_MISMATCH', error.message)
    }
  }

  const commit: RequestHandler = async (request, response) => {
    const record = await ownedRecord(request)
    if (!record) {
      response.status(404).json({ message: NO_LONGER_AVAILABLE })
      return
    }
    const parsed = parseCommitRequest(request.body, record)
    if (isRejection(parsed)) {
      response.status(400).json({ message: parsed.message })
      return
    }
    // A folder the library hides (the app's own, node_modules, Music) is not a place an upload may be filed.
    const destination = isPublicLibraryPath(parsed.relativeDestination, library.ignoredDirectories)
      ? uploads.resolveDestination(parsed.relativeDestination)
      : null
    if (!destination) {
      response.status(400).json({ message: 'That destination is not allowed.' })
      return
    }
    try {
      response.status(201).json(await uploads.commit(record, destination))
    } catch (error) {
      if (!(error instanceof UploadRejected)) throw error
      response.status(400).json({ message: error.message })
    }
  }

  const discard: RequestHandler = async (request, response) => {
    const record = await ownedRecord(request)
    if (!record && accounts) {
      response.status(404).json({ message: NO_LONGER_AVAILABLE })
      return
    }
    if (record) await uploads.discard(record)
    response.status(204).end()
  }

  return { checkQuota, create, commit, discard }
}
