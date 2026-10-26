import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import type { AppMode, AuthSessionResponse, ReadingScale, Theme } from './@types'
import { authRequest, fetchSession, logout } from './api'
import { LogOut } from './components/icons'
import { content as copy } from './content.js'
import { AuthGate } from './features/auth/AuthGate'
import { ProfileMenu } from './features/auth/ProfileMenu'
import { GuestView } from './features/guest/GuestView'
import { setLearningProgressScope } from './features/learning/learningProgress'
import { useMusic } from './features/music/musicContext'
import { MusicDock } from './features/music/MusicDock'
import { StudyPage } from './features/study/StudyPage'
import { forgetLibrary } from './features/study/useLibrary'
import { LegalPage } from './pages/LegalPage'
import { MarkdownPage } from './pages/MarkdownPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { modePath, navigate, routeForPath, usePathname } from './routes'
import { readStorage, writeStorage } from './utils/storage'
import './features/auth/Auth.css'
import './components/Shell.css'
import './features/study/Study.css'
import './features/uploads/Upload.css'
import './themes/prose.css'
import './components/SiteFooter.css'
import './pages/LegalPage.css'
import './features/study/Study.responsive.css'
import './features/learning/Learning.css'
import './features/markdown/Markdown.css'
import './features/guest/Guest.css'
import './components/ModeSwitch.motion.css'
import './features/guest/Guest.motion.css'
import './features/uploads/Upload.motion.css'
import './features/auth/Auth.motion.css'

const WatchView = lazy(() => import('./features/watch/WatchView').then((module) => ({ default: module.WatchView })))
const MusicView = lazy(() => import('./features/music/MusicView').then((module) => ({ default: module.MusicView })))

const MODE_KEY = 'study-library:mode'
const THEME_KEY = 'study-library:theme'
const EMAIL_LINK_HASH = /^#(?:verify-email|reset-password|auth-error)=/

const lastMode = (): AppMode => {
  const stored = readStorage(MODE_KEY)
  return stored === 'watch' || stored === 'markdown' || stored === 'music' ? stored : 'study'
}

const verificationNotice = (session: AuthSessionResponse): string | null => {
  if (!session.verification || session.user?.emailVerified) return null
  if (session.verification === 'sent') return copy.app.checkYourInboxToVerifyYourEmail
  if (session.verification === 'offline') return copy.app.localAccountCreatedEmailDeliveryIsUnavailableYourEmailIs
  return copy.app.accountCreatedButVerificationEmailDeliveryFailedRetryFromMy
}

