---
name: "Study Library App Builder"
description: >
  Use when creating, rebuilding, testing, reviewing, or deploying the Second
  Brain Study Library. Reproduces the local-first markdown and image library,
  folder indexing, reading workflow, responsive study UI, 3D motion system,
  hosted Supabase Storage mode, REST API contract, deployment workflow, and the
  future lawful Watch media domain.
tools: [read, edit, search, execute, todo]
argument-hint: "Describe the study library change."
---

# Study Library App Builder

You own the Second Brain Study Library in this repository. It is a portable,
file-backed learning workspace: the user creates folders and adds Markdown files
and images; the app recursively indexes those files and renders them in a
focused, searchable reading experience.
The product shell includes a local Watch mode for authorized personal
video/audio and may later add hosted Watch for authorized movies/series; keep
that media pipeline distinct from document reading.

## Project memory

Before a substantial change, read `SYSTEM_DESIGN.md`, `OPERATIONS.md`, and
`FEATURE_LOG.md`.
Treat them as durable project memory: `SYSTEM_DESIGN.md` owns architecture,
hosting, security, API decisions, and future plans; `OPERATIONS.md` owns
database, self-hosting, backup, deployment, and monitoring procedures;
`FEATURE_LOG.md` records what has shipped and how it was validated. Update the
feature log after every feature, fix, refactor, configuration, or documentation
change.

When bootstrapping on a new machine with no repository files, use the supplied
standalone `REPLICATION_GUIDE.md` as the complete specification. Do not require
missing project-memory files, invent dependencies, or ask the user to provide
the old repository. Create the tree, contracts, UI, storage, API, and validation
from that guide first; add the project-memory files as part of the bootstrap.
For exact Markdown-only replication, also consume `REPLICATION_SOURCE_WEB.md`,
`REPLICATION_SOURCE_SERVER.md`, `REPLICATION_SOURCE_API.md`,
`REPLICATION_SOURCE_ANDROID.md`, and `REPLICATION_SOURCE_DOCS.md`. Extract each
`## File: ...` fenced block verbatim into the target path before running tests.
When these bundles are present, they are normative. Do not replace their API,
JSX, CSS, dependency versions, routes, or configuration with a scaffold or an
equivalent redesign.

## Architecture decision ledger

- The web shell is React/TypeScript built with Webpack 5; Node/pnpm is required
  for that build, but the separate API language is independent.
- The API contract is versioned REST/OpenAPI. Node/Express is the current
  default; Python/FastAPI, Java/Spring Boot, Go, and C#/ASP.NET Core may be
  interchangeable learning implementations selected through `API_ORIGIN`.
- Keep one selected API writer per environment. Use isolated databases and
  mocked Storage for comparison; do not let experimental APIs compete over the
  production catalog.
- PostgreSQL stores metadata, identity, progress, rights, and jobs. SSD files
  or private object storage hold books, ebooks, and local media.
- Use one shell with `/study` and `/watch`; add subdomains only when independent
  deployment, scaling, or security boundaries justify them.
- The personal server uses the 512 GB NVMe for OS/PostgreSQL, a redundant
  external four-NVMe pool for active objects, the internal 2 TB NVMe for staging
  and restore, and the SATA SSD for local backups plus an offsite copy.
- Watch media is lawful-only, separate from document routes, and requires
  workers, HLS/DASH, signed playback, CDN planning, and takedown handling.
- Start modular-monolith-first, then add replicas/workers and extract services
  only when measurements justify the operational cost.

## Product contract

1. The app runs on `http://localhost:4444`.
2. The default content root is the directory directly above the app repository.
3. `STUDY_CONTENT_DIR` overrides the content root for internal deployments.
4. New folders and supported files appear after `Rescan folders`. The app also
  stages browser uploads for review before moving them into the content root.
5. Supported documents include `.md`, `.markdown`, `.mdx`, `.pdf`, common text
  and code extensions, ebook formats, and office textbook formats.
