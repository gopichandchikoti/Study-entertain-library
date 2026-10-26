# Second Brain Study Library: Standalone Build Specification

## How to use this document

This document is self-contained. Give this document to a new coding agent in an
empty directory on a different machine. The agent must create the application
from this specification without assuming that another repository, source file,
database, API, screenshot, or local media folder exists.

The agent must not ask for missing project files. All required architecture,
contracts, names, dimensions, workflows, storage rules, and validation criteria
are defined here. When a detail is not specified, preserve the existing design
language and choose the smallest typed implementation that satisfies the REST
contract.

### Fidelity status

This guide plus `CHAT_BOOTSTRAP.md` and the five `REPLICATION_SOURCE_*.md`
bundles is the exact Markdown-only handoff. These are the only artifacts that
must be pasted into the new agent chat. The bundles contain verbatim current
source/configuration files in fenced blocks with target paths. A new agent must
write those blocks without redesigning them, then run the validation gate. No
`.ts`, `.tsx`, `.css`, `.json`, `.jar`, or other source/binary file needs to be
transferred separately.
When all five source bundles are supplied, they are normative: the new agent
must create the API, React/Webpack UI, server, Android wrapper, configuration,
and styles from those blocks verbatim before making improvements. It must not
replace them with a framework scaffold, approximate CSS, different route
shapes, a different component tree, or a new dependency set. The Web bundle
contains the exact current UI implementation and styles; the Server and API
bundles contain the exact current backend implementations and contracts. The
guide alone is a specification; the guide plus all source bundles is the exact
implementation handoff.
Browser rendering, font availability, dependency installation, and media
fixtures can still cause environmental differences, so screenshot comparison
is required for visual parity.

### Exact Markdown handoff payload

To reproduce the current implementation and UI, paste only these Markdown
documents into the new agent conversation:

```text
CHAT_BOOTSTRAP.md
REPLICATION_GUIDE.md
REPLICATION_SOURCE_WEB.md
REPLICATION_SOURCE_SERVER.md
REPLICATION_SOURCE_API.md
REPLICATION_SOURCE_ANDROID.md
REPLICATION_SOURCE_DOCS.md
```

The source bundles contain the files listed above as text. The new agent creates
the directories and target files from each `## File: ...` section. The Android
bundle contains Gradle/Kotlin/XML text; the agent generates the binary
`gradle-wrapper.jar` with Gradle or Android Studio and does not need it pasted.

Do not share these generated/private items:

```text
node_modules/
dist/
data/study-library.sqlite
.env files containing values
database dumps containing private data
personal Study files
personal Desktop media
Supabase keys, passwords, session secrets, AI keys, signing keys
```

If the new machine needs a populated demo, create synthetic Markdown, a small
public-domain image/audio/video fixture, and a test PDF/EPUB in a temporary
fixture directory. Do not copy private books or unlicensed media merely to make
the screen look populated.

### Extracting the exact source bundles

Give the new agent this guide plus all five source bundles. For each bundle,
find every heading matching `## File: <path>`, create the target path, and copy
the following fenced block exactly. Preserve whitespace, line endings, package
versions, JSX, CSS, route names, and XML. Do not merge similar files, upgrade
dependencies, or rewrite a component to a preferred style during extraction.

The source-bundle generator is `scripts/generate-replication-bundles.mjs`.
After an intentional source change, run:

```bash
node scripts/generate-replication-bundles.mjs
```

The generated bundles are handoff artifacts, not runtime imports. A new agent
must not import Markdown files or parse bundles at runtime.

### Chat-only paste order

When the destination machine is isolated, paste `CHAT_BOOTSTRAP.md` first,
then this guide, then `REPLICATION_SOURCE_WEB.md`,
`REPLICATION_SOURCE_SERVER.md`, `REPLICATION_SOURCE_API.md`,
`REPLICATION_SOURCE_ANDROID.md`, and `REPLICATION_SOURCE_DOCS.md`, one message
at a time. The new agent must acknowledge each bundle, wait until all bundles
are received, and only then create files. If a message-size limit is reached,
split only between `## File: ...` sections and preserve each fenced block.

The result is one user-facing application with two modes:

```text
Second Brain
+-- Study: Markdown, text, images, PDF, EPUB, office files, bookmarks, progress
+-- Watch: local video/audio, seeking, speed, quality, subtitles, lyrics
```

The initial implementation is local-first. Hosted storage, multiple accounts,
worldwide media delivery, and independent API implementations are extension
boundaries, not prerequisites for the local app.

