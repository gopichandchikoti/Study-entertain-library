import type { LibraryFile } from '../../@types'
import { content as copy, formatContent } from '../../content.js'

export const displayTitle = (file: LibraryFile): string => file.title || file.name

type CountKind = 'note' | 'file'

/** "1 note", "2 notes": the plural rules come from the locale, the wording from the content model. */
export const formatCount = (value: number, kind: CountKind): string => {
  const forms = kind === 'note' ? copy.common.noteCount : copy.common.fileCount
  const plural = new Intl.PluralRules(copy.locale).select(value)
  return formatContent(plural === 'one' ? forms.one : forms.other, { count: value.toLocaleString(copy.locale) })
}

/** Resolves a link or image path written relative to a note into a library path, or null for external addresses. */
export const resolveRelativePath = (fromPath: string, target: string): string | null => {
  if (!target || target.startsWith('#') || target.startsWith('mailto:') || /^https?:\/\//i.test(target)) return null
  try {
    const cleanTarget = target.split('#')[0]
    const resolved = new URL(cleanTarget, `https://study-library.local/${fromPath}`).pathname
    return decodeURIComponent(resolved).replace(/^\/+/, '')
  } catch {
    return null
  }
}
