import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import type { AppMode, FolderNode, LibraryFile, ReadingScale, ReadingView, Theme } from '../../@types'
import { createEbook, fileUrl } from '../../api'
import { ArrowUpRight, ChevronRight, Clock3, FileUp, RefreshCw } from '../../components/icons'
import { content as copy, formatContent } from '../../content.js'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { Presence } from '../../components/Presence'
import { MusicDock } from '../music/MusicDock'
import { UploadDialog } from '../uploads/UploadDialog'
import { displayTitle, formatCount, resolveRelativePath } from './fileDisplay'
import { LibraryRail } from './LibraryRail'
import { NoteArticle } from './NoteArticle'
import { NoteList } from './NoteList'
import { DownloadPreview, EpubPreview, ImagePreview, PdfPreview } from './previews'
import { StudyHeader } from './StudyHeader'
import { forgetLibrary, rememberedSelection, rememberSelection, useLibrary } from './useLibrary'
import { useMarks } from './useMarks'
import { isInlineContent, useNoteContent } from './useNoteContent'
import { useUploadFlow } from './useUploadFlow'

const UPLOAD_ACCEPT =
  '.md,.markdown,.mdx,.pdf,.txt,.csv,.json,.xml,.yaml,.yml,.py,.js,.jsx,.ts,.tsx,.html,.css,.sql,.docx,.epub,.pptx,.xlsx,.odt,.ods,.odp,.png,.jpg,.jpeg,.gif,.webp,.svg,.avif'

const flattenFolders = (folders: FolderNode[]): FolderNode[] =>
  folders.flatMap((folder) => [folder, ...flattenFolders(folder.children)])

// Course folders hold numbered lessons; the next lesson is the next number in the same folder.
const LESSON_NAME = /^(?:\d{2}-|INDEX-READING|TM-SCHEDULE)/i
const NOT_A_LESSON = /blueprint|first-api-course/

type StudyPageProps = {
  /** The signed-in account id, or null for the shared owner password. */
  userId: string | null
  theme: Theme
  readingScale: ReadingScale
  accountControl: ReactNode
  onToggleTheme: () => void
  onToggleReadingScale: () => void
  onMode: (mode: AppMode) => void
  onUnauthorized: () => void
  onProblem: (message: string) => void
}

