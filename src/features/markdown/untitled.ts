import { content as copy, formatContent } from '../../content.js'

// Compare generated names rather than parsing an English-specific prefix.
export const nextUntitledName = (names: string[]): string => {
  const used = new Set(names.map((name) => name.trim().toLocaleLowerCase(copy.locale)))
  let number = 1
  let candidate = formatContent(copy.untitled.untitledValue, { value0: number })
  while (used.has(candidate.toLocaleLowerCase(copy.locale))) {
    candidate = formatContent(copy.untitled.untitledValue, { value0: ++number })
  }
  return candidate
}
