import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

const render = (markdown: string): string =>
  renderToStaticMarkup(
    createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSanitize, rehypeHighlight] }, markdown),
  )

const HOSTILE = [
  '<script>alert(1)</script>',
  '<img src=x onerror="alert(1)">',
  '<a href="javascript:alert(1)">click</a>',
  '[click](javascript:alert(1))',
  '<iframe src="https://evil.example"></iframe>',
  '<svg onload="alert(1)"></svg>',
  '<div style="background:url(javascript:alert(1))">x</div>',
  '<form action="https://evil.example"><input name="password"></form>',
  '<object data="x.swf"></object><embed src="x.swf">',
  '![x](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)',
]

test('lesson Markdown is sanitised: no script, handler, frame, form or script URL survives', () => {
  for (const source of HOSTILE) {
    const html = render(source).toLowerCase()
    assert.ok(
      !/<script|<iframe|<form|<object|<embed|<svg|\son\w+\s*=|javascript:|style=/.test(html),
      `unsafe output for ${source}: ${html}`,
    )
  }
})

test('ordinary Markdown still renders: headings, tables, code and links', () => {
  const html = render('# Title\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n```js\nconst x = 1\n```\n\n[docs](https://example.com)')
  assert.match(html, /<h1[^>]*>Title<\/h1>/)
  assert.match(html, /<table>/)
  assert.match(html, /<code/)
  assert.match(html, /href="https:\/\/example.com"/)
})
