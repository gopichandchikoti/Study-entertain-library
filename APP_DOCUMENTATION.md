# Second Brain Study Library: Application Documentation

This is the one-stop description of what the app is, what it does, how it is built and how to run it. It links to the deeper documents rather than repeating them.

Last updated 2026-10-22. Facts here were checked against the source tree and, for behaviour, against the test and browser runs recorded in [MARKDOWN_VALIDATION.md](MARKDOWN_VALIDATION.md), [AUTH_VALIDATION.md](AUTH_VALIDATION.md) and [LEARNING_VALIDATION.md](LEARNING_VALIDATION.md).

## 1. What the app is

Second Brain Study Library is a private, browser-based learning workspace. It turns a folder of Markdown notes, PDFs, ebooks, diagrams and media into a searchable library you can read, study from and track progress in, and it includes a live Markdown editor with a side-by-side preview.

- **Front end:** React 19 and TypeScript, bundled by Webpack 5.
- **Back end:** one Node.js (22.5 or newer) / Express 5 server that serves the built web app and a REST API from the same origin.
- **Accounts and saved Markdown files:** a local SQLite database (`data/study-library.sqlite` by default).
- **Content:** plain files on disk (filesystem mode, the default) or a private Supabase bucket (hosted mode).
- **Also in the repo:** an optional independent hosted REST API (`api/`) and an Android WebView wrapper (`android/`).

It is designed for one owner or a small group, not for large public traffic.

## 2. What you can do

### 2.1 Without an account (guest)

On the sign-in screen choose **Continue as guest**. A guest sees two tabs:

| Tab | What it shows |
| --- | --- |
| **Features** | A preview of everything the app offers, marking what needs an account and what can be tried immediately. |
| **Markdown preview** | The full Markdown editor (see section 3). Guests cannot save files; the draft is kept in this browser only. |

A guest cannot reach the library, Watch, uploads or any saved data. **Sign in** in the top-right corner returns to the sign-in screen.

### 2.2 With an account

The top bar has three modes: **Study**, **Watch** and **Markdown**.

**Study** (the library and learning area)
- Recursively finds Markdown, text and code files, PDFs, images, EPUBs and office documents under the content folder. Folder names become categories, and filename prefixes such as `00-`, `01-` set the order.
- Renders GitHub-flavoured Markdown (tables, task lists, code with highlighting, Mermaid-style diagrams), images, PDFs and EPUBs.
- Search (`Ctrl+K`), reading queue, bookmarks, "mark as complete" and an explored-percentage bar. Bookmarks and completion are stored in the browser per account, not on the server.
- **Interactive lessons:** lesson files can carry a five-question quiz (pass mark 80% or higher) and a practical exercise. Practicals currently validate fixed JSON or text answers only. The app does not run submitted code, because there is no isolated sandbox yet.
- **Import study file:** upload a file, review the suggested category and file name (suggested by rules, or by an OpenAI-compatible model if configured), then approve it. Nothing enters the library without that review step.
- **Create EPUB** from a Markdown or text note.
- Focus mode, larger reading size and light or dark theme.

**Watch**
- Plays local video (`.mp4 .m4v .webm .mov .mkv`) and audio (`.mp3 .m4a .aac .ogg .opus .wav .flac`) from the media folder.
- Subtitles from sibling `.vtt` files, synchronized lyrics from sibling `.lrc` files, quality variants, playback speed and volume.

**Markdown** (the editor with a saved-files list; see section 3)

**Account**
- Sign up with email, username and a 15 to 128 character password. Sign-in by email or username.
- Optional Google, Microsoft and Facebook sign-in (each button is enabled only when that provider is configured on the server).
- Profile (name, phone, PNG avatar up to 512 KB), settings (theme and reading size, active sessions), password change, provider linking, data export, account deletion.

## 3. Markdown preview

### 3.1 The screen

```
+-----------------------------------------------------------------------------+
| [files] [ File name ] [Save]  status                  [Scroll sync ON] [sun] |
+--------------------------------+---+----------------------------------------+
| MARKDOWN          words · chars| ⋮ | PREVIEW                                |
|                                | ⋮ |                                        |
|  # Heading                     | ⋮ |   Heading (rendered)                   |
|  - list item                   | ⋮ |   • list item                          |
|  (plain text editor)           | ⋮ |   (formatted, human-readable page)     |
+--------------------------------+---+----------------------------------------+
        editor (left)         divider           preview (right)
```

Guests have the same layout minus the file list, file name and Save button.

### 3.2 Controls

