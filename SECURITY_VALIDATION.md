# Security validation - 2026-10-26

What was reviewed, what was found, what was changed, how each change was proved, and what is still open. It covers the Study Library (root server and client), its hosted `api/` service, and, in summary, Cine Music Wave Web and Cine Music Wave Mobile (their own `VALIDATION.md` files hold the detail). Nothing here is a promise that the apps cannot be broken; it is a list of what was checked and what happened.

## How the review was done

1. **Understand first.** The server, client, configuration, scripts, database schemas, Android manifest and native module were read before anything was changed, and trust boundaries were mapped: browser to server, server to Supabase Storage, server to the local media folder, uploads to the library, signed-in account to signed-in account, and the phone app to Android's media store.
2. **Look for realistic attack paths**, not a checklist of features: an unauthenticated visitor; a signed-in account reaching for another account's data; a hostile upload; a hostile page using a victim's session cookie; a script hammering an expensive route; a leaked log.
3. **Fix only what was confirmed**, in the smallest change, and **prove it**: a regression test that fails without the fix. Each new control was broken on purpose once (mutation check) and the matching test failed, then the code was restored.
4. **Standards used:** the OWASP Top 10 and ASVS areas that apply to this stack (authentication, sessions, access control, input and output handling, file handling, API and configuration), plus AGENTS.md Part 1 section 3 (SEC-01 to SEC-22).

Secrets were looked for by pattern (well-known token formats, private-key headers, `KEY=value` assignments) across the working tree and **every revision of git history** in Study (7 commits) and Mobile (1 commit), and across the working tree of Web (no git). Only an instruction line in the agent docs matched (`export LLM_API_KEY="<key>"`, a placeholder). This is a pattern search, not an entropy scanner such as gitleaks or trufflehog (no tool was installed, PRC-06), so a secret in an unusual format could be missed. `.env` files are ignored and untracked in all three; `.env.example` files hold no values.

## Results at a glance

| Check | Study root | Study `api/` | Web | Mobile |
| --- | --- | --- | --- | --- |
| Secrets in tree and history | none found | none found | none found (no git) | none found |
| `pnpm audit --prod` | no known vulnerabilities | none | none | 2 high, build tooling only (see below) |
| typecheck, lint, format | pass | pass (no formatter) | pass | pass (no formatter) |
| Tests | 228 pass | 24 pass (first tests it has had) | 138 pass | 25 pass |
| Production build and budget tests | pass | build pass | pass | release APK rebuilt, installed and opened on the emulator; merged manifest read |
| `audit:standards` | 0 errors, 16 old warnings | n/a | 0 errors, 7 old warnings | see there |
| Strix autonomous pen test | **not run** | not run | not run | not run |

Root test counts: learning 30, auth 30, markdown 21, watch 43, music 37, motion 6, server 35, security 26. Web: auth 20, server 11, security 17, watch 43, music 41, motion 6.

## Findings and fixes: Study Library root server

Severity is the effect if the weakness were exploited in a deployment where it applies, not a score.

