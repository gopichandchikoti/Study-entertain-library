import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import type { ContentResponse, LibraryFile, ReadingScale } from '../../@types'
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  CircleAlert,
  FileText,
  LoaderCircle,
} from '../../components/icons'
import { content as copy } from '../../content.js'
import { formatSize } from '../../utils/format'
import { LearningLesson } from '../learning/LearningLesson'
import { remarkSectionAnchors } from '../learning/sectionAnchors'
import { isInlineContent } from './useNoteContent'
import { createMarkdownComponents } from './markdownComponents'

type NoteArticleProps = {
  file: LibraryFile | null
  note: { content: ContentResponse | null; error: string | null; isLoading: boolean }
  /** Keys the lesson so progress is tracked per account and per note. */
  accountKey: string
  readingScale: ReadingScale
  isBookmarked: boolean
  isCompleted: boolean
  isCreatingEbook: boolean
  ebookError: string | null
  nextLesson: LibraryFile | null
  onToggleBookmark: () => void
  onToggleReadingScale: () => void
  onCreateEbook: () => void
  onToggleCompleted: () => void
  onMarkCompleted: () => void
  onOpenLesson: (file: LibraryFile) => void
  openLinkedNote: (target: string) => boolean
}

/** A note: its toolbar, its text (as a lesson when it is Markdown) and the mark-as-complete footer. */
export function NoteArticle(props: NoteArticleProps) {
  const { file, note, readingScale, isCompleted, nextLesson } = props
  const bookmarkLabel = props.isBookmarked ? copy.app.removeBookmark : copy.app.bookmarkNote
  const scaleLabel = readingScale === 'standard' ? copy.app.increaseReadingSize : copy.app.useStandardReadingSize
  const components = createMarkdownComponents({ notePath: file?.path ?? null, openLinkedNote: props.openLinkedNote })
  const canMakeEbook = Boolean(file && isInlineContent(file.previewKind)) && !props.isCreatingEbook

  return (
    <>
      <div className="note-toolbar">
        <div className="toolbar-actions">
          <button
            className="toolbar-button"
            type="button"
            onClick={props.onToggleBookmark}
            aria-pressed={props.isBookmarked}
            aria-label={bookmarkLabel}
            title={bookmarkLabel}
          >
            {props.isBookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
          </button>
          <button
            className="toolbar-button"
            type="button"
            onClick={props.onToggleReadingScale}
            aria-label={scaleLabel}
            title={scaleLabel}
          >
            <span className="type-toggle">{copy.app.aa}</span>
          </button>
          <button
            className="toolbar-button"
            type="button"
            onClick={props.onCreateEbook}
            disabled={!canMakeEbook}
            aria-label={copy.app.createEpubFromThisNote}
            title={copy.app.createEpubFromThisNote}
          >
            {props.isCreatingEbook ? <LoaderCircle className="spin-icon" size={17} /> : <BookOpen size={17} />}
          </button>
          {props.ebookError && (
            <span className="toolbar-status" role="status">
              {props.ebookError}
            </span>
          )}
        </div>
      </div>
      {note.isLoading && (
        <div className="reading-state" role="status">
          <div className="loading-orbit" />
          <p>{copy.app.openingTheNextIdea}</p>
        </div>
      )}
      {!note.isLoading && note.error && (
        <div className="reading-state error-state" role="alert">
          <CircleAlert size={22} />
          <p>{note.error}</p>
        </div>
      )}
      {!note.isLoading && !note.error && note.content && file && (
        <div className={`markdown-body reading-size-${readingScale}`}>
          <div className="note-meta">
            <span className="note-type">
              <FileText size={14} />
              {file.extension.replace('.', '').toUpperCase()}{' '}
              {file.previewKind === 'markdown' ? copy.common.note : copy.common.text}
            </span>
            <span>{formatSize(file.size)}</span>
            <span>{new Date(file.modifiedAt).toLocaleDateString(copy.locale)}</span>
          </div>
          {file.previewKind === 'markdown' ? (
            <LearningLesson
              key={`${props.accountKey}:${file.path}`}
              markdown={note.content.content}
              nextLesson={nextLesson?.title ?? null}
              onNext={() => nextLesson && props.onOpenLesson(nextLesson)}
              onComplete={props.onMarkCompleted}
              renderLesson={(markdown) => (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkSectionAnchors]}
                  rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                  components={components}
                >
                  {markdown}
                </ReactMarkdown>
              )}
            />
          ) : (
            <pre className="text-file-body">{note.content.content}</pre>
          )}
          <div className="note-footer">
            <button
              className={`complete-button ${isCompleted ? 'is-complete' : ''}`}
              type="button"
              onClick={props.onToggleCompleted}
              aria-pressed={isCompleted}
            >
              {isCompleted ? <Check size={16} /> : <CheckCircle2 size={16} />}{' '}
              {isCompleted ? copy.app.completed : copy.app.markAsComplete}
            </button>
            <span className="footer-path">{file.path}</span>
          </div>
        </div>
      )}
      {!note.isLoading && !note.error && !note.content && !file && (
        <div className="reading-state">
          <BookOpen size={26} />
          <p>{copy.app.selectANoteToBegin}</p>
        </div>
      )}
    </>
  )
}
