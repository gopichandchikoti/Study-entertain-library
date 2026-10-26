import type { LibraryFile } from '../../@types'
import { BookOpen, File, FileText, Image as ImageGlyph } from '../../components/icons'

/** The small icon that shows what kind of file a row is. */
export function FileGlyph({ file }: { file: LibraryFile }) {
  if (file.previewKind === 'image') return <ImageGlyph size={15} strokeWidth={1.8} />
  if (file.previewKind === 'epub') return <BookOpen size={15} strokeWidth={1.8} />
  if (file.previewKind === 'download') return <File size={15} strokeWidth={1.8} />
  return <FileText size={15} strokeWidth={1.8} />
}
