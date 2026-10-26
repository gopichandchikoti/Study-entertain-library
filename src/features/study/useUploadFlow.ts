import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import type { UploadResponse } from '../../@types'
import { commitUpload, discardUpload, uploadFile } from '../../api'
import { content as copy } from '../../content.js'

export type UploadState = 'idle' | 'uploading' | 'reviewing' | 'committing'
type UploadResult = UploadResponse['upload']

const UNSORTED = 'Unsorted'

const messageOf = (error: unknown, fallback: string): string => (error instanceof Error ? error.message : fallback)

type UploadFlowOptions = {
  /** Called after a file has been added to the library. */
  onCommitted: () => void
  /** Called for a problem the dialog itself cannot show, such as a failed discard. */
  onProblem: (message: string) => void
}

/**
 * Import is a review step, not a blind save: the file is staged and classified, the person checks the suggested
 * category and name, and only then is it committed. Closing the dialog discards what was staged.
 */
export function useUploadFlow({ onCommitted, onProblem }: UploadFlowOptions) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<UploadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [category, setCategory] = useState(UNSORTED)
  const [fileName, setFileName] = useState('')
  const [isDropActive, setIsDropActive] = useState(false)
  const generation = useRef(0)
  const staged = useRef<UploadResult | null>(null)

  useEffect(() => {
    staged.current = result
  }, [result])

  const discard = useCallback(
    (upload: UploadResult): void => {
      discardUpload(upload.id).catch((problem: unknown) => onProblem(messageOf(problem, copy.app.theUploadCouldNotBeDiscarded)))
    },
    [onProblem],
  )

  // Leaving the page with a staged file would leave it in the inbox, so discard it.
  useEffect(
    () => () => {
      generation.current += 1
      if (staged.current) void discardUpload(staged.current.id).catch(() => undefined)
    },
    [],
  )

  const open = (): void => {
    setIsOpen(true)
    setError(null)
  }

  const close = (): void => {
    generation.current += 1
    if (result) discard(result)
    setIsOpen(false)
    setState('idle')
    setError(null)
    setResult(null)
    setCategory(UNSORTED)
    setFileName('')
    setIsDropActive(false)
  }

  const chooseFile = (file: File | undefined): void => {
    if (!file) return
    const mine = ++generation.current
    if (result) discard(result)
    setState('uploading')
    setError(null)
    setResult(null)
    uploadFile(file).then(
      (response) => {
        if (mine !== generation.current) {
          discard(response.upload)
          return
        }
        setResult(response.upload)
        setCategory(response.upload.classification.category)
        setFileName(response.upload.classification.suggestedFileName)
        setState('reviewing')
      },
      (problem: unknown) => {
        if (mine !== generation.current) return
        setState('idle')
        setError(messageOf(problem, copy.app.theUploadCouldNotBeAnalyzed))
      },
    )
  }

  const drop = (event: DragEvent<HTMLLabelElement>): void => {
    event.preventDefault()
    setIsDropActive(false)
    chooseFile(event.dataTransfer.files[0])
  }

  const commit = (): void => {
    if (!result) return
    const mine = generation.current
    setState('committing')
    setError(null)
    commitUpload(result.id, category, fileName).then(
      () => {
        if (mine !== generation.current) return
        setResult(null)
        setIsOpen(false)
        setState('idle')
        setFileName('')
        onCommitted()
      },
      (problem: unknown) => {
        if (mine !== generation.current) return
        setState('reviewing')
        setError(messageOf(problem, copy.app.theUploadCouldNotBeAddedToTheLibrary))
      },
    )
  }

  return {
    isOpen,
    state,
    error,
    result,
    category,
    fileName,
    isDropActive,
    setCategory,
    setFileName,
    setIsDropActive,
    open,
    close,
    chooseFile,
    drop,
    commit,
  }
}
