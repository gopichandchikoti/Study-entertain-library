import { content as copy, formatContent } from '../../content.js'
export const sampleMarkdown = formatContent(copy.sampleMarkdown.welcomeToTheMarkdownPreviewTypeOnTheLeftAnd, {
  value0: Array.from({ length: 6 }, (_, index) => formatContent(copy.sampleMarkdown.section, { number: index + 1 })).join('\n\n'),
})
