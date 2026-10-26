import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { RequestHandler, Response } from 'express'
import type { LibraryInventory } from '../@types/library.js'
import type { Services } from '../@types/services.js'
import { activeDocumentPolicy, isActiveDocument } from '../auth/security-headers.js'
import { mimeTypeForExtension, previewKindForExtension, supportedExtensions } from '../helpers/extensions.js'
import { safeStoragePath, toPosix } from '../helpers/paths.js'
import { requestedPath } from '../validators/library.js'

/** Library responses are private to the signed-in reader but may be reused after a conditional (ETag) check. */
const REVALIDATE = 'private, no-cache'

const isNote = (extension: string): boolean => ['markdown', 'text'].includes(previewKindForExtension(extension))

const notFound = (response: Response, message: string): void => {
  response.status(404).json({ message })
}

/** SVG, HTML and XML are active documents: serve them sandboxed so a hostile file cannot run script in the app's origin. */
const sandboxActiveDocument = (response: Response, relativePath: string): void => {
  if (isActiveDocument(relativePath)) response.setHeader('Content-Security-Policy', activeDocumentPolicy)
}

const inventoryEtag = (inventory: LibraryInventory): string => {
  const signature = inventory.files.map((file) => [file.path, file.title, file.size, file.modifiedAt])
  return `W/"${createHash('sha1').update(JSON.stringify(signature)).digest('base64url')}"`
}

export function libraryController({ config, library, remote }: Services) {
  const inventory: RequestHandler = async (_request, response) => {
    const result = await library.build()
    response.setHeader('Cache-Control', REVALIDATE)
    // The scan time changes on every request, so the ETag covers what the reader sees: which files, how big, how recent.
    response.setHeader('ETag', inventoryEtag(result))
    response.json(result)
  }

  const remoteNote = async (response: Response, relativePath: string): Promise<void> => {
    const safePath = safeStoragePath(relativePath)
    const extension = path.extname(safePath ?? '').toLowerCase()
    const found = safePath && remote && isNote(extension) ? await remote.fetchObject(safePath) : null
    if (!safePath || !found?.ok) {
      notFound(response, 'That study note could not be found.')
      return
    }
    response.json({
      path: safePath,
      content: await found.text(),
      modifiedAt: found.headers.get('last-modified') ?? new Date().toISOString(),
    })
  }

  const content: RequestHandler = async (request, response) => {
    const relativePath = requestedPath(request)
    if (!relativePath) {
      response.status(400).json({ message: 'A file path is required.' })
      return
    }
    response.setHeader('Cache-Control', REVALIDATE)
    if (remote) {
      await remoteNote(response, relativePath)
      return
    }
    const file = await library.safeFile(relativePath)
    if (!file || !isNote(path.extname(file.absolutePath).toLowerCase())) {
      notFound(response, 'That study note could not be found.')
      return
    }
    response.json({
      path: toPosix(path.relative(config.contentRoot, file.absolutePath)),
      content: await fs.readFile(file.absolutePath, 'utf8'),
      modifiedAt: file.stats.mtime.toISOString(),
    })
  }

  const asset: RequestHandler = async (request, response) => {
    const relativePath = requestedPath(request)
    if (!relativePath) {
      response.status(400).json({ message: 'An image path is required.' })
      return
    }
    response.setHeader('Cache-Control', REVALIDATE)
    sandboxActiveDocument(response, relativePath)
    if (remote) {
      const safePath = safeStoragePath(relativePath)
      const extension = path.extname(safePath ?? '').toLowerCase()
      const isImage = previewKindForExtension(extension) === 'image'
      const sent = Boolean(
        safePath && isImage && (await remote.send(request, response, safePath, mimeTypeForExtension(extension))),
      )
      if (!sent) notFound(response, 'That visual could not be found.')
      return
    }
    const file = await library.safeFile(relativePath)
    if (!file || previewKindForExtension(path.extname(file.absolutePath).toLowerCase()) !== 'image') {
      notFound(response, 'That visual could not be found.')
      return
    }
    response.sendFile(file.absolutePath, { cacheControl: false })
  }

  const file: RequestHandler = async (request, response) => {
    const relativePath = requestedPath(request)
    if (!relativePath) {
      response.status(400).json({ message: 'A file path is required.' })
      return
    }
    response.setHeader('Cache-Control', REVALIDATE)
    sandboxActiveDocument(response, relativePath)
    if (remote) {
      const safePath = safeStoragePath(relativePath)
      const extension = path.extname(safePath ?? '').toLowerCase()
      const allowed = supportedExtensions.has(extension)
      const sent = Boolean(
        safePath && allowed && (await remote.send(request, response, safePath, mimeTypeForExtension(extension))),
      )
      if (!sent) notFound(response, 'That study file could not be found.')
      return
    }
    const found = await library.safeFile(relativePath)
    if (!found || !supportedExtensions.has(path.extname(found.absolutePath).toLowerCase())) {
      notFound(response, 'That study file could not be found.')
      return
    }
    response.type(path.extname(found.absolutePath)).sendFile(found.absolutePath, { cacheControl: false })
  }

  return { inventory, content, asset, file }
}
