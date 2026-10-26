import type { KeyboardEvent, ReactNode, RefObject } from 'react'
import type { AppMode, Theme } from '../../@types'
import { BrandLockup } from '../../components/BrandLockup'
import { Moon, Search, Sun, Zap } from '../../components/icons'
import { ModeSwitch } from '../../components/ModeSwitch'
import { content as copy, formatContent } from '../../content.js'

type StudyHeaderProps = {
  theme: Theme
  search: string
  searchRef: RefObject<HTMLInputElement | null>
  isFocusMode: boolean
  accountControl: ReactNode
  onSearch: (value: string) => void
  onSearchEnter: () => void
  onToggleTheme: () => void
  onToggleFocus: () => void
  onMode: (mode: AppMode) => void
}

/** Brand, mode switch, note search and the theme, account and focus controls. */
export function StudyHeader(props: StudyHeaderProps) {
  const { searchRef } = props
  const nextTheme = formatContent(copy.app.switchToValueMode, {
    value0: props.theme === 'dark' ? copy.common.light : copy.common.dark,
  })
  const focusLabel = props.isFocusMode ? copy.app.exitFocusMode : copy.app.enterFocusMode
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') props.onSearchEnter()
  }
  return (
    <header className="topbar">
      <BrandLockup subtitle={copy.app.studyLibraryLocalIndex} />
      <div className="topbar-actions">
        <ModeSwitch mode="study" onMode={props.onMode} />
        <label className="search-box">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">{copy.app.searchStudyNotes}</span>
          <input
            ref={searchRef}
            value={props.search}
            onChange={(event) => props.onSearch(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={copy.app.findAConcept}
          />
          <kbd>{copy.app.ctrlK}</kbd>
        </label>
        <button className="icon-button" type="button" onClick={props.onToggleTheme} aria-label={nextTheme} title={nextTheme}>
          {props.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {props.accountControl}
        <button
          className="icon-button"
          type="button"
          onClick={props.onToggleFocus}
          aria-pressed={props.isFocusMode}
          aria-label={focusLabel}
          title={focusLabel}
        >
          <Zap size={18} />
        </button>
      </div>
    </header>
  )
}