/** Owns what every area shares: who is signed in, the theme and the address. Each area is its own page. */
function App() {
  const pathname = usePathname()
  const route = routeForPath(pathname)
  const [authSession, setAuthSession] = useState<AuthSessionResponse | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [guest, setGuest] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => (readStorage(THEME_KEY) as Theme | null) ?? 'dark')
  const [readingScale, setReadingScale] = useState<ReadingScale>('standard')
  const { setAccount: setMusicAccount } = useMusic()

  // Music belongs to one account: signing out, or into another account, stops it and forgets its library.
  useEffect(() => {
    setMusicAccount(authSession?.authenticated ? (authSession.user?.id ?? 'owner') : null)
  }, [authSession, setMusicAccount])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    writeStorage(THEME_KEY, theme)
  }, [theme])

  // `/` is not a page: send people to the area they used last. The query and hash survive (email links use them).
  useEffect(() => {
    if (route === 'root') navigate(`${modePath(lastMode())}${location.search}${location.hash}`, { replace: true })
    else if (route === 'study' || route === 'watch' || route === 'music' || route === 'markdown') writeStorage(MODE_KEY, route)
  }, [route])

  const adoptSession = useCallback((session: AuthSessionResponse): void => {
    setAuthError(null)
    setLearningProgressScope(session.user?.id ?? null)
    setAuthSession(session)
    if (!session.authenticated) forgetLibrary()
    if (!session.user) return
    // The account's saved preferences replace the browser's once they arrive.
    authRequest<{ theme: Theme; reading_scale: ReadingScale }>('/settings')
      .then((settings) => {
        setTheme(settings.theme)
        setReadingScale(settings.reading_scale)
      })
      .catch(() => undefined)
  }, [])

  const endSession = useCallback((): void => adoptSession({ authenticated: false, required: true }), [adoptSession])

  useEffect(() => {
    fetchSession().then(
      (session) => {
        // An email link is being followed: show the sign-in screen, which reads the link, instead of resuming a session.
        if (EMAIL_LINK_HASH.test(location.hash)) setAuthSession({ authenticated: false, required: true })
        else adoptSession(session)
      },
      (error: unknown) => setLoadError(error instanceof Error ? error.message : copy.app.theAccessSessionCouldNotBeChecked),
    )
  }, [adoptSession])

  const handleLogout = (): void => {
    logout().then(
      (session) => adoptSession(session),
      (error: unknown) => setAuthError(error instanceof Error ? error.message : copy.app.theLibraryCouldNotBeLocked),
    )
  }

  const goTo = useCallback((mode: AppMode): void => navigate(modePath(mode)), [])
  const toggleTheme = (): void => setTheme(theme === 'dark' ? 'light' : 'dark')

  if (route === 'privacy' || route === 'terms') return <LegalPage document={route} />
  if (route === 'not-found') return <NotFoundPage />

  if (!authSession) {
    return (
      <main className="account-shell">
        <p role="status">{loadError ?? copy.app.checkingYourAccount}</p>
        {loadError && (
          <button type="button" onClick={() => location.reload()}>
            {copy.app.retry}
          </button>
        )}
      </main>
    )
  }

  if (!authSession.authenticated) {
    if (guest) return <GuestView theme={theme} onToggleTheme={toggleTheme} onSignIn={() => setGuest(false)} />
    return (
      <AuthGate
        onSession={(session) => {
          setGuest(false)
          adoptSession(session)
        }}
        onGuest={() => setGuest(true)}
      />
    )
  }

  const lockLabel = copy.app.lockStudyLibrary
  const accountControl = authSession.user ? (
    <ProfileMenu
      user={authSession.user}
      onUser={(user) =>
        setAuthSession((current) => (current?.authenticated && current.user?.id === user.id ? { ...current, user } : current))
      }
      onLogout={handleLogout}
      theme={theme}
      readingScale={readingScale}
      onPreferences={(nextTheme, scale) => {
        setTheme(nextTheme)
        setReadingScale(scale)
      }}
    />
  ) : (
    authSession.required && (
      <button className="icon-button" type="button" onClick={handleLogout} aria-label={lockLabel} title={lockLabel}>
        <LogOut size={18} />
      </button>
    )
  )
  const notice = verificationNotice(authSession)
  const userId = authSession.user?.id ?? null
  const banners = (
    <>
      {authError && (
        <p className="account-notice is-error" role="alert">
          {authError}
        </p>
      )}
      {notice && route === 'study' && (
        <p className="account-notice" role="status">
          {notice}
        </p>
      )}
    </>
  )

  if (route === 'markdown') {
    return (
      <>
        {banners}
        <MarkdownPage
          hasAccount={Boolean(authSession.user)}
          theme={theme}
          accountControl={accountControl}
          onToggleTheme={toggleTheme}
          onMode={goTo}
          onUnauthorized={endSession}
        />
      </>
    )
  }

  if (route === 'music') {
    return (
      <>
        {banners}
        <Suspense
          fallback={
            <main className="account-shell">
              <p role="status">{copy.app.openingMusic}</p>
            </main>
          }
        >
          <MusicView
            onStudy={() => goTo('study')}
            onWatch={() => goTo('watch')}
            onMarkdown={() => goTo('markdown')}
            onLogout={handleLogout}
            accountControl={accountControl}
          />
        </Suspense>
      </>
    )
  }

  if (route === 'watch') {
    return (
      <>
        {banners}
        <Suspense
          fallback={
            <main className="account-shell">
              <p role="status">{copy.app.openingWatch}</p>
            </main>
          }
        >
          <WatchView
            onStudy={() => goTo('study')}
            onMusic={() => goTo('music')}
            onMarkdown={() => goTo('markdown')}
            onLogout={handleLogout}
            accountControl={accountControl}
          />
        </Suspense>
        <MusicDock onOpen={() => goTo('music')} />
      </>
    )
  }

  if (route === 'study') {
    return (
      <>
        {banners}
        <StudyPage
          key={userId ?? 'owner'}
          userId={userId}
          theme={theme}
          readingScale={readingScale}
          accountControl={accountControl}
          onToggleTheme={toggleTheme}
          onToggleReadingScale={() => setReadingScale(readingScale === 'standard' ? 'large' : 'standard')}
          onMode={goTo}
          onUnauthorized={endSession}
          onProblem={setAuthError}
        />
      </>
    )
  }

  return null
}

export default App