/** The Study area: library rail, note list and reading surface. */
export function StudyPage(props: StudyPageProps) {
  const { userId, theme, readingScale } = props
  useSmoothScroll()

  const { library, isLoading, loadError, reload } = useLibrary(userId, () => {
    forgetLibrary()
    props.onUnauthorized()
  })
  const marks = useMarks(userId)
  const [chosenPath, setSelectedPath] = useState<string | null>(() => rememberedSelection(userId))
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [readingView, setReadingView] = useState<ReadingView>('all')
  const [isRailOpen, setIsRailOpen] = useState(true)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isCreatingEbook, setIsCreatingEbook] = useState(false)
  const [ebookError, setEbookError] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const surfaceContentRef = useRef<HTMLDivElement>(null)
  const lastDocumentPath = useRef<string | null>(null)
  const upload = useUploadFlow({ onCommitted: reload, onProblem: props.onProblem })

  const documents = useMemo(() => library?.files.filter((file) => file.kind === 'document') ?? [], [library])
  const folders = useMemo(() => (library ? flattenFolders(library.folders) : []), [library])
  // The chosen note, or the first document when nothing is chosen yet or the chosen note no longer exists.
  const fallbackPath = documents[0]?.path ?? library?.files[0]?.path ?? null
  const selectedPath = library ? (library.files.some((file) => file.path === chosenPath) ? chosenPath : fallbackPath) : chosenPath
  const selectedFile = library?.files.find((file) => file.path === selectedPath) ?? null
  const note = useNoteContent(selectedFile)

  useEffect(() => {
    if (selectedFile?.kind === 'document') lastDocumentPath.current = selectedFile.path
    rememberSelection(userId, library, selectedPath)
  }, [selectedFile, selectedPath, library, userId])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape' && isFocusMode) setIsFocusMode(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isFocusMode])

  const visibleFiles = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (library?.files ?? []).filter((file) => {
      if (activeCategory !== 'all' && file.categoryPath !== activeCategory) return false
      if (term && ![file.title, file.name, file.folderPath].some((value) => value.toLowerCase().includes(term))) return false
      if (readingView === 'bookmarked') return marks.bookmarks.has(file.path)
      if (readingView === 'completed') return marks.completed.has(file.path)
      return true
    })
  }, [library, search, activeCategory, readingView, marks.bookmarks, marks.completed])
  const visibleDocuments = useMemo(() => visibleFiles.filter((file) => file.kind === 'document'), [visibleFiles])
  const visibleImages = useMemo(() => visibleFiles.filter((file) => file.previewKind === 'image'), [visibleFiles])

  const lessons = useMemo(
    () =>
      documents
        .filter(
          (file) => file.folderPath === selectedFile?.folderPath && LESSON_NAME.test(file.name) && !NOT_A_LESSON.test(file.name),
        )
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
    [documents, selectedFile?.folderPath],
  )
  const lessonIndex = lessons.findIndex((file) => file.path === selectedFile?.path)
  const nextLesson = lessonIndex >= 0 ? (lessons[lessonIndex + 1] ?? null) : null

  const completedCount = documents.filter((file) => marks.completed.has(file.path)).length
  const progress = documents.length ? Math.round((completedCount / documents.length) * 100) : 0
  const categoryName = library?.categories.find((category) => category.path === activeCategory)?.name
  const uploadCategories = [
    ...new Set([
      ...(library?.categories ?? []).filter((category) => category.path).map((category) => category.name),
      'Unsorted',
      upload.result?.classification.category ?? '',
    ]),
  ].filter(Boolean)
  const selectedImage = selectedFile?.previewKind === 'image' ? selectedFile : null

  const selectFile = (file: LibraryFile): void => setSelectedPath(file.path)

  const openLinkedNote = (target: string): boolean => {
    const resolved = selectedPath ? resolveRelativePath(selectedPath, target) : null
    const linked = resolved ? library?.files.find((file) => file.path === resolved && file.kind === 'document') : undefined
    if (!linked) return false
    selectFile(linked)
    return true
  }

  const resetView = (): void => {
    setSearch('')
    setActiveCategory('all')
    setReadingView('all')
  }

  const createEpub = (): void => {
    if (!selectedFile || !isInlineContent(selectedFile.previewKind)) return
    setIsCreatingEbook(true)
    setEbookError(null)
    createEbook([selectedFile.path], displayTitle(selectedFile)).then(
      (response) => {
        const link = document.createElement('a')
        link.href = fileUrl(response.path)
        link.download = response.fileName
        link.click()
        setIsCreatingEbook(false)
        reload()
      },
      (error: unknown) => {
        setIsCreatingEbook(false)
        setEbookError(error instanceof Error ? error.message : copy.app.theEbookCouldNotBeCreated)
      },
    )
  }

  // A soft glow follows the pointer across the reading surface; the note itself never moves.
  const followPointer = (event: PointerEvent<HTMLElement>): void => {
    const surface = surfaceContentRef.current
    if (event.pointerType === 'touch' || !surface) return
    const bounds = event.currentTarget.getBoundingClientRect()
    surface.style.setProperty('--glow-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`)
    surface.style.setProperty('--glow-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`)
  }

  const resetPointer = (): void => {
    surfaceContentRef.current?.style.setProperty('--glow-x', '50%')
    surfaceContentRef.current?.style.setProperty('--glow-y', '40%')
  }

  const preview = (() => {
    if (selectedImage)
      return (
        <ImagePreview
          file={selectedImage}
          onClose={() => setSelectedPath(lastDocumentPath.current ?? documents[0]?.path ?? null)}
        />
      )
    if (selectedFile?.previewKind === 'pdf') return <PdfPreview file={selectedFile} />
    if (selectedFile?.previewKind === 'epub') return <EpubPreview key={selectedFile.path} file={selectedFile} />
    if (selectedFile?.previewKind === 'download') return <DownloadPreview file={selectedFile} />
    return null
  })()

  const indexedAt = library
    ? new Date(library.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--'

  return (
    <div className={`app-shell ${isFocusMode ? 'is-focus-mode' : ''}`} data-theme={theme}>
      <div className="ambient-grid" aria-hidden="true" />
      <a className="skip-link" href="#main">
        {copy.app.skipToContent}
      </a>
      <StudyHeader
        theme={theme}
        search={search}
        searchRef={searchRef}
        isFocusMode={isFocusMode}
        accountControl={props.accountControl}
        onSearch={setSearch}
        onSearchEnter={() => visibleFiles[0] && selectFile(visibleFiles[0])}
        onToggleTheme={props.onToggleTheme}
        onToggleFocus={() => setIsFocusMode((current) => !current)}
        onMode={props.onMode}
      />
      <main className="workspace" id="main">
        {!isFocusMode && (
          <LibraryRail
            library={library}
            isOpen={isRailOpen}
            readingView={readingView}
            activeCategory={activeCategory}
            bookmarkCount={marks.bookmarks.size}
            completedCount={completedCount}
            folders={folders}
            onToggle={() => setIsRailOpen((current) => !current)}
            onReadingView={setReadingView}
            onCategory={setActiveCategory}
            onFolder={(folder) => {
              setActiveCategory(folder.path.split('/')[0] ?? 'all')
              setSearch(folder.name)
            }}
          />
        )}
        <section className="content-stage">
          <div className="stage-intro">
            <div>
              <p className="section-kicker">{copy.app.yourLearningCockpit}</p>
              <h2>{activeCategory === 'all' ? copy.app.pickUpWhereCuriosityLeftOff : categoryName}</h2>
              <p className="stage-subtitle">{copy.app.aCalmIndexForDeepWorkBuiltFromTheFolders}</p>
            </div>
            <div className="stage-actions">
              <button className="upload-button" type="button" onClick={upload.open}>
                <FileUp size={15} />
                {copy.app.importStudyFile}
              </button>
              <button className="refresh-button" type="button" onClick={reload}>
                <RefreshCw size={15} />
                {copy.app.rescanFolders}
              </button>
            </div>
          </div>
          <div className="progress-strip">
            <div className="progress-copy">
              <span className="progress-orbit">
                <span />
              </span>
              <div>
                <strong>
                  {progress}
                  {copy.app.explored}
                </strong>
                <span>
                  {formatCount(completedCount, 'note')}
                  {copy.app.completedInThisLibrary}
                </span>
              </div>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={formatContent(copy.app.valueOfNotesCompleted, { value0: progress })}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-hint">
              {indexedAt}
              {copy.app.index}
            </span>
          </div>
          <div className="content-grid">
            <NoteList
              search={search}
              documents={visibleDocuments}
              images={visibleImages}
              selectedPath={selectedPath}
              bookmarks={marks.bookmarks}
              completed={marks.completed}
              isLoading={isLoading}
              loadError={loadError}
              onRetry={reload}
              onReset={resetView}
              onSelect={selectFile}
              onToggleBookmark={marks.toggleBookmark}
              onToggleCompleted={marks.toggleCompleted}
            />
            <section className="reading-column">
              {selectedFile && (
                <nav className="reading-context" aria-label={copy.app.currentNoteLocation}>
                  <button
                    className="breadcrumb-link"
                    type="button"
                    onClick={() => {
                      setActiveCategory(selectedFile.categoryPath || 'all')
                      setSearch('')
                      setReadingView('all')
                    }}
                    aria-current={activeCategory === (selectedFile.categoryPath || 'all') ? 'page' : undefined}
                  >
                    {selectedFile.category}
                  </button>
                  <ChevronRight className="breadcrumb-separator" size={14} aria-hidden="true" />
                  <button
                    className="breadcrumb-link"
                    type="button"
                    onClick={() => {
                      setActiveCategory(selectedFile.categoryPath || 'all')
                      setSearch(selectedFile.folderPath)
                      setReadingView('all')
                    }}
                  >
                    {selectedFile.folderPath || copy.app.libraryRoot}
                  </button>
                </nav>
              )}
              <article className="reading-surface" onPointerMove={followPointer} onPointerLeave={resetPointer}>
                <div className="surface-content" ref={surfaceContentRef}>
                  <div className="surface-glow" aria-hidden="true" />
                  {preview ?? (
                    <NoteArticle
                      file={selectedFile}
                      note={note}
                      accountKey={userId ?? 'owner'}
                      readingScale={readingScale}
                      isBookmarked={Boolean(selectedFile && marks.bookmarks.has(selectedFile.path))}
                      isCompleted={Boolean(selectedFile && marks.completed.has(selectedFile.path))}
                      isCreatingEbook={isCreatingEbook}
                      ebookError={ebookError}
                      nextLesson={nextLesson}
                      onToggleBookmark={() => selectedFile && marks.toggleBookmark(selectedFile.path)}
                      onToggleReadingScale={props.onToggleReadingScale}
                      onCreateEbook={createEpub}
                      onToggleCompleted={() => selectedFile && marks.toggleCompleted(selectedFile.path)}
                      onMarkCompleted={() => selectedFile && marks.markCompleted(selectedFile.path)}
                      onOpenLesson={selectFile}
                      openLinkedNote={openLinkedNote}
                    />
                  )}
                </div>
              </article>
              {!isFocusMode && (
                <aside className="insight-deck">
                  <div className="insight-heading">
                    <div>
                      <span className="section-kicker">{copy.app.sessionSignals}</span>
                      <h3>{copy.app.keepTheThread}</h3>
                    </div>
                    <Clock3 size={18} />
                  </div>
                  <div className="signal-grid">
                    <div>
                      <span>{copy.app.queue}</span>
                      <strong>{visibleDocuments.length}</strong>
                      <small>{copy.app.notesInView}</small>
                    </div>
                    <div>
                      <span>{copy.app.saved}</span>
                      <strong>{marks.bookmarks.size}</strong>
                      <small>{copy.app.bookmarks}</small>
                    </div>
                    <div>
                      <span>{copy.app.folders}</span>
                      <strong>{library?.stats.folders ?? 0}</strong>
                      <small>{copy.app.toExplore}</small>
                    </div>
                  </div>
                  <div className="next-move">
                    <div className="next-icon">
                      <ArrowUpRight size={17} />
                    </div>
                    <div>
                      <span>{copy.app.nextMove}</span>
                      <p>
                        {selectedFile
                          ? formatContent(copy.app.continueWithValue, { value0: displayTitle(selectedFile) })
                          : copy.app.chooseOneSmallIdeaAndStayWithIt}
                      </p>
                    </div>
                  </div>
                </aside>
              )}
            </section>
          </div>
        </section>
      </main>
      <Presence show={upload.isOpen}>
        <UploadDialog
          isOpen={upload.isOpen}
          state={upload.state}
          error={upload.error}
          result={upload.result}
          categories={uploadCategories}
          category={upload.category}
          fileName={upload.fileName}
          accept={UPLOAD_ACCEPT}
          isDropActive={upload.isDropActive}
          onClose={upload.close}
          onFile={upload.chooseFile}
          onDrop={upload.drop}
          onDragEnter={() => upload.setIsDropActive(true)}
          onDragLeave={() => upload.setIsDropActive(false)}
          onCategoryChange={upload.setCategory}
          onFileNameChange={upload.setFileName}
          onCommit={upload.commit}
        />
      </Presence>
      <MusicDock onOpen={() => props.onMode('music')} />
    </div>
  )
}
