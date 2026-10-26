import { randomUUID } from 'node:crypto'
import path from 'node:path'
import JSZip from 'jszip'
import { Marked } from 'marked'
import type { Catalog, Storage } from './gateways.js'
import { normalizeFileName } from './uploads.js'

/** A request the caller can fix; its message is safe to show because it names no server detail. */
export class EbookError extends Error {}

const SOURCE_EXTENSIONS: ReadonlySet<string> = new Set(['.md', '.markdown', '.mdx', '.txt'])
const MAX_SOURCE_BYTES = 2 * 1024 * 1024

const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

// Raw HTML inside a note is shown as text, not carried into the book: a reader that runs scripts must not run a note's.
const markdown = new Marked({ renderer: { html: ({ text }) => escapeXml(text) } })

const titleFromContent = (content: string, fileName: string): string =>
  content.match(/^\s*#\s+(.+)$/m)?.[1]?.trim().replace(/[*_`]/g, '') ??
  fileName.replace(/\.(md|markdown|mdx)$/i, '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ')

type Source = { path: string; title: string; content: string }

const readSources = async (catalog: Catalog, storage: Storage, relativePaths: string[]): Promise<Source[]> => {
  const sources: Source[] = []
  for (const relativePath of relativePaths) {
    const row = await catalog.findRow(relativePath)
    if (!row || !SOURCE_EXTENSIONS.has(row.extension.toLowerCase())) {
      throw new EbookError('Only Markdown and text files from the library can be included in an ebook.')
    }
    if (Number(row.size_bytes) > MAX_SOURCE_BYTES) throw new EbookError('One of those files is too large to include in an ebook.')
    const response = await storage.request(row.storage_path)
    if (!response.ok) throw new EbookError('One of those notes could not be read for the ebook.')
    const content = await response.text()
    const fileName = path.posix.basename(row.storage_path)
    const isText = row.extension.toLowerCase() === '.txt'
    sources.push({ path: row.storage_path, title: isText ? path.posix.basename(fileName, row.extension) : titleFromContent(content, fileName), content })
  }
  return sources
}

/** Builds an EPUB 3 archive from indexed Markdown and text notes. Markdown is converted, and every title and path is escaped. */
export const createEpub = async (
  catalog: Catalog,
  storage: Storage,
  relativePaths: string[],
  requestedTitle: string,
): Promise<{ path: string; fileName: string; archive: Buffer }> => {
  const sources = await readSources(catalog, storage, relativePaths)
  if (sources.length === 0) throw new EbookError('Choose at least one Markdown or text file to create an ebook.')
  const title = requestedTitle.trim() || sources[0].title || 'Study collection'
  const fileName = normalizeFileName(title, 'study-collection.epub', '.epub')
  const zip = new JSZip()
  const chapters = await Promise.all(
    sources.map(async (source, index) => {
      const chapterId = `chapter-${index + 1}`
      const chapterFileName = `${chapterId}.xhtml`
      const body = source.path.toLowerCase().endsWith('.txt') ? `<pre>${escapeXml(source.content)}</pre>` : await markdown.parse(source.content)
      zip.file(
        `OEBPS/${chapterFileName}`,
        `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><title>${escapeXml(source.title)}</title><meta charset="utf-8" /></head><body><h1>${escapeXml(source.title)}</h1>${body}<p><small>Source: ${escapeXml(source.path)}</small></p></body></html>`,
      )
      return { chapterId, chapterFileName, title: source.title }
    }),
  )
  const bookId = `urn:uuid:${randomUUID()}`
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })
  zip.file(
    'META-INF/container.xml',
    '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument.org:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles></container>',
  )
  zip.file(
    'OEBPS/nav.xhtml',
    `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en"><head><title>${escapeXml(title)}</title><meta charset="utf-8" /></head><body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${chapters.map((chapter) => `<li><a href="${chapter.chapterFileName}">${escapeXml(chapter.title)}</a></li>`).join('')}</ol></nav></body></html>`,
  )
  zip.file(
    'OEBPS/content.opf',
    `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${bookId}</dc:identifier><dc:title>${escapeXml(title)}</dc:title><dc:language>en</dc:language><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')}</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />${chapters.map((chapter) => `<item id="${chapter.chapterId}" href="${chapter.chapterFileName}" media-type="application/xhtml+xml" />`).join('')}</manifest><spine>${chapters.map((chapter) => `<itemref idref="${chapter.chapterId}" />`).join('')}</spine></package>`,
  )
  return { path: `Ebooks/${fileName}`, fileName, archive: await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }) }
}