6. Supported images are `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, and
   `.avif`.
7. Hidden directories, the app directory, `node_modules`, build output,
   coverage, and the unrelated audio-library directory must not be indexed.
8. Relative paths must be resolved and served safely under the content root.
9. Markdown is rendered with GitHub-flavored syntax, sanitized HTML, highlighted
   code blocks, and local relative image resolution.
10. Bookmarks, completion state, theme, focus mode, and reading size are user
  experience features. Bookmark and completion state remain local browser
  preferences in the current phase; study files remain on disk locally or in
  private object storage when hosted.
11. `STORAGE_MODE=filesystem` is the default local mode. `STORAGE_MODE=supabase`
  is the durable hosted mode and requires server-only Supabase credentials.
12. The API is REST. Do not introduce GraphQL or a Java backend unless the
  system design is updated with a concrete client/query need first.
13. Local Watch scans `WATCH_MEDIA_DIR` (Desktop by default), persists media
  metadata in `data/study-library.sqlite`, and supports video/audio playback,
  byte ranges, VTT subtitles, and sidecar LRC lyrics.

## File and Ebook Storage Contract

- In local mode, study files live under `STUDY_CONTENT_DIR`; if it is unset,
  use the directory directly above this repository. Keep books in category
  folders such as `Python/`, `System Design/`, or `Ebooks/`, never in `src/`,
  `public/`, `dist/`, or `node_modules/`.
- In hosted mode, PDFs, EPUBs, Markdown, images, office files, and generated
  ebooks live in the private object-storage bucket. Preserve relative keys such
  as `System Design/01-foundations.pdf` and `Ebooks/collection.epub`.
- PostgreSQL stores catalog metadata, stable IDs, reading state, bookmarks, and
  upload-job state. Never store large book bytes in SQL rows, browser local
  storage, source control, or public URLs.
- Readers access files only through authorized REST routes (`/api/content`,
  `/api/asset`, `/api/file`) or a server-issued short-lived download URL. The
  browser, Android app, and agents must never connect directly to PostgreSQL or
  use a Supabase service-role key.
- Every new ebook format must have an allowlisted extension, MIME policy,
  metadata parser or honest download fallback, bounded parsing, and a test for
  a missing/corrupt object. EPUB export must write to staged/private storage,
  then update catalog metadata only after the object is complete.
- Scale catalog reads with database pagination/search and stable item IDs. Do
  not list an entire bucket or load every PDF into `/api/library`.
- Keep originals immutable after commit when practical. Use a new object key
  for replacements, record checksums and byte size, and clean up abandoned
  staged objects with an idempotent job.

## Failure-Resistant Operating Rules

- Never turn Storage, database, authentication, or catalog-sync failure into an
  empty successful library. Return a bounded, retryable error and preserve the
  last known catalog only when its freshness is visible.
- Make writes recoverable: stage first, validate second, commit third, catalog
  sync fourth, and delete temporary data only after the durable step succeeds.
  Add compensation for partial Storage/database failures.
- Validate every request at the boundary, enforce authorization server-side,
  bound file size and parser work, and redact secrets, cookies, book contents,
  and local paths from logs.
- Preserve response contracts across the root server and `api/`. Any contract
  change must update the system design, client adapter, tests, migration notes,
  and feature log in the same change.
- Before declaring work complete, run the narrowest focused check, then the
  relevant typecheck/lint/build/test gates, and report unavailable scans or
  external credentials instead of claiming they passed.
- Do not call the app fail-proof. Treat every change as a failure-mode exercise:
  define the expected behavior for missing files, duplicate names, expired
  sessions, provider outages, partial writes, large books, and bad input.

## Media Library Contract

- Books, PDFs, Markdown, EPUBs, and office files remain on the document/ebook
  pipeline. Local video/audio uses the Watch media routes; do not add video
  bytes to `/api/file` or load them into `/api/library`.
- Only ingest videos the owner created, licensed for redistribution, purchased
  with redistribution rights, or that are public domain. Never rip DRM, bypass
  access controls, scrape streaming services, or publish unlicensed films.
- Hosted media records require rights/provenance, checksum, duration, codecs,
  subtitles, age/region policy, publish status, and takedown metadata before
  public playback is enabled.
- Store private originals and HLS/DASH renditions in object storage. Use a
  queued FFmpeg/transcoding worker, bounded processing, thumbnails, subtitles,
  retries, and cleanup; never transcode a full movie in an HTTP request.
- Serve movies through short-lived signed manifests/segments or an authorized
  CDN. Do not create permanent public file URLs or expose service credentials.
- Keep media routes separate: `/api/media`, `/api/media/stream`,
  `/api/media/subtitle`, future publish routes, and watch-progress routes.
  Worldwide streaming needs
  lawful distribution, CDN bandwidth, monitoring, and a takedown process; free
  web hosting is not a movie CDN.
- Start with one shell app using `/study` and `/watch` routes and a visible
  mode switch. Keep the Android `LIBRARY_URL` pointed at the shell. Do not use
  iframes for the modes. Extract `study.example.com`, `watch.example.com`,
  `api.example.com`, or `media.example.com` only when independent deployment,
  scaling, or security boundaries justify their CORS, cookie, DNS, and release
  complexity.

## Repository and Shell Structure

- The target split is `study-library-web`, `study-library-api`,
  `study-library-contracts`, and optional `study-library-workers`. This current
  workspace may contain `api/` during migration.
- The React shell should organize features under `src/features/study/` and
  `src/features/watch/`, with `src/app/` owning routes/providers/mode switch,
  `src/entities/` owning domain views, `src/shared/` owning reusable UI, and
  `src/platform/` owning auth/API/telemetry adapters.
- Keep the API contract in OpenAPI or generated shared types. Do not duplicate
  request/response shapes manually between repositories.
- Node is required for the React/Webpack build even if the separate API is
  Python, Java, or Go. Keep API language choice behind the REST contract,
  authentication/error semantics, range behavior, and storage ports.
- A learning lab may implement the same OpenAPI contract in five repositories:
  Node/Express, Python/FastAPI, Java/Spring Boot, Go/net-http or chi, and
  C#/ASP.NET Core. The UI selects one with `API_ORIGIN`; do not let multiple
  implementations mutate the same production catalog concurrently.
- Run the same contract suite against every stack, with isolated test database
  schemas and mocked Storage. Compare latency, memory, startup, range behavior,
  failure recovery, testing, observability, and deployment effort before
  choosing a production implementation.

## Required architecture

- React and TypeScript client built with Webpack 5.
- Express-compatible Node server in `server/index.ts`.
- Independent hosted REST service in `api/` with Supabase PostgreSQL and private Storage integration.
- `GET /api/library` returns the recursive inventory and counts.
- `GET /api/content?path=...` returns a Markdown or text document.
- `GET /api/asset?path=...` streams an image.
- `GET /api/file?path=...` streams an indexed PDF or fallback file.
- `POST /api/uploads` stages and classifies an upload.
- `POST /api/uploads/:id/commit` moves an approved upload into a category.
- `DELETE /api/uploads/:id` discards a staged upload.
- `GET /api/media` lists local Watch video/audio metadata.
- `GET /api/media/stream?path=...` serves authorized local range streams.
- `GET /api/media/subtitle?path=...` serves validated local WebVTT sidecars.
- Development uses Webpack Dev Server on `4444` and the content server on
  `4445`; Webpack proxies `/api` to `4445`.
- Production builds the client and serves both static files and the API from
  the same server on `PORT`, defaulting to `4444`.
- The server must derive its app/static root from its own module path, not from
  the process working directory. This keeps service-manager launches portable.
- Keep data types in `src/types.ts` and HTTP details in `src/api.ts`.
- `API_ORIGIN` may point the client at the independent API service; empty means same-origin `/api` routes. The old `VITE_API_ORIGIN` name is accepted only for migration compatibility.
- Use PostgreSQL for future metadata/progress and private object storage for
  book binaries; never put large books in SQL rows.
- Keep `SUPABASE_SERVICE_ROLE_KEY`, AI keys, and session secrets server-only.
- The Android wrapper uses Gradle Kotlin DSL; this Node repository uses pnpm.
- Keep Node.js/Express for the main REST API while workloads are I/O-bound and
  the browser/API contract is TypeScript. Java/Spring or Go may be introduced
  only for a measured service boundary such as media transcoding or a
  high-throughput gateway. Python/FastAPI may be introduced for AI, OCR, or
  data-processing workers. Do not rewrite the main API speculatively.
- Do not add hard-coded absolute content paths or a client-side copy of study
  files.

## API Creation and Extension Standard

The independent `api/` service is a first-class product surface, not a thin
route file. Preserve REST and the existing web-client response contracts while
keeping the root `server/` compatibility mode working.

### API boundaries and modules

- Keep the API bootstrap in `api/src/server.ts`; keep route registration,
  middleware, validation, controllers, services, storage, database access,
  authentication, error types, and response contracts in separate modules.
- Keep HTTP parsing and status translation in route/controller modules. Keep
  business rules in services, Supabase queries in repositories or adapters, file
  streaming in storage adapters, and environment parsing in configuration.
  `src/sync.ts` may be a CLI entry point but must call the same typed service
  layer as the HTTP endpoint.
- Keep shared request/response/error types in a contract module. The browser
  client in `src/api.ts` must not duplicate server business rules or SQL details.
- Use schema validation (Zod or the repository's typed equivalent) for every
  path parameter, query, JSON body, header token, multipart field, and upload
  metadata before business logic runs. Reject unknown or malformed values with
  deliberate errors and bounded limits.
- Preserve the REST contract for `/api/health`, auth/session, library, content,
  asset, file, uploads, ebooks, and catalog sync routes. A contract change must
  update `SYSTEM_DESIGN.md`, the client adapter, API tests, and feature log.

### HTTP, auth, and persistence rules

- Use a stable error body such as `{ message, code, requestId }`; never return
  stack traces, SQL, filesystem paths, provider errors, secrets, or raw exception
  objects. Map invalid input to `400`, unauthenticated requests to `401`,
  forbidden actions to `403`, missing resources to `404`, conflicts to `409`,
  oversized uploads to `413`, unsupported media to `415`, rate limits to `429`,
  dependency outages to `503`, and unexpected failures to a generic `500`.
- Centralize error middleware and request IDs. Log structured diagnostic context
  server-side without passwords, tokens, file contents, personal data, or full
  local paths. Health responses may expose active mode and dependency status, but
  never credentials or internal configuration.
- Keep `SUPABASE_SERVICE_ROLE_KEY`, AI keys, session secrets, and sync tokens on
  the server. Use signed, HttpOnly, Secure cookies with an intentional SameSite
  policy for hosted sessions; use constant-time password/token comparison and
  add CSRF protection and rate limiting before multi-user exposure.
- Enforce authorization on every catalog, content, asset, file, upload, commit,
  EPUB, and sync action. Do not rely on React route guards or hidden controls.
- Use PostgreSQL constraints, typed queries, parameter binding, and explicit
  migration files for metadata. Do not edit a deployed schema destructively;
  preserve backwards compatibility, indexes, foreign keys, and a rollback path.
- Keep large binaries in private Storage and stream them with bounded memory.
  Preserve valid byte ranges with `206`/`416` behavior, content types, and safe
  download names without exposing a public bucket URL.

### File, upload, and workflow invariants

- Resolve every requested path beneath the configured content root or private
  bucket prefix. Reject absolute paths, traversal, encoded traversal, unsafe
  symlinks, hidden/system directories, and archive entries escaping a destination.
- Enforce allowlisted extensions, MIME checks, filename normalization, upload
  size limits, decompression limits, and safe temporary locations. Stage uploads
  before approval; never let AI classification auto-commit a file.
- Make upload commit, discard, catalog sync, and cleanup operations idempotent
  where possible. Model staged/committed/discarded/failed states explicitly and
  add compensation or retry behavior for storage/database partial failures.
- Never fall back to an empty library when Storage or PostgreSQL is unavailable;
  return a visible retryable error so users cannot mistake an outage for data loss.
- Keep REST route names and status behavior stable for the root server and the
  independent API. Document intentional compatibility adapters instead of
  silently changing client semantics.

### API test contract

- Add a test runner to both the root client and `api/` before adding substantial
  API behavior. Vitest with `@vitest/coverage-v8`, React Testing Library for UI,
  and Supertest or an equivalent HTTP harness are suitable for this stack.
- Test route status, headers, content types, error bodies, auth boundaries,
  validation, path traversal, hidden paths, unsupported files, upload limits,
  duplicate names, commit/discard idempotency, range requests, provider failures,
  database failures, sync-token rejection, and partial storage failures.
- Use mocked Supabase/Storage adapters in unit tests and controlled fixtures in
  integration tests. Never use production credentials or mutate the real private
  bucket from tests.
- Add `test` and `test:coverage` scripts with thresholds of at least 90% for
  statements, branches, functions, and lines. Coverage must include changed API
  services and route branches; do not exclude them to make the gate pass.

## UI language and motion contract

The visual language is a calm study desk: warm paper surfaces, teal structure,
coral accents, editorial serif headings, and compact mono metadata. Preserve
this intentional contrast rather than falling back to a generic dashboard,
purple gradient, or flat card grid.

The study surface should feel tactile but remain readable:

- Use CSS perspective and `transform-style: preserve-3d` for stable depth on the
  reading surface, library rail, and insight deck.
- Let pointer movement update a soft glow only; never move the reading document
  or its hit boundary in response to pointer position.
- Use staged rise-in and row-reveal animations to show hierarchy as content loads.
- Use the slow grid drift and orbit indicator as ambient study cues, not as the
  main content.
- Keep hover transforms small and never require hover to understand a control.
- Include `prefers-reduced-motion: reduce` rules that remove tilt and compress
  animations.
- Keep touch targets at least 40px and support widths down to 320px.
- Preserve light mode, dark mode, focus mode, search, bookmarks, completion,
  reading-size control, and the dedicated image preview.
- For replication, copy `App.tsx`, `App.css`, `Watch.css`, `index.css`,
  `WatchView.tsx`, `UploadDialog.tsx`, `api.ts`, `types.ts`, `index.html`,
  `webpack.config.mjs`, `package.json`, and `pnpm-lock.yaml` before redesigning.
  Treat those files as the visual source of truth; do not substitute a generic
  dashboard, fake media posters, marketing hero, pricing cards, gradients,
  rainbow/neon palettes, radial orbs, excessive rounded cards, or decorative
  motion. Validate at 320px, 390px, 768px, 1024px, and 1440px when tooling is
  available and report browser-automation limitations honestly.

## Content workflow

- Use folder names as categories and preserve natural numeric filename order.
- Show loading, error, empty, and successful states.
- A selected Markdown file opens in the reading surface.
- A selected image opens in the visual-reference panel and can return to the
  selected note.
- A selected PDF opens in the reading surface; an EPUB opens in the built-in
  reader; other indexed textbook files offer safe open/download actions.
- Watch mode lists local videos and songs, supports play/pause, seeking,
  playback speed, volume, quality variants, subtitle language selection, and
  synchronized `.lrc` lyrics when a sidecar file exists.
- Markdown/text notes can be exported through `POST /api/ebooks` as EPUB 3
  files under the `Ebooks` category.
- Hosted catalog metadata can be refreshed through `POST /api/catalog/sync`
  with the server-only sync token.
- Relative Markdown links to another indexed Markdown file should open inside
  the app. External links may remain normal links.
- Relative Markdown images should resolve through `/api/asset` with encoded
  query parameters.
- Search should match title, filename, and folder path.
- A rescan must not discard existing local bookmark or completion preferences.

## Implementation rules

- Check the nearest existing code before editing.
- Read `SYSTEM_DESIGN.md`, `OPERATIONS.md`, `FEATURE_LOG.md`, and this agent
  file before a substantial change.
- Make the smallest coherent change and run the narrowest validation immediately.
- Keep visible copy in the component model or existing source, not duplicated in
  unrelated CSS selectors.
- Use typed React events and avoid `any`, unsafe assertions, debug logging, and
  unhandled promises.
- Use `rehype-sanitize` for rendered Markdown and never use raw untrusted HTML.
- Do not change study files while implementing the app.
- Do not commit, reset, or discard user changes.
- Update `FEATURE_LOG.md` after every feature, fix, refactor, configuration, or
  documentation change using the repository's exact entry format.

## Static Analysis and File Quality Baseline

Apply these rules to new and changed TypeScript, TSX, JavaScript, test,
configuration, server, and API files. Generated output, lockfiles, coverage
reports, vendored code, and generated snapshots may be excluded only in tool
configuration; never exclude changed production code to hide a finding.

### File size, readability, and complexity

- Keep source lines at or below 120 characters. Wrap imports, JSX, chained
  expressions, SQL, and test assertions instead of allowing long lines to grow.
- Keep an application file at or below 300 physical lines as the normal target.
  At 300 lines, stop adding unrelated logic and evaluate extraction; split a
  file before it reaches 400 lines. A file over 500 lines requires a documented
  exception in the feature log and is not acceptable for routine new code.
- Keep one responsibility per file. Extract cohesive hooks, helpers, API
  adapters, types, validators, styles, route handlers, and storage services when
  a file becomes difficult to scan; do not split trivial statements merely to
  satisfy a number.
- Keep functions at or below 50 lines as the target. Review anything over 60
  lines, extract cohesive branches above 80 lines, and do not add a new function
  over 100 lines without a documented exception.
- Keep control-flow nesting at three levels or fewer. A fourth level requires a
  refactor attempt or documented exception; a fifth level is prohibited. Prefer
  guard clauses, early returns, extracted predicates, lookup tables, and strategy
  functions. Do not use nested ternaries or deeply chained boolean conditions.
- Keep cyclomatic complexity at 10 or less and cognitive complexity at 15 or
  less per function. Split a function when either threshold is reached; do not
  suppress the scanner finding to keep the function intact.
- Keep new-code duplication at or below 3% where the Sonar configuration
  supports that gate. Resolve duplication through a named shared abstraction.
- Keep client, server, API, storage, and configuration imports layered and
  acyclic. Do not create circular dependencies between the reader and file API.

### Sonar-style reliability and maintainability rules

- Require zero new blocker or critical issues, zero new reliability/security
  issues, no new unreviewed security hotspots, and all four coverage metrics at
  or above 90% for changed behavior.
- Do not commit dead code, unreachable branches, unused imports/parameters,
  empty catches, commented-out code, unexplained magic values, duplicated string
  literals, or debug logging. Use named constants and typed error handling.
- Do not add `NOSONAR`, `eslint-disable`, `ts-ignore`, or `ts-expect-error` to
  bypass a finding. A genuinely necessary narrow suppression must explain why,
  name the risk, and be recorded in the feature log for review.
- Keep exported functions, React components, route handlers, parsers, and
  storage services small and explicit. Use complete types, null guards, and
  explicit error states instead of unsafe casts or implicit fallthrough.
- Formatter, typecheck, lint, test, and static-analysis warnings are defects to
  fix, not warnings to ignore.

### CodeQL-oriented security rules

- Treat query parameters, request bodies, headers, filenames, Markdown, archive
  entries, uploaded files, and remote metadata as untrusted. Validate them at the
  boundary and enforce authorization in the server/API service.
- Keep every resolved path confined under the configured content root. Reject
  traversal, unsafe symlink escapes, absolute paths, and archive entries that
  escape their destination. Keep hidden/app/build/coverage directories excluded.
- Never build SQL, shell commands, regular expressions, HTML, or filesystem paths
  by concatenating untrusted input. Use parameterized queries, bounded regexes,
  sanitized Markdown, encoded asset parameters, and allowlisted remote origins.
- Do not use `eval`, `new Function`, dynamic shell execution, or child processes
  with user-controlled arguments. Constrain upload size/type/name and validate
  archive extraction before writing files.
- Keep Supabase service keys, AI keys, session secrets, and personal data out of
  source, client bundles, URLs, logs, tests, screenshots, and feature logs. Use
  server-only environment values and secure session/cookie settings.
- Handle errors without exposing stack traces, SQL, filesystem paths, tokens, or
  internal authorization details. Bound expensive parsing, search, exports,
  decompression, range reads, and retries.

### Static-analysis enforcement

- Before completion, run formatter check, typecheck, lint, focused tests, full
  tests, four-metric coverage, and the relevant client/server build. Run the
  configured Sonar and CodeQL workflows when available; never claim a scan passed
  when it was not run.
- New repositories must add a test runner and coverage command with thresholds,
  formatter/linter configuration, dependency auditing, and CI Sonar/CodeQL gates
  before promotion. The current package must gain a real test/coverage script
  before a new feature is considered complete; do not claim 90% without metrics.
- If a quality tool is unavailable locally, report that limitation and use the
  equivalent type, lint, test, security, and manual boundary checks.

## Recreate this app on a new machine

From an empty target folder:

1. Install Node.js 22.5+ and pnpm, then scaffold a React TypeScript project with Webpack 5.
2. Install `express`, `lucide-react`, `react-markdown`, `remark-gfm`,
   `rehype-sanitize`, `rehype-highlight`, `multer`, `pdf-parse`, `mammoth`,
  `epubjs`, `jszip`, `marked`, `concurrently`, `tsx`, `vitest`,
  `@vitest/coverage-v8`, and `supertest`; install `@types/express`,
  `@types/multer`, and any required Supertest types as development dependencies.
3. Create the typed API and recursive server contract above.
4. Create the responsive study workspace with the motion contract above.
5. Add the Webpack config/proxy, server/API TypeScript configs, test and coverage scripts,
  README, system design, feature log, and this agent file.
6. Add CI formatter, typecheck, lint, test/coverage, dependency-audit, Sonar,
  and CodeQL quality gates before calling the new app complete.
7. Run the validation commands below.

## Validation gate

Run all of these before declaring the app complete:

```bash
pnpm typecheck
pnpm lint
pnpm test:coverage
pnpm build

cd api
pnpm typecheck
pnpm lint
pnpm test:coverage
pnpm build
```

For a live content-root check, run the server on `4445` and verify:

```bash
curl -i http://localhost:4445/api/library
curl -i 'http://localhost:4445/api/content?path=some%2Fnote.md'
curl -I 'http://localhost:4445/api/asset?path=some%2Fdiagram.svg'
curl -i http://localhost:4450/api/health
```

Also verify that a traversal path returns `404`, a new folder appears after a
rescan, Markdown links open in the reading surface, an image opens in the side
panel, the theme and focus controls work, and the interface remains usable at
320px and desktop widths. Verify Watch media listing, range streaming, subtitle
sidecars, audio playback controls, and lyrics parsing when local fixtures exist.
In hosted mode also verify `/api/health`, login,
logout, private Storage reads, range requests, and upload approval. When
browser automation is unavailable, report that limitation and use live HTTP
checks plus the build, typecheck, lint, test/coverage, traversal, auth, and
provider-failure results instead. Run configured Sonar and CodeQL scans when
available and report unavailable scans explicitly.
