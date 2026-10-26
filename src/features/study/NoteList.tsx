import { memo, useState, type CSSProperties } from 'react'
import type { LibraryFile } from '../../@types'
import { Bookmark, BookmarkCheck, BookOpen, ChevronDown, ChevronRight, CheckCircle2, CircleAlert } from '../../components/icons'
import { content as copy, formatContent } from '../../content.js'
import { formatSize } from '../../utils/format'
import { displayTitle } from './fileDisplay'
import { FileGlyph } from './FileGlyph'

type RowProps = {
  file: LibraryFile
  index: number
  isSelected: boolean
  isBookmarked: boolean
  isCompleted: boolean
  onSelect: (file: LibraryFile) => void
  onToggleBookmark: (path: string) => void
  onToggleCompleted: (path: string) => void
}

const FileRow = memo(function FileRow({
  file,
  index,
  isSelected,
  isBookmarked,
  isCompleted,
  onSelect,
  onToggleBookmark,
  onToggleCompleted,
}: RowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const title = displayTitle(file)
  const bookmarkLabel = isBookmarked
    ? formatContent(copy.app.removeValueBookmark, { value0: title })
    : formatContent(copy.app.bookmarkValue, { value0: title })
  return (
    <article
      className={`file-row ${isSelected ? 'is-selected' : ''} ${isCompleted ? 'is-completed' : ''}`}
      style={{ '--row-index': index } as CSSProperties}
    >
      <button className="file-main" type="button" onClick={() => onSelect(file)} aria-current={isSelected ? 'true' : undefined}>
        <span className={`file-icon ${file.kind} ${file.previewKind}`}>
          <FileGlyph file={file} />
        </span>
        <span className="file-copy">
          <strong>{title}</strong>
          <small>{file.folderPath || copy.app.libraryRoot}</small>
        </span>
        {isCompleted && <CheckCircle2 className="completed-icon" size={16} />}
        {isSelected && <span className="selected-pulse" />}
      </button>
      <div className="file-actions">
        <button
          className="row-action"
          type="button"
          onClick={() => onToggleBookmark(file.path)}
          aria-pressed={isBookmarked}
          aria-label={bookmarkLabel}
          title={isBookmarked ? copy.app.removeBookmark : copy.app.bookmark}
        >
          {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        </button>
        <button
          className="row-action"
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-label={copy.app.openFileDetails}
          title={copy.app.fileDetails}
        >
          {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>
      {isOpen && (
        <div className="file-detail">
          <span>{file.name}</span>
          <span>
            {formatSize(file.size)}
            {copy.app.text}
            {new Date(file.modifiedAt).toLocaleDateString(copy.locale)}
          </span>
          <button type="button" onClick={() => onToggleCompleted(file.path)}>
            {isCompleted ? copy.app.unmarkComplete : copy.app.markComplete}
          </button>
        </div>
      )}
    </article>
  )
})

type NoteListProps = {
  search: string
  documents: LibraryFile[]
  images: LibraryFile[]
  selectedPath: string | null
  bookmarks: ReadonlySet<string>
  completed: ReadonlySet<string>
  isLoading: boolean
  loadError: string | null
  onRetry: () => void
  onReset: () => void
  onSelect: (file: LibraryFile) => void
  onToggleBookmark: (path: string) => void
  onToggleCompleted: (path: string) => void
}

/** The notes that match the current view, with loading, error and empty states. */
export function NoteList(props: NoteListProps) {
  const { search, documents, images, selectedPath, bookmarks, completed, isLoading, loadError, onRetry, onReset } = props
  const total = documents.length + images.length
  const row = (file: LibraryFile, index: number) => (
    <FileRow
      key={file.path}
      file={file}
      index={index}
      isSelected={selectedPath === file.path}
      isBookmarked={bookmarks.has(file.path)}
      isCompleted={completed.has(file.path)}
      onSelect={props.onSelect}
      onToggleBookmark={props.onToggleBookmark}
      onToggleCompleted={props.onToggleCompleted}
    />
  )
  return (
    <section className="note-deck" aria-label={copy.app.studyFiles}>
      <div className="deck-header">
        <div>
          <span className="section-kicker">{copy.app.readingQueue}</span>
          <h3>{search ? formatContent(copy.app.resultsForValue, { value0: search }) : copy.app.yourNotes}</h3>
        </div>
        <span className="result-count">
          {total}
          {copy.app.items}
        </span>
      </div>
      {isLoading && (
        <div className="state-panel" role="status">
          <div className="loading-orbit" />
          <p>{copy.app.mappingYourShelves}</p>
        </div>
      )}
      {!isLoading && loadError && (
        <div className="state-panel error-state" role="alert">
          <CircleAlert size={20} />
          <p>{loadError}</p>
          <button type="button" onClick={onRetry}>
            {copy.app.tryAgain}
          </button>
        </div>
      )}
      {!isLoading && !loadError && total === 0 && (
        <div className="state-panel">
          <BookOpen size={22} />
          <p>{copy.app.noNotesMatchThisViewYet}</p>
          <button type="button" onClick={onReset}>
            {copy.app.resetView}
          </button>
        </div>
      )}
      <div className="file-list">
        {documents.map((file, index) => row(file, index))}
        {images.length > 0 && (
          <div className="asset-divider">
            <span>{copy.app.visualReferences}</span>
            <span>{images.length}</span>
          </div>
        )}
        {images.map((file, index) => row(file, index + documents.length))}
      </div>
    </section>
  )
}
