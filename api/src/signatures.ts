/** How many leading bytes are enough to recognise every type below. */
export const SIGNATURE_BYTES = 1024

const startsWith = (head: Buffer, bytes: readonly number[], offset = 0): boolean =>
  head.length >= offset + bytes.length && bytes.every((byte, index) => head[offset + index] === byte)

const ascii = (text: string): number[] => [...text].map((character) => character.charCodeAt(0))

const PDF = ascii('%PDF-')
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const JPEG = [0xff, 0xd8, 0xff]
const GIF = ascii('GIF8')
const RIFF = ascii('RIFF')
const WEBP = ascii('WEBP')
const FTYP = ascii('ftyp')
const ZIP = [0x50, 0x4b, 0x03, 0x04]
const UTF16_BOMS = [
  [0xff, 0xfe],
  [0xfe, 0xff],
]

const ZIP_CONTAINERS: ReadonlySet<string> = new Set(['.docx', '.pptx', '.xlsx', '.epub', '.odt', '.ods', '.odp'])
/** Kindle and Mobipocket files have no fixed leading bytes, so only their extension can be checked. */
const UNCHECKED: ReadonlySet<string> = new Set(['.mobi', '.azw', '.azw3'])

const looksLikeText = (head: Buffer): boolean => UTF16_BOMS.some((bom) => startsWith(head, bom)) || !head.includes(0)

/**
 * True when the leading bytes fit the extension a file claims: binary formats start with their magic number and text
 * formats contain no NUL bytes. A file that fails is not the type its name says, so it is refused before it is staged.
 */
export function matchesDeclaredType(extension: string, head: Buffer): boolean {
  if (UNCHECKED.has(extension)) return true
  if (extension === '.pdf') return head.subarray(0, SIGNATURE_BYTES).includes(Buffer.from(PDF))
  if (extension === '.png') return startsWith(head, PNG)
  if (extension === '.jpg' || extension === '.jpeg') return startsWith(head, JPEG)
  if (extension === '.gif') return startsWith(head, GIF)
  if (extension === '.webp') return startsWith(head, RIFF) && startsWith(head, WEBP, 8)
  if (extension === '.avif') return startsWith(head, FTYP, 4)
  if (ZIP_CONTAINERS.has(extension)) return startsWith(head, ZIP)
  return looksLikeText(head)
}
