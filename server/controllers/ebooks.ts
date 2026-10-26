import type { RequestHandler } from 'express'
import type { Services } from '../@types/services.js'
import { EbookInputError } from '../services/ebooks.js'
import { parseEbookRequest } from '../validators/ebooks.js'

export function ebooksController({ ebooks, library }: Services) {
  const create: RequestHandler = async (request, response) => {
    const { paths, title } = parseEbookRequest(request.body)
    if (paths.length === 0) {
      response.status(400).json({ message: 'Choose at least one Markdown or text file to create an ebook.' })
      return
    }
    try {
      const result = await ebooks.create(paths, title)
      const inventory = await library.buildFresh()
      response.status(201).json({ ...result, file: inventory.files.find((file) => file.path === result.path) ?? null })
    } catch (error) {
      if (error instanceof EbookInputError) {
        response.status(400).json({ message: error.message })
        return
      }
      throw error
    }
  }

  return { create }
}
