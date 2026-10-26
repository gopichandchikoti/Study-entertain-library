import type { ReactNode } from 'react'
import type { AppMode, Theme } from '../@types'
import { BrandLockup } from '../components/BrandLockup'
import { ModeSwitch } from '../components/ModeSwitch'
import { content as copy } from '../content.js'
import { LocalMarkdown } from '../features/markdown/LocalMarkdown'
import { MarkdownWorkspace } from '../features/markdown/MarkdownWorkspace'
import { MusicDock } from '../features/music/MusicDock'

type MarkdownPageProps = {
  /** Saved files need an account; without one the editor keeps its text in memory only. */
  hasAccount: boolean
  theme: Theme
  accountControl: ReactNode
  onToggleTheme: () => void
  onMode: (mode: AppMode) => void
  onUnauthorized: () => void
}

/** The Markdown editor, either backed by the signed-in account's saved files or local to the page. */
export function MarkdownPage(props: MarkdownPageProps) {
  return (
    <div className="app-shell md-page" data-theme={props.theme}>
      <header className="topbar">
        <BrandLockup subtitle={copy.app.studyLibraryMarkdown} />
        <div className="topbar-actions">
          <ModeSwitch mode="markdown" onMode={props.onMode} />
          {props.accountControl}
        </div>
      </header>
      {props.hasAccount ? (
        <MarkdownWorkspace theme={props.theme} onToggleTheme={props.onToggleTheme} onUnauthorized={props.onUnauthorized} />
      ) : (
        <LocalMarkdown theme={props.theme} onToggleTheme={props.onToggleTheme} />
      )}
      <MusicDock onOpen={() => props.onMode('music')} />
    </div>
  )
}
