import { useEffect, useState, type FormEvent } from 'react'
import { authRequest, fetchAuthConfig, login, oauthStart } from '../../api'
import { ArrowUpRight, BookOpen, Eye, EyeOff, LoaderCircle } from '../../components/icons'
import { SiteFooter } from '../../components/SiteFooter'
import { content as copy } from '../../content.js'
import { AuthMascot, type MascotState } from './AuthMascot'
import type { AccountSession, AuthConfig, AuthView, OAuthProvider } from './authTypes'
import { signupError, usernamePolicy } from './authValidation'

type FormValues = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  identifier: string
}

const BLANK: FormValues = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  identifier: '',
}
const PASSWORD_FIELDS: ReadonlyArray<keyof FormValues> = ['password', 'confirmPassword']
const PASSWORD_VIEWS: readonly AuthView[] = ['sign-in', 'sign-up', 'reset-password']
const PROVIDER_SYMBOL: Record<OAuthProvider, string> = { google: 'G', microsoft: '▦', facebook: 'f' }

const maxLength = (key: keyof FormValues): number => {
  if (PASSWORD_FIELDS.includes(key)) return 128
  return key === 'email' || key === 'identifier' ? 254 : 50
}

const titleFor = (view: AuthView): string => {
  if (view === 'sign-up') return copy.authGate.makeRoomForDiscovery
  if (view === 'forgot-password') return copy.authGate.findYourWayBack
  if (view === 'reset-password') return copy.authGate.aFreshStart
  if (view === 'verify-email') return copy.authGate.confirmYourEmail
  return copy.authGate.welcomeToYourSecondBrain
}

const submitLabelFor = (view: AuthView, owner: boolean): string => {
  if (owner) return copy.authGate.unlockLibrary
  if (view === 'sign-up') return copy.authGate.createAccount2
  if (view === 'forgot-password') return copy.authGate.sendResetLink
  if (view === 'reset-password') return copy.authGate.updatePassword
  if (view === 'verify-email') return copy.authGate.verifyEmail
  return copy.authGate.signIn
}

const providerLabel = (provider: OAuthProvider): string => provider[0].toUpperCase() + provider.slice(1)

type AuthGateProps = { onSession: (session: AccountSession) => void; onGuest?: () => void }

