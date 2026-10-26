# Authentication validation

Completed 2026-10-03 in E:\New repos for portfolio\Study-entertain-library.

## Implemented

Database-backed email/password accounts replace the anonymous/shared-password default. An explicit AUTH_MODE=owner preserves deliberate owner access. Profiles, private PNG avatars, linked identities, settings, session lists, logout-all, account export/deletion, optional verification/reset email delivery, and Google/Microsoft/Facebook server adapters are implemented.

The original paper/teal/coral design is retained with an original animated bear SVG, reduced-motion CSS, password visibility controls, typed account state, native dialogs and a keyboard-operable profile menu in Study and Watch. Browser progress is scoped to the authenticated account and captured by each lesson component.

Passwords use scrypt N=131072/r=8/p=1, per-password random 16-byte salts and 256-bit derived hashes. Unpredictable session/reset tokens use SHA-256 hashes in SQLite. Session cookies, CSRF, Origin checks, rate limits, progressive login delay, email verification gates, OAuth browser binding/state/nonce/PKCE, signed OIDC claims, Facebook token introspection, private path restrictions, active-document sandbox CSP and production HTTPS/trusted-proxy controls are implemented. Current account/password/session state is rechecked after asynchronous hashing.

## Passed checks

- pnpm install completed with lifecycle scripts disabled.
- pnpm typecheck passed.
- pnpm lint passed without warnings.
- pnpm build passed with three existing-category Webpack bundle-size/performance warnings; initial entrypoint is about 11.5 MiB.
- pnpm test:auth: 22 passed, zero failed. These include hashing, normalization, generic login, session rotation/revocation, disabled/expired sessions, single-use verification/reset, CSRF, profile ownership/conflicts, bounded avatars, reauthentication, export/deletion, OAuth state/browser binding, explicit linking, last-method protection, Google/Microsoft signed-token checks, Facebook introspection fixtures, response bounds, progressive delay, asynchronous password/session races, UI interactions, local progress isolation and patched EPUB XML compatibility.
- pnpm test:learning: all 24 existing learning checks passed after the progress namespace change.
- pnpm test:auth:live passed against the running UI/API on ports 4444/4445. It exercised real SQLite-backed signup, logout/login, saved profile retrieval, protected Study/Watch, structured practical execution/results, cross-account practical access denial, hostile Origin denial, private path denial, and staged-upload commit/deletion ownership. All temporary accounts/uploads were removed.
- The live smoke check caught a missing ownership check on staged-upload deletion. It was fixed, and the complete check passed on rerun.
- UI DOM tests cover disabled providers, signup/password controls and feedback, CSRF headers, recovery fragment removal, keyboard menu movement/Escape/focus return/outside click, and profile conflict/save feedback.
- Production dependency audit: zero known advisories after overriding EPUB's @xmldom/xmldom to patched 0.8.15. XML parser compatibility check passed.

## Remaining limits

- No registered OAuth credentials or public HTTPS callback environment were supplied. Google, Microsoft and Facebook real consent/callback flows have not run. The current live config correctly reports all three disabled; development displays Not configured buttons. Adapters were tested with signed local fixtures or mocked authoritative provider responses.
- Microsoft supports personal consumers or one explicit tenant GUID. common/organizations and accounts without an email claim for new-account creation are not supported by this first adapter. Provider linking for an existing signed-in account can use a verified subject without a new email.
- No configured Resend sender/API key exists. Real email delivery was not attempted. Verification/reset tests used a memory-only test email adapter; local UI labels email verification/recovery unavailable.
- Browser discovery returned no connected browser. No screenshots, actual 320px layout check, screen-reader test, rendered reduced-motion check, or real-browser provider navigation was performed. DOM tests passed; they do not substitute for those acceptance checks.
- Only the SQLite identity writer is installed. PostgreSQL/Supabase identity adapters and production multi-replica identity are not implemented. Production account startup requires an explicit persistent single-instance SQLite acknowledgement; unsupported identity modes fail closed.
- Full dependency audit still reports one high-severity development-only braces advisory, GHSA-vfj7-8cjw-p6xm, with no published patched version. Development listeners default to loopback and use a fixed proxy path filter; do not expose the development server or use untrusted glob patterns. The audit was not hidden or suppressed.
- Hosted cross-device progress, email change and OTP are not implemented. Server export excludes local browser progress. Current-browser account progress/bookmark/completion keys are removed on UI account deletion; clear site data in other browsers separately.
- Production TLS, reverse-proxy configuration and provider dashboard settings require deployment testing. Unit/live-local checks do not prove a security guarantee. Filesystem/backup access controls and a production security review remain operational responsibilities.

## Setup and evidence

See AUTH_SETUP.md for exact environment variables, callbacks, provider registration, local/owner modes, database ownership, recovery behavior and deployment constraints. .env.example contains empty credential slots only. No default account, plaintext password, provider token or secret was added to source.

## Created files

- AUTH_SETUP.md
- AUTH_VALIDATION.md
- course-blueprints/AUTHENTICATION_PROFILE_ENHANCEMENT.md
- pnpm-workspace.yaml
- scripts/smoke-auth.mjs
- server/auth/avatar.ts
- server/auth/config.ts
- server/auth/email.ts
- server/auth/environment.ts
- server/auth/file-policy.ts
- server/auth/migrations.sql
- server/auth/password.ts
- server/auth/providers.ts
- server/auth/rate-limit.ts
- server/auth/repository.ts
- server/auth/routes.ts
- server/auth/security-headers.ts
- server/auth/service.ts
- server/auth/sessions.ts
- server/auth/types.ts
- server/auth/validation.ts
- src/features/auth/Auth.css
- src/features/auth/AuthGate.tsx
- src/features/auth/AuthMascot.tsx
- src/features/auth/ProfileMenu.tsx
- src/features/auth/ProfileView.tsx
- src/features/auth/SettingsView.tsx
- src/features/auth/authTypes.ts
- src/features/auth/authValidation.ts
- tests/auth/auth-security.test.ts
- tests/auth/auth-ui.test.tsx
- tests/auth/xml-compatibility.test.ts

## Modified integration files

- src/App.tsx
- src/api.ts
- src/types.ts
- src/features/watch/WatchView.tsx
- src/features/learning/learningProgress.ts
- src/features/learning/LearningLesson.tsx
- server/index.ts
- server/learning/routes.ts
- scripts/dev-local.mjs
- webpack.config.mjs
- package.json
- pnpm-lock.yaml
- .gitignore
- .env.example
- README.md
- FEATURE_LOG.md
- system_design.md
- OPERATIONS.md
