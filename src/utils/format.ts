import { content, formatContent } from '../content.js'

export const formatSize = (bytes: number): string => {
  if (bytes < 1024) return formatContent(content.common.bytes, { value0: bytes.toLocaleString(content.locale) })
  if (bytes < 1024 * 1024)
    return formatContent(content.common.kilobytes, { value0: Math.round(bytes / 1024).toLocaleString(content.locale) })
  return formatContent(content.common.megabytes, {
    value0: (bytes / (1024 * 1024)).toLocaleString(content.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  })
}
