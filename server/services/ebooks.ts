import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import JSZip from 'jszip'
import { Marked } from 'marked'
import type { ServerConfig } from '../config/index.js'
import { previewKindForExtension } from '../helpers/extensions.js'
import { uniqueLocalPath } from '../helpers/files.js'
import { normalizeFileName, safeStoragePath, toPosix } from '../helpers/paths.js'
import { escapeXml, titleFromMarkdown } from '../helpers/text.js'
import type { LibraryService } from './library.js'
import type { RemoteStorage } from './remote-storage.js'

/** A problem with the request itself (not a server fault); its message is safe to show to the person who asked. */
export class EbookInputError extends Error {}

// Raw HTML inside a note is shown as text, not carried into the book: a reader that runs scripts must not run a note's.
const markdown = new Marked({ renderer: { html: ({ text }) => escapeXml(text) } })

type Note = { path: string; title: string; content: string }
type Chapter = { id: string; fileName: string; title: string }

const EPUB_MIME = 'application/epub+zip'
const NAV_NAMESPACES = 'xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"'

const isNoteExtension = (extension: string): boolean => ['markdown', 'text'].includes(previewKindForExtension(extension))

const noteTitle = (content: string, fileName: string, extension: string): string =>
  previewKindForExtension(extension) === 'markdown'
    ? titleFromMarkdown(content, fileName)
    : path.posix.basename(fileName, extension)

const chapterDocument = (note: Note, body: string): string =>
  `<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><title>${escapeXml(note.title)}</title><meta charset="utf-8" /></head><body><h1>${escapeXml(note.title)}</h1>${body}<p><small>Source: ${escapeXml(note.path)}</small></p></body></html>`

const navigationDocument = (title: string, chapters: Chapter[]): string => {
  const items = chapters.map((chapter) => `<li><a href="${chapter.fileName}">${escapeXml(chapter.title)}</a></li>`).join('')
  return `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html ${NAV_NAMESPACES} lang="en"><head><title>${escapeXml(title)}</title><meta charset="utf-8" /></head><body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${items}</ol></nav></body></html>`
}

const packageDocument = (bookId: string, title: string, chapters: Chapter[]): string => {
  const manifest = chapters
    .map((chapter) => `<item id="${chapter.id}" href="${chapter.fileName}" media-type="application/xhtml+xml" />`)
    .join('')
  const spine = chapters.map((chapter) => `<itemref idref="${chapter.id}" />`).join('')
  const modified = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
  return `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${bookId}</dc:identifier><dc:title>${escapeXml(title)}</dc:title><dc:language>en</dc:language><meta property="dcterms:modified">${modified}</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />${manifest}</manifest><spine>${spine}</spine></package>`
}

const CONTAINER_DOCUMENT =
  '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles></container>'

/** Bundles Markdown and text notes into an EPUB 3 file in the `Ebooks` category. */
export class EbookService {
  constructor(
    private readonly config: ServerConfig,
    private readonly library: LibraryService,
    private readonly remote: RemoteStorage | null,
  ) {}

  async create(relativePaths: string[], requestedTitle: string): Promise<{ path: string; fileName: string }> {
    const notes: Note[] = []
    for (const relativePath of relativePaths) notes.push(await this.readNote(relativePath))
    if (notes.length === 0) throw new EbookInputError('Choose at least one Markdown or text file to create an ebook.')

    const title = requestedTitle.trim() || notes[0].title || 'Study collection'
    const fileName = normalizeFileName(title, 'study-collection.epub', '.epub')
    const archive = await this.buildArchive(title, notes)
    if (this.remote) {
      const destination = await this.remote.uniqueDestination(`Ebooks/${fileName}`)
      await this.remote.upload(destination, archive, EPUB_MIME)
      return { path: destination, fileName: path.posix.basename(destination) }
    }
    const destination = await uniqueLocalPath(path.join(this.config.contentRoot, 'Ebooks', fileName))
    await fs.mkdir(path.dirname(destination), { recursive: true })
    await fs.writeFile(destination, archive)
    return { path: toPosix(path.relative(this.config.contentRoot, destination)), fileName: path.basename(destination) }
  }

  private notAllowed(relativePath: string): EbookInputError {
    return new EbookInputError(`Only Markdown and text files can be included in an ebook: ${relativePath}`)
  }

  private async readNote(relativePath: string): Promise<Note> {
    return this.remote ? this.readRemoteNote(this.remote, relativePath) : this.readLocalNote(relativePath)
  }

  private async readRemoteNote(remote: RemoteStorage, relativePath: string): Promise<Note> {
    const safePath = safeStoragePath(relativePath)
    const extension = path.extname(safePath ?? '').toLowerCase()
    if (!safePath || !isNoteExtension(extension)) throw this.notAllowed(relativePath)
    const response = await remote.fetchObject(safePath)
    if (!response.ok) throw new EbookInputError(`The study note could not be read for the ebook: ${relativePath}`)
    const content = await response.text()
    return { path: safePath, title: noteTitle(content, path.posix.basename(safePath), extension), content }
  }

  private async readLocalNote(relativePath: string): Promise<Note> {
    const file = await this.library.safeFile(relativePath)
    const extension = path.extname(file?.absolutePath ?? '').toLowerCase()
    if (!file || !isNoteExtension(extension)) throw this.notAllowed(relativePath)
    const content = await fs.readFile(file.absolutePath, 'utf8')
    return { path: toPosix(relativePath), title: noteTitle(content, path.basename(file.absolutePath), extension), content }
  }

  private async buildArchive(title: string, notes: Note[]): Promise<Buffer> {
    const zip = new JSZip()
    const chapters: Chapter[] = []
    for (const [index, note] of notes.entries()) {
      const id = `chapter-${index + 1}`
      const isMarkdown = previewKindForExtension(path.extname(note.path).toLowerCase()) === 'markdown'
      const body = isMarkdown ? await markdown.parse(note.content) : `<pre>${escapeXml(note.content)}</pre>`
      zip.file(`OEBPS/${id}.xhtml`, chapterDocument(note, body))
      chapters.push({ id, fileName: `${id}.xhtml`, title: note.title })
    }
    zip.file('mimetype', EPUB_MIME, { compression: 'STORE' })
    zip.file('META-INF/container.xml', CONTAINER_DOCUMENT)
    zip.file('OEBPS/nav.xhtml', navigationDocument(title, chapters))
    zip.file('OEBPS/content.opf', packageDocument(`urn:uuid:${randomUUID()}`, title, chapters))
    return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  }
}
