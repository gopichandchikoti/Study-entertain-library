import { useEffect, useRef, useState } from 'react'
import type { LibraryFile } from '../../@types'
import { assetUrl, fileUrl } from '../../api'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Download,
  ExternalLink,
  File,
  FileText,
  Image as ImageGlyph,
} from '../../components/icons'
import { content as copy } from '../../content.js'
import { displayTitle } from './fileDisplay'

type Rendition = { next: () => Promise<unknown>; prev: () => Promise<unknown> }

function Caption({ file, icon }: { file: LibraryFile; icon: 'file' | 'book' | 'image' | 'text' }) {
  const Glyph = { file: File, book: BookOpen, image: ImageGlyph, text: FileText }[icon]
  return (
    <div className="image-caption">
      <Glyph size={15} />
      <span>{file.path}</span>
    </div>
  )
}

export function ImagePreview({ file, onClose }: { file: LibraryFile; onClose: () => void }) {
  return (
    <div className="image-preview">
      <div className="image-preview-heading">
        <div>
          <span className="section-kicker">{copy.app.visualReference}</span>
          <h2>{displayTitle(file)}</h2>
        </div>
        <button className="text-button" type="button" onClick={onClose}>
          {copy.app.backToNote}
        </button>
      </div>
      <div className="image-frame">
        <img src={assetUrl(file.path)} alt={displayTitle(file)} decoding="async" />
      </div>
      <Caption file={file} icon="image" />
    </div>
  )
}

export function PdfPreview({ file }: { file: LibraryFile }) {
  return (
    <div className="file-preview pdf-preview">
      <div className="image-preview-heading">
        <div>
          <span className="section-kicker">{copy.app.textbookPreview}</span>
          <h2>{displayTitle(file)}</h2>
        </div>
        <div className="file-preview-actions">
          <a className="text-button" href={fileUrl(file.path)} target="_blank" rel="noreferrer">
            <ExternalLink size={15} />
            {copy.app.open}
          </a>
          <a className="text-button" href={fileUrl(file.path)} download={file.name}>
            <Download size={15} />
            {copy.app.download}
          </a>
        </div>
      </div>
      <iframe className="pdf-frame" src={fileUrl(file.path)} title={displayTitle(file)} />
      <Caption file={file} icon="text" />
    </div>
  )
}

export function EpubPreview({ file }: { file: LibraryFile }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const renditionRef = useRef<Rendition | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!frameRef.current) return
    let disposed = false
    let book: ReturnType<typeof import('epubjs').default> | null = null
    void import('epubjs')
      .then(({ default: ePub }) => {
        if (disposed || !frameRef.current) return
        book = ePub(fileUrl(file.path))
        const rendition = book.renderTo(frameRef.current, { width: '100%', height: '100%' })
        renditionRef.current = rendition
        return rendition.display()
      })
      .catch(() => {
        if (!disposed) setError(copy.app.thisEpubCouldNotBeOpenedInTheReader)
      })
    return () => {
      disposed = true
      renditionRef.current = null
      book?.destroy()
    }
  }, [file.path])

  const movePage = (direction: 'next' | 'prev'): void => {
    const rendition = renditionRef.current
    if (rendition) rendition[direction]().catch(() => setError(copy.app.thisChapterCouldNotBeOpened))
  }

  return (
    <div className="file-preview epub-preview">
      <div className="image-preview-heading">
        <div>
          <span className="section-kicker">{copy.app.ebookReader}</span>
          <h2>{displayTitle(file)}</h2>
        </div>
        <div className="file-preview-actions">
          <a className="text-button" href={fileUrl(file.path)} download={file.name}>
            <Download size={15} />
            {copy.app.download}
          </a>
        </div>
      </div>
      <div className="epub-frame" ref={frameRef}>
        {error && (
          <div className="reading-state error-state">
            <CircleAlert size={22} />
            <p>{error}</p>
          </div>
        )}
      </div>
      <div className="epub-controls">
        <button className="text-button" type="button" onClick={() => movePage('prev')}>
          <ChevronLeft size={15} />
          {copy.app.previous}
        </button>
        <span>{copy.app.useTheBookControlsToTurnPages}</span>
        <button className="text-button" type="button" onClick={() => movePage('next')}>
          {copy.app.next}
          <ChevronRight size={15} />
        </button>
      </div>
      <Caption file={file} icon="book" />
    </div>
  )
}

export function DownloadPreview({ file }: { file: LibraryFile }) {
  return (
    <div className="file-preview download-preview">
      <div className="download-icon">
        <File size={26} />
      </div>
      <span className="section-kicker">{copy.app.filePreview}</span>
      <h2>{displayTitle(file)}</h2>
      <p>{copy.app.thisFormatIsStoredSafelyInTheLibraryAndCan}</p>
      <div className="file-preview-actions">
        <a className="upload-button" href={fileUrl(file.path)} target="_blank" rel="noreferrer">
          <ExternalLink size={15} />
          {copy.app.openFile}
        </a>
        <a className="text-button" href={fileUrl(file.path)} download={file.name}>
          <Download size={15} />
          {copy.app.download}
        </a>
      </div>
      <Caption file={file} icon="file" />
    </div>
  )
}