| Control | Behaviour |
| --- | --- |
| **Editor (left)** | A plain-text area. Type or paste Markdown. Shows a live word and character count. |
| **Preview (right)** | Renders the text as you type: headings, bold, italic, strikethrough, lists, task lists, tables, block quotes, code blocks with syntax colours, links and images. |
| **Scroll sync** | Button with an On/Off state. When on, scrolling either side moves the other to the same relative position. Switching it on lines the preview up with the editor straight away. Remembered between visits. |
| **Dark / light toggle** | Sun or moon button. It switches the whole app theme and is remembered. |
| **Divider** | The split starts at 50/50. Hover the middle line and the cursor becomes a left-right resize cursor and the grip grows. Drag to resize (20% to 80%). Keyboard: focus the divider and use ← →, Shift for bigger steps, Home/End for the limits. Enter or double-click resets to 50/50. The chosen split is remembered. |
| **Small screens** | Below 860 px the editor stacks above the preview and the divider is hidden. |

### 3.3 Saved files (signed-in only)

- Opening Markdown loads your files and opens the most recently changed one. A new account starts with an empty document named **Untitled 1**.
- **New file** names the document **Untitled 1**, **Untitled 2**, and so on, using the smallest number not already taken.
- **Rename** by editing the file name at the top, then **Save** (or press Enter in the name box). Names are unique per account, ignoring upper and lower case. A clash shows a message instead of overwriting.
- **Save** with the button or `Ctrl+S` (`Cmd+S` on macOS). The status shows "Unsaved changes", "All changes saved" or "Not saved yet". Leaving the page, switching file or starting a new file with unsaved changes asks for confirmation.
- **Delete** a file with the bin icon beside it; it asks first.
- Files are stored on the server against your account, so they appear on any device after you sign in.
- Limits per account: 200 files, 100 characters per name, 300,000 characters per file.
- Preview safety: raw HTML is sanitised (no scripts or event handlers), and external links open in a new tab with `noopener`. Images must come from the same site or `data:` URLs, because the Content-Security-Policy blocks other image hosts.
- Not supported: Mermaid diagrams in this editor (the Study area does render them), real-time collaboration, and conflict detection when the same file is edited in two tabs (the last save wins).

## 4. Architecture

```
Browser (React app)                       Node/Express server (server/index.ts)
 ├─ Sign-in / guest                        ├─ /api/auth/*       public account routes
 ├─ Study, Watch, Markdown       HTTPS     ├─ account guard     session cookie + CSRF + verified-email check
 └─ calls same-origin /api  ───────────►   ├─ /api/markdown/*   saved Markdown files   (SQLite)
                                           ├─ /api/library, content, asset, file, uploads, ebooks
                                           ├─ /api/media/*      Watch streaming (range requests)
                                           ├─ /api/practice/*   structured lesson answers
                                           └─ serves dist/      the built web app

   data/study-library.sqlite  ◄── accounts, sessions, settings, saved Markdown, catalog index
   STUDY_CONTENT_DIR          ◄── your notes, PDFs, ebooks, images (or private Supabase bucket)
   WATCH_MEDIA_DIR            ◄── your video and audio
```

### 4.1 Technology

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript 6, `lucide-react` icons, plain CSS with theme variables |
| Markdown | `react-markdown`, `remark-gfm`, `rehype-sanitize`, `rehype-highlight` |
| Build | Webpack 5 and Babel, `pnpm` 11 |
| Server | Express 5, `multer` (uploads), `jose` (OIDC), `mammoth`, `pdf-parse`, `epubjs`, `jszip` |
| Database | Node's built-in `node:sqlite` (accounts, saved Markdown, local catalog) |
| Tests | Node's test runner with `tsx`, jsdom and Testing Library |
| Hosted option | Render web service plus Supabase Storage and PostgreSQL (metadata) |

### 4.2 Folder map

| Path | Contents |
| --- | --- |
| `src/` | The web app. `App.tsx` is the shell; `features/` holds `auth`, `guest`, `markdown`, `learning`, `diagrams`, `uploads`, `watch`; `api.ts` is the only place that talks to the server. |
| `src/features/markdown/` | `SplitEditor` (editor, preview, divider, scroll sync), `MarkdownWorkspace` (saved files), `MarkdownPreview`, `LocalMarkdown`, `Markdown.css`. |
| `src/features/guest/` | `GuestView` (Features and Markdown tabs) and `Guest.css`. |
| `server/` | `index.ts` (routes, library scanning, uploads, media), `auth/` (accounts, sessions, OAuth, email), `markdown/` (saved files API), `learning/` (quiz and practical API). |
| `api/` | Optional separate REST API for Supabase-backed hosting. Does not include accounts or saved Markdown. |
| `android/` | WebView wrapper that loads the deployed HTTPS address. |
| `study-content/` | The supplied courses (generated lessons, diagrams). |
| `course-authoring/`, `course-blueprints/` | Inputs and specs used to generate the courses. |
| `scripts/` | Build, serve, seed and validation scripts. |
| `tests/` | `auth`, `learning`, `markdown` and `build` suites. |
| `supabase/schema.sql` | Schema for the hosted catalog option. |

