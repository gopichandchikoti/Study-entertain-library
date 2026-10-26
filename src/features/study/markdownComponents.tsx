import type { MouseEvent } from 'react'
import type { Components } from 'react-markdown'
import { assetUrl } from '../../api'
import { hastText } from '../diagrams/hastText'
import { LessonDiagram } from '../diagrams/LessonDiagram'
import { resolveRelativePath } from './fileDisplay'

type Options = {
  /** The library path of the note being rendered, used to resolve relative images and links. */
  notePath: string | null
  /** Opens a linked note inside the app. Returns false when the target is not a note in the library. */
  openLinkedNote: (target: string) => boolean
}

/** How rendered notes handle links, images and Mermaid diagrams. HTML is sanitized before this runs. */
export function createMarkdownComponents({ notePath, openLinkedNote }: Options): Components {
  return {
    a: ({ href, children, ...props }) => {
      const isInternal = Boolean(href && !/^https?:\/\//i.test(href))
      const onClick = (event: MouseEvent<HTMLAnchorElement>): void => {
        if (href && openLinkedNote(href)) event.preventDefault()
      }
      return (
        <a href={href} onClick={onClick} {...props} data-internal={isInternal || undefined}>
          {children}
        </a>
      )
    },
    pre: ({ node, children, ...props }) => {
      const code = node?.children[0]
      const isDiagram =
        code?.type === 'element' &&
        code.tagName === 'code' &&
        Array.isArray(code.properties.className) &&
        code.properties.className.includes('language-mermaid')
      return isDiagram ? <LessonDiagram source={hastText(code)} /> : <pre {...props}>{children}</pre>
    },
    img: ({ src, alt, ...props }) => {
      const resolved = src && notePath ? resolveRelativePath(notePath, src) : null
      return <img src={resolved ? assetUrl(resolved) : src} alt={alt ?? ''} loading="lazy" decoding="async" {...props} />
    },
  }
}
