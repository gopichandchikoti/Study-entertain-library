import { content as copy } from '../../content.js'
import { CircleAlert, FileText, FileUp, LoaderCircle, Sparkles, Upload, X } from '../../components/icons'
import type { DragEvent } from 'react'
import { formatSize } from '../../utils/format'
import type { UploadResponse } from '../../@types'

type UploadDialogProps = {
  isOpen: boolean
  state: 'idle' | 'uploading' | 'reviewing' | 'committing'
  error: string | null
  result: UploadResponse['upload'] | null
  categories: string[]
  category: string
  fileName: string
  accept: string
  isDropActive: boolean
  onClose: () => void
  onFile: (file: File | undefined) => void
  onDrop: (event: DragEvent<HTMLLabelElement>) => void
  onDragEnter: () => void
  onDragLeave: () => void
  onCategoryChange: (value: string) => void
  onFileNameChange: (value: string) => void
  onCommit: () => void
}

export function UploadDialog({
  isOpen,
  state,
  error,
  result,
  categories,
  category,
  fileName,
  accept,
  isDropActive,
  onClose,
  onFile,
  onDrop,
  onDragEnter,
  onDragLeave,
  onCategoryChange,
  onFileNameChange,
  onCommit,
}: UploadDialogProps) {
  if (!isOpen) return null
  const isBusy = state === 'uploading' || state === 'committing'
  const confidence = result ? Math.round(result.classification.confidence * 100) : 0

  return (
    <div
      className="upload-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isBusy) onClose()
      }}
    >
      <section className="upload-dialog" role="dialog" aria-modal="true" aria-labelledby="upload-dialog-title">
        <header className="dialog-header">
          <div>
            <span className="section-kicker">{copy.uploadDialog.libraryImport}</span>
            <h2 id="upload-dialog-title">{copy.uploadDialog.bringATextbookIntoFocus}</h2>
            <p>{copy.uploadDialog.uploadAFileReviewItsTopicSuggestionThenPlaceIt}</p>
          </div>
          <button
            className="icon-button subtle"
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label={copy.uploadDialog.closeImportDialog}
            title={copy.uploadDialog.closeImportDialog}
          >
            <X size={18} />
          </button>
        </header>
        {!result && (
          <label
            className={`upload-dropzone ${isDropActive ? 'is-active' : ''}`}
            onDragEnter={(event) => {
              event.preventDefault()
              onDragEnter()
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input type="file" accept={accept} onChange={(event) => onFile(event.target.files?.[0])} />
            {state === 'uploading' ? <LoaderCircle className="spin-icon" size={28} /> : <FileUp size={28} />}
            <strong>
              {state === 'uploading' ? copy.uploadDialog.readingTheUpload : copy.uploadDialog.chooseAStudyFileOrDropItHere}
            </strong>
            <span>{copy.uploadDialog.pdfMarkdownImagesTextDocxEpubAndCommonTextbookFormats}</span>
          </label>
        )}
        {result && (
          <div className="upload-review">
            <div className="upload-file-heading">
              <div className="upload-file-icon">
                <FileText size={18} />
              </div>
              <div>
                <strong>{result.originalName}</strong>
                <span>
                  {result.extension.toUpperCase()}
                  {copy.uploadDialog.text}
                  {formatSize(result.size)}
                </span>
              </div>
            </div>
            <div className="classification-callout">
              <Sparkles size={17} />
              <div>
                <strong>
                  {result.classification.source === 'ai'
                    ? copy.uploadDialog.aiTopicSuggestion
                    : copy.uploadDialog.localTopicSuggestion}
                </strong>
                <span>{result.classification.summary}</span>
              </div>
              <b>
                {confidence}
                {copy.uploadDialog.text2}
              </b>
            </div>
            <div className="upload-fields">
              <label>
                <span>{copy.uploadDialog.folder}</span>
                <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{copy.uploadDialog.fileName}</span>
                <input value={fileName} onChange={(event) => onFileNameChange(event.target.value)} />
              </label>
            </div>
            {result.classification.tags.length > 0 && (
              <div className="tag-row">
                {result.classification.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
            {result.previewText && (
              <details className="upload-preview">
                <summary>{copy.uploadDialog.viewExtractedPreview}</summary>
                <pre>{result.previewText}</pre>
              </details>
            )}
          </div>
        )}
        {error && (
          <p className="upload-error">
            <CircleAlert size={16} />
            {error}
          </p>
        )}
        <footer className="dialog-footer">
          <button className="text-button" type="button" onClick={onClose} disabled={isBusy}>
            <X size={15} />
            {copy.uploadDialog.cancel}
          </button>
          {result && (
            <button className="upload-button" type="button" onClick={onCommit} disabled={isBusy || !category || !fileName}>
              {state === 'committing' ? (
                <>
                  <LoaderCircle className="spin-icon" size={15} />
                  {copy.uploadDialog.adding}
                </>
              ) : (
                <>
                  <Upload size={15} />
                  {copy.uploadDialog.addToLibrary}
                </>
              )}
            </button>
          )}
        </footer>
      </section>
    </div>
  )
}