## 5. Where data lives

| Data | Location | Notes |
| --- | --- | --- |
| Accounts, hashed passwords, sessions, settings, audit log | SQLite file (`PERSONAL_DB_PATH`, default `data/study-library.sqlite`) | Single instance only. Must be on a disk that survives restarts. |
| **Saved Markdown files** | Same SQLite file, table `markdown_documents` (one row per file, tied to the user, deleted with the account) | Included in the account data export. |
| Notes, PDFs, ebooks, images | `STUDY_CONTENT_DIR` (filesystem mode) or the private Supabase bucket | Uploads are staged, reviewed, then moved in. |
| Video and audio | `WATCH_MEDIA_DIR` | Create the folder first; Watch returns an error if it does not exist. On Windows it must be on drive G: unless `WATCH_ALLOWED_DRIVE` names another drive. Videos show in Watch, songs in Music. |
| Bookmarks, completion, lesson progress | Browser `localStorage`, keyed by account | Not synced between devices. |
| Theme and reading size | Server (signed-in) and `localStorage` | |
| Markdown editor layout (split, scroll sync) and guest draft | Browser `localStorage` | Per browser only. |

## 6. HTTP API

All routes are under `/api`, JSON unless noted. After sign-in the browser sends a session cookie. Every write also needs the CSRF token (`x-csrf-token` header) and a same-origin `Origin` header.

### 6.1 Public

| Method and path | Purpose |
| --- | --- |
| `GET /api/health` | Liveness check (also reports storage mode). |
| `GET /api/auth/config`, `GET /api/auth/session` | Sign-in options; current session and CSRF token. |
| `POST /api/auth/signup`, `login`, `logout`, `logout-all` | Account sessions. |
| `POST /api/auth/verify-email`, `resend-verification`, `forgot-password`, `reset-password` | Email flows (need a configured email sender). |
| `POST /api/auth/oauth/:provider/start`, `GET .../callback` | Google, Microsoft, Facebook. |

### 6.2 Requires sign-in

| Method and path | Purpose |
| --- | --- |
| `GET/PATCH /api/profile`, `POST /api/profile/password`, `GET/POST/DELETE /api/profile/avatar`, `GET/DELETE /api/profile/providers[/:provider]` | Profile. |
| `GET/PATCH /api/settings` | Theme, reading size, active sessions. |
| `POST /api/account/export`, `DELETE /api/account` | Data export and account deletion (re-authentication required). |
| `GET /api/markdown` | List your saved files (no content) and the limits. |
| `GET /api/markdown/:id` | One file with its content. |
| `POST /api/markdown` | Create. Body `{ name?, content? }`; a missing name becomes "Untitled N". Returns 201. |
| `PUT /api/markdown/:id` | Rename and/or replace content. Body `{ name?, content? }`. |
| `DELETE /api/markdown/:id` | Delete. |
| `GET /api/library`, `/content`, `/asset`, `/file` | Library index and file delivery. |
| `GET /api/media`, `/media/stream`, `/media/subtitle` | Watch. |
| `POST /api/uploads`, `POST /api/uploads/:id/commit`, `DELETE /api/uploads/:id` | Upload review workflow. |
| `POST /api/ebooks` | Create an EPUB from notes. |
| `/api/practice/*` | Lesson answer validation. |

