import { useEffect, useState } from 'react'
import type { ContentResponse, LibraryFile, PreviewKind } from '../../@types'
import { fetchContent } from '../../api'
import { content as copy } from '../../content.js'

/** Markdown and text open inline; PDFs, EPUBs, images and downloads use their own previews. */
export const isInlineContent = (previewKind: PreviewKind): boolean => previewKind === 'markdown' || previewKind === 'text'

type NoteContent = {
  content: ContentResponse | null
  error: string | null
  /** True from the moment another note is selected until its text arrives. */
  isLoading: boolean
}

/** Fetches the text of the selected note and cancels the request if another note is chosen first. */
export function useNoteContent(file: LibraryFile | null): NoteContent {
  const [content, setContent] = useState<ContentResponse | null>(null)
  const [failure, setFailure] = useState<{ path: string; message: string } | null>(null)
  const path = file && isInlineContent(file.previewKind) ? file.path : null

  useEffect(() => {
    if (!path) return
    const controller = new AbortController()
    fetchContent(path, controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) setContent(response)
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setFailure({ path, message: error instanceof Error ? error.message : copy.app.thisNoteCouldNotBeOpened })
        }
      })
    return () => controller.abort()
  }, [path])

  const error = failure && failure.path === path ? failure.message : null
  return { content, error, isLoading: Boolean(path && content?.path !== path && !error) }
}
