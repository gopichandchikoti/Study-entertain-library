import { memo, useDeferredValue, useEffect, useMemo, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

const remarkPlugins = [remarkGfm]
// Sanitize first so user HTML cannot add scripts; highlight afterwards so its classes survive.
const rehypePlugins = [rehypeSanitize, rehypeHighlight]

const components: Components = {
  a: ({ node: _node, href, children, ...props }) => {
    const isExternal = Boolean(href && /^https?:\/\//i.test(href))
    return (
      <a {...props} href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    )
  },
}

// Rendering re-parses the whole document (about 5 ms per 1,000 characters), so on large documents
// it would block typing on every key. Hold the preview back until typing pauses, but show a paste
// or a newly opened file straight away.
const SMALL_DOCUMENT = 5000
const BIG_CHANGE = 500
const MAX_DELAY = 1000

function useSettledValue(value: string): string {
  const [settled, setSettled] = useState(value)
  const delay = value.length < SMALL_DOCUMENT ? 0 : Math.min(MAX_DELAY, Math.round(value.length / 50))
  const immediate = delay === 0 || Math.abs(value.length - settled.length) > BIG_CHANGE
  // Adopting the new text during render (React's "adjust state while rendering" pattern) keeps later
  // length comparisons honest without an extra effect-driven render.
  if (immediate && settled !== value) setSettled(value)
  useEffect(() => {
    if (immediate) return
    const timer = window.setTimeout(() => setSettled(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay, immediate])
  return immediate ? value : settled
}

export const MarkdownPreview = memo(function MarkdownPreview({ source }: { source: string }) {
  const deferred = useDeferredValue(useSettledValue(source))
  // ReactMarkdown is not memoised: reusing the same element lets React skip re-parsing unchanged text.
  return useMemo(
    () => (
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={components}>
        {deferred}
      </ReactMarkdown>
    ),
    [deferred],
  )
})
