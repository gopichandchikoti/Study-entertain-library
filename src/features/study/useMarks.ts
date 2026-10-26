import { useCallback, useState } from 'react'
import { readStoredSet, writeStoredSet } from '../../utils/storage'

type MarkName = 'bookmarks' | 'completed'

const storageKey = (name: MarkName, userId: string | null): string => `study-library:${name}${userId ? `:${userId}` : ''}`

const toggled = (current: ReadonlySet<string>, path: string): Set<string> => {
  const next = new Set(current)
  if (next.has(path)) next.delete(path)
  else next.add(path)
  return next
}

/** Bookmarks and completed notes. They live in this browser, per account, and do not follow the person to another device. */
export function useMarks(userId: string | null) {
  const [bookmarks, setBookmarks] = useState(() => readStoredSet(storageKey('bookmarks', userId)))
  const [completed, setCompleted] = useState(() => readStoredSet(storageKey('completed', userId)))

  const toggleBookmark = useCallback(
    (path: string): void => {
      setBookmarks((current) => {
        const next = toggled(current, path)
        writeStoredSet(storageKey('bookmarks', userId), next)
        return next
      })
    },
    [userId],
  )

  const toggleCompleted = useCallback(
    (path: string): void => {
      setCompleted((current) => {
        const next = toggled(current, path)
        writeStoredSet(storageKey('completed', userId), next)
        return next
      })
    },
    [userId],
  )

  const markCompleted = useCallback(
    (path: string): void => {
      setCompleted((current) => {
        if (current.has(path)) return current
        const next = new Set(current).add(path)
        writeStoredSet(storageKey('completed', userId), next)
        return next
      })
    },
    [userId],
  )

  return { bookmarks, completed, toggleBookmark, toggleCompleted, markCompleted }
}
