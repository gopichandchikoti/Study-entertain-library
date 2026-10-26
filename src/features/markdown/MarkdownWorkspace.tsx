import { content as copy, formatContent } from '../../content.js'
import { Check, FilePlus2, Files, LoaderCircle, PencilLine, Save, Trash2, TriangleAlert } from '../../components/icons'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import {
  ApiError,
  createMarkdownDocument,
  deleteMarkdownDocument,
  fetchMarkdownDocument,
  fetchMarkdownList,
  updateMarkdownDocument,
} from '../../api'
import { formatSize } from '../../utils/format'
import type { MarkdownDocument, MarkdownLimits, MarkdownSummary, Theme } from '../../@types'
import { SplitEditor } from './SplitEditor'
import { nextUntitledName } from './untitled'

type Notice = { kind: 'ok' | 'error'; text: string }

const byNewest = (a: MarkdownSummary, b: MarkdownSummary): number =>
  b.updatedAt.localeCompare(a.updatedAt) || a.name.localeCompare(b.name)

type MarkdownWorkspaceProps = {
  theme: Theme
  onToggleTheme: () => void
  /** Called when the server says the session is gone, so the app can return to sign-in. */
  onUnauthorized: () => void
}

export function MarkdownWorkspace({ theme, onToggleTheme, onUnauthorized }: MarkdownWorkspaceProps) {
  const [documents, setDocuments] = useState<MarkdownSummary[]>([])
  const [limits, setLimits] = useState<MarkdownLimits | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState({ name: '', content: '' })
  const [phase, setPhase] = useState<'loading' | 'ready' | 'opening' | 'saving'>('loading')
  const [notice, setNotice] = useState<Notice | null>(null)
  const [filesOpen, setFilesOpen] = useState(true)
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
  const openTicket = useRef(0)

  const dirty = name.trim() !== saved.name.trim() || content !== saved.content
  const tooLong = limits !== null && content.length > limits.maxContentLength

  // The latest callback is read through a ref so the helpers below stay stable.
  const unauthorized = useRef(onUnauthorized)
  useEffect(() => {
    unauthorized.current = onUnauthorized
  })

  const fail = useCallback((error: unknown, fallback: string): void => {
    if (error instanceof ApiError && error.status === 401) {
      unauthorized.current()
      return
    }
    setNotice({ kind: 'error', text: error instanceof Error ? error.message : fallback })
  }, [])

  const showDocument = useCallback((document: MarkdownDocument): void => {
    setActiveId(document.id)
    setName(document.name)
    setContent(document.content)
    setSaved({ name: document.name, content: document.content })
  }, [])

  const startNewDocument = useCallback((existing: MarkdownSummary[]): void => {
    const untitled = nextUntitledName(existing.map((item) => item.name))
    setActiveId(null)
    setName(untitled)
    setContent('')
    setSaved({ name: untitled, content: '' })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void (async () => {
      try {
        const list = await fetchMarkdownList(controller.signal)
        const [latest] = [...list.documents].sort(byNewest)
        const opened = latest ? await fetchMarkdownDocument(latest.id, controller.signal) : null
        if (controller.signal.aborted) return
        setDocuments(list.documents)
        setLimits(list.limits)
        if (opened) showDocument(opened.document)
        else startNewDocument(list.documents)
      } catch (error) {
        if (controller.signal.aborted) return
        startNewDocument([])
        fail(error, copy.markdownWorkspace.yourFilesCouldNotBeLoaded)
      } finally {
        if (!controller.signal.aborted) setPhase('ready')
      }
    })()
    return () => controller.abort()
  }, [fail, showDocument, startNewDocument])

  useEffect(() => {
    if (notice?.kind !== 'ok') return
    const timer = window.setTimeout(() => setNotice(null), 3000)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent): void => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const confirmDiscard = (): boolean => !dirty || window.confirm(copy.markdownWorkspace.youHaveUnsavedChangesDiscardThem)

  const loadDocument = async (id: string): Promise<void> => {
    const ticket = ++openTicket.current
    setPhase('opening')
    setNotice(null)
    try {
      const { document } = await fetchMarkdownDocument(id)
      if (ticket === openTicket.current) showDocument(document)
    } catch (error) {
      if (ticket === openTicket.current) fail(error, copy.markdownWorkspace.thatFileCouldNotBeOpened)
    } finally {
      if (ticket === openTicket.current) setPhase('ready')
    }
  }

  const openDocument = (id: string): void => {
    if (id === activeId || phase === 'saving' || !confirmDiscard()) return
    void loadDocument(id)
  }

  const newDocument = (): void => {
    if (phase === 'saving' || !confirmDiscard()) return
    ++openTicket.current
    setPhase('ready')
    setNotice(null)
    startNewDocument(documents)
  }

  const save = async (): Promise<void> => {
    if (phase !== 'ready') return
    const sentName = name.trim()
    const sentContent = content
    if (!sentName) {
      setNotice({ kind: 'error', text: copy.markdownWorkspace.giveTheFileANameBeforeSaving })
      return
    }
    if (limits && sentContent.length > limits.maxContentLength) {
      setNotice({
        kind: 'error',
        text: formatContent(copy.markdownWorkspace.aFileCanHoldUpToValueCharacters, {
          value0: limits.maxContentLength.toLocaleString(copy.locale),
        }),
      })
      return
    }
    setPhase('saving')
    setNotice(null)
    try {
      const { document } = activeId
        ? await updateMarkdownDocument(activeId, { name: sentName, content: sentContent })
        : await createMarkdownDocument(sentName, sentContent)
      setActiveId(document.id)
      setSaved({ name: document.name, content: sentContent })
      // Keep anything typed while the request was in flight; only adopt the server's spelling of an unchanged name.
      setName((current) => (current.trim() === sentName ? document.name : current))
      const summary: MarkdownSummary = {
        id: document.id,
        name: document.name,
        size: new TextEncoder().encode(sentContent).length,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      }
      setDocuments((current) => [summary, ...current.filter((item) => item.id !== document.id)].sort(byNewest))
      setNotice({ kind: 'ok', text: copy.markdownWorkspace.saved })
    } catch (error) {
      fail(error, copy.markdownWorkspace.theFileCouldNotBeSaved)
    } finally {
      setPhase('ready')
    }
  }

  const remove = async (id: string): Promise<void> => {
    setConfirmingDelete(null)
    try {
      await deleteMarkdownDocument(id)
    } catch (error) {
      fail(error, copy.markdownWorkspace.theFileCouldNotBeDeleted)
      return
    }
    const remaining = documents.filter((item) => item.id !== id)
    setDocuments(remaining)
    if (id !== activeId) return
    const [next] = [...remaining].sort(byNewest)
    if (next) await loadDocument(next.id)
    else startNewDocument(remaining)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault()
      void save()
    }
  }

  const status = dirty
    ? copy.markdownWorkspace.unsavedChanges
    : activeId
      ? copy.markdownWorkspace.allChangesSaved
      : copy.markdownWorkspace.notSavedYet

  const toolbarStart = (
    <>
      <button
        className="md-icon-button"
        type="button"
        onClick={() => setFilesOpen((open) => !open)}
        aria-label={filesOpen ? copy.markdownWorkspace.hideFileList : copy.markdownWorkspace.showFileList}
        aria-pressed={filesOpen}
        title={filesOpen ? copy.markdownWorkspace.hideFileList : copy.markdownWorkspace.showFileList}
      >
        <Files size={17} />
      </button>
      <label className="md-name">
        <PencilLine size={14} aria-hidden="true" />
        <span className="sr-only">{copy.markdownWorkspace.fileName}</span>
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            setNotice(null)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void save()
          }}
          maxLength={limits?.maxNameLength ?? 100}
          placeholder={copy.markdownWorkspace.fileName}
          aria-invalid={notice?.kind === 'error' || undefined}
        />
      </label>
      <button
        className="md-save"
        type="button"
        onClick={() => void save()}
        disabled={phase !== 'ready' || tooLong || (!dirty && activeId !== null)}
        title={copy.markdownWorkspace.saveCtrlS}
      >
        {phase === 'saving' ? <LoaderCircle className="spin-icon" size={15} /> : <Save size={15} />}
        {copy.markdownWorkspace.save}
      </button>
      <span className={`md-status ${dirty ? 'is-dirty' : ''}`}>{status}</span>
      {notice && (
        <span className={`md-notice is-${notice.kind}`} role={notice.kind === 'error' ? 'alert' : 'status'}>
          {notice.kind === 'ok' ? <Check size={14} aria-hidden="true" /> : <TriangleAlert size={14} aria-hidden="true" />}
          {notice.text}
        </span>
      )}
    </>
  )

  if (phase === 'loading')
    return (
      <div className="md-loading" role="status">
        <LoaderCircle className="spin-icon" size={20} />
        {copy.markdownWorkspace.loadingYourMarkdownFiles}
      </div>
    )

  return (
    <div className={`md-workspace ${filesOpen ? '' : 'files-hidden'}`} onKeyDown={onKeyDown}>
      {filesOpen && (
        <aside className="md-files" aria-label={copy.markdownWorkspace.yourMarkdownFiles}>
          <div className="md-files-head">
            <span className="section-kicker">{copy.markdownWorkspace.yourFiles}</span>
            <span className="count-badge">{documents.length}</span>
          </div>
          <button className="md-new" type="button" onClick={newDocument}>
            <FilePlus2 size={15} />
            {copy.markdownWorkspace.newFile}
          </button>
          <ul>
            {activeId === null && (
              <li className="is-active">
                <span className="md-file" aria-current="true">
                  <strong>{name.trim() || 'Untitled'}</strong>
                  <small>{copy.markdownWorkspace.notSavedYet}</small>
                </span>
              </li>
            )}
            {documents.map((item) => (
              <li key={item.id} className={item.id === activeId ? 'is-active' : ''}>
                {confirmingDelete === item.id ? (
                  <div
                    className="md-confirm"
                    role="group"
                    aria-label={formatContent(copy.markdownWorkspace.deleteValue, { value0: item.name })}
                  >
                    <span>
                      {copy.markdownWorkspace.delete}
                      {item.name}
                      {copy.markdownWorkspace.text}
                    </span>
                    <button type="button" onClick={() => void remove(item.id)}>
                      {copy.markdownWorkspace.delete2}
                    </button>
                    <button type="button" onClick={() => setConfirmingDelete(null)}>
                      {copy.markdownWorkspace.keep}
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className="md-file"
                      type="button"
                      onClick={() => openDocument(item.id)}
                      aria-current={item.id === activeId ? 'true' : undefined}
                    >
                      <strong>{item.name}</strong>
                      <small>
                        {new Date(item.updatedAt).toLocaleDateString(copy.locale)}
                        {copy.markdownWorkspace.text2}
                        {formatSize(item.size)}
                      </small>
                    </button>
                    <button
                      className="md-file-delete"
                      type="button"
                      onClick={() => setConfirmingDelete(item.id)}
                      aria-label={formatContent(copy.markdownWorkspace.deleteValue2, { value0: item.name })}
                      title={copy.markdownWorkspace.deleteThisFile}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {documents.length === 0 && (
            <p className="md-files-empty">{copy.markdownWorkspace.filesYouSaveShowUpHereEveryTimeYouSign}</p>
          )}
        </aside>
      )}
      <div className={`md-editor-area ${phase === 'opening' ? 'is-busy' : ''}`} aria-busy={phase === 'opening'}>
        <SplitEditor
          value={content}
          onChange={setContent}
          theme={theme}
          onToggleTheme={onToggleTheme}
          toolbarStart={toolbarStart}
          limit={limits?.maxContentLength}
        />
      </div>
    </div>
  )
}
