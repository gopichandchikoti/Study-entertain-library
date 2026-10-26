import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { RequestHandler } from 'express'
import type { Services } from '../@types/services.js'
import { resolveWithinRoot } from '../auth/file-policy.js'
import { activeDocumentPolicy, isActiveDocument } from '../auth/security-headers.js'
import { mediaMimeTypeForExtension } from '../helpers/extensions.js'
import { queryValue } from '../helpers/query.js'
import { sendFileWithRange } from '../watch/range.js'
import { confinedRealPath } from '../watch/root.js'

export function mediaController({ config, mediaFiles }: Services) {
  const list: RequestHandler = async (request, response) => {
    if (config.remote) {
      response.status(501).json({ message: 'Local Watch media is not enabled in hosted Storage mode yet.' })
      return
    }
    const kind = queryValue(request.query.kind)
    const search = queryValue(request.query.q)?.trim().toLowerCase() ?? ''
    const files = (await mediaFiles.list()).filter((file) => {
      const matchesKind = !kind || file.kind === kind
      const matchesSearch = !search || [file.title, file.name, file.path].some((value) => value.toLowerCase().includes(search))
      return matchesKind && matchesSearch
    })
    response.json({ root: 'Watch media', generatedAt: new Date().toISOString(), files })
  }

  const stream: RequestHandler = async (request, response) => {
    const relativePath = queryValue(request.query.path)
    if (relativePath && isActiveDocument(relativePath)) response.setHeader('Content-Security-Policy', activeDocumentPolicy)
    if (!relativePath) {
      response.status(400).json({ message: 'A media path is required.' })
      return
    }
    const file = await mediaFiles.safeFile(relativePath)
    if (!file) {
      response.status(404).json({ message: 'That media file could not be found.' })
      return
    }
    const mimeType = mediaMimeTypeForExtension(path.extname(file.absolutePath).toLowerCase())
    sendFileWithRange(request, response, file.absolutePath, Number(file.stats.size), mimeType)
  }

  const subtitle: RequestHandler = async (request, response) => {
    const { root, allowedDrive } = config.media
    const relativePath = queryValue(request.query.path)
    const safePath = relativePath ? resolveWithinRoot(root, relativePath) : null
    const allowed = safePath && path.extname(safePath).toLowerCase() === '.vtt' && confinedRealPath(root, safePath, allowedDrive)
    const stats = allowed && safePath ? await fs.stat(safePath) : null
    if (!safePath || !stats?.isFile()) {
      response.status(404).json({ message: 'That subtitle track could not be found.' })
      return
    }
    response.type('text/vtt').sendFile(safePath)
  }

  return { list, stream, subtitle }
}