## 1. Non-negotiable decisions

### Browser and shell

- React 19 with TypeScript.
- Webpack 5, Babel, HtmlWebpackPlugin, Webpack Dev Server.
- `pnpm` is the package manager.
- Web development uses port `4444`.
- Do not use ports `3000` or `8080`.
- The shell has a Study/Watch mode switch. Do not use iframes.
- `API_ORIGIN` is the canonical compile-time API origin. Empty means relative
  same-origin `/api` requests.
- Accept `VITE_API_ORIGIN` only as a compatibility fallback for older deploys;
  no Vite dependency is allowed.

### Backend

- Express 5 and TypeScript are the default local API implementation.
- The API is REST. Do not introduce GraphQL for the initial product.
- The API must be replaceable by Python/FastAPI, Java/Spring Boot,
  Go/net/http or Chi, or C#/ASP.NET Core if the same OpenAPI contract is kept.
- Start as a modular monolith. Add workers or services only for measured
  bottlenecks such as FFmpeg, AI/OCR, indexing, or high-throughput media.

### Data and storage

- PostgreSQL stores metadata, identity, progress, bookmarks, rights, and jobs
  for production or concurrent access.
- Local filesystem objects hold Study files and local Watch media.
- SQLite is used locally only as the personal catalog metadata index.
- Never put large PDF, EPUB, image, song, or movie bytes into SQL rows.
- Never expose PostgreSQL, raw filesystem paths, SMB, MinIO, or service keys.
- Hosted Storage must be private and accessed through authenticated REST or
  short-lived signed URLs.

### Media rights

Only ingest or publish video/audio that is owner-created, licensed for
redistribution, purchased with redistribution rights, or public domain. Never
rip DRM, bypass access controls, scrape streaming services, or publish
unlicensed films. Hosted media later requires provenance, rights records,
takedown handling, age/region policy, signed access, CDN planning, and lawful
distribution.

## 2. Required machine and toolchain

Install:

- Node.js `22.5+` because local SQLite uses built-in `node:sqlite`.
- pnpm `11+`.
- Java 17 for Android builds.
- Android SDK 35 for the Android WebView wrapper.
- Git.

A local personal server may be a Ryzen 7 7840 mini PC with 32 GB RAM. A
recommended six-drive layout is:

```text
512 GB NVMe             OS, containers, PostgreSQL metadata, logs
4 x 2 TB PCIe 4 NVMe    External JBOD pool for active objects
2 TB PCIe 4 NVMe        Staging and restore workspace
2 TB SATA SSD           Local backup target
```

Use an external enclosure with individual-drive/JBOD mode, active cooling,
stable power, SMART/NVMe passthrough, TRIM/discard support, and Linux support.
A USB4/Thunderbolt uplink is shared and will not deliver four independent
7,000 MB/s links. Use software RAID10 or ZFS RAIDZ2 on Linux. RAID is not a
backup. Keep an encrypted offsite copy.

A personal desktop can run the server at the same time, but sleep, reboots,
Wi-Fi loss, updates, and disk maintenance cause downtime. Use a dedicated
service account, automatic restart, UPS, Tailscale for owner-only access, or
Cloudflare Tunnel plus HTTPS reverse proxy for public access.

## 3. Complete project tree

Create this tree in an empty project directory:

```text
study-library/
+-- .env.example
+-- .gitignore
+-- index.html
+-- package.json
+-- pnpm-lock.yaml
+-- webpack.config.mjs
+-- tsconfig.json
+-- tsconfig.app.json
+-- tsconfig.server.json
+-- public/
+-- src/
|   +-- App.tsx
|   +-- App.css
|   +-- Watch.css
|   +-- index.css
|   +-- main.tsx
|   +-- api.ts
|   +-- types.ts
|   +-- env.d.ts
|   +-- styles.d.ts
|   +-- features/
|   |   +-- uploads/UploadDialog.tsx
|   |   +-- watch/WatchView.tsx
|   +-- shared/format.ts
|   +-- entities/
|   +-- app/
|   +-- platform/
+-- server/
|   +-- index.ts
|   +-- personal-db.ts
+-- data/
+-- api/
|   +-- package.json
|   +-- pnpm-lock.yaml
|   +-- src/
|   +-- render.yaml
+-- android/
+-- scripts/seed-supabase.mjs
+-- supabase/schema.sql
+-- SYSTEM_DESIGN.md
+-- OPERATIONS.md
+-- FEATURE_LOG.md
+-- REPLICATION_GUIDE.md
+-- .github/copilot-instructions.md
+-- .github/agents/study-library.agent.md
```