| ID | Severity | Finding and evidence | Fix | Proof |
| --- | --- | --- | --- | --- |
| S1 | Medium | Staged uploads had no limit and no expiry: one signed-in account could stage 100 MB files until the disk was full; abandoned ones stayed for ever. | 10 staged uploads per account, 24-hour lifetime, an orphan sweep, and a check before the file is received so a refused upload writes nothing. | `tests/security/hardening.test.ts`: quota, per-account limit, expiry and sweep |
| S2 | Medium | The upload middleware returned the raw `error.message`. A disk or permission failure put the server's folder path in the reply; a hostile file name was echoed back. | Known refusals have fixed messages; system failures become the generic 500 with a request id and are logged. | failing-disk test (no path, no system text); hostile-name test |
| S3 | Medium | Only the extension was checked, so HTML could be stored as `.pdf` or `.png`. | The first bytes must match the extension (PDF, PNG, JPEG, GIF, WebP, AVIF, ZIP-based formats; text has no NUL bytes). | `tests/server/hardening.test.ts` and the HTTP test |
| S4 | Low | A commit did not refuse a folder the library hides (the app's own, `node_modules`, `Music`), an NTFS stream-style name (`a:b.md`), or a folder that is really a link out of the library. (The link case needs someone to have placed a link in the content folder first.) | Destination must be a public library path; the created folder is resolved with `realpath` and must stay inside the root. | same file; the link test uses a Windows junction and checks nothing was written outside |
| S5 | Low | `safeStoragePath('..')` returned `'..'` (`normalize` leaves a lone `..` with no slash) and `./` was accepted as a key. | Whole segments are tested; a trailing slash is refused. The extension check had been hiding it. | `tests/server/hardening.test.ts` (also found the `./` case) |
| S6 | Medium (owner mode) | In production owner mode the cookie was signed with the access password itself when `SESSION_SECRET` was unset: anyone who saw one cookie could test password guesses offline. | Production owner mode needs a `SESSION_SECRET` of 32 bytes or more that is not the password; start-up fails otherwise. | config tests |
| S7 | Medium | Only sign-in, uploads, ebooks and the library scan had tighter limits. Saving notes, playlists and playback positions, and `/api/watch/rescan` (walks the whole media folder), had only the 2000 a minute flood guard. | 240 writes a minute per address on those routers (reads and streams not counted) and 6 rescans a minute. | `hardening.test.ts` (Markdown writes); Web test for rescan and Music |
| S8 | Low | An unreadable `catalog.json` answered with the parser or file-system message, which names local paths. | Generic message; the reason is logged. | Web test (same routers) |
| S9 | Low | `process.env` was read in the practice router and the stream code, against ARCH-10. | Read once in `config/`. A bad `WEB_ORIGIN` now stops start-up. | config tests |
| S10 | Low | Requests to Supabase Storage had no timeout (SEC-20). | `fetchWithTimeout` (15 s for headers; a large download is not cut short). | type-check and existing suites (no network in tests) |
| S11 | Low | The account export left out Watch and Music data (SEC-21) and the settings text understated it. | Export includes them, per account only; text corrected. | export test: own rows present, another account's absent, no hashes |
| S12 | Low | The password rule was length only. | 15 to 128 characters as before, plus refusal of repeated characters, counting and keyboard runs, a small list of well-known phrases, and the person's own username or email name. | `tests/auth/password-policy.test.ts` and the sign-up test |
| S13 | Low | EPUB builders carried raw HTML from notes into the book (epub.js blocks scripts, other readers may not). | Raw HTML is written as text. | api ebook test |
| S14 | Info | The SQLite file had default permissions. | Owner-only on POSIX (no effect on Windows). | by inspection |
| S15 | Info | 429 bodies lacked `requestId` (ARCH-21). | Added. | rate-limit test |
| S16 | **High** (hosted Storage mode) | `RemoteStorage.send` set `Content-Type` from the stored object, and staging stored the type the uploader's browser claimed (`file.mimetype`). A `.txt` uploaded as `text/html` would be served as a web page from the app's origin with no sandbox (only files with an active extension were sandboxed). The same method forwarded the object's `Cache-Control: public`, making authenticated library files publicly cacheable. It is the twin of A3 in `api/`, found while writing the audit rule for it. | The caller chooses the type from the extension; staging and the hosted inventory use the extension-derived type; the stored cache policy is not forwarded (SEC-30, SEC-36). | `tests/server/remote-storage.test.ts` (3 tests; each of the two controls was removed once and its test failed) |

## Findings and fixes: hosted `api/` (Render and Supabase)

This service had no tests and no structure that allowed any. It is now `createApp(config, { storage, catalog })`, which the tests start against in-memory stand-ins.

| ID | Severity | Finding and evidence | Fix | Proof |
| --- | --- | --- | --- | --- |
| A1 | **High** | If `LIBRARY_ACCESS_PASSWORD` was missing the API was open to everyone, including uploads, with the service-role key behind it. `render.yaml` left it `sync: false`. | Production refuses to start without the password (12+ characters), a separate 32-byte `SESSION_SECRET`, an https `WEB_ORIGIN` and an https Supabase URL. | `tests/config.test.ts` |
| A2 | **High** | The session cookie is `SameSite=None` in production and uploads are multipart POSTs, which a hostile page can submit with the cookie. No Origin check existed. | Every write needs `Origin = WEB_ORIGIN` and `X-Requested-With: StudyLibrary`. | `security.test.ts` (no origin, other origin, look-alike origin, no marker, DELETE, login CSRF) |
| A3 | **High** | Files were served with the content type stored with the object, which came from the uploader's browser. A `.txt` uploaded as `text/html` would run as a page on the API origin, in the session's origin. | The type comes from the extension; SVG, HTML and XML get a `sandbox` policy; the catalog stores the extension-derived type. | `security.test.ts` (trojan `.txt`, `.html`, `.svg`, PDF stays framable by the web origin only) |
| A4 | Medium | The preflight allowed `content-type, range, x-catalog-sync-token`, but the client sends `X-Requested-With` and `X-CSRF-Token`, so browser writes from a separate web origin were blocked. `POST /api/catalog/sync` sat behind the session guard, so the documented `curl` with the token failed when a password was set. | Allowed headers match what the client sends; sync is token-only (no session) and limited to 6 a minute. | CORS and sync tests |
| A5 | Medium | The cookie was signed with the password when no secret was set, lasted 30 days, and the sign-out cookie carried different attributes from the one it replaced. | Separate secret, 7 days, `__Host-` prefix and `Secure` in production, single-cookie parsing against cookie tossing. | cookie and forged-cookie tests |
| A6 | Medium | The error handler returned `error.message`: Supabase and database text, and `/api/ebooks` echoed any error. | Standard body `{ code, message, requestId }`; the detail goes to the log with configured secrets blanked. | error test (no key, no provider text, log redaction) |
| A7 | Medium | No security headers beyond four, no HSTS, no CSP, the health probe named the storage bucket. | CSP (`default-src 'none'`), `nosniff`, no referrer, Permissions-Policy, COOP, HSTS in production, `no-store` on private JSON, minimal health. | header, production and health tests |
| A8 | Medium | The only limit was on sign-in, keyed on the address Express saw. Behind any reverse proxy, with Express's `trust proxy` unset (it was), that is the proxy's address, so every visitor would share one bucket and ten wrong passwords could lock the owner out. The map was unbounded. | `trust proxy` hops from config, a whole-API limit, tighter limits on sign-in, uploads, ebooks and sync, bounded memory. | rate-limit and throttle tests |
| A9 | Medium | Uploads were held in memory up to 100 MB with no concurrency cap and no ceiling on staged uploads. | 2 at a time, 25 staged, 24-hour expiry, content check. | upload tests |
| A10 | Low | No timeouts on Supabase calls, no graceful shutdown, 1 MB JSON limit before sign-in, `safeStoragePath('..')`. | Timeouts, shutdown, 64 KB, fixed path check. | tests and type-check |

## The standard is enforced by the audit script

The 2026-10-26 lessons were written into `AGENTS.md` (Section 3.1, SEC-23 to SEC-52; Section 13 for auditing; Section 14 for field notes) and into `scripts/audit-standards.mjs`, which is now the same file in all three repositories. It reports as **errors** a tracked secret, env file, database or keystore; debug code; `eval`, `innerHTML =` and `dangerouslySetInnerHTML`; wildcard CORS; a reply that echoes a raw error message (SEC-37); `trust proxy` set to `true` (SEC-29); a `Content-Type` taken from a stored object (SEC-30); a value for a secret-named variable in `.env.example`; Android backup left on (SEC-49); and a failing positive control for its own secret patterns. It reports as **warnings** outbound `fetch` without a timeout (SEC-42), `process.env` outside config (ARCH-10), `express.json()` without a limit (SEC-41), focused or skipped tests, missing required documents and `.gitignore` patterns, Android `INTERNET` with no network code, and native modules that accept `file:` paths unconfined (SEC-50). Each new rule was proved by planting a violation and seeing it reported, then removing it. In Study it reports 0 errors; its warnings are the seven tracked scratch files and nine long files that were already there. Writing the SEC-50 rule also revealed that Mobile's `.gitignore` hid the app's own native module sources (see `mobile appsCine Music Wave MobileSECURITY_VALIDATION.md`, M4).

## Checked and found sound (no change needed)

Passwords: scrypt (N=131072) with per-user salt and constant-time compare; sessions stored only as SHA-256 hashes, `HttpOnly`, `__Host-` and `Secure` in production, 12-hour idle and 7-day absolute expiry, rotated on sign-in, revoked on password change. Sign-in answers the same for an unknown account and a wrong password. CSRF token plus Origin on every account write. OAuth uses state, nonce, PKCE and a binding cookie, and its outbound calls have timeouts and refuse redirects. Object-level access: Markdown, playlists, progress and staged uploads are looked up by id and owner (cross-account tests existed and pass). Path traversal on `/api/content|asset|file` is refused by a lexical filter and a `realpath` check. The practice runner executes no code (structured answers only) and bounds runs. Static serving never reaches dotfiles, source or maps. Supabase: row-level security is enabled on every table with no public policy, the bucket is private, and the service-role key is read once on the server. Dependencies: no advisory in Study, `api/` or Web.

## Not fixed, and why

1. **Who may add to the shared library (root app, multi-account).** The library is shared, so every signed-in account can approve an upload into it. There is no role model. This is a product decision. Production sign-up is closed by default; keep it closed or add an owner role. Unauthenticated users cannot do any of it.
2. **`api/` has one shared password and no per-person sessions.** A session cannot be revoked singly (rotate `SESSION_SECRET` to end all). Move to Supabase Auth, as `supabase/schema.sql` anticipates, before sharing the password beyond people you trust.
3. **`style-src 'unsafe-inline'` remains** in the root CSP because the approved design uses inline styles; script-src has no `unsafe-inline` or `unsafe-eval` in production. Removing it needs a nonce or hash plan that must not change the design.
4. **No breached-password lookup.** The password check is local (patterns, a short list, own name). A lookup such as Pwned Passwords needs an outside service, which was not added.
5. **Diagnostics are visible to any signed-in account** (`/api/watch/diagnostics`: ffmpeg version, skipped folders, unreadable file names). Acceptable for trusted accounts; restrict it with the role model if that is added.
6. **Seven scratch files are tracked in git** (`.tmp-*`, from earlier sessions, not created here). They were reported by `audit:standards`, not deleted (PRC-05). `.gitignore` now stops new ones; removing them is `git rm --cached` plus your decision, because they may hold study material.
7. **Web and Study share one SQLite file.** `Cine Music Wave Web\.env` sets `PERSONAL_DB_PATH` to the Study Library's `data\study-library.sqlite`. The tables are separate (`entertainment_*`), but one file holds both apps' accounts and password hashes, and Web is the one published through a public tunnel. Giving Web its own file (remove `PERSONAL_DB_PATH`, which defaults to `data\cine-music-wave.sqlite`) limits what a flaw in Web could reach. It also means Web accounts would have to be created again, so it is your decision, and `.env` was not touched.
8. **Mobile advisories** `node-forge` (no patched release exists) and `zod` (patch is a major-version jump that would break `@expo/cli`) are reached only through Expo's command-line tool. Neither appears in the shipped JavaScript bundle (searched the release APK's bundle for `node-forge`, `ZodError`, `@expo/cli`, `devcert`: none). They are not reachable from the installed app.

