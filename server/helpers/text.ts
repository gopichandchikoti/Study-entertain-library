import type { LyricLine } from '../@types/library.js'

const leadingNumber = /^\d+[-_ ]*/

export const titleFromMarkdown = (content: string, fileName: string): string => {
  const heading = content.match(/^\s*#\s+(.+)$/m)?.[1]?.trim()
  if (heading) return heading.replace(/[*_`]/g, '')
  return fileName
    .replace(/\.(md|markdown|mdx)$/i, '')
    .replace(leadingNumber, '')
    .replace(/[-_]+/g, ' ')
}

export const stripExtension = (fileName: string, extension: string): string =>
  fileName.replace(new RegExp(`${extension.replace('.', '\\.')}$`, 'i'), '')

/** A readable title from a file name: extension and leading ordering digits removed. */
export const titleFromFileName = (fileName: string, extension: string): string =>
  stripExtension(fileName, extension).replace(leadingNumber, '').replace(/[-_]+/g, ' ')

export const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const lyricLine = /^\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]\s*(.*)$/

export const parseLyrics = (content: string): LyricLine[] =>
  content
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = line.match(lyricLine)
      if (!match) return []
      const fraction = Number((match[3] ?? '0').padEnd(3, '0')) / 1000
      return [{ time: Number(match[1]) * 60 + Number(match[2]) + fraction, text: match[4].trim() }]
    })
    .filter((line) => line.text.length > 0)
    .sort((left, right) => left.time - right.time)
