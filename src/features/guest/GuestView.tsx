import { content as copy, formatContent } from '../../content.js'
import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Film,
  FileText,
  GraduationCap,
  Library,
  LogIn,
  Moon,
  ShieldCheck,
  Sun,
  Sunrise,
  Upload,
} from '../../components/icons'
import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react'
import type { Theme } from '../../@types'
import { SiteFooter } from '../../components/SiteFooter'
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator'
import { SplitEditor } from '../markdown/SplitEditor'
import { sampleMarkdown } from '../markdown/sampleMarkdown'

type Tab = 'features' | 'markdown'
const tabs: { id: Tab; label: string }[] = [
  { id: 'features', label: copy.guestView.features },
  { id: 'markdown', label: copy.guestView.markdownPreview },
]

const DRAFT_KEY = 'study-library:guest-markdown'

const readDraft = (): string => {
  try {
    return localStorage.getItem(DRAFT_KEY) ?? sampleMarkdown
  } catch {
    return sampleMarkdown
  }
}

type Feature = { icon: ReactNode; title: string; text: string; tag: string; tryIt?: boolean }

const features: Feature[] = [
  {
    icon: <FileText size={20} />,
    title: copy.guestView.markdownPreview,
    text: copy.guestView.writeMarkdownOnTheLeftAndReadTheFinishedPage,
    tag: copy.guestView.tryItNow,
    tryIt: true,
  },
  {
    icon: <Library size={20} />,
    title: copy.guestView.studyLibrary,
    text: copy.guestView.notesPdfsEbooksCodeAndDiagramsSortedIntoCategoriesAnd,
    tag: copy.guestView.signIn,
  },
  {
    icon: <GraduationCap size={20} />,
    title: copy.guestView.interactiveLessons,
    text: copy.guestView.stepByStepLessonsWithQuizzesPracticalExercisesAndDiagrams,
    tag: copy.guestView.signIn,
  },
  {
    icon: <BookMarked size={20} />,
    title: copy.guestView.bookmarksAndProgress,
    text: copy.guestView.bookmarkWhatMattersMarkNotesCompleteAndWatchYourExplored,
    tag: copy.guestView.signIn,
  },
  {
    icon: <Upload size={20} />,
    title: copy.guestView.importAndEbooks,
    text: copy.guestView.importAFileReviewTheSuggestedCategoryAndNameAnd,
    tag: copy.guestView.signIn,
  },
  {
    icon: <Film size={20} />,
    title: copy.guestView.watch,
    text: copy.guestView.aBuiltInPlayerForVideoAndAudioWithSubtitles,
    tag: copy.guestView.signIn,
  },
  {
    icon: <ShieldCheck size={20} />,
    title: copy.guestView.privateAccounts,
    text: copy.guestView.signUpWithAnEmailAndPasswordAddGoogleMicrosoft,
    tag: copy.guestView.signIn,
  },
  {
    icon: <Sunrise size={20} />,
    title: copy.guestView.comfortableReading,
    text: copy.guestView.lightAndDarkThemesALargerReadingSizeAndA,
    tag: copy.guestView.everywhere,
  },
]

type GuestViewProps = {
  theme: Theme
  onToggleTheme: () => void
  onSignIn: () => void
}

export function GuestView({ theme, onToggleTheme, onSignIn }: GuestViewProps) {
  const [tab, setTab] = useState<Tab>('features')
  const [draft, setDraft] = useState(readDraft)
  const tabIndicator = useSlidingIndicator<HTMLDivElement>(
    'guest-tabs',
    tabs.findIndex((entry) => entry.id === tab),
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, draft)
      } catch {
        /* the draft simply will not survive a reload */
      }
    }, 400)
    return () => window.clearTimeout(timer)
  }, [draft])

  const moveTab = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const next = tab === 'features' ? 'markdown' : 'features'
    setTab(next)
    document.getElementById(`guest-tab-${next}`)?.focus()
  }

  return (
    <div className={`guest-shell ${tab === 'markdown' ? 'is-editor' : ''}`} data-theme={theme}>
      <header className="guest-topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="eyebrow">{copy.guestView.guestPreview}</p>
            <h1>{copy.guestView.secondBrain}</h1>
          </div>
        </div>
        <div className="guest-tabs" ref={tabIndicator} role="tablist" aria-label={copy.guestView.guestPreviewSections}>
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              id={`guest-tab-${id}`}
              role="tab"
              type="button"
              aria-selected={tab === id}
              aria-controls={`guest-panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              className={tab === id ? 'is-active' : ''}
              onClick={() => setTab(id)}
              onKeyDown={moveTab}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="guest-actions">
          <button
            className="md-icon-button"
            type="button"
            onClick={onToggleTheme}
            aria-label={formatContent(copy.guestView.switchToValueMode, {
              value0: theme === 'dark' ? copy.common.light : copy.common.dark,
            })}
            title={formatContent(copy.guestView.switchToValueMode, {
              value0: theme === 'dark' ? copy.common.light : copy.common.dark,
            })}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="guest-signin" type="button" onClick={onSignIn}>
            <LogIn size={15} />
            {copy.guestView.signIn}
          </button>
        </div>
      </header>

      {tab === 'features' ? (
        <main className="guest-main" id="guest-panel-features" role="tabpanel" aria-labelledby="guest-tab-features">
          <section className="guest-hero">
            <p className="eyebrow">{copy.guestView.yourCuriosityCollected}</p>
            <h2>{copy.guestView.aCalmPlaceToReadLearnAndWrite}</h2>
            <p>{copy.guestView.youAreBrowsingAsAGuestTheMarkdownPreviewWorks}</p>
            <div className="guest-hero-actions">
              <button className="guest-primary" type="button" onClick={() => setTab('markdown')}>
                <FileText size={16} />
                {copy.guestView.openTheMarkdownPreview}
              </button>
              <button className="guest-secondary" type="button" onClick={onSignIn}>
                {copy.guestView.signInOrCreateAnAccount}
                <ArrowUpRight size={15} />
              </button>
            </div>
          </section>
          <ul className="guest-features" aria-label={copy.guestView.whatTheAppOffers}>
            {features.map((feature) => (
              <li key={feature.title} className={`guest-feature ${feature.tryIt ? 'is-try' : ''}`}>
                <span className="guest-feature-icon" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                {feature.tryIt ? (
                  <button type="button" className="guest-feature-link" onClick={() => setTab('markdown')}>
                    {feature.tag}
                    <ArrowUpRight size={13} />
                  </button>
                ) : (
                  <span className="guest-feature-tag">{feature.tag}</span>
                )}
              </li>
            ))}
          </ul>
          <SiteFooter />
        </main>
      ) : (
        <main
          className="guest-main guest-main-editor"
          id="guest-panel-markdown"
          role="tabpanel"
          aria-labelledby="guest-tab-markdown"
        >
          <SplitEditor
            value={draft}
            onChange={setDraft}
            theme={theme}
            onToggleTheme={onToggleTheme}
            showThemeToggle={false}
            toolbarStart={
              <p className="guest-note">
                {copy.guestView.guestModeYourDraftStaysInThisBrowser}
                <button type="button" onClick={onSignIn}>
                  {copy.guestView.signInToSaveFiles}
                </button>
              </p>
            }
          />
        </main>
      )}
    </div>
  )
}
