import { content as copy, formatContent } from '../../content.js'
import { ArrowDownUp, Moon, Sun } from '../../components/icons'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import type { Theme } from '../../@types'
import { MarkdownPreview } from './MarkdownPreview'

const MIN_SPLIT = 20
const MAX_SPLIT = 80
const DEFAULT_SPLIT = 50
const DIVIDER_WIDTH = 14
const PREFS_KEY = 'study-library:markdown-prefs'

type Prefs = { split: number; scrollSync: boolean }

const clampSplit = (value: number): number => Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, value))

const readPrefs = (): Prefs => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}')
    const { split, scrollSync } = (stored && typeof stored === 'object' ? stored : {}) as Partial<Prefs>
    return {
      split: typeof split === 'number' && Number.isFinite(split) ? clampSplit(split) : DEFAULT_SPLIT,
      scrollSync: typeof scrollSync === 'boolean' ? scrollSync : true,
    }
  } catch {
    return { split: DEFAULT_SPLIT, scrollSync: true }
  }
}

const savePrefs = (prefs: Prefs): void => {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    /* storage can be unavailable; the layout just will not be remembered */
  }
}

type Pane = 'editor' | 'preview'

export type SplitEditorProps = {
  value: string
  onChange: (value: string) => void
  theme: Theme
  onToggleTheme: () => void
  /** Hide the theme button when the surrounding page already offers one. */
  showThemeToggle?: boolean
  /** Controls placed at the start of the top bar, such as the file name and Save button. */
  toolbarStart?: ReactNode
  /** Character limit shown beside the count; the host decides what happens when it is exceeded. */
  limit?: number
}

