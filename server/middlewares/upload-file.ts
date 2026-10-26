import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { RequestHandler } from 'express'
import multer from 'multer'
import type { ServerConfig } from '../config/index.js'
import { supportedExtensions } from '../helpers/extensions.js'
import { sendProblem } from './request-context.js'

const SAFE_EXTENSION = /^\.[a-z0-9]{1,10}$/

/** A refusal the browser may be told about as it is: it never repeats a file name or a path. */
class UploadTypeRefused extends Error {}

/** Operating-system failures (no space, no permission) carry a code like ENOSPC and belong in the server log, not the reply. */
const isSystemError = (error: unknown): boolean =>
  error instanceof Error && /^E[A-Z]+$/.test(String((error as NodeJS.ErrnoException).code ?? ''))

/**
 * Accepts one file in the `file` field, bounded by MAX_UPLOAD_BYTES and the supported-extension allowlist.
 * Local mode writes to the private inbox with a random name; hosted mode keeps the bytes in memory for Storage.
 */
export function uploadSingleFile(config: ServerConfig): RequestHandler {
  const diskStorage = multer.diskStorage({
    destination: (_request, _file, callback) => {
      fs.mkdir(config.uploads.directory, { recursive: true }).then(
        () => callback(null, config.uploads.directory),
        (error: unknown) => callback(error as Error, config.uploads.directory),
      )
    },
    filename: (_request, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  })
  const upload = multer({
    storage: config.remote ? multer.memoryStorage() : diskStorage,
    limits: { fileSize: config.uploads.maxBytes },
    fileFilter: (_request, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase()
      if (!supportedExtensions.has(extension)) {
        callback(new UploadTypeRefused(`Unsupported upload type: ${SAFE_EXTENSION.test(extension) ? extension : 'unknown'}.`))
        return
      }
      callback(null, true)
    },
  }).single('file')

  return (request, response, next) => {
    upload(request, response, (error: unknown) => {
      if (!error) {
        next()
        return
      }
      if (isSystemError(error)) {
        next(error)
        return
      }
      if (error instanceof UploadTypeRefused) {
        sendProblem(response, 400, 'UPLOAD_TYPE_UNSUPPORTED', error.message)
        return
      }
      if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        sendProblem(response, 413, 'UPLOAD_TOO_LARGE', 'The file is larger than the upload limit.')
        return
      }
      sendProblem(response, 400, 'UPLOAD_INVALID', 'The upload could not be accepted. Send one file in the "file" field.')
    })
  }
}