/** Sign in, sign up, password reset and email verification, for accounts or for the shared owner password. */
export function AuthGate({ onSession, onGuest }: AuthGateProps) {
  const [config, setConfig] = useState<AuthConfig | null>(null)
  const [view, setView] = useState<AuthView>('sign-in')
  const [form, setForm] = useState(BLANK)
  const [showPassword, setShowPassword] = useState(false)
  const [mascot, setMascot] = useState<MascotState>('idle')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [linkToken, setLinkToken] = useState<string | null>(null)

  useEffect(() => {
    void fetchAuthConfig().then(setConfig, () => setError(copy.authGate.theSignInServiceCouldNotBeReachedReloadTo))
    // Links in emails and provider redirects carry their result in the address hash; read it once, then clear it.
    const params = new URLSearchParams(location.hash.slice(1))
    const reset = params.get('reset-password')
    const verify = params.get('verify-email')
    const providerError = params.get('auth-error')
    if (reset || verify) {
      queueMicrotask(() => {
        setLinkToken(reset ?? verify)
        setView(reset ? 'reset-password' : 'verify-email')
      })
    }
    if (providerError) {
      const text =
        providerError === 'link-required'
          ? copy.authGate.signInToYourExistingAccountThenLinkThisProvider
          : copy.authGate.providerSignInCouldNotBeVerifiedTryAgain
      queueMicrotask(() => setError(text))
    }
    if (reset || verify || providerError) history.replaceState(null, '', location.pathname + location.search)
  }, [])

  const owner = config?.mode === 'owner'
  // Providers that are not configured are listed (disabled) only while developing, so a missing setup is visible there.
  const shownProviders = config?.providers.filter((item) => item.enabled || config.development) ?? []

  const switchView = (next: AuthView): void => {
    setView(next)
    setForm(BLANK)
    setError(null)
    setMessage(null)
    setShowPassword(false)
    setMascot('idle')
  }

  const fail = (problem: unknown, fallback: string): void => {
    setError(problem instanceof Error ? problem.message : fallback)
    setMascot('error')
  }

  const send = async (path: string, body: unknown): Promise<string> =>
    (await authRequest<{ message: string }>(path, 'POST', body)).message

  const submit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    if (view === 'sign-up') {
      const problem = signupError(form)
      if (problem) {
        setError(problem)
        setMascot('error')
        return
      }
    }
    setBusy(true)
    try {
      if (owner) {
        onSession(await login(form.password))
      } else if (view === 'sign-in' || view === 'sign-up') {
        const body = view === 'sign-in' ? { identifier: form.identifier, password: form.password } : form
        const session = await authRequest<AccountSession>(view === 'sign-in' ? '/auth/login' : '/auth/signup', 'POST', body)
        setMascot('success')
        setForm(BLANK)
        onSession(session)
      } else if (view === 'forgot-password') {
        setMessage(await send('/auth/forgot-password', { email: form.email }))
      } else if (view === 'verify-email') {
        setMessage(await send('/auth/verify-email', { token: linkToken }))
        setLinkToken(null)
        setMascot('success')
      } else {
        setMessage(
          await send('/auth/reset-password', {
            token: linkToken,
            password: form.password,
            confirmPassword: form.confirmPassword,
          }),
        )
        setForm(BLANK)
        setLinkToken(null)
        setMascot('success')
      }
    } catch (problem) {
      fail(problem, copy.authGate.theAccountRequestFailed)
    } finally {
      setBusy(false)
    }
  }

  const signInWith = async (provider: OAuthProvider): Promise<void> => {
    setBusy(true)
    setError(null)
    try {
      location.assign(await oauthStart(provider))
    } catch (problem) {
      fail(problem, copy.authGate.providerSignInIsUnavailable)
      setBusy(false)
    }
  }

  const field = (key: keyof FormValues, label: string, type = 'text', autoComplete?: string) => (
    <label className="account-field" key={key}>
      {label}
      <span className="account-input">
        <input
          name={key}
          type={type === 'password' && showPassword ? 'text' : type}
          value={form[key]}
          autoComplete={autoComplete}
          required
          maxLength={maxLength(key)}
          onFocus={() => setMascot(type === 'password' ? 'password' : key === 'email' ? 'email' : 'username')}
          onBlur={() => setMascot('ready')}
          onChange={(event) => {
            setForm({ ...form, [key]: event.target.value })
            setError(null)
            if (mascot === 'error') setMascot('idle')
          }}
        />
        {key === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? copy.authGate.hidePassword : copy.authGate.showPassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </span>
    </label>
  )

  const needsLink = (view === 'reset-password' || view === 'verify-email') && !linkToken
  const eyebrow = owner
    ? copy.authGate.localOwnerAccess
    : view === 'sign-up'
      ? copy.authGate.createAccount
      : copy.authGate.welcomeBack

  return (
    <main className="account-shell" id="main">
      <section className="account-story">
        <a className="account-brand" href="/">
          <span className="brand-mark">
            <BookOpen size={22} />
          </span>
          <span>
            {copy.authGate.secondBrain}
            <small>{copy.authGate.studyLibrary}</small>
          </span>
        </a>
        <p className="eyebrow">{copy.authGate.yourCuriosityCollected}</p>
        <h1>
          {copy.authGate.smallDiscoveries}
          <br />
          {copy.authGate.lastingUnderstanding}
        </h1>
        <p>{copy.authGate.yourNotesYourNextIdeaAndAQuietPlaceTo}</p>
        <AuthMascot state={mascot} />
      </section>

      <section className="account-form-area" aria-label={copy.authGate.yourAccount}>
        <div className="account-form-heading">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{owner ? copy.authGate.unlockYourPrivateLibrary : titleFor(view)}</h2>
          <p>
            {owner
              ? copy.authGate.thisDeploymentUsesADeliberateSharedOwnerPassword
              : copy.authGate.pickUpWhereYourCuriosityLeftOff}
          </p>
        </div>
        {error && (
          <p className="account-notice is-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="account-notice" role="status">
            {message}
          </p>
        )}
        <form onSubmit={(event) => void submit(event)} aria-busy={busy}>
          {!owner && view === 'sign-up' && (
            <>
              <div className="account-name-row">
                {field('firstName', copy.authGate.firstName, 'text', 'given-name')}
                {field('lastName', copy.authGate.lastName, 'text', 'family-name')}
              </div>
              {field('username', copy.authGate.username, 'text', 'username')}
              <small>{usernamePolicy}</small>
              {field('email', copy.authGate.email, 'email', 'email')}
            </>
          )}
          {!owner && view === 'sign-in' && field('identifier', copy.authGate.emailOrUsername, 'text', 'username')}
          {!owner && view === 'forgot-password' && field('email', copy.authGate.email, 'email', 'email')}
          {(owner || PASSWORD_VIEWS.includes(view)) &&
            field('password', copy.authGate.password, 'password', view === 'sign-in' ? 'current-password' : 'new-password')}
          {!owner && (view === 'sign-up' || view === 'reset-password') && (
            <>
              {field('confirmPassword', copy.authGate.confirmPassword, 'password', 'new-password')}
              <small>{copy.authGate.text15128CharactersALongUniquePassphraseWorksWell}</small>
            </>
          )}
          {view === 'verify-email' && <p>{copy.authGate.confirmTheSingleUseLinkFromYourVerificationEmail}</p>}
          <button className="account-primary" disabled={busy || !config || needsLink}>
            {busy ? <LoaderCircle size={17} className="spin-icon" /> : <ArrowUpRight size={17} />} {submitLabelFor(view, owner)}
          </button>
        </form>

        {!owner && view === 'sign-in' && (
          <>
            <button className="account-text-button" type="button" onClick={() => switchView('forgot-password')}>
              {copy.authGate.forgotPassword}
            </button>
            <div className="account-divider">
              <span>{copy.authGate.orContinueWith}</span>
            </div>
            <div className="account-providers">
              {shownProviders.map((item) => (
                <button
                  type="button"
                  key={item.provider}
                  disabled={!item.enabled || busy}
                  onClick={() => void signInWith(item.provider)}
                  aria-label={copy.authGate.continueWith + item.provider}
                >
                  <span className={`provider-symbol provider-${item.provider}`} aria-hidden="true">
                    {PROVIDER_SYMBOL[item.provider]}
                  </span>
                  <span>
                    {providerLabel(item.provider)}
                    {!item.enabled && <small>{copy.authGate.notConfigured}</small>}
                  </span>
                </button>
              ))}
            </div>
            <p className="account-alternate">
              {copy.authGate.newHere}
              <button type="button" disabled={!config?.signupEnabled} onClick={() => switchView('sign-up')}>
                {copy.authGate.createAnAccount}
              </button>
            </p>
          </>
        )}
        {!owner && view !== 'sign-in' && (
          <button type="button" className="account-text-button" onClick={() => switchView('sign-in')}>
            {copy.authGate.backToSignIn}
          </button>
        )}
        {onGuest && (owner || view === 'sign-in' || view === 'sign-up') && (
          <div className="account-guest">
            <div className="account-divider">
              <span>{copy.authGate.or}</span>
            </div>
            <button type="button" className="account-guest-button" onClick={onGuest}>
              {copy.authGate.continueAsGuest}
            </button>
            <small>{copy.authGate.previewTheAppAndTryTheMarkdownEditorWithoutAn}</small>
          </div>
        )}
        {config && !config.emailDelivery && !owner && (
          <p className="account-local-note">{copy.authGate.localModeEmailDeliveryIsNotConfiguredVerificationAndPassword}</p>
        )}
        <footer className="account-footer">
          {copy.authGate.passwordsAreHashedProviderPasswordsStayWithTheProvider}
          <br />
          {copy.authGate.yourLearningLibraryAtYourOwnPace}
          <SiteFooter inline />
        </footer>
      </section>
    </main>
  )
}