Create `data/` but ignore it from source control. The local SQLite database is
`data/study-library.sqlite`.

## 4. Exact package requirements

The root `package.json` must use these scripts:

```json
{
  "type": "module",
  "engines": { "node": ">=22.5.0" },
  "scripts": {
    "dev": "concurrently -k \"webpack serve --mode development\" \"tsx watch server/index.ts\"",
    "build": "tsc -b && pnpm typecheck:server && webpack --mode production",
    "start": "pnpm build && NODE_ENV=production PORT=4444 tsx server/index.ts",
    "serve": "NODE_ENV=production tsx server/index.ts",
    "typecheck": "tsc -b && pnpm typecheck:server",
    "typecheck:server": "tsc -p tsconfig.server.json --noEmit",
    "lint": "oxlint .",
    "preview": "webpack serve --mode production --host 0.0.0.0 --port 4444"
  }
}
```

Runtime dependencies:

```text
express ^5.2.1
react ^19.2.x
react-dom ^19.2.x
lucide-react ^1.47.x
react-markdown ^10.1.x
remark-gfm ^4.0.x
rehype-sanitize ^6.0.x
rehype-highlight ^7.0.x
epubjs ^0.3.x
jszip ^3.10.x
marked ^18.0.x
multer ^2.4.x
pdf-parse ^2.4.x
mammoth ^1.13.x
```

Build dependencies:

```text
webpack ^5.111.x
webpack-cli ^7.2.x
webpack-dev-server ^6.0.x
babel-loader ^10.1.x
@babel/core ^8.0.x
@babel/preset-env ^8.0.x
@babel/preset-react ^8.0.x
@babel/preset-typescript ^8.0.x
html-webpack-plugin ^5.6.x
style-loader ^4.0.x
css-loader ^7.1.x
typescript ^6.0.x
tsx ^4.23.x
concurrently ^10.0.x
oxlint ^1.81.x
@types/node ^24.x
@types/react ^19.x
@types/react-dom ^19.x
@types/express ^5.x
@types/multer ^2.x
@types/pdf-parse ^1.x
```

Do not install floating `latest` versions when exact reproduction matters. The
lockfile and manifest together are authoritative.

## 5. Webpack configuration

Create `webpack.config.mjs` with these requirements:

- Entry: `src/main.tsx`.
- Output: clean `dist/`, hashed production assets under `dist/assets/`,
  `publicPath: '/'`.
- Resolve `.tsx`, `.ts`, `.jsx`, `.js`.
- Babel rules for TypeScript and TSX using preset-env, preset-react automatic
  runtime, and preset-typescript.
- CSS rules using `style-loader` and `css-loader`.
- Asset resources for images.
- HtmlWebpackPlugin using `index.html` without a manual module script.
- DefinePlugin exposes `__API_ORIGIN__` from `process.env.API_ORIGIN` or the
  compatibility fallback `process.env.VITE_API_ORIGIN`.
- `splitChunks: { chunks: 'all' }`.
- Webpack Dev Server host `0.0.0.0`, port `4444`, HMR enabled, static `public/`,
  history fallback enabled, and proxy `/api` to `http://localhost:4445`.

`src/env.d.ts` must contain:

```ts
declare const __API_ORIGIN__: string
```

`src/styles.d.ts` must declare CSS side-effect imports:

```ts
declare module '*.css'
```

## 6. Filesystem scanner and local SQLite

Default Study root:

```text
path.resolve(serverDirectory, '..', '..)
```

More precisely, the server directory is derived from its own module URL and the
default content root is the directory directly above the app repository. Use
`STUDY_CONTENT_DIR` when set.

Default Watch root:

```text
WATCH_MEDIA_DIR || path.join(os.homedir(), 'Desktop')
```

Ignore hidden directories, `.git`, `.idea`, `.vscode`, `node_modules`, `dist`,
`build`, `coverage`, the app directory, `Music`, and
`Music Library.musiclibrary` where applicable.

Study extensions:

```text
Markdown: .md .markdown .mdx
PDF: .pdf
Text/code: .c .cc .cpp .css .csv .go .h .hpp .html .java .js .json .jsx .mjs
           .py .rs .sh .sql .tex .toml .ts .tsx .txt .xml .yaml .yml
Books/office: .azw .azw3 .docx .epub .mobi .odp .ods .odt .pptx .xlsx
Images: .png .jpg .jpeg .gif .webp .svg .avif
```

