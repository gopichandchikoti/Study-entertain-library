import { useCallback, useEffect, useRef, useState } from 'react'
import type { LibraryResponse } from '../../@types'
import { ApiError, fetchLibrary } from '../../api'
import { content as copy } from '../../content.js'

type Snapshot = { userId: string | null; library: LibraryResponse; selectedPath: string | null }

/**
 * The last library and note this account looked at. Leaving Study for Watch and coming back shows it at once while
 * a fresh copy is fetched (the server answers 304 when nothing changed), instead of an empty screen and a spinner.
 */
let snapshot: Snapshot | null = null

/** Drops what was remembered. Called when someone signs out so the next person starts clean. */
export const forgetLibrary = (): void => {
  snapshot = null
}

export const rememberSelection = (userId: string | null, library: LibraryResponse | null, selectedPath: string | null): void => {
  if (library) snapshot = { userId, library, selectedPath }
}

export const rememberedSelection = (userId: string | null): string | null =>
  snapshot?.userId === userId ? snapshot.selectedPath : null

type LibraryState = {
  library: LibraryResponse | null
  isLoading: boolean
  loadError: string | null
  reload: () => void
}

/** Loads the library once, then again on request. A 401 means the session ended and is reported to the caller. */
export function useLibrary(userId: string | null, onUnauthorized: () => void): LibraryState {
  const cached = snapshot?.userId === userId ? snapshot.library : null
  const [library, setLibrary] = useState<LibraryResponse | null>(cached)
  const [isLoading, setIsLoading] = useState(cached === null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [requests, setRequests] = useState(0)
  const unauthorized = useRef(onUnauthorized)

  useEffect(() => {
    unauthorized.current = onUnauthorized
  })

  useEffect(() => {
    let cancelled = false
    fetchLibrary().then(
      (next) => {
        if (cancelled) return
        setLibrary(next)
        setLoadError(null)
        setIsLoading(false)
      },
      (error: unknown) => {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 401) {
          unauthorized.current()
          return
        }
        setLoadError(error instanceof Error ? error.message : copy.app.theLibraryCouldNotBeLoaded)
        setIsLoading(false)
      },
    )
    return () => {
      cancelled = true
    }
  }, [requests])

  const reload = useCallback((): void => {
    setIsLoading(true)
    setLoadError(null)
    setRequests((count) => count + 1)
  }, [])

  return { library, isLoading, loadError, reload }
}