Markdown error codes: `401` not signed in, `403` CSRF or unverified email, `404` not found (also used for someone else's file), `409` name taken or file limit reached, `413` file too large, `415` not JSON.

## 7. Configuration

Settings come from environment variables or a `.env` file in the project root (loaded automatically; real environment variables win). Copy `.env.example` as a starting point. Never commit `.env`.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `production` enables HTTPS-only behaviour. `pnpm serve` sets it for you. |
| `PORT` | Server port (default 4444 in production). |
| `STUDY_SERVER_HOST` | Address to listen on. Defaults to `0.0.0.0` in production and `127.0.0.1` otherwise. Use `127.0.0.1` when a tunnel or reverse proxy runs on the same machine. |
| `AUTH_MODE` | `accounts` (default) or `owner` (one shared password, no personal accounts, so no saved Markdown). |
| `AUTH_PUBLIC_ORIGIN` | The exact public address, such as `https://library.example.com`. Must be HTTPS in production. |
| `AUTH_SESSION_SECRET` | Random secret, at least 32 bytes. Required in production. |
| `AUTH_SIGNUP_ENABLED` | Open sign-up. On by default locally, off by default in production. |
| `AUTH_TRUST_PROXY` | Which proxy to believe about HTTPS and client address, for example `127.0.0.1`. Required behind a tunnel or reverse proxy. |
| `AUTH_ALLOW_PERSISTENT_SQLITE` | Must be `true` in production to confirm the SQLite file is on durable disk. |
| `PERSONAL_DB_PATH` | Location of the SQLite file. |
| `STUDY_CONTENT_DIR`, `WATCH_MEDIA_DIR` | Content and media folders. |
| `STORAGE_MODE` | `filesystem` (default) or `supabase`. |
| `MAX_UPLOAD_BYTES` | Upload size limit (default 100 MB). |
| `GOOGLE_*`, `MICROSOFT_*`, `FACEBOOK_*` | Optional OAuth settings. See [AUTH_SETUP.md](AUTH_SETUP.md). |
| `RESEND_API_KEY`, `AUTH_EMAIL_FROM` | Optional email sender for verification and password reset. |
| `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL` | Optional model for upload classification. |
| `API_ORIGIN` | Build-time address of a separate API (leave empty for same-origin). |

## 8. Security summary

- Passwords are hashed with scrypt; sessions are random tokens stored only as hashes. Sessions last 7 days and expire after 12 hours of inactivity.
- Cookies are `HttpOnly`, `SameSite=Lax`, and `__Host-` prefixed with `Secure` in production.
- Write requests need a matching CSRF token and same-origin `Origin`. Sign-in, sign-up and other account routes are rate limited.
- Production refuses non-HTTPS requests and sends HSTS, a strict Content-Security-Policy (`script-src 'self'`), `nosniff` and frame protections.
- Markdown is sanitised before display. Uploaded SVG, HTML and XML are served in a sandboxed policy. File paths are confined to the content root.
- Saved Markdown is scoped by the account id taken from the server session, never from the request. Another account's file looks like "not found".
- The practice runner does not execute code.

## 9. Run, build and test

```bash
pnpm install
pnpm dev:local     # web on http://localhost:4444, API on 4445, content from study-content/
pnpm typecheck && pnpm lint
pnpm build         # production bundle into dist/
pnpm serve         # run the production server (set the variables in section 7 first)
```

| Test command | Covers |
| --- | --- |
| `pnpm test:markdown` | Saved-files API (accounts, isolation, limits, CSRF) and the editor UI (rendering, divider, scroll sync, theme, guest flow, saved-files workflow). |
| `pnpm test:auth` | Account, session, OAuth and profile logic. |
| `pnpm test:learning` | Lesson parsing, quiz scoring, diagrams, runner policy. |
| `pnpm test:build` | Production bundle config, size budget, and no development JSX. |

## 10. Putting it on the internet

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). In short: run `pnpm build` and `pnpm serve` on an always-on computer, keep the SQLite file and content on a durable disk, and publish it through a tunnel (Cloudflare Tunnel or Tailscale Funnel) or a small cloud server. Free hosting plans that reset their disk will lose accounts and saved Markdown files.

## 11. Known limitations

- One server instance only: the account database is SQLite. There is no PostgreSQL account adapter yet.
- Bookmarks, completion and lesson progress live in the browser, so they do not follow a user to another device.
- Google, Microsoft and Facebook sign-in and email delivery are implemented but were not exercised against real provider apps or a real email sender (see [AUTH_VALIDATION.md](AUTH_VALIDATION.md)).
- Saved Markdown has no version history or multi-tab conflict detection.
- Remote images in the Markdown preview are blocked by the Content-Security-Policy.

## 12. Further reading

| Document | Topic |
| --- | --- |
| [README.md](README.md) | Quick start |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Hosting on your own PC or a server, step by step |
| [OPERATIONS.md](OPERATIONS.md) | Storage, database, monitoring, backup and restore |
| [AUTH_SETUP.md](AUTH_SETUP.md) | Accounts, OAuth providers, email |
| [system_design.md](system_design.md) | Architecture decisions and growth path |
| [ADDING_CONTENT.md](ADDING_CONTENT.md) | Adding study material |
| [FEATURE_LOG.md](FEATURE_LOG.md) | History of changes |
| [MARKDOWN_VALIDATION.md](MARKDOWN_VALIDATION.md) | Evidence for the Markdown preview feature |
