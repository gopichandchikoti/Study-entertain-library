# Markdown Preview, Guest Mode and Saved Files: Validation

Recorded 2026-10-22. Covers the guest option on the sign-in screen, the guest Features and Markdown tabs, the split Markdown editor and preview, and per-account saved Markdown files. Feature description: [APP_DOCUMENTATION.md](APP_DOCUMENTATION.md) section 3.

## Automated checks

| Command | Result |
| --- | --- |
| `pnpm typecheck` | Pass (app and server) |
| `pnpm lint` | 0 warnings, 0 errors |
| `pnpm test:markdown` | 18 of 18 pass (7 server API, 11 UI) |
| `pnpm test:auth` | 23 of 23 pass (unchanged behaviour) |
| `pnpm test:learning` | 30 of 30 pass |
| `pnpm test:build` | 2 of 2 pass, including the new "no development JSX in the production bundle" check |
| `pnpm build` | Compiles successfully |

What `pnpm test:markdown` covers:

- **Saved-files API** (real Express app, in-memory SQLite, real account sessions and CSRF): sign-in required; "Untitled N" numbering reuses the smallest free number; read, rename, edit and delete; case-insensitive unique names; one account cannot read, change or delete another's file (404); name, size, type, ID, CSRF and origin validation; the 200-file limit; deleting an account removes its files; the data export includes the owner's files only.
- **Editor UI** (jsdom): Markdown renders (headings, bold, tables, task lists), `<script>` and `onerror` are removed, external links open safely; the divider starts at 50/50 and moves by keyboard, double-click and pointer drag within 20% to 80%; scroll sync mirrors both ways, does not echo back, switches off and on; theme button label and callback; large documents wait for a pause in typing but a paste appears at once.
- **Guest and sign-in screens:** "Continue as guest" appears only when a guest handler is supplied; the guest view shows Features first, then a working Markdown tab with no Save button, one theme button, a persisted draft and a sign-in path.
- **Signed-in workspace** (against an in-memory fake server): starts on "Untitled 1", saves, next file is "Untitled 2"; the latest file opens on load; rename plus `Ctrl+S` saves with PUT; a taken name is reported; unsaved work is protected by a confirmation; delete asks first and then opens the next file; a 401 sends the user back to sign-in.

## Real browser run

Microsoft Edge (headless, driven by puppeteer-core) against the real server in development mode with a throwaway database, at 1440 by 900 and 390 by 844. 29 of 29 checks passed:

- Sign-in screen shows "Continue as guest"; guest Features tab shows 8 feature cards; the Markdown tab renders the sample on the right; guests have no Save button.
- Panes start at 713 px and 713 px; the divider cursor is `col-resize` on hover; dragging narrows the editor (393 px and 1033 px); Enter resets to 50/50.
- Scroll sync with real layout: scrolling the editor to 54.6% put the preview at 54.6%; scrolling the preview to the bottom moved the editor to the bottom; positions stayed stable (no feedback loop); with sync off the preview stayed put; switching it back on realigned it.
- Theme toggle flips dark and light for guests and signed-in users. No horizontal scroll at phone width.
- Sign-up leads to a top bar with Study, Watch and Markdown. A new account starts on "Untitled 1"; Save works; renaming at the top and saving works; the next new files are "Untitled 1" (reused) and "Untitled 2"; a duplicate name is rejected with a message.
- Files survive a page reload, and after signing out and signing in again; opening a saved file shows its rendered content; the Watch screen also links to Markdown.
- The only console error was the intentional 409 for the duplicate-name check.

## Production-mode run

`scripts/serve.mjs` (the `pnpm serve` path) on a spare port with `NODE_ENV` production, HTTPS-only origin, `AUTH_TRUST_PROXY=127.0.0.1` and a script that sends the `X-Forwarded-Proto: https` header a tunnel sends. 13 of 13 checks passed: plain HTTP is refused with 426; the home page and all 3 initial scripts load; HSTS, CSP and `nosniff` are present; sign-up works; the session cookie is `__Host-`, `HttpOnly` and `Secure`; a saved file **survived a full server restart** after signing in again; another account cannot read it; a cross-origin write is rejected with 403.

## Performance

Typing latency in headless Edge with a document of the given size (17 characters typed in a row), before and after memoising the rendered preview and delaying the refresh on large documents:

| Document size | Before | After |
| --- | --- | --- |
| 20,000 characters | 95 ms per key | 7 ms per key |
| 100,000 characters | 530 ms per key | 25 ms per key |
| 300,000 characters (the file limit) | about 1,900 ms per key | 70 ms per key |

## Backup script

`pnpm db:backup` (`scripts/backup-db.mjs`, `VACUUM INTO`) was run against a live database with the server running and against a stopped one. Both copies passed `PRAGMA integrity_check` and contained the expected users and Markdown rows.

## Defect found and fixed during validation

The production bundle crashed on load with `jsxDEV is not a function` when `NODE_ENV` was unset, which is the case for `pnpm build` on a normal Windows shell. Babel chose development JSX from the environment. `webpack.config.mjs` now sets `development: !isProduction` for the React preset, and `tests/build/bundle.test.mjs` fails if the bundle ever contains development JSX calls again. Builds on hosts that set `NODE_ENV=production` (such as Render) were not affected, which is how it went unnoticed.

## Not verified

- A real Cloudflare Tunnel or Tailscale Funnel; the proxy behaviour was checked by sending the forwarded-protocol header directly.
- Touch dragging of the divider on a real phone (the divider is hidden below 860 px, and the stacked layout was checked by screenshot only), Safari and Firefox, and screen readers. The divider has `role="separator"`, ARIA values and keyboard control, but it has not been tested with assistive technology.
- Email-verification interaction: when an email sender is configured, an unverified account is refused saves (`403`) by the existing account guard. This follows from the guard code and is not covered by a Markdown test.
- Behaviour when two browser tabs edit the same file (last save wins by design).
- Windows service registration and the Task Scheduler backup job described in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).