## Deployment actions still required

- **Deploy `api/` only after setting** `LIBRARY_ACCESS_PASSWORD`, `SESSION_SECRET`, `WEB_ORIGIN` (and keep `TRUST_PROXY_HOPS=1`). Otherwise the new version exits at start-up by design. Everyone signs in again once.
- Consider `API_COOKIE_SAMESITE=lax` with the web page and API on subdomains of one domain; browsers are restricting third-party cookies.
- Before sharing the Android APK with anyone, create a private release keystore. The current release is signed with the public debug key, so a different build could replace it. Never commit the keystore.
- Run Strix (AGENTS.md 7.4) before a public launch. It needs Docker, a model API key, and sends code to a provider, so it needs your go-ahead. `tests/security` and `api/tests` stand in until then.
- Have the Privacy and Terms text reviewed before a public launch (UI-12).

## What this validation did not cover

Real Supabase and Render traffic (the `api/` tests use in-memory stand-ins); a real browser check of the `api/` file headers with a PDF viewer; Safari and Firefox; a load test; the Cloudflare tunnel in front of Web; iOS (cannot be built on Windows); a lawyer's review.

## How to re-run

```
pnpm check && pnpm test:auth && pnpm test:server && pnpm test:security && pnpm test:learning && pnpm test:markdown && pnpm test:watch && pnpm test:music
pnpm build && pnpm test:build && pnpm audit:standards && pnpm deps:audit
cd api && pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm deps:audit
```