export function SplitEditor({
  value,
  onChange,
  theme,
  onToggleTheme,
  showThemeToggle = true,
  toolbarStart,
  limit,
}: SplitEditorProps) {
  const [prefs] = useState(readPrefs)
  const [split, setSplit] = useState(prefs.split)
  const [scrollSync, setScrollSync] = useState(prefs.scrollSync)
  const [dragging, setDragging] = useState(false)
  const panesRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  // The scroll position we last set on a pane ourselves, so its echo event is not mirrored back.
  const echo = useRef<{ pane: Pane; top: number; timer: number } | null>(null)

  useEffect(() => {
    if (!dragging) savePrefs({ split, scrollSync })
  }, [split, scrollSync, dragging])
  useEffect(
    () => () => {
      if (echo.current) window.clearTimeout(echo.current.timer)
    },
    [],
  )

  const mirror = (source: Pane): void => {
    const from = source === 'editor' ? editorRef.current : previewRef.current
    const to = source === 'editor' ? previewRef.current : editorRef.current
    if (!from || !to) return
    const target: Pane = source === 'editor' ? 'preview' : 'editor'
    const pending = echo.current
    if (pending && pending.pane === source && Math.abs(from.scrollTop - pending.top) < 2) {
      window.clearTimeout(pending.timer)
      echo.current = null
      return
    }
    const fromRange = from.scrollHeight - from.clientHeight
    const toRange = to.scrollHeight - to.clientHeight
    if (fromRange <= 0 || toRange <= 0) return
    to.scrollTop = (from.scrollTop / fromRange) * toRange
    if (pending) window.clearTimeout(pending.timer)
    echo.current = {
      pane: target,
      top: to.scrollTop,
      timer: window.setTimeout(() => {
        echo.current = null
      }, 150),
    }
  }

  const syncFrom = (source: Pane): void => {
    if (scrollSync) mirror(source)
  }

  const toggleScrollSync = (): void => {
    setScrollSync(!scrollSync)
    // Turning sync on lines the preview up with wherever the editor currently is.
    if (!scrollSync) {
      echo.current = null
      mirror('editor')
    }
  }

  const moveDivider = (event: PointerEvent<HTMLDivElement>): void => {
    const panes = panesRef.current
    if (!dragging || !panes) return
    const bounds = panes.getBoundingClientRect()
    const usable = bounds.width - DIVIDER_WIDTH
    if (usable <= 0) return
    setSplit(clampSplit(((event.clientX - bounds.left - DIVIDER_WIDTH / 2) / usable) * 100))
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    setDragging(false)
  }

  const dividerKeys = (event: KeyboardEvent<HTMLDivElement>): void => {
    const step = event.shiftKey ? 10 : 2
    if (event.key === 'ArrowLeft') setSplit((current) => clampSplit(current - step))
    else if (event.key === 'ArrowRight') setSplit((current) => clampSplit(current + step))
    else if (event.key === 'Home') setSplit(MIN_SPLIT)
    else if (event.key === 'End') setSplit(MAX_SPLIT)
    else if (event.key === 'Enter') setSplit(DEFAULT_SPLIT)
    else return
    event.preventDefault()
  }

  const stats = useMemo(() => {
    const trimmed = value.trim()
    return { words: trimmed ? trimmed.split(/\s+/).length : 0, characters: value.length }
  }, [value])
  const overLimit = limit !== undefined && stats.characters > limit

  return (
    <section className={`md-split ${dragging ? 'is-dragging' : ''}`} aria-label={copy.splitEditor.markdownEditorAndPreview}>
      <div className="md-toolbar">
        <div className="md-toolbar-start">{toolbarStart}</div>
        <div className="md-toolbar-end">
          <button
            className={`md-toggle ${scrollSync ? 'is-on' : ''}`}
            type="button"
            aria-pressed={scrollSync}
            onClick={toggleScrollSync}
            title={copy.splitEditor.scrollTheEditorAndThePreviewTogether}
          >
            <ArrowDownUp size={15} aria-hidden="true" />
            {copy.splitEditor.scrollSync}
            <span className="md-toggle-state">{scrollSync ? copy.splitEditor.on : copy.splitEditor.off}</span>
          </button>
          {showThemeToggle && (
            <button
              className="md-icon-button"
              type="button"
              onClick={onToggleTheme}
              aria-label={formatContent(copy.splitEditor.switchToValueMode, {
                value0: theme === 'dark' ? copy.common.light : copy.common.dark,
              })}
              title={formatContent(copy.splitEditor.switchToValueMode, {
                value0: theme === 'dark' ? copy.common.light : copy.common.dark,
              })}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}
        </div>
      </div>

      <div
        className="md-panes"
        ref={panesRef}
        style={{ '--md-left': `${split}fr`, '--md-right': `${100 - split}fr` } as CSSProperties}
      >
        <div className="md-pane">
          <div className="md-pane-head">
            <span className="section-kicker">{copy.splitEditor.markdown}</span>
            <span className={`md-count ${overLimit ? 'is-over' : ''}`}>
              {stats.words.toLocaleString(copy.locale)}
              {copy.splitEditor.words}
              {stats.characters.toLocaleString(copy.locale)}
              {limit !== undefined ? ` / ${limit.toLocaleString(copy.locale)}` : ''}
              {copy.splitEditor.characters}
            </span>
          </div>
          <textarea
            ref={editorRef}
            className="md-editor"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onScroll={() => syncFrom('editor')}
            spellCheck={false}
            aria-label={copy.splitEditor.markdownSource}
            placeholder={copy.splitEditor.typeOrPasteMarkdownHere}
          />
        </div>

        <div
          className="md-divider"
          role="separator"
          aria-orientation="vertical"
          aria-label={copy.splitEditor.resizeEditorAndPreview}
          aria-valuemin={MIN_SPLIT}
          aria-valuemax={MAX_SPLIT}
          aria-valuenow={Math.round(split)}
          tabIndex={0}
          title={copy.splitEditor.dragToResizeDoubleClickToReset}
          onPointerDown={(event) => {
            if (event.button !== 0) return
            event.preventDefault()
            event.currentTarget.setPointerCapture?.(event.pointerId)
            setDragging(true)
          }}
          onPointerMove={moveDivider}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={() => setSplit(DEFAULT_SPLIT)}
          onKeyDown={dividerKeys}
        >
          <span className="md-grip" aria-hidden="true" />
        </div>

        <div className="md-pane">
          <div className="md-pane-head">
            <span className="section-kicker">{copy.splitEditor.preview}</span>
          </div>
          <div
            className="md-preview"
            ref={previewRef}
            onScroll={() => syncFrom('preview')}
            tabIndex={0}
            role="region"
            aria-label={copy.splitEditor.renderedPreview}
          >
            {value.trim() ? (
              <div className="markdown-body">
                <MarkdownPreview source={value} />
              </div>
            ) : (
              <p className="md-empty">{copy.splitEditor.nothingToPreviewYetStartTypingOnTheLeft}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