Watch extensions:

```text
Video: .mp4 .m4v .webm .mov .mkv
Audio: .mp3 .m4a .aac .ogg .opus .wav .flac
```

The SQLite schema must create WAL mode, foreign keys, and:

```sql
CREATE TABLE IF NOT EXISTS catalog_items (
  path TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('document', 'image', 'video', 'audio')),
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes >= 0),
  modified_at TEXT NOT NULL,
  indexed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS catalog_items_kind_idx ON catalog_items(kind);
CREATE INDEX IF NOT EXISTS catalog_items_title_idx ON catalog_items(title);
```

Study rescans replace only `document` and `image` rows. Watch rescans replace
only `video` and `audio` rows. Never let one mode delete the other mode's
metadata.

## 7. REST response contracts

Stable Study endpoints:

```text
GET /api/health
GET /api/auth/session
POST /api/auth/login             { password }
POST /api/auth/logout
GET /api/library
GET /api/content?path=...
GET /api/asset?path=...
GET /api/file?path=...
POST /api/uploads
POST /api/uploads/:id/commit
DELETE /api/uploads/:id
POST /api/ebooks
POST /api/catalog/sync
```

Stable Watch endpoints:

```text
GET /api/media?kind=video|audio&q=...
GET /api/media/stream?path=...
GET /api/media/subtitle?path=...
```

Every filesystem path must be normalized, relative, and confined to its root.
Media streams must return:

```text
200 with Content-Length when no Range header is present
206 with Accept-Ranges, Content-Range, Content-Length for valid ranges
416 with Content-Range: bytes */<size> for invalid ranges
```

Errors must be bounded JSON such as:

```json
{ "code": "NOT_FOUND", "message": "That media file could not be found." }
```

Never return absolute filesystem paths, stack traces, SQL, credentials, cookie
values, or raw provider errors.

## 8. React behavior

### Study mode

- Load `/api/auth/session` first.
- If authentication is required, show the password screen.
- Load `/api/library` after authentication.
- Show loading, error, empty, and success states.
- Select the first document by default.
- Markdown/text use `/api/content` and ReactMarkdown with GFM, sanitization,
  and code highlighting.
- Images use `/api/asset` and a visual reference view.
- PDFs/EPUBs use `/api/file`; unsupported formats use honest download/open
  fallback.
- Search matches title, name, and folder.
- Bookmarks/completion/theme are browser-local in this phase.

### Watch mode

- Load `/api/media` after entering Watch.
- Show a shell header with Study/Watch mode switch, theme control, and logout.
- Show real local media only; no fake posters or demo metadata.
- Selecting video creates a `<video>` player with `playsInline`, range URL,
  custom controls, and VTT `<track>` sidecars.
- Selecting audio creates an `<audio>` player with the same range URL and a
  restrained audio art surface.
- Controls: play/pause, seek range, back 10 seconds, forward 10 seconds,
  volume, speed (`0.75x`, `1x`, `1.25x`, `1.5x`, `2x`), quality variants, language,
  fullscreen.
- Quality variants are discovered by matching the same media basename with
  suffixes such as `720p`, `1080p`, `1440p`, `2160p`, or `4k`.
- Subtitle sidecars use names such as `movie.en.vtt` and are selectable by
  language.
- Lyrics sidecars use `.lrc` timestamps. The active line is selected by the
  current player time; clicking a line seeks the player.
- If no media exists, show an explicit empty state explaining `WATCH_MEDIA_DIR`.

## 9. Exact visual system

Use the same CSS variables:

```css
--paper: #f4f0e7;
--paper-raised: #fffdf8;
--ink: #1d2523;
--muted: #71807a;
--line: rgba(29, 37, 35, 0.12);
--line-strong: rgba(29, 37, 35, 0.2);
--accent: #e66d43;
--accent-soft: rgba(230, 109, 67, 0.13);
--teal: #1e6b68;
--teal-soft: rgba(30, 107, 104, 0.13);
--shadow: 0 24px 70px rgba(43, 45, 32, 0.14);
--shadow-small: 0 10px 28px rgba(43, 45, 32, 0.1);
--code: #212a2a;
--surface-radius: 18px;
```

Dark theme:

