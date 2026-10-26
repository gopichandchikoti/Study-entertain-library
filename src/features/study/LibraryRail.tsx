import type { FolderNode, LibraryResponse, ReadingView } from '../../@types'
import { Bookmark, CheckCircle2, Folder, ListTree, PanelLeftClose, PanelLeftOpen } from '../../components/icons'
import { content as copy } from '../../content.js'

const FOLDERS_SHOWN = 8

type LibraryRailProps = {
  library: LibraryResponse | null
  isOpen: boolean
  readingView: ReadingView
  activeCategory: string
  bookmarkCount: number
  completedCount: number
  folders: FolderNode[]
  onToggle: () => void
  onReadingView: (view: ReadingView) => void
  onCategory: (path: string) => void
  onFolder: (folder: FolderNode) => void
}

/** The left column: reading views (all, bookmarked, completed), categories and the first folders. */
export function LibraryRail(props: LibraryRailProps) {
  const { library, isOpen, readingView, activeCategory, folders } = props
  const toggleLabel = isOpen ? copy.app.collapseLibraryRail : copy.app.expandLibraryRail
  const views: { id: ReadingView; label: string; count: number; icon: typeof ListTree }[] = [
    { id: 'all', label: copy.app.allNotes, count: library?.stats.documents ?? 0, icon: ListTree },
    { id: 'bookmarked', label: copy.app.bookmarked, count: props.bookmarkCount, icon: Bookmark },
    { id: 'completed', label: copy.app.completed, count: props.completedCount, icon: CheckCircle2 },
  ]
  return (
    <aside className={`library-rail ${isOpen ? '' : 'is-collapsed'}`}>
      <div className="rail-heading">
        {isOpen && (
          <div>
            <p className="section-kicker">{copy.app.yourShelves}</p>
            <h2>{library?.root ?? copy.app.loadingLibrary}</h2>
          </div>
        )}
        <button
          className="icon-button subtle"
          type="button"
          onClick={props.onToggle}
          aria-label={toggleLabel}
          title={toggleLabel}
          aria-expanded={isOpen}
        >
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>
      {isOpen && (
        <>
          <nav className="view-tabs" aria-label={copy.app.readingViews}>
            {views.map(({ id, label, count, icon: Icon }) => (
              <button
                key={id}
                className={readingView === id ? 'is-active' : ''}
                type="button"
                onClick={() => props.onReadingView(id)}
              >
                <Icon size={16} />
                {label}
                <span>{count}</span>
              </button>
            ))}
          </nav>
          <div className="rail-divider" />
          <div className="rail-section">
            <div className="rail-section-title">
              <span>{copy.app.categories}</span>
              <span className="count-badge">{library?.stats.categories ?? 0}</span>
            </div>
            <button
              className={`category-row ${activeCategory === 'all' ? 'is-active' : ''}`}
              type="button"
              onClick={() => props.onCategory('all')}
            >
              <span className="category-swatch all-swatch" />
              {copy.app.everything}
              <span className="row-count">{library?.stats.documents ?? 0}</span>
            </button>
            {library?.categories.map((category) => (
              <button
                className={`category-row ${activeCategory === category.path ? 'is-active' : ''}`}
                type="button"
                key={category.path || 'root'}
                onClick={() => props.onCategory(category.path)}
              >
                <span className="category-swatch" />
                {category.name}
                <span className="row-count">{category.documents}</span>
              </button>
            ))}
          </div>
          <div className="rail-section folder-list">
            <div className="rail-section-title">
              <span>{copy.app.folderMap}</span>
              <span className="count-badge">{folders.length}</span>
            </div>
            {folders.slice(0, FOLDERS_SHOWN).map((folder) => (
              <button className="folder-row" type="button" key={folder.path} onClick={() => props.onFolder(folder)}>
                <Folder size={15} />
                {folder.name}
                <span className="row-count">{folder.documents.length}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </aside>
  )
}