```css
--paper: #111917;
--paper-raised: #182321;
--ink: #ebefe5;
--muted: #91a19a;
--line: rgba(235, 239, 229, 0.1);
--line-strong: rgba(235, 239, 229, 0.18);
--accent: #ef825a;
--accent-soft: rgba(239, 130, 90, 0.14);
--teal: #6bb7a4;
--teal-soft: rgba(107, 183, 164, 0.13);
--shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
--shadow-small: 0 12px 32px rgba(0, 0, 0, 0.22);
--code: #0e1514;
```

Fonts:

```css
DM Sans       body and controls
DM Mono       metadata, labels, paths, counts
Fraunces      editorial headings
```

Study dimensions:

```text
Topbar min-height: 78px
Search height: 42px
Icon buttons: 40px x 40px
Rail width: 236px
Workspace max-width: 1640px
Content grid: .72fr / 1.3fr with 22px gap
Reading surface min-height: 640px
Markdown max-width: 760px
Large reading max-width: 840px
Mobile breakpoint: 720px
Minimum viewport: 320px
```

Watch dimensions:

```text
Watch topbar min-height: 76px
Watch main max-width: 1500px
Player/details: 1.75fr / .65fr with 22px gap
Player min-height: 470px
Audio stage min-height: 470px
Library: two columns desktop, one below 620px
Lyrics scroll area: maximum 230px
```

Do not add harsh gradients, pure-white generic backgrounds, rainbow colors,
neon/purple bias, radial orbs, dot-grid decorations, fake testimonials,
pricing cards, bento grids, fake posters, excessive shadows, excessive rounded
cards, emojis, fake statistics, or a marketing hero. The first screen must be a
usable library/player. Use purposeful icons, real controls, explicit loading/
empty/error states, accessible labels, and reduced-motion behavior.

## 10. Agent behavior

The new agent receiving only this document must:

1. Treat this document as the complete specification.
2. Create the project tree and all source/configuration files from scratch.
3. Install the exact package versions or use the supplied lockfile.
4. Never assume existing source, database, media, API, credentials, or screenshots.
5. Create safe sample fixtures only in temporary directories, never in the user's
   real Study or Watch roots.
6. Keep local filesystem mode functional before adding hosted adapters.
7. Never add secrets, fake media, fake metadata, or copyrighted content.
8. After every edit, run the narrowest relevant check.
9. Use the feature log format in this document if a feature log is requested.
10. Report missing browser automation, credentials, PDF/EPUB/media fixtures, or
    external services instead of claiming those validations passed.

Custom-agent frontmatter:

```yaml
---
name: "Study Library App Builder"
description: "Use for the complete Study/Watch shell, Webpack client, REST API, local SQLite catalog, media player, storage, Android wrapper, and operations work."
tools: [read, edit, search, execute, todo]
argument-hint: "Describe the Study Library change."
---
```

The agent must preserve the API and UI contracts in this document even if it
chooses Python, Java, Go, or .NET for a separate API implementation.

## 11. Build and run

Local development:

```bash
pnpm install
WATCH_MEDIA_DIR="$HOME/Desktop" pnpm dev
```

Open:

```text
http://localhost:4444
```

Production-shaped local server:

```bash
STUDY_CONTENT_DIR=/srv/study-library \
WATCH_MEDIA_DIR=/srv/study-library \
PORT=4444 \
pnpm start
```

Do not use ports `3000` or `8080`.

## 12. Verification gate

Run:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Start the app and check:

```bash
curl -i http://localhost:4444/
curl -i http://localhost:4445/api/health
curl -i http://localhost:4445/api/library
curl -i http://localhost:4445/api/media
curl -H 'Range: bytes=0-127' -i 'http://localhost:4445/api/media/stream?path=encoded%2Fmedia.mov'
```

Check all of these:

- Study Markdown renders with links/images sanitized and resolved.
- Study image preview opens and returns to the last document.
- Study PDF and EPUB paths work when fixtures exist.
- Watch catalog lists real local files and creates SQLite metadata.
- Video play/pause, seek, forward/back, speed, volume, quality, subtitles, and fullscreen work.
- Audio play/pause, seek, speed, volume, and LRC active-line sync work.
- Loading, empty, error, auth, and success states are visible.
- The mode switch preserves shell styling and does not use an iframe.
- Layout works at `320px`, `390px`, `768px`, `1024px`, and `1440px`.
- Ports `3000` and `8080` remain untouched.
- Browser screenshots are taken when browser automation is available.

If PDF, EPUB, subtitle, lyrics, or browser fixtures are absent, report the gap.
Do not invent a passing result. Do not claim cloud deployment, public media
rights, CDN readiness, Android Play release, or provider health without real
credentials and live checks.
