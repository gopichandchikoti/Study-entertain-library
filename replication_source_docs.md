# Exact Project Memory and Operations Bundle

This file is a generated exact source bundle. Create each target path and copy the corresponding fenced block verbatim. Do not redesign or paraphrase these files during exact replication.

Generated from the current project on 2026-09-30T22:23:55.606Z.

## File: .github/agents/study-library.agent.md

````md
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
````

## File: .github/copilot-instructions.md

````md
# Study Library Workspace Instructions

This workspace owns the Second Brain Study Library: a React/Webpack reading UI and an Express/Node API for Markdown, text, PDFs, images, EPUBs, and other indexed book files.

## Always read

Before a substantial change, read:

- `SYSTEM_DESIGN.md` for architecture, hosting, storage, API, and security decisions.
- `FEATURE_LOG.md` for shipped behavior and validation history.
- `.github/agents/study-library.agent.md` for the product contract and agent workflow.

Treat those files as project memory. Update `FEATURE_LOG.md` after every feature, fix, refactor, configuration, or documentation change. Keep future plans in `SYSTEM_DESIGN.md` rather than scattering them through source comments.

## Architecture invariants

- `STORAGE_MODE=filesystem` remains the default local mode.
- `STORAGE_MODE=supabase` uses a private Supabase Storage bucket; service-role credentials are server-only.
- The client talks only to same-origin `/api` routes or the explicitly configured `API_ORIGIN` REST service; it never receives Storage, AI, or database secrets.
- Relative paths must remain validated under the active storage root. Never accept absolute paths or traversal segments.
- Keep uploads staged and user-approved before commit. Treat AI classification as an untrusted suggestion.
- Local Watch uses `GET /api/media`, `/api/media/stream`, and
	`/api/media/subtitle`; keep those routes separate from Study document routes.
- The personal SQLite catalog at `data/study-library.sqlite` stores local
	metadata only and must remain ignored by source control.
- Preserve the existing `/api/library`, `/api/content`, `/api/asset`, `/api/file`, upload, and ebook contracts unless the system design is updated first.
- Browser-local bookmarks/completion are current behavior; do not imply cross-device sync until the database-backed phase is implemented.

## Product modes

- The product contains `Study` and `Watch` modes in one shell. Study owns notes,
	PDFs, EPUBs, images, bookmarks, and reading progress. Local Watch owns
	authorized video/audio playback, subtitles, lyrics, and watch controls.
- Hosted Watch is a separate media domain for authorized movies/series. Do not
	add video bytes to document routes or expose raw movie files publicly.
- Only owner-created, licensed, redistribution-authorized, or public-domain
	video may be ingested. Never bypass DRM, scrape streaming services, or host
	unlicensed films.
- Future Watch playback requires rights/provenance metadata, transcoding,
	subtitles, thumbnails, signed HLS/DASH access, watch progress, takedown
	handling, and CDN/bandwidth planning.
- Start with one shell app and `/study` plus `/watch` routes. Keep the Android
	URL pointed at the shell and do not iframe separate modes. Add Study, Watch,
	API, or media subdomains only when independent deployment or scaling justifies
	the additional DNS, CORS, cookie, and monitoring complexity.

	## Repository boundaries

	- The target split is a Webpack React shell repository, a separate API
		repository, a versioned OpenAPI/contracts package, and optional worker
		repositories.
	- The shell remains Node/pnpm because React and Webpack require that build
		toolchain; the API may be Node, Python, Java, or Go if it preserves the REST
		contracts, auth/error semantics, range behavior, and storage ports.
	- Organize the shell around `src/app`, `src/features/study`,
		`src/features/watch`, `src/entities`, `src/shared`, and `src/platform`.
	- A learning lab may implement the same OpenAPI contract in Node/Express,
	  Python/FastAPI, Java/Spring Boot, Go, and ASP.NET Core repositories. Select
	  one with `API_ORIGIN`; do not operate competing writers against the same
	  production catalog without an explicit gateway and ownership model.

## File and ebook lifecycle

- Local files live below `STUDY_CONTENT_DIR`; hosted PDFs, EPUBs, Markdown,
	images, office files, and generated ebooks live in the private object-storage
	bucket. Preserve relative category keys such as `Ebooks/collection.epub`.
- PostgreSQL stores metadata and references, never large book bytes. Clients
	read through authorized REST routes and never connect directly to SQL,
	Storage, or service-role credentials.
- New formats require an extension allowlist, MIME policy, bounded parser,
	honest download fallback, and missing/corrupt-object tests. Keep catalog reads
	paginated and do not list an entire bucket for every request.
- Upload and ebook writes are stage, validate, commit, sync, then clean up.
	Partial failures must be visible and recoverable; never return an empty
	library as if an outage were data loss.

## Working rules

- Make the smallest coherent change and validate it immediately.
- Preserve the warm paper, teal, coral, editorial-serif study UI and responsive behavior.
- Keep loading, empty, error, authentication, and success states explicit.
- Do not add credentials, hard-coded machine paths, or public Storage URLs.
- Use typed TypeScript, no `any`, no unsafe input interpolation, and no unhandled promises.
- Use `pnpm` for dependency changes.
- Do not change study content while changing the application.
- Read `OPERATIONS.md` before changing storage, deployment, backups, monitoring,
  or self-hosting behavior.

## Validation gate

Run, as applicable:

```bash
pnpm typecheck
pnpm lint
pnpm build
curl -i http://localhost:4445/api/health
```

For hosted mode, verify `/api/health`, login, library listing, content, binary range reads, upload approval, logout, and traversal rejection. Never claim deployment is complete without documenting the required environment variables and free-host limitations.
````

## File: ADDING_CONTENT.md

````md
# Adding Content to the Study Library

This app is a local-first, file-backed study library. Study files live on disk, and the app builds its library view by scanning a configured content directory. Browser imports stage files on the server, ask for a category suggestion, and write the file into the library only after approval.

> Current status: manual filesystem import, browser uploads, PDF/text/image readers, textbook fallbacks, and approval-based categorization are implemented. LLM classification is optional; without a configured provider, a local filename/category suggestion is used.

For internet deployment, set `STORAGE_MODE=supabase` and use the private
Supabase Storage bucket described in [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md).
Hosted files are not written to the web host's local disk. Seed an existing
library with `pnpm storage:seed`, then use the same upload and approval flow
through the REST API. Keep Supabase service-role credentials on the server.

## Storage map

### Local filesystem mode

Store source files below the active content root:

```text
STUDY_CONTENT_DIR/
├── System Design/
│   ├── 01-foundations.md
│   └── distributed-systems.pdf
├── Programming/
│   └── algorithms.epub
└── Ebooks/
  └── my-study-collection.epub
```

The local server scans this tree. It returns metadata through `GET /api/library`,
Markdown/text through `GET /api/content?path=...`, images through
`GET /api/asset?path=...`, and PDFs/EPUBs/other files through
`GET /api/file?path=...`. The browser never receives an absolute machine path.

Do not store study files in `src/`, `public/`, `dist/`, `node_modules/`, or
source control. Those locations are application code or generated output.

### Hosted object-storage mode

Store the same relative folder layout as object keys in the private
`study-library` bucket:

```text
System Design/01-foundations.md
System Design/distributed-systems.pdf
Programming/algorithms.epub
Ebooks/my-study-collection.epub
```

The independent `api/` service records each object in PostgreSQL
`library_items`. The database stores the title, type, size, category, modified
time, and storage key; the file bytes remain in private Storage. The API
validates the key, authorizes the request, and streams the object, including
byte ranges for large PDFs where supported. Never make the bucket public and
never put the service-role key in React, Android, `VITE_*`, or a URL.

### Scaling ebooks

As the collection grows, keep originals immutable and use stable catalog IDs.
Add metadata such as author, ISBN, language, cover key, page count, checksum,
parser status, and extracted-text status to `library_items.metadata` or a
future migration. Search and pagination should query PostgreSQL; opening a book
should fetch only its metadata and the requested content/range. Large PDFs and
EPUBs must never be loaded into the library-list response.

A new format is supported only after its extension and MIME are allowlisted,
its browser behavior is known, and its failure mode is explicit. If a format
cannot be rendered safely, index it as a download instead of pretending it is a
reader. Generated EPUBs follow the same private-storage path as uploaded books.

## 1. Where to add files

The server chooses the content root in this order:

1. `STUDY_CONTENT_DIR`, when that environment variable is set.
2. Otherwise, the directory directly above this repository.

For this checkout, the default content root is `/Users/gchikoti/Music`, while the app itself is `/Users/gchikoti/Music/study-library`. The app directory is excluded from the scan.

A custom content root can be used for development or deployment:

```bash
STUDY_CONTENT_DIR=/absolute/path/to/study-root pnpm dev
```

Put study material inside that root, not inside `src/`, `server/`, `public/`, or the app repository. Those folders contain the application itself or its built assets.

### Example: adding Python notes

With the default content root, create a top-level `Python` folder:

```text
/Users/gchikoti/Music/
├── Python/
│   ├── 00-start-here.md
│   ├── 01-syntax.md
│   ├── data-structures/
│   │   └── lists-and-dicts.md
│   └── images/
│       └── list-model.svg
└── study-library/
```

With a custom root, the same layout would be:

```text
/absolute/path/to/study-root/
└── Python/
    └── 00-start-here.md
```

The first folder below the content root becomes the category shown in the left rail. In this example, `Python` is the category. Nested folders remain part of the folder map and file paths. Files placed directly at the root appear under `Library root`.

The scanner supports these files:

| Purpose | Extensions |
| --- | --- |
| Markdown notes | `.md`, `.markdown`, `.mdx` |
| PDF textbooks | `.pdf` |
| Text and code | `.c`, `.cc`, `.cpp`, `.css`, `.csv`, `.go`, `.h`, `.hpp`, `.html`, `.java`, `.js`, `.json`, `.jsx`, `.mjs`, `.py`, `.rs`, `.sh`, `.sql`, `.tex`, `.toml`, `.ts`, `.tsx`, `.txt`, `.xml`, `.yaml`, `.yml` |
| Textbook and office files | `.azw`, `.azw3`, `.docx`, `.epub`, `.mobi`, `.odp`, `.ods`, `.odt`, `.pptx`, `.xlsx` |
| Images and visual references | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.avif` |

Use numeric prefixes such as `00-`, `01-`, and `02-` when reading order matters. The server sorts paths naturally, so `02-topic.md` follows `01-topic.md`.

Hidden directories and several application/build directories are ignored. Markdown and text files render inside the reading surface, PDFs open in an embedded browser viewer, images use the visual-reference panel, and DOCX/EPUB/office/ebook formats are indexed with an open/download fallback when the browser cannot render them directly.

## 2. How a new file appears in the app

The update path is deliberately simple:

1. Create or copy a supported file into the configured content root, or click **Import study file** in the app.
2. For a manual file, click **Rescan folders**. For an app import, choose or drop the file and wait for the review screen.
3. Review the suggested folder and filename. The file is still in a hidden staging inbox at this point.
4. Click **Add to library** to move it into the selected top-level category. The client requests a fresh library scan after the move.
5. The client requests `GET /api/library`, and `server/index.ts` recursively scans the content root into a fresh in-memory inventory.
6. Selecting Markdown or text requests `GET /api/content?path=...`; images use `GET /api/asset?path=...`; PDFs and other indexed files use `GET /api/file?path=...`.

There is no background filesystem watcher and no persistent index. The library is regenerated when the app first loads, after an approved import, or when **Rescan folders** is pressed. A restart is not normally required after adding a study file.

The relevant implementation surfaces are:

- [server/index.ts](server/index.ts): content-root selection, supported extensions, recursive scan, and API routes.
- [src/api.ts](src/api.ts): client requests for the library, Markdown content, and images.
- [src/App.tsx](src/App.tsx): initial load, **Rescan folders**, search, categories, and reading views.
- [src/types.ts](src/types.ts): the file and library response shapes.

### If a file does not appear

Check these items in order:

- The extension is in the supported list above.
- The file is inside the active `STUDY_CONTENT_DIR` or the default parent directory.
- The file is not hidden and is not inside an ignored directory.
- The app has permission to read the file.
- **Rescan folders** was pressed after the file was copied.
- The file was not accidentally placed inside `study-library/src`, `public`, or another app directory.

## 3. Uploading from the app

Click **Import study file** and choose a file or drop it into the import area. The server:

- validates the extension and upload size;
- stores the file in the hidden `.study-library-inbox` staging directory;
- extracts Markdown/text content, PDF text, or DOCX text when possible;
- creates an AI suggestion when a provider is configured, otherwise uses a local filename/category fallback;
- lets you review the folder and filename before writing into the content root.

The browser never chooses an absolute path. The server validates the category, filename, extension, and destination before moving the staged file. Closing the review dialog discards the staged upload.

The default upload limit is 100 MB. Override it with `MAX_UPLOAD_BYTES` when the server needs to accept larger textbooks:

```bash
MAX_UPLOAD_BYTES=250000000 pnpm dev
```

## 4. Configuring AI classification

AI already sits on the server between upload and the final filesystem move. The browser never receives an LLM API key, and the model cannot choose an arbitrary absolute path. The app accepts any OpenAI-compatible chat-completions endpoint, including hosted providers and local Ollama.

### OpenAI-compatible provider

Set these server-side variables before starting the app. Do not prefix the secret with `VITE_` because that would expose it to the browser.

```bash
AI_BASE_URL=https://api.openai.com/v1 \\
AI_API_KEY=your-server-only-key \\
AI_MODEL=gpt-4o-mini \\
pnpm dev
```

For a local Ollama model:

```bash
AI_BASE_URL=http://127.0.0.1:11434/v1 \\
AI_MODEL=llama3.2 \\
pnpm dev
```

If the provider is unavailable or returns invalid JSON, the upload remains usable and falls back to local rules. The review screen always remains the authority for the final folder.

The import workflow is:

```text
Browser upload
    -> server staging inbox
    -> file validation and text extraction
    -> optional LLM returns a structured category suggestion
    -> server validates the suggestion against safe folder names
    -> user approves or changes the destination
    -> server moves the file into the content root
    -> client requests a fresh library scan
```

### Recommended implementation steps

1. **Upload and stage.** The server accepts a multipart upload, enforces a size limit, allowlists extensions, and assigns a server-generated temporary ID. Staged files stay outside the visible library until approved.
2. **Extract text safely.** Markdown and text are read directly. PDF and DOCX text is extracted for classification. Images and ebook formats still use filename/extension context unless an OCR or ebook parser is added.
3. **Call an LLM from the server.** Send the extracted preview and allowed category names to the configured OpenAI-compatible endpoint.
4. **Require structured output.** The server asks for JSON that matches a schema, for example:

   ```json
   {
     "category": "Python",
     "suggestedFileName": "lists-and-dicts.md",
     "summary": "Working with Python list and dictionary operations.",
     "tags": ["python", "data structures"],
     "confidence": 0.94
   }
   ```

5. **Validate the result in application code.** The server checks the category, normalizes the filename, rejects path separators and traversal segments, enforces the original extension, and keeps the LLM response as a suggestion rather than a filesystem command.
6. **Review before commit.** The dialog shows the suggested category, filename, summary, confidence, tags, and extracted preview. Approve, edit, or cancel the import.
7. **Commit and rescan.** After approval, the server moves the file to a folder such as `Python/`, and the client requests `GET /api/library` so it appears immediately.

### Folder policy

Start with an explicit allowlist rather than letting the model invent folders:

```text
Python
JavaScript
System Design
MCP servers
Unsorted
```

The allowlist can come from existing top-level folders or from a server configuration file. If the model suggests a new subject that has no approved folder, route it to `Unsorted` and let the user create or approve a new category.

### Privacy and security decisions

- Hosted LLMs receive the uploaded content. Do not send private notes to a hosted provider without an explicit privacy decision.
- A local model can keep content on the machine, but it still needs resource and quality checks.
- Keep provider keys in server environment variables, never in React code or `VITE_*` client variables.
- Treat uploaded documents as untrusted data. Prompt injection inside a note must not change the server's folder policy or tool permissions.
- Validate MIME type, extension, file size, filename, and destination path on the server.
- Keep originals and classification decisions auditable so a mistaken move can be reversed.

### Suggested code changes for the AI version

A small implementation could evolve the existing app like this:

- `server/index.ts`: add upload, staging, validation, classification, approval, and commit routes. Split these into server modules if the file grows.
- `src/api.ts`: add typed upload, classify, approve, and refresh requests.
- `src/types.ts`: add upload status and classification suggestion types.
- `src/App.tsx`: add an upload control and an approval view, then reuse the existing rescan behavior after commit.
- Environment configuration: add a server-only provider name, model name, and secret. Document the provider and privacy choice in deployment instructions.

The current implementation is intentionally approval-first. Add OCR, deeper EPUB extraction, automatic approval, or batch processing only after the basic import path is reliable.

## 5. Working with ebooks

### Importing ebooks

EPUB files open in the built-in reader after import. PDF textbooks open in the browser PDF viewer. DOCX, MOBI, AZW, and office formats are indexed and provide safe open/download actions; converting them to EPUB or PDF gives the best in-app reading experience.

To add a book you downloaded legally:

1. Keep the original file on your computer and confirm that the source permits your use of it.
2. Click **Import study file**.
3. Select the `.epub`, `.pdf`, `.docx`, `.mobi`, `.azw`, or other supported file.
4. Review the suggested folder and filename, then click **Add to library**.

The app does not scrape book websites or automatically download copyrighted books. Good starting points for public-domain or openly licensed books include:

| Source | What to look for |
| --- | --- |
| [Project Gutenberg](https://www.gutenberg.org/) | Public-domain books in EPUB and other formats |
| [Standard Ebooks](https://standardebooks.org/) | Carefully edited public-domain ebooks |
| [OpenStax](https://openstax.org/) | Openly licensed college textbooks |
| [Open Textbook Library](https://open.umn.edu/opentextbooks) | Open textbooks with license information |
| [LibreTexts](https://libretexts.org/) | Open educational textbooks and course material |
| [Internet Archive](https://archive.org/) | Public-domain and controlled-lending material; check each item license and lending terms |

For a commercial or copyrighted book, use the publisher, library, or store download that grants you access. Do not upload or share a book when its license does not permit it.

### Creating an ebook from your notes

Open a Markdown or text note and click the book icon in the reading toolbar. The app creates an EPUB 3 file under the `Ebooks/` category, downloads it to your browser, and rescans the library so the generated book is available in the app. The generated EPUB includes the note title, rendered Markdown or text, and the source path.

The current button exports the selected note. The server API can also accept up to 30 Markdown/text paths in one request for multi-chapter collections:

```bash
curl -X POST http://localhost:4445/api/ebooks \\
  -H 'content-type: application/json' \\
  --data '{"paths":["Python/00-start-here.md","Python/01-syntax.md"],"title":"Python Foundations"}'
```

Local images referenced by notes are not embedded into generated EPUBs yet. They continue to work in the app through the normal local asset route.

## Quick answers

- **Where should Python files go?** In a `Python/` folder directly inside the configured content root.
- **What updates the app?** The filesystem scan behind `GET /api/library`, started on initial load or by **Rescan folders**.
- **Can I upload from the app now?** Yes. Use **Import study file**, review the suggestion, and click **Add to library**.
- **Can an LLM categorize files now?** Yes, when `AI_BASE_URL` and optionally `AI_API_KEY` are configured. Without them, the local fallback still produces a reviewable suggestion.
- **Can I read EPUB books?** Yes. EPUBs use the built-in reader; PDFs use the browser viewer, and other ebook formats use open/download fallback actions.
- **Can I create an ebook?** Yes. Open a Markdown/text note and use the book icon, or call `POST /api/ebooks` for a multi-chapter collection.
````

## File: CHAT_BOOTSTRAP.md

````md
# Chat-Only Bootstrap Protocol

Use this protocol when the new machine is isolated and the new agent can receive only text pasted into chat. The new agent has no access to the original repository.

You will paste Markdown text only. Do not transfer `.ts`, `.tsx`, `.css`, `.json`,
`.jar`, source directories, archives, or generated dependencies. The source
bundles in this protocol contain those files as verbatim fenced text, and the
new agent creates the files locally.

## Message order

Paste these messages in this order:

1. This file: `CHAT_BOOTSTRAP.md`.
2. `REPLICATION_GUIDE.md`.
3. `REPLICATION_SOURCE_WEB.md`.
4. `REPLICATION_SOURCE_SERVER.md`.
5. `REPLICATION_SOURCE_API.md`.
6. `REPLICATION_SOURCE_ANDROID.md`.
7. `REPLICATION_SOURCE_DOCS.md`.

Paste one file per message. Do not paste all source bundles into one message. If a bundle is too large for the editor/chat limit, split it only between `## File: ...` sections and preserve every fenced code block exactly.

## First prompt to the new agent

Paste this before the files:

```text
You are bootstrapping Second Brain Study Library in a completely empty directory.
You do not have access to the original repository, machine, media, database, or
screenshots. I will paste a standalone guide and exact source bundles in several
messages. Do not invent files or implement anything yet.

For every message containing a bundle, reply only:
RECEIVED: <bundle name>
FILES: <number of File sections seen>
WAITING: yes

Do not summarize or rewrite bundle contents. Do not start from a template. After
all seven payloads are received, reply with:
READY: source payload complete
Then create every file from the exact fenced blocks, preserving paths, whitespace,
package versions, JSX, CSS, routes, and configuration. Run the documented
validation commands after writing the files. The source bundles are normative:
do not replace them with a scaffold, equivalent implementation, approximate CSS,
different component tree, or different API contract. Never add credentials,
fake media, private content, or unlicensed media.
```

## Source extraction rules

Every source bundle uses sections like:

```text
## File: src/App.tsx
```ts
<verbatim file content>
```
```

Create the target directory and write the fenced content exactly. The heading
path is the target path. Do not include the fence markers in the target file.
Use the bundle's language label only as documentation; do not transform code.

The correct extraction order is:

```text
Guide and bootstrap
    -> Web shell and package lock
    -> Root server, SQLite, seed script, schema
    -> Independent API and API lock
    -> Android wrapper
    -> Agent, operations, system design, README, feature log
```

## If chat context becomes limited

Do not claim completion after partial input. Ask the user to continue with the
next bundle or chunk. Keep a checkpoint listing:

```text
received: CHAT_BOOTSTRAP
received: REPLICATION_GUIDE
received: REPLICATION_SOURCE_WEB
received: REPLICATION_SOURCE_SERVER
received: REPLICATION_SOURCE_API
received: REPLICATION_SOURCE_ANDROID
received: REPLICATION_SOURCE_DOCS
```

If the chat platform starts a fresh context, paste this checkpoint and the
remaining bundles again. Never regenerate missing source from memory when an
exact bundle chunk is available.

## Secrets and personal content

Never paste `.env` files containing values, Supabase keys, passwords, session
secrets, AI keys, Android signing keys, personal Study files, personal Desktop
media, database dumps, or `data/study-library.sqlite`. The new agent creates
empty roots and uses synthetic fixtures for validation when real media is absent.

## Expected first run

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm build
WATCH_MEDIA_DIR="$HOME/Desktop" pnpm dev
```

Use `http://localhost:4444`. Keep ports `3000` and `8080` unused. Run the live
checks in `REPLICATION_GUIDE.md`, and report absent PDF/EPUB/audio/video fixtures
or unavailable browser automation honestly.
````

## File: FEATURE_LOG.md

````md
# Feature Log - Second Brain Study Library

## [2026-09-30] Make exact replication Markdown-only

**Type**: Documentation

### What changed

Updated `REPLICATION_GUIDE.md` and `CHAT_BOOTSTRAP.md` to state that the user transfers only Markdown text. Source/configuration files are embedded verbatim in the five `REPLICATION_SOURCE_*.md` bundles; the new agent creates `.ts`, `.tsx`, `.css`, JSON, Gradle, Kotlin, XML, and other target files locally. The Android wrapper JAR is generated locally and is not transferred.

### Why

The destination machine is isolated and cannot receive code files, directories, or binary artifacts. The handoff must remain usable through pasted Markdown messages only.

### Files touched

- `REPLICATION_GUIDE.md`
- `CHAT_BOOTSTRAP.md`
- `REPLICATION_SOURCE_DOCS.md`
- `FEATURE_LOG.md`

### Validation

Regenerated all five source bundles and confirmed the Markdown-only transfer instructions and Android wrapper generation rule are present.

### Migration / Setup notes

Paste `CHAT_BOOTSTRAP.md`, then the guide and each source bundle. Split only at file-section boundaries when a chat message limit requires it.

## [2026-09-30] Add chat-only exact source transfer protocol

**Type**: Documentation

### What changed

Added `CHAT_BOOTSTRAP.md` with a multi-message paste protocol for an isolated destination machine that cannot receive files. Updated `REPLICATION_GUIDE.md` with the paste order, acknowledgement protocol, chunking rule, and no-file-transfer workflow. Regenerated all five verbatim source bundles so the new agent can create the exact Webpack shell, server, API, Android wrapper, and documentation from pasted Markdown text alone.

### Why

The user cannot transfer source files to the new machine. The new agent therefore needs a controlled text-only protocol that preserves every fenced code block and prevents it from starting a partial or invented implementation.

### Files touched

- `CHAT_BOOTSTRAP.md`
- `REPLICATION_GUIDE.md`
- `REPLICATION_SOURCE_WEB.md`
- `REPLICATION_SOURCE_SERVER.md`
- `REPLICATION_SOURCE_API.md`
- `REPLICATION_SOURCE_ANDROID.md`
- `REPLICATION_SOURCE_DOCS.md`
- `FEATURE_LOG.md`

### Validation

The five bundles were regenerated successfully. Their sizes and existence were checked, and the guide/bootstrap files contain the ordered paste protocol and exact extraction rules.

### Migration / Setup notes

Paste `CHAT_BOOTSTRAP.md` first, then `REPLICATION_GUIDE.md`, then each source bundle separately. Split only at `## File:` boundaries if a chat message limit requires it. Do not paste secrets, data, personal books, or personal media.

## [2026-09-30] Add verbatim Markdown source bundles for exact handoff

**Type**: Documentation

### What changed

Added five generated source bundles: `REPLICATION_SOURCE_WEB.md`,
`REPLICATION_SOURCE_SERVER.md`, `REPLICATION_SOURCE_API.md`,
`REPLICATION_SOURCE_ANDROID.md`, and `REPLICATION_SOURCE_DOCS.md`. Each bundle
contains the current source/configuration file contents in fenced blocks with target paths. Added `scripts/generate-replication-bundles.mjs` and updated `REPLICATION_GUIDE.md` and the custom agent with exact extraction instructions.

### Why

The user requires a new agent with no access to this machine to reproduce the exact implementation and styles from Markdown files alone. Verbatim source bundles are more reliable than prose-only CSS and architecture descriptions.

### Files touched

- `REPLICATION_SOURCE_WEB.md`
- `REPLICATION_SOURCE_SERVER.md`
- `REPLICATION_SOURCE_API.md`
- `REPLICATION_SOURCE_ANDROID.md`
- `REPLICATION_SOURCE_DOCS.md`
- `scripts/generate-replication-bundles.mjs`
- `REPLICATION_GUIDE.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

The five bundles were generated from the current workspace and contain the exact Webpack shell, server, API, Android, and documentation files. Root typecheck/lint and the local Study/Watch HTTP checks had already passed; bundle generation completed successfully.

### Migration / Setup notes

Give the new agent `REPLICATION_GUIDE.md` plus all five source bundles. It must extract every fenced block verbatim before running install/build validation. Do not include `node_modules`, `dist`, `data`, secrets, or personal media.

## [2026-09-30] Add exact handoff payload and root lockfile

**Type**: Documentation

### What changed

Generated the root `pnpm-lock.yaml` and added an exact handoff manifest to `REPLICATION_GUIDE.md`, listing all source/config/API/Android/agent files required for a different machine. Documented generated/private files that must not be shared and the safe synthetic-fixture rule.

### Why

Exact implementation and UI reproduction requires the real source tree and pinned dependency graph, while private databases, media, credentials, and generated dependencies must stay local.

### Files touched

- `pnpm-lock.yaml`
- `REPLICATION_GUIDE.md`
- `FEATURE_LOG.md`

### Validation

Confirmed the root lockfile exists and the handoff manifest includes the Webpack shell, API, Android, server, storage, agent, and contract files.

### Migration / Setup notes

Share the tracked handoff payload with the new agent. Exclude `node_modules`, `dist`, `data`, secret `.env` values, private books, and personal media.

## [2026-09-30] Clarify standalone guide fidelity guarantee

**Type**: Documentation

### What changed

Added an explicit fidelity status to `REPLICATION_GUIDE.md`: it is a complete standalone build specification with tokens, dimensions, behavior, routes, and validation, but not a byte-for-byte source archive. Exact parity requires the source repository and lockfile in addition to the guide.

### Why

A new agent can reproduce compatible architecture and styling from prose, but JSX details, full CSS selectors, browser rendering, fonts, dependency versions, and media fixtures affect exact visual identity. The guide must be honest about that boundary.

### Files touched

- `REPLICATION_GUIDE.md`
- `FEATURE_LOG.md`

### Validation

Confirmed that the guide still contains the complete empty-machine specification and now states its exact-parity limitation explicitly.

### Migration / Setup notes

Provide the guide alone for an independent compatible rebuild. Provide the repository and `pnpm-lock.yaml` for exact source/UI reproduction.

## [2026-09-30] Make replication guide standalone for empty-machine bootstrap

**Type**: Documentation

### What changed

Rewrote `REPLICATION_GUIDE.md` as a self-contained build specification that does not assume access to this repository or any existing source files. Added exact project tree, package/version requirements, Webpack behavior, SQLite schema, filesystem roots, REST response contracts, Study/Watch behavior, UI tokens and dimensions, anti-generic visual rules, agent frontmatter, deployment shapes, and validation gates. Updated the custom agent to bootstrap from the guide when project-memory files are absent.

### Why

The user will provide the guide to a new agent on a different machine. That agent must create the application from an empty directory without asking for hidden context or referring back to this workspace.

### Files touched

- `REPLICATION_GUIDE.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

The standalone guide was checked for external project-file dependencies and verified against the current Webpack shell, local SQLite catalog, Study/Watch routes, player controls, package manifest, server ports, and current local validation results.

### Migration / Setup notes

Provide the standalone guide itself to a new agent. For highest visual fidelity, also provide the source repository and lockfile, but the guide contains the complete requirements and does not require them to begin a fresh implementation.

## [2026-09-30] Synchronize replication guide with complete app state

**Type**: Documentation

### What changed

Updated `REPLICATION_GUIDE.md` and the custom agent instructions to reflect the current complete app: Webpack 5, local SQLite, Study/Watch shell, Desktop media scanning, range streams, VTT subtitles, LRC lyrics, player controls, five API learning repositories, separate contracts, mini-PC dual-use paths, external NVMe pool, Vercel/Render deployment shapes, GitHub Actions, and browser/build validation limits.

### Why

The replication handoff must reproduce the current implementation rather than an earlier document-only architecture. A new agent should know the exact paths, ports, contracts, UI dimensions, media sidecars, storage ownership, and lawful hosted-media boundary without additional conversation.

### Files touched

- `REPLICATION_GUIDE.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

The guide was reviewed against the current server routes, Webpack configuration, SQLite catalog, Watch player, API packages, Android wrapper, operations runbook, and current local validation results.

### Migration / Setup notes

Use Node 22.5+, run on ports `4444`/`4445`, set `WATCH_MEDIA_DIR` as needed, and do not use `3000` or `8080`. Hosted Watch remains a future lawful HLS/DASH/CDN phase.

## [2026-09-30] Strengthen replication fidelity and visual source-of-truth rules

**Type**: Documentation

### What changed

Expanded `REPLICATION_GUIDE.md` and the custom agent with exact UI source files, dependency/lockfile rules, typography and token preservation, component dimensions, anti-generic visual rules, local media behavior, fixed viewport validation, and an explicit limitation that prose-only reconstruction cannot guarantee pixel-identical rendering.

### Why

The handoff must help a new agent reproduce the same app instead of inventing a generic dashboard or silently upgrading dependencies. Exact source copying plus screenshot checks is more reliable than design prose alone.

### Files touched

- `REPLICATION_GUIDE.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

The guide was checked against the current Webpack package, Study/Watch source files, CSS dimensions, media routes, local SQLite behavior, and completed root build/typecheck/lint results.

### Migration / Setup notes

Copy the repository source and lockfile for highest fidelity. When only the guide is available, recreate the documented contract and report missing fonts, media fixtures, browser automation, or provider credentials instead of claiming exact parity.

## [2026-09-30] Document mini PC desktop and server co-location

**Type**: Operations

### What changed

Added explicit guidance for using the Ryzen mini PC as both a personal desktop and Study Library server. Documented separate paths for PostgreSQL-managed data, application releases, Study/Watch objects, staging, and backups; explained SQLite versus PostgreSQL directory ownership; and documented sleep, reboot, network, update, permission, and availability tradeoffs.

### Why

The personal server can run beside normal desktop use, but production reliability depends on clear storage ownership, dedicated service accounts, power/network behavior, automatic restart, and tested backups.

### Files touched

- `OPERATIONS.md`
- `SYSTEM_DESIGN.md`
- `FEATURE_LOG.md`

### Validation

The paths were reviewed against the current `STUDY_CONTENT_DIR`, `WATCH_MEDIA_DIR`, SQLite catalog, PostgreSQL plan, external NVMe pool, backup layout, and tunnel guidance. No runtime code changed.

### Migration / Setup notes

Use `/opt/study-library` for releases, `/var/lib/postgresql` for PostgreSQL-managed data, `/srv/study-library` for content/media, and `/srv/backups` for backup jobs. Do not manually edit PostgreSQL data files.

## [2026-09-30] Document monorepo, Vercel, and GitHub Actions deployment shapes

**Type**: Operations

### What changed

Documented why the shell and compatibility API currently share a workspace, how the root server can run the Webpack shell and Express API together, how Vercel can host only the shell while `API_ORIGIN` points to an external API, and how GitHub Actions builds/tests/deploys without acting as the runtime. Added explicit warnings about ephemeral Vercel disk and the current filesystem/SQLite server not being a serverless function.

### Why

The repository layout is optimized for development, while deployment can be unified, split, or fully separated. Making the options explicit prevents deploying a stateful local server to a stateless frontend platform or accidentally committing credentials.

### Files touched

- `SYSTEM_DESIGN.md`
- `OPERATIONS.md`
- `FEATURE_LOG.md`

### Validation

The deployment shapes were reviewed against the current root `server/index.ts`, Webpack build, independent `api/` service, `API_ORIGIN`, Render definitions, and local SQLite/filesystem behavior. No runtime code changed.

### Migration / Setup notes

No migration is required. Use the unified Render/VM shape for the current local filesystem server, or deploy the Webpack shell to Vercel and the API elsewhere with durable PostgreSQL/object storage.

## [2026-09-30] Implement local Watch mode and complete replication guide

**Type**: Feature

### What changed

Added a personal SQLite catalog using Node `node:sqlite`, local Desktop media scanning, video/audio REST catalog routes, byte-range streaming, VTT subtitle sidecars, LRC lyric parsing, Study/Watch shell switching, a Netflix-inspired but restrained Watch surface, play/pause, seek, speed, volume, quality, language, fullscreen, and synchronized lyrics controls. Added `REPLICATION_GUIDE.md` with exact architecture, filesystem, API, UI dimensions, agent setup, and validation instructions.

### Why

The user needs one local application for studying and watching personal media without fake assets, unsafe public file exposure, or a generic marketing/dashboard layout. The local Watch mode provides a real testable foundation while hosted HLS/CDN media remains a lawful future boundary.

### Files touched

- `server/index.ts`
- `server/personal-db.ts`
- `src/App.tsx`
- `src/api.ts`
- `src/types.ts`
- `src/features/watch/WatchView.tsx`
- `src/Watch.css`
- `.gitignore`
- `REPLICATION_GUIDE.md`
- `SYSTEM_DESIGN.md`
- `.github/agents/study-library.agent.md`
- `.github/copilot-instructions.md`
- `FEATURE_LOG.md`

### Validation

Root typecheck, lint, and Webpack build passed. The local API returned Study library `200`, Watch catalog `200` with 75 Desktop media files, SQLite was created, and a real `.mov` returned `206` with `Content-Range` for a byte-range request. PDF/EPUB routes were not exercised because the current local Study root contains no PDF or EPUB fixtures. Browser automation was unavailable through the current tool session; HTTP and build validation were completed.

### Migration / Setup notes

Node 22.5+ is required for built-in SQLite. Run on ports `4444`/`4445`; do not use `3000` or `8080`. Set `WATCH_MEDIA_DIR` for another media folder. Add lawful local media and optional `.vtt`/`.lrc` sidecars to exercise Watch controls.

## [2026-09-30] Consolidate architecture decision ledger and agent guidance

**Type**: Architecture

### What changed

Consolidated the accumulated findings into authoritative decision ledgers in `SYSTEM_DESIGN.md` and `.github/agents/study-library.agent.md`: Webpack shell, separate contract-driven API repositories, five-stack learning lab, PostgreSQL/object-storage split, Study/Watch shell, mini-PC and external NVMe layout, lawful media boundary, and modular-monolith scaling path.

### Why

The architecture had grown across many sections and sessions. A concise ledger makes the current decisions discoverable to future agents and reduces the risk of reintroducing Vite, duplicating API contracts, exposing storage, or splitting services prematurely.

### Files touched

- `SYSTEM_DESIGN.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

The ledger was checked against the current Webpack build, REST API origin configuration, separate-repository plan, operations runbook, storage contract, Android shell, and Study/Watch media rules. No runtime code changed.

### Migration / Setup notes

No migration is required. Treat the ledger and linked `OPERATIONS.md` as the source of truth before future implementation or deployment work.

## [2026-09-30] Define five-stack API learning lab

**Type**: Architecture

### What changed

Documented a contract-conformance lab with five interchangeable API repositories: Node/Express, Python/FastAPI, Java/Spring Boot, Go/net-http or chi, and C#/ASP.NET Core. Added `API_ORIGIN` selection, isolated test databases/Storage mocks, shared OpenAPI response requirements, and comparison metrics for latency, memory, startup, range behavior, failure recovery, observability, and deployment effort.

### Why

The user wants to learn different backend stacks while keeping one React/Webpack UI. Shared contracts allow fair comparison without duplicating frontend behavior or allowing multiple experimental services to write conflicting production data.

### Files touched

- `SYSTEM_DESIGN.md`
- `.github/agents/study-library.agent.md`
- `.github/copilot-instructions.md`
- `FEATURE_LOG.md`

### Validation

The learning-lab design was reviewed against the current REST endpoints, API origin configuration, separate repository plan, and failure-resistant storage rules. No runtime API implementation was added in this architecture slice.

### Migration / Setup notes

Keep Node/Express selected for the current production path. Add alternate stacks as separate repositories and require every implementation to pass the same versioned OpenAPI contract suite before comparison.

## [2026-09-29] Define React shell and separate API repository boundaries

**Type**: Architecture

### What changed

Documented the target repository split into a Webpack React shell, separate API repository, versioned OpenAPI/contracts package, and optional worker repositories. Added the feature-based React filesystem for `app`, `study`, `watch`, `entities`, `shared`, and `platform`, plus the rule that the web build needs Node while the API language remains independent.

### Why

The user plans to keep the shell and API in separate repositories. Explicit contracts and feature boundaries prevent duplicated request models, tangled Study/Watch navigation, and a false assumption that the API must use Node forever.

### Files touched

- `SYSTEM_DESIGN.md`
- `.github/agents/study-library.agent.md`
- `.github/copilot-instructions.md`
- `FEATURE_LOG.md`

### Validation

The architecture was reviewed against the current Webpack client, independent REST API, Android shell, and future Watch media domain. No runtime behavior changed.

### Migration / Setup notes

Keep the current `api/` directory during migration. When splitting repositories, publish or generate a versioned OpenAPI contract and keep `API_ORIGIN`, auth, error, range, and storage semantics stable.

## [2026-09-29] Record personal database and storage decision

**Type**: Architecture

### What changed

Documented PostgreSQL as the metadata database, SSD-backed filesystem storage
for the current personal phase, private API-only file access, Tailscale or
Cloudflare Tunnel remote access, 3-2-1 backups, and the phased Supabase/R2
managed-service path. Explicitly ruled out Oracle and MongoDB as the primary
database for this project.

### Why

The system design needs a durable decision for the current owned-hardware setup
and clear rules for future worldwide access without exposing databases, storage
ports, or large binaries directly.

### Files touched

- `SYSTEM_DESIGN.md`
- `FEATURE_LOG.md`

### Validation

System-design recommendation markers, trailing whitespace, and `git diff --check`
passed. No application runtime or database changes were made.

### Migration / Setup notes

None

## [2026-09-29] Migrate web client from Vite to Webpack 5

**Type**: Configuration

### What changed

Replaced the Vite client toolchain with Webpack 5, Babel, HtmlWebpackPlugin, CSS loaders, Webpack Dev Server, history fallback, API proxying, code splitting, and compile-time `API_ORIGIN` definition. Removed Vite config/types and updated scripts, TypeScript references, README, and active agent instructions. The former `VITE_API_ORIGIN` name remains an accepted compatibility fallback.

### Why

The project is standardizing on Webpack 5 for the browser build while retaining the existing React UI, Express API, REST contracts, and Android wrapper.

### Files touched

- `webpack.config.mjs`
- `package.json`
- `pnpm-lock.yaml`
- `index.html`
- `src/api.ts`
- `src/env.d.ts`
- `src/styles.d.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `README.md`
- `.github/agents/study-library.agent.md`
- `.github/copilot-instructions.md`
- `vite.config.ts` (removed)
- `tsconfig.node.json` (removed)
- `FEATURE_LOG.md`

### Validation

Root typecheck and lint passed. Production Webpack build passed. Webpack Dev Server served the HTML and JavaScript with HTTP `200`, and its `/api` proxy returned API health HTTP `200`. Bundle-size warnings remain as optimization work, not build failures.

### Migration / Setup notes

Use `pnpm dev` for Webpack Dev Server plus the filesystem API, `pnpm build` for production assets, and `pnpm serve` for the Express production server. `API_ORIGIN` is the canonical build-time API-origin variable, injected by Webpack DefinePlugin; the old `VITE_API_ORIGIN` name remains a compatibility fallback.

## [2026-09-29] Document backend language and scaling tradeoffs

**Type**: Architecture

### What changed

Documented why Node.js/Express remains the main API stack: shared TypeScript contracts with the React client, strong document/ebook libraries, I/O-bound storage workloads, and low solo-development overhead. Documented Python/FastAPI, Java/Spring, and Go as valid future choices for AI/OCR, enterprise, media-worker, or high-throughput gateway boundaries rather than speculative rewrites. Added the modular-monolith, stateless-replica, queue-worker, and measured-service-extraction path.

### Why

The platform may eventually add worldwide video delivery and workers, but changing the main API language now would duplicate contracts and increase operational complexity without solving the current bottleneck.

### Files touched

- `SYSTEM_DESIGN.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

The decision was reviewed against the current TypeScript client, root Express server, independent API, document/ebook dependencies, and future Watch media boundaries. No runtime behavior changed.

### Migration / Setup notes

Keep Node/Express for the main REST API. Introduce Python, Java, Go, or FFmpeg workers only behind explicit service ports after load and latency measurements identify a real boundary.

## [2026-09-29] Define shell navigation and optional media subdomains

**Type**: Architecture

### What changed

Documented one shell app with `/study` and `/watch` routes as the initial user experience, with optional `app`, `study`, `watch`, `api`, and `media` subdomains only when independent deployment or scaling justifies them. Added rules for shared authentication, deep links, Android `LIBRARY_URL`, normal routes instead of iframes, and the extra CORS/cookie/DNS/monitoring complexity of subdomains.

### Why

The user wants one app for study and lawful media playback. A shell gives one link and one mobile app while preserving a clean extraction path for separate clients and media delivery later.

### Files touched

- `SYSTEM_DESIGN.md`
- `.github/agents/study-library.agent.md`
- `.github/copilot-instructions.md`
- `FEATURE_LOG.md`

### Validation

The navigation and deployment boundary was reviewed against the current Study routes, Android wrapper, REST API origin configuration, and future media contract. No runtime Watch feature was added.

### Migration / Setup notes

No migration is required. Keep the current Study shell as the Android and browser entry point; add Watch routes after lawful media ingestion and playback infrastructure exists.

## [2026-09-29] Define unified Study and Watch product boundary

**Type**: Architecture

### What changed

Documented that the app will contain a current `Study` mode and a future `Watch` mode in one product shell. Study keeps the document/ebook pipeline; Watch gets a separate lawful media catalog, rights metadata, FFmpeg worker, HLS/DASH renditions, signed playback access, subtitles, watch progress, CDN planning, and takedown workflow. Updated the persistent workspace instructions with the same media rules.

### Why

Books and movies can share accounts, navigation, collections, and future entitlements, but they have different storage, delivery, legal, and scaling requirements. Separating the domains prevents movie streaming concerns from destabilizing the current reading API.

### Files touched

- `SYSTEM_DESIGN.md`
- `.github/copilot-instructions.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

The product boundary was reviewed against the current document-only routes and storage contract. No runtime media code was added; the current Study app remains unchanged.

### Migration / Setup notes

No migration is required. Watch remains a future feature and must only ingest owner-created, licensed, redistribution-authorized, or public-domain video. Do not bypass DRM or publish unlicensed films.

## [2026-09-29] Design external NVMe storage pool for personal server

**Type**: Architecture

### What changed

Updated the self-hosting plan for four additional 2 TB PCIe 4 NVMe drives in an external enclosure. Documented the recommended JBOD/individual-drive requirement, PCIe switch or bifurcation, cooling and power requirements, SMART/TRIM expectations, shared USB4/Thunderbolt bandwidth, Linux software RAID10 or ZFS RAIDZ2 options, and the existing SATA SSD as a separate backup target.

### Why

An external enclosure can provide a useful redundant book pool, but it should not hide four drives behind proprietary hardware RAID or promise four independent 7,000 MB/s links. The design needs explicit failure, bandwidth, and recovery assumptions before the collection is placed on it.

### Files touched

- `OPERATIONS.md`
- `SYSTEM_DESIGN.md`
- `FEATURE_LOG.md`

### Validation

The storage layout was reviewed against the mini PC hardware, current filesystem mode, planned PostgreSQL/MinIO adapter, and 3-2-1 backup requirements. No runtime code changed.

### Migration / Setup notes

Use a Linux host, expose the enclosure in JBOD mode, create the redundant pool on the host, mount it at `/srv/study-library`, and retain an offsite backup. Do not begin with public access until disk health, restore, tunnel, and backup tests pass.

## [2026-09-29] Choose scale-ready modular monolith architecture

**Type**: Architecture

### What changed

Documented the target UI and API architecture as a domain-oriented modular
monolith with ports and adapters. Added the feature-based React structure,
modular Express boundaries, storage and billing provider ports, future account
and entitlement model, and staged path from the current single-user MVP to
background jobs, subscriptions, and independently deployed modules.

### Why

The project is currently maintained by one person but has room for additional
clients, hosted storage, paid plans, and subscription-backed capabilities. The
architecture needs explicit boundaries for that growth without introducing
microservice and module-federation complexity before independent deployment is
actually needed.

### Files touched

- `SYSTEM_DESIGN.md`
- `FEATURE_LOG.md`

### Validation

The design was checked against the current React/Vite client, Express API,
Supabase schema, storage adapters, Android wrapper, and operations runbook.
No runtime behavior or database schema changed in this documentation pass.

### Migration / Setup notes

No migration is required. Future account, membership, billing, and entitlement
tables must be additive and introduced with real identity and server-side
authorization. Payment providers must be integrated through a server-only
adapter and verified idempotent webhooks.

## [2026-09-29] Add API and static-analysis agent standards

**Type**: Config
**Author**: agent

### What changed

Expanded the Study Library agent with independent Express/Supabase API module
boundaries, typed validation and error contracts, auth and storage protections,
idempotent upload/sync rules, HTTP failure tests, four-metric coverage scripts,
and shared Sonar/CodeQL file-quality standards.

### Why

The upcoming API needs the same maintainability, security, unhappy-path, and
coverage discipline as the UI before it is deployed or promoted.

### Files touched

- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

Study Library agent frontmatter, API-standard, static-analysis, and whitespace
checks passed. Application test suites were not run because this change only
updates agent and documentation files.

### Migration / Setup notes

Add the documented client/API test and coverage scripts before the next
substantial API feature; no application runtime migration is required.

## [2026-09-29] Define ebook storage lifecycle and failure-resistant agent rules

**Type**: Config

### What changed

Updated the custom agent and workspace instructions with the canonical local and hosted locations for PDFs, EPUBs, Markdown, images, office files, and generated ebooks; the PostgreSQL metadata versus object-storage boundary; authorized REST access rules; future ebook metadata/search/pagination rules; and failure-resistant staging, commit, sync, cleanup, outage, and validation requirements. Expanded `ADDING_CONTENT.md` and `SYSTEM_DESIGN.md` with the same storage map and scaling contract.

### Why

The library must remain understandable and safe as its book collection grows. A local folder is appropriate for local mode, but production files need private durable storage, metadata needs a database, and every reader path must handle missing objects, provider outages, large files, and unsupported formats explicitly.

### Files touched

- `.github/agents/study-library.agent.md`
- `.github/copilot-instructions.md`
- `ADDING_CONTENT.md`
- `SYSTEM_DESIGN.md`
- `FEATURE_LOG.md`

### Validation

The instructions and storage paths were reviewed against the root filesystem server, independent API, Supabase schema, Android wrapper, and operations runbook. No runtime code changed in this configuration/documentation slice.

### Migration / Setup notes

No migration is required. Existing local files remain below `STUDY_CONTENT_DIR`; hosted files remain in private Storage with catalog metadata in PostgreSQL. Future format support must preserve the extension, MIME, parser, range-read, and honest fallback rules.

## [2026-09-29] Add end-to-end operations and self-hosting architecture

**Type**: Docs

### What changed

Added `OPERATIONS.md` with the database versus file-storage model, SQLite/PostgreSQL/Oracle decision, four-SSD home-server topology, Render/Supabase deployment path, future PostgreSQL/MinIO adapter boundary, CI/CD and Play Store release flow, client consumption, monitoring, alerting, 3-2-1 backup/restore procedure, and public-launch security gate. Linked it from `SYSTEM_DESIGN.md` and `README.md`.

### Why

The app needs an operational plan beyond source code: a local file is suitable for a single-user prototype, but a public reading service needs a database service, durable object storage, HTTPS, backups, monitoring, and a tested recovery path. The guide makes owned hardware possible without implying that RAID or an enclosure is a backup.

### Files touched

- `OPERATIONS.md`
- `SYSTEM_DESIGN.md`
- `README.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

Documentation links and deployment commands were reviewed against the current root app, independent API, Android wrapper, Supabase schema, and Render definitions. No runtime code changed in this documentation slice.

### Migration / Setup notes

No migration is required. The current internet path remains Supabase PostgreSQL plus private Storage. A pure self-hosted PostgreSQL/MinIO mode requires a future storage/database adapter and the vendor-neutral migration described in `OPERATIONS.md`.

## [2026-09-28] Add Android WebView app and complete API write contract

**Type**: Feature

### What changed

Added a Gradle 8.9 Kotlin DSL Android app under `android/` with configurable `LIBRARY_URL`, HTTPS release enforcement, cookie-preserving WebView sessions, internal navigation, external-link routing, Android Download Manager integration, back navigation, retryable network errors, and a branded launcher icon. Completed the independent API's upload staging, approval commit, discard, and EPUB routes backed by Supabase Storage and `upload_jobs`.

### Why

The product needs a real installable mobile client and a hosted API that supports the full web workflow, not only catalog reads. The WebView remains thin and keeps secrets out of the APK, while the API remains the single REST boundary for database and file access.

### Files touched

- `android/`
- `api/src/server.ts`
- `api/src/storage.ts`
- `api/src/database.ts`
- `api/src/uploads.ts`
- `api/src/ebooks.ts`
- `api/.env.example`
- `.gitignore`
- `FEATURE_LOG.md`

### Validation

The Android debug APK build passed with `./gradlew :app:assembleDebug -PLIBRARY_URL=https://study-library.example.com`. The independent API typecheck, lint, and build passed, as did the root web typecheck, lint, and production build. Vite retains its existing large-client-chunk advisory.

### Migration / Setup notes

Build the Android release with a real HTTPS `LIBRARY_URL` and private signing configuration. Run the updated `supabase/schema.sql` before using hosted upload jobs; deploy `api/` independently and keep all Supabase, session, sync, and AI secrets server-side.

## [2026-09-28] Add independent Supabase-linked REST API service

**Type**: Feature

### What changed

Added a standalone `api/` TypeScript service with its own package, lockfile, environment contract, Render definition, Supabase database client, private Storage adapter, catalog sync command, REST catalog/file routes, password sessions, staged upload jobs, approval commits, discard cleanup, and EPUB creation. The React client now accepts `VITE_API_ORIGIN` and sends credentialed requests so the hosted web surface can use this service.

### Why

The app needs an independently deployable backend that links the UI to PostgreSQL metadata and private object storage. Keeping the API separate makes database-backed development, Render deployment, and future mobile/native clients possible without coupling them to the local filesystem server.

### Files touched

- `api/`
- `src/api.ts`
- `SYSTEM_DESIGN.md`
- `README.md`
- `.env.example`
- `render.yaml`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

The independent API typecheck, lint, and production build passed. Its smoke service returned health `200`, session `200`, CORS preflight `204`, and invalid catalog-sync token `401`. The root client typecheck, lint, and production build also passed; Vite retains the existing large-client-chunk advisory.

### Migration / Setup notes

Run `supabase/schema.sql`, seed the private bucket, run `pnpm catalog:sync` from `api/`, deploy `api/` with `api/render.yaml`, and set the root web build's `VITE_API_ORIGIN` to the API URL. Supabase credentials and session/sync secrets remain server-only.

## [2026-09-28] Document REST and Android build-tool decisions

**Type**: Docs

### What changed

Documented why the current web/API should use REST rather than GraphQL, why this Node repository continues to use pnpm, and why the separate Android WebView shell should use Gradle Kotlin DSL rather than Maven. Updated README and content guidance with the Render, Supabase, and seed-command path.

### Why

The browser and WebView clients need straightforward JSON and range-streaming endpoints, while Android Studio already standardizes on Gradle. Making the choices explicit prevents an unnecessary Java backend or GraphQL layer from complicating the current product.

### Files touched

- `SYSTEM_DESIGN.md`
- `README.md`
- `ADDING_CONTENT.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

The documented REST endpoints were checked locally for health, session, library, protected access, and traversal rejection. Full typecheck, lint, and production build are run after the final documentation pass.

### Migration / Setup notes

No migration is required. Use `pnpm` for the web/API, `pnpm storage:seed` for existing hosted files, and Gradle Kotlin DSL only in the Android project.

## [2026-09-28] Add hosted storage architecture, REST decision, and session protection

**Type**: Feature

### What changed

Added an optional Supabase Storage mode for durable hosted files, private-bucket streaming, remote inventory, staged remote uploads, approved object moves, remote EPUB creation, signed HttpOnly password sessions, security headers, health reporting, and a protected login view. Added the full system design, PostgreSQL schema for the next metadata/progress phase, Render deployment blueprint, environment template, local-to-Supabase seed script, and `serve`/`storage:seed` package commands. Documented REST as the API style, pnpm as the Node toolchain, and Gradle Kotlin DSL as the Android WebView build tool.

### Why

Free web hosts generally do not provide durable local disks, so the hosted app needs private object storage while local filesystem mode remains the simplest development experience. A small private library also needs a deployable access boundary without putting service-role or AI credentials in the browser.

### Files touched

- `server/index.ts`
- `src/api.ts`
- `src/types.ts`
- `src/App.tsx`
- `src/App.css`
- `package.json`
- `SYSTEM_DESIGN.md`
- `supabase/schema.sql`
- `render.yaml`
- `.env.example`
- `scripts/seed-supabase.mjs`
- `.github/copilot-instructions.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

Server and client typecheck plus lint are run after the hosted integration. Production build and live local API checks remain required before deployment. Supabase and Render cannot be verified without project credentials and a deployed service.

### Migration / Setup notes

Local mode remains the default. For hosted mode, run `supabase/schema.sql`, create a private `study-library` bucket, seed with `pnpm storage:seed`, and set the server-only variables documented in `.env.example` and `SYSTEM_DESIGN.md`. Use REST for the current API; use Gradle Kotlin DSL only in the separate Android wrapper.

## [2026-09-28] Add textbook imports, AI classification, and EPUB workflows

**Type**: Feature

### What changed

Added an in-app import workflow with multipart staging, upload-size and extension validation, PDF/DOCX text extraction, optional OpenAI-compatible LLM classification, deterministic fallback suggestions, human review, safe category/file-name validation, and commit/discard actions. Expanded reading to support PDFs, text/code files, images, EPUBs, and common ebook/office textbook formats. Added EPUB 3 export from Markdown/text notes through the reading toolbar and `POST /api/ebooks`.

### Why

The study library should accept legally obtained textbooks, help organize them by topic, let users read EPUBs in the app, and turn personal notes into portable ebooks without giving an AI model direct filesystem control.

### Files touched

- `server/index.ts`
- `src/api.ts`
- `src/types.ts`
- `src/App.tsx`
- `src/App.css`
- `src/epubjs.d.ts`
- `package.json`
- `pnpm-lock.yaml`
- `README.md`
- `ADDING_CONTENT.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

`pnpm typecheck`, `pnpm lint`, and the isolated API checks passed. Live checks covered library scanning, Markdown content, upload classification fallback, staged discard, safe file delivery, traversal rejection, approved commit into a temporary `Python` category, EPUB creation, safe serving, and required EPUB archive entries. Vite still reports its existing large-client-chunk advisory during the production build.

### Migration / Setup notes

Set `AI_BASE_URL`, `AI_MODEL`, and optionally server-only `AI_API_KEY` to enable LLM suggestions. Without them, uploads use the local fallback classifier. Set `MAX_UPLOAD_BYTES` to change the default 100 MB upload limit. Use public-domain or openly licensed sources for online ebooks and verify each book's terms before importing it.

## [2026-09-28] Document content workflow and AI extension path

**Type**: Docs

### What changed

Added a guide for placing study files in the configured content root, understanding the rescan and API flow, adding Python notes, and evaluating the current upload and LLM capabilities. The guide also describes a validated, approval-based design for future AI classification.

### Why

The app is file-backed today, so users need a clear distinction between study content and application source files, along with an accurate path for introducing uploads and AI without assuming those features already exist.

### Files touched

- `ADDING_CONTENT.md`
- `README.md`
- `FEATURE_LOG.md`

### Validation

Verified that the new guide exists and contains the content placement, rescan, upload, AI, and quick-answer sections. No application code changed.

### Migration / Setup notes

None. Browser uploads and LLM classification remain future implementation work.

## [2026-09-22] Keep the library heading visible across views

**Type**: Fix
**Author**: agent

### What changed

Removed vertical overflow clipping from the app shell, made the topbar sticky, and removed the library rail's unused 3D transform. The `Music` heading and rail controls now retain stable layout boxes while switching between all notes, bookmarks, completed notes, and folders.

### Why

The scrolling shell and transformed rail could leave the library heading partially outside the viewport or visually clipped after a view change.

### Files touched

- `src/App.css`
- `FEATURE_LOG.md`

### Validation

The focused client typecheck passed immediately after the CSS fix. Full lint, typecheck, production build, and live port-4444 checks are run after this entry.

### Migration / Setup notes

None.

## [2026-09-22] Remove Markdown page entrance animation

**Type**: Fix
**Author**: agent

### What changed

Removed the reading surface's entrance animation and its unused keyframe. The Markdown page now appears immediately in a stable position while library and control interactions remain unchanged.

### Why

The page animation was visually distracting during study and made the reading surface feel less settled.

### Files touched

- `src/App.css`
- `FEATURE_LOG.md`

### Validation

Client typecheck, production build, and served CSS verification are run after this change.

### Migration / Setup notes

None.

## [2026-09-22] Move breadcrumbs above the reading page

**Type**: Feature
**Author**: agent

### What changed

Restored deliberate top spacing for the reading column and moved the current category/folder breadcrumbs outside the Markdown surface. Category crumbs select the shelf; folder crumbs filter the queue to that folder. The card toolbar now contains only reading actions.

### Why

The location trail should orient the reader without occupying the document page, and it should provide a useful navigation path rather than static text.

### Files touched

- `src/App.tsx`
- `src/App.css`
- `FEATURE_LOG.md`

### Validation

Focused client typecheck, lint, full typecheck, production build, and live port-4444 verification are run after this change.

### Migration / Setup notes

None.

## [2026-09-22] Remove vertical reading-surface tilt

**Type**: Fix
**Author**: agent

### What changed

Removed pointer-driven `rotateX`/`rotateY` from the Markdown reading surface and changed its load animation to opacity only. The fixed reading frame keeps its depth styling and pointer-following glow without moving the rendered document or creating top/bottom gaps.

### Why

The vertical component of the 3D transform pitched the document down when the pointer was near the top and up when it was near the bottom. The changing visual border made the hover boundary feel ambiguous and produced the reported glitch.

### Files touched

- `src/App.tsx`
- `src/App.css`
- `FEATURE_LOG.md`

### Validation

Focused typecheck, lint, production build, and live port-4444 verification are run after this change.

### Migration / Setup notes

None.

## [2026-09-22] Stabilize hover targets and reading tilt

**Type**: Fix
**Author**: agent

### What changed

Removed hover translations from category, folder, file, and action targets so their hit areas remain under the pointer. Moved the reading card's 3D transform to a stable inner visual layer, removed its load-time downward shift, and updated tilt CSS variables through a DOM ref instead of React state on every pointer-move event.

### Why

Moving hover targets caused the cursor to alternate between the hand and default cursor. Transforming the outer reading card also changed its hit geometry, while React re-renders on every pointer event made the surface feel laggy and unstable near the empty space above it.

### Files touched

- `src/App.tsx`
- `src/App.css`
- `FEATURE_LOG.md`

### Validation

The focused client typecheck passed immediately after the interaction fix. Final lint, typecheck, production build, served-bundle, and live port-4444 checks are run after this entry.

### Migration / Setup notes

None.

## [2026-09-22] Start rescans from explicit user actions

**Type**: Refactor
**Author**: agent

### What changed

Kept the initial loading state in the component initializer and moved rescan/retry loading resets into the explicit user-action handler.

### Why

This keeps the initial filesystem effect asynchronous and removes an avoidable cascading render without changing the visible loading, retry, or rescan behavior.

### Files touched

- `src/App.tsx`
- `FEATURE_LOG.md`

### Validation

`pnpm lint` is run immediately after this change, followed by typecheck, production build, and live port-4444 checks.

### Migration / Setup notes

None.

## [2026-09-22] Derive document loading state from responses

**Type**: Refactor
**Author**: agent

### What changed

Made the Markdown fetch effect responsible only for requesting content. Loading and error presentation now derive from the selected file path and the returned content path, avoiding synchronous effect state resets while preserving transitions between notes and images.

### Why

The reading surface should not trigger avoidable cascading renders when a note is selected, and lint should describe a genuinely asynchronous data boundary.

### Files touched

- `src/App.tsx`
- `FEATURE_LOG.md`

### Validation

The focused lint command is run immediately after this change, followed by the full typecheck and production build.

### Migration / Setup notes

None.

## [2026-09-22] Keep image preview navigation coherent

**Type**: Fix
**Author**: agent

### What changed

Derived image-preview mode from the selected indexed file and remembered the last Markdown note so the image panel's “Back to note” action returns to a useful reading surface. Removed redundant synchronous preview state updates.

### Why

The image preview should be a side path from the reading workflow, not a dead end, and the client should avoid unnecessary state updates inside effects.

### Files touched

- `src/App.tsx`
- `FEATURE_LOG.md`

### Validation

The client typecheck and full build were run after the change; the final lint check is run as part of completion validation.

### Migration / Setup notes

None.

## [2026-09-22] Add portable build instructions

**Type**: Docs
**Author**: agent

### What changed

Added the repository README and a copyable `.github/agents/study-library.agent.md` with the product contract, filesystem rules, motion system, runtime commands, internal deployment settings, and validation gate.

### Why

The app needs to be reproducible on another machine by a new agent and understandable to the person hosting it on an internal server.

### Files touched

- `README.md`
- `.github/agents/study-library.agent.md`
- `FEATURE_LOG.md`

### Validation

The README documents the commands and live endpoint checks that passed during this build: `pnpm typecheck`, `pnpm build`, the `/api/library` scan, Markdown content response, SVG asset response, and traversal rejection.

### Migration / Setup notes

Set `STUDY_CONTENT_DIR` to the directory containing the study folders and use `PORT=4444` for the internal server.

## [2026-09-22] Add interactive 3D study workspace

**Type**: Feature
**Author**: agent

### What changed

Replaced the Vite starter screen with a responsive study workspace that indexes categories and files, renders Markdown, opens images, searches titles and folders, tracks bookmarks and completion locally, supports focus mode, reading-size control, light/dark mode, and exposes loading, error, and empty states. Added perspective depth, pointer-reactive reading-surface tilt, staged queue reveals, ambient grid motion, orbit indicators, hover elevation, and reduced-motion handling.

### Why

The study material should feel inviting and tactile while keeping the reading path calm, readable, and usable on mobile screens.

### Files touched

- `src/App.tsx`
- `src/App.css`
- `src/index.css`
- `src/types.ts`
- `src/api.ts`
- `index.html`

### Validation

The client typecheck passed and the production bundle completed successfully. The bundle emitted a size advisory for the Markdown renderer chunk; it did not block the build.

### Migration / Setup notes

None.

## [2026-09-22] Add filesystem-backed content server

**Type**: Feature
**Author**: agent

### What changed

Added a recursive file scanner and safe content API for Markdown and image files, with natural filename ordering, folder/category summaries, Markdown title extraction, hidden/build-folder exclusions, path traversal protection, and static production serving. Added Vite proxy and development/production scripts on ports `4444` and `4445`.

### Why

The user should only need to create folders and add notes or images; the app should understand the folder structure without a database or manual import step.

### Files touched

- `server/index.ts`
- `package.json`
- `vite.config.ts`
- `tsconfig.server.json`
- `pnpm-lock.yaml`

### Validation

`pnpm typecheck` and `pnpm build` passed. The live scan found `62` documents, `43` images, `6` folders, and the three expected categories: `API designs`, `MCP servers`, and `System Design`. Markdown returned HTTP `200`, the SVG asset returned HTTP `200` with `image/svg+xml`, and a traversal request returned HTTP `404`.

### Migration / Setup notes

The server defaults to the directory above the app and can be pointed at another root with `STUDY_CONTENT_DIR`.
````

## File: OPERATIONS.md

````md
# Study Library Operations Architecture

This document answers what the database is, how the app is built and shipped, and how to run it on free cloud infrastructure or on personally owned hardware.

## 1. What a database is

A database is a long-running program that stores and queries structured records safely. It provides transactions, indexes, constraints, concurrent access, backups, and a query language. It is not the same thing as a folder of books.

For Study Library, PostgreSQL records should look like this:

| Record | Example data |
| --- | --- |
| `library_items` | storage path, title, extension, size, category, modified time |
| `reading_progress` | user, book ID, completed flag, reading position, last opened time |
| `bookmarks` | user, book ID, created time |
| `upload_jobs` | staging path, original filename, classification, staged/committed/discarded status |

The PDF, EPUB, Markdown, image, or office file itself belongs in object storage or a filesystem. A database row should contain metadata and a reference to that file, not a 500 MB binary.

## 2. Can a local file be a database?

Yes, but choose the right scope:

- A JSON file is acceptable only for a tiny prototype or configuration. It is easy to corrupt during concurrent writes, has no useful query planner, and is not a production database.
- SQLite is a real embedded database stored as one file. It is excellent for local development, one-user desktop tools, and small offline apps. Enable WAL mode and back up the file while the process is stopped or use SQLite's backup API.
- PostgreSQL is the correct production database for this app when several clients, uploads, progress updates, catalog searches, or multiple users can write concurrently. It runs as a service and gives stronger concurrency, migrations, indexes, and operational tooling.

The current app intentionally does not need a database in local filesystem mode: it scans the content root and keeps browser preferences local. The hosted `api/` service uses Supabase PostgreSQL for catalog metadata. Adding SQLite to the current API would be a separate adapter, not a reason to replace the existing REST contract.

## 3. Do you need Oracle?

No. Oracle is a capable enterprise database, but it adds licensing, administration, and Java/Oracle-specific operational weight that this app does not need. Do not buy an Oracle database for this project.

Recommended choices:

- Local prototype: filesystem mode, or SQLite if persistent local metadata is needed.
- Free internet deployment: Supabase PostgreSQL plus private Supabase Storage.
- Personal server: PostgreSQL plus S3-compatible object storage such as MinIO, or a carefully managed filesystem adapter.
- Large public service: managed PostgreSQL plus managed object storage and a CDN.

The API remains REST across all choices. Only the storage/database adapters should change.

## 4. Your mini PC as a personal server

Your Ryzen 7 7840, 32 GB RAM, and six-drive inventory are more than sufficient
for a private Study Library, PostgreSQL, MinIO, containers, monitoring, and a
small number of readers. The advertised SSD speeds are useful for local scans,
but internet throughput will usually be the bottleneck: a 1 Gbps network is
about 125 MB/s before protocol overhead.

Your hardware is:

| Device | Recommended role | Reason |
| --- | --- | --- |
| 512 GB NVMe, about 5,000 MB/s | Linux OS, Docker/Podman, app code, PostgreSQL metadata, logs | Metadata is small; fast low-latency storage keeps the system responsive. |
| 4 x extra 2 TB PCIe 4 NVMe | Redundant primary book pool, preferably RAID10 or a two-way ZFS mirror layout | About 4 TB usable with redundancy; matching drives simplify health and replacement. |
| Existing 2 TB PCIe 4 NVMe | Fast staging, restore workspace, or backup of the most important collection | Keeps temporary PDF/EPUB extraction and restore work off the system disk. |
| Existing 2 TB SATA SSD, about 500 MB/s | Scheduled local backup target | Slower is fine for nightly backups, but it is still inside the same server. |

Start with separate filesystems or mount points:

```text
/                         512 GB NVMe
/var/lib/postgresql      512 GB NVMe
/srv/study-library       4 x 2 TB PCIe 4 NVMe redundant pool
/srv/study-staging       existing 2 TB PCIe 4 NVMe
/srv/backups              2 TB SATA SSD
```

### Personal computer and server at the same time

The mini PC can remain a normal personal computer while also running the
server. Use a supported Linux installation with a desktop environment if you
want local desktop use, and run PostgreSQL, the API, Webpack/Express production
server, MinIO, and monitoring as system services or containers. Keep the server
processes under a dedicated service account rather than your interactive login.

Use these boundaries:

```text
/opt/study-library              application checkout and releases
/var/lib/postgresql              PostgreSQL-managed database files
/srv/study-library               Study books and local Watch media
/srv/study-staging               temporary extraction/restore workspace
/srv/backups                     encrypted backup jobs
/home/<your-user>                personal files, not production book storage
```

Do not manually edit, move, or sync files inside `/var/lib/postgresql`; the
PostgreSQL service owns that directory. For the current personal SQLite catalog
only, `data/study-library.sqlite` is acceptable, but migrate to PostgreSQL when
multiple devices, writes, progress, or accounts matter. Set
`STUDY_CONTENT_DIR=/srv/study-library` and `WATCH_MEDIA_DIR=/srv/study-library`
or a separate media directory. The app can run while you use the desktop, but
sleep, reboots, Wi-Fi outages, OS updates, and disk maintenance make the server
temporarily unavailable. Use Tailscale for private access and configure power,
automatic restart, backups, and health alerts before public access.

Run the current app immediately in `STORAGE_MODE=filesystem` with
`STUDY_CONTENT_DIR=/srv/study-library`. The root server can scan and serve the
files without a database. Back up `/srv/study-library` to the SATA SSD with
`restic` or `borg`, use the existing 2 TB PCIe disk for restore staging, and
back up PostgreSQL with encrypted `pg_dump` files when the database-backed API
is enabled.

Use RAID10 when predictable performance and simple recovery matter most. Use
ZFS RAIDZ2 when surviving any two failed drives matters more than peak write
speed; four 2 TB drives still provide roughly 4 TB usable before overhead. Do
not use RAID0 for the library. Redundancy protects availability, not against
deletion, ransomware, enclosure failure, or fire, so keep offsite backups.

The four-drive enclosure must support four physical M.2 NVMe PCIe 4 x4 devices,
active cooling, stable power, and Linux drivers. A PCIe bifurcation card or PCIe
switch may be required. USB4/Thunderbolt enclosures share an upstream link, so
they will not deliver 7,000 MB/s per drive; that is acceptable for books but
must be documented as a shared bandwidth limit. A passive USB enclosure or hub
is not a server-grade storage plan.

For an external enclosure, require:

- JBOD or individual-drive mode so Linux can see all four disks separately;
- no proprietary hardware RAID volume as the only presentation to the host;
- a PCIe switch or bifurcation design that explicitly supports four NVMe M.2
   drives, not four SATA bays with adapters;
- active fan cooling, a reliable power brick, power-loss protection, and a
   documented Linux driver/firmware path;
- SMART/NVMe health passthrough, TRIM/discard support, and stable reconnect
   behavior after reboot;
- a short, certified USB4 or Thunderbolt cable if that is the host link.

A 40 Gbps USB4/Thunderbolt uplink is shared by all four drives and has protocol
overhead, so the enclosure is a high-capacity redundant pool, not four separate
7,000 MB/s network links. For this reading workload that is acceptable because
the internet connection is slower than the local bus. Put the four drives into
software RAID10 or ZFS RAIDZ2 on Linux, mount the resulting pool at
`/srv/study-library`, and keep the existing SATA SSD as a separate backup target.

Recommended home-server layers:

```text
Internet
   |
Cloudflare Tunnel or Tailscale (no inbound port forwarding)
   |
Caddy or Nginx with HTTPS and request limits
   |
Web static server / API service
   |------------------|
PostgreSQL          MinIO or private filesystem
   |
Uptime Kuma + disk SMART + backup jobs
```

For a personal-only library, Tailscale is the simplest private network. For public browser and Play Store access, use a domain and Cloudflare Tunnel so the server stays behind the router. Avoid exposing PostgreSQL, MinIO, SSH, or the Node ports directly to the internet.

### Hardware checklist

- Linux or a supported server OS is preferable for 24/7 operation.
- Use a UPS if the server and enclosure will run continuously.
- Use active cooling and monitor NVMe temperatures.
- Keep the operating system and container runtime on separate boot media if possible.
- Use ECC memory if the platform supports it; it is helpful but not mandatory for a private library.
- Verify SMART/NVMe health and enclosure power-loss behavior before trusting the array.
- Keep one external backup disk and one offsite backup destination.
- The SATA SSD is only a local backup copy; add an external or encrypted offsite
   copy before exposing the server to the public internet.

## 5. Deployment choices

### Option A: free cloud, easiest first deployment

```text
Browser / Android
      |
Render web service
      |
Render API service -> Supabase PostgreSQL + private Storage
```

Advantages: HTTPS and public access are straightforward, no home-network maintenance, and the current `api/` implementation already targets Supabase. Limitations: free services sleep, quotas apply, and the provider is not a backup.

Use the root `render.yaml` for the web service and `api/render.yaml` for the API service. Run `supabase/schema.sql`, seed Storage, run `api` catalog sync, and set `API_ORIGIN` on the Webpack build.

### Option A1: Vercel shell plus external API

Vercel can host the Webpack-built React shell, but the API must be deployed as
a separate service or rewritten into Vercel-compatible request functions. Do
not deploy the current long-running filesystem/SQLite server to Vercel and
expect its local files to persist. Use:

```text
Vercel static shell
   -> API_ORIGIN
Render/Cloud Run/VM API
   -> PostgreSQL + private Storage
```

Set `API_ORIGIN` in the Webpack build environment and configure the API's
`WEB_ORIGIN` for credentialed CORS. The Android wrapper points at the Vercel
shell URL. Vercel is appropriate for the UI; it is not the home server or a
durable media filesystem.

### GitHub Actions

GitHub Actions can build and deploy either shape:

1. Checkout the repository or API repository.
2. Install Node 22.5+, pnpm, and pinned lockfile dependencies.
3. Run typecheck, lint, tests, and coverage.
4. Build the Webpack shell and/or API.
5. Deploy the shell to Vercel or the unified service to Render.
6. Deploy the independent API and run catalog sync after migrations.
7. Call `/api/health` and record the release commit.

Use encrypted GitHub secrets for provider tokens and deployment variables. Do
not put `SUPABASE_SERVICE_ROLE_KEY`, database passwords, session secrets, AI
keys, or media credentials in the repository or client build. GitHub Actions
does not keep the API running; it only automates delivery.

### Option B: personal hardware, maximum ownership

```text
Cloudflare Tunnel -> Caddy -> web + API containers
                               |
                    PostgreSQL + MinIO containers
                               |
                    RAID10/ZFS + 3-2-1 backups
```

The current filesystem mode works immediately on your mini PC. The current
hosted API works with Supabase. A pure PostgreSQL plus MinIO deployment requires
a new `postgres-minio` storage adapter and a vendor-neutral migration because
`supabase/schema.sql` references Supabase Auth. Do not point the current
Supabase client at an arbitrary PostgreSQL port and assume it is compatible.

The self-hosted adapter should implement the same interfaces:

- `CatalogRepository`: list, lookup, upsert, and search `library_items`.
- `ObjectStorage`: list, read, range-read, upload, move, delete, and existence checks.
- `SessionStore`: signed session or an identity provider.

Once those interfaces exist, local filesystem, Supabase, and MinIO can share the same controllers and REST responses.

### Option C: self-host Supabase

You can run the Supabase stack on your hardware, but it is much heavier than installing PostgreSQL alone. It includes PostgreSQL, Storage, Auth, API gateway, Studio, and supporting services. Use the official Supabase self-hosting instructions, pin versions, keep the admin surface private, and budget RAM, updates, and backups. This is the shortest path to running the current Supabase-linked API on owned hardware, but it is not the simplest first home-server project.

## 6. Build and release pipeline

### Pull request checks

Run these before merge:

```bash
pnpm typecheck
pnpm lint
pnpm build
cd api && pnpm install --frozen-lockfile && pnpm typecheck && pnpm lint && pnpm build
cd ../android && ./gradlew :app:assembleDebug -PLIBRARY_URL=https://staging.example.com
```

Add the test and coverage commands from the agent contract before treating the API as production-ready. Tests should mock Supabase and Storage; never use a real private bucket in CI.

### Release steps

1. Merge a reviewed change to the main branch.
2. Build the web client and API from pinned lockfiles.
3. Run database migrations before code that requires them.
4. Run catalog sync and verify the indexed count.
5. Deploy API, then web, then run health and smoke checks.
6. Build a signed Android App Bundle with the production `LIBRARY_URL`.
7. Upload to Play Console internal testing before production rollout.
8. Record the release version, migration version, catalog count, and rollback target.

### Rollback

Keep the previous web/API image or commit available. Roll back code first if the schema is backwards-compatible. Never destroy a deployed database column or table to recover a release; use additive migrations and a tested rollback or forward-fix plan.

## 7. Consuming the app

### Browser

The browser loads the web origin. In same-origin mode it calls `/api`. In split mode the Webpack build receives `API_ORIGIN`, and the API allows that exact `WEB_ORIGIN` with credentialed CORS.

### Android

The Android wrapper receives the web URL through `LIBRARY_URL` at build time. It does not receive database keys, Storage keys, AI keys, or the access password. WebView cookies carry the signed session; downloads copy the session cookie into Android Download Manager requests.

### Future clients

A future native client should consume the same REST contract, use stable catalog IDs instead of raw Storage paths, and use short-lived authorized download URLs or authenticated range endpoints. It should not connect directly to PostgreSQL or Storage.

## 8. Monitoring and alerting

Start small:

- Uptime Kuma checks `GET /api/health` for the web and API URLs every minute.
- Monitor HTTP 5xx rate, 401/429 spikes, response latency, and failed catalog syncs.
- Monitor disk free space, NVMe SMART health, temperature, memory, CPU, container restarts, and tunnel connectivity.
- Alert when the database backup is old, object backup is old, the certificate is near expiry, or the catalog count unexpectedly drops.
- Keep application logs structured and redact passwords, cookies, tokens, book contents, and absolute personal paths.

A deeper health endpoint should eventually report dependency status without secrets:

```json
{
  "ok": true,
  "service": "study-library-api",
  "database": "ok",
  "storage": "ok",
  "catalogGeneratedAt": "2026-09-29T12:00:00.000Z"
}
```

Do not make a dependency health check return `ok: true` when PostgreSQL or Storage is unavailable. The current public health route is a process/configuration check; dependency checks should be added before public launch.

## 9. Backup and restore

Use the 3-2-1 rule:

- 3 copies of important data.
- 2 different storage media.
- 1 copy offsite.

Back up separately:

- PostgreSQL: encrypted daily `pg_dump` or physical backups, with retention.
- Object files: versioned snapshots or encrypted `restic`/`rclone` backups.
- Configuration: deployment manifests, migration files, and secret names, never secret values.

Test a restore at least monthly:

1. Restore PostgreSQL into an isolated database.
2. Restore a sample of the object tree.
3. Run catalog sync.
4. Open Markdown, image, PDF, upload, and download paths.
5. Compare item counts and checksums.

A backup that has never been restored is only an assumption.

## 10. Security launch gate

Before exposing the service publicly:

- HTTPS only; no direct database, Storage, SSH, or Node ports.
- Long random `SESSION_SECRET`, strong access password, and rotated sync token.
- Private bucket and server-only service-role credentials.
- Rate limiting for login, upload, sync, and expensive parsing.
- CSRF protection when cookie-authenticated state-changing routes are used across origins.
- Upload size/type limits, malware scanning or quarantine for untrusted users, and archive extraction limits.
- Privacy policy, book rights review, and Play Store Data Safety answers.
- Tested backup restore and a documented recovery contact.

## Recommended path for this project

1. Keep filesystem mode for local development.
2. Use the current Supabase-linked `api/` service plus Render for the first internet deployment.
3. Put the Android WebView in Play internal testing only after the HTTPS deployment and cookie flow work on cellular data.
4. Build a self-hosted PostgreSQL/MinIO adapter only when you are ready to operate backups, updates, monitoring, and the home network.
5. Use the four SSDs for redundant storage and backups, not as a replacement for the database service or operational discipline.
````

## File: README.md

````md
# Second Brain Study Library

A local-first and deployment-ready study workspace for Markdown notes, PDFs, ebooks, and visual references. Add folders and files to the configured study root locally, or use private Supabase Storage in hosted mode; the app organizes material into categories, a folder map, search results, and a reading queue.

## What it does

- Recursively discovers Markdown, PDF, text/code, image, ebook, and office textbook files.
- Uses folder names as categories and preserves filename ordering such as `00-`, `01-`, and `02-`.
- Renders GitHub-flavored Markdown, text/code files, PDF textbooks, links, and local images.
- Opens EPUB files in an in-app reader and offers safe open/download fallback actions for other ebook formats.
- Opens diagrams in a dedicated visual-reference panel.
- Imports files from the app with a review step and optional OpenAI-compatible LLM classification.
- Creates personal EPUBs from Markdown/text notes and adds them to the `Ebooks` category.
- Supports search, bookmarks, completion tracking, focus mode, reading-size control, and light/dark mode.
- Stores bookmarks, completion state, and theme preference in the browser only.
- Uses a stable perspective study surface with layered depth, pointer-following glow, queue reveals, and reduced-motion support.
- Serves content through path-safe REST API routes. Local mode needs no database; hosted mode uses private Supabase Storage for binaries and PostgreSQL metadata.
- Protects an optional hosted deployment with a server-only shared password and signed HttpOnly session cookie.

## Run locally

Requirements: Node.js 22.5 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4444](http://localhost:4444).

Development uses Webpack Dev Server on `4444` and the filesystem API on `4445`. Webpack proxies `/api` to the API process.

The client is bundled with Webpack 5, Babel, and HtmlWebpackPlugin. Webpack owns the development proxy, CSS processing, production assets, and history fallback; Express owns the API and production static-file serving.

By default, the app reads the directory directly above this project. Point it at a different study root with:

```bash
STUDY_CONTENT_DIR=/absolute/path/to/study-root pnpm dev
```

## Adding study content

See [ADDING_CONTENT.md](ADDING_CONTENT.md) for the content-root layout, supported files, hosted storage map, rescan behavior, and upload workflow.

## Production / internal server

Build and serve the app on the requested port:

```bash
pnpm install
STUDY_CONTENT_DIR=/srv/study-notes PORT=4444 pnpm start
```

The process serves the Webpack-built client and content API from the same origin. Put it behind an internal reverse proxy if TLS, authentication, or a company hostname is required.

## Free hosted deployment

The full architecture and free-host limitations are in [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md). Operational details are in [OPERATIONS.md](OPERATIONS.md).

- Render free web service for the Node/Express app and Webpack-built client.
- Optional independent REST API service in [`api/`](api/) for hosted catalog and file reads.
- Supabase free project for a private `study-library` Storage bucket and PostgreSQL metadata.
- Android WebView shell built with Gradle Kotlin DSL, pointing at the deployed HTTPS URL.

Run `supabase/schema.sql`, set `.env.example` variables, and seed an existing local root:

```bash
pnpm storage:seed
```

On Render, use `pnpm build` as the web build command and `pnpm serve` as the web start command. For the independent API, set its root directory to `api/`, use `pnpm install --frozen-lockfile && pnpm build` and `pnpm start`, then run `pnpm catalog:sync`. Set `API_ORIGIN` on the Webpack build to the API URL and keep all Supabase, session, sync, and AI secrets server-side.

The current API is REST rather than GraphQL because resources, streamed binaries, curl diagnostics, and the WebView client map directly to HTTP endpoints. The web/API uses pnpm; Gradle is only for Android. Maven is not needed unless a separate Java backend is introduced later.

## Validation

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Live checks:

```bash
curl http://localhost:4445/api/library
curl 'http://localhost:4445/api/content?path=some%2Fnote.md'
curl 'http://localhost:4445/api/asset?path=some%2Fdiagram.svg'
```

## Portable build instructions

The reproducible agent instructions live at [`.github/agents/study-library.agent.md`](.github/agents/study-library.agent.md). Copy that file with the repository when asking an agent to recreate or extend this app on another machine.

Webpack 5 owns the browser build; Express owns the production API/static server. The independent API package and Android wrapper have their own build instructions in [`api/README.md`](api/README.md) and [`android/README.md`](android/README.md).

## Oxlint

For type-aware linting, enable the repository's recommended Oxlint TypeScript configuration in `.oxlintrc.json` when the project adopts the corresponding plugin.
````

## File: REPLICATION_GUIDE.md

````md
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
````

## File: SYSTEM_DESIGN.md

````md
# Study Library System Design

## Decision Summary

Study Library is a single-origin reading service:

```text
Android WebView / browser
          |
          v
HTTPS web app (React + Webpack 5) and API (Express + Node)
          |
          +--> PostgreSQL metadata (Supabase, source of truth for future catalog/progress)
          |
          +--> private object storage (Supabase Storage, source of truth for book binaries)
```

Use PostgreSQL for metadata and relationships. Use object storage for PDFs, EPUBs, Markdown files, images, and office documents. Do not store large binaries in SQL rows and do not rely on a free web host's local disk.

The current implementation supports two storage modes:

- `filesystem` (default): local-first development and internal servers. Files stay below `STUDY_CONTENT_DIR`.
- `supabase`: hosted mode. Files are listed, read, uploaded, moved, and streamed through a private Supabase Storage bucket. The service-role key remains server-only.

The hosted starter is intentionally a single-user or small-private-library deployment. It is suitable for a free Render web service plus a free Supabase project, subject to sleep, storage, bandwidth, and quota limits. It is not a zero-cost SLA or a backup strategy.

For the complete database explanation, owned-hardware topology, build/release process, monitoring, backup, restore, and launch gates, see [OPERATIONS.md](OPERATIONS.md). The short decision is: filesystem or SQLite for local development, PostgreSQL for production metadata, and object storage for books. A home server is viable, but it must be protected by a tunnel/reverse proxy and backed up independently.

## Architecture Decision Ledger

- **Web shell:** React + TypeScript + Webpack 5. Node/pnpm is required for the
     browser build; `API_ORIGIN` selects the REST API implementation.
- **API contract:** REST with versioned OpenAPI/contracts. The current default
     is Node/Express, but Python/FastAPI, Java/Spring Boot, Go, and
     C#/ASP.NET Core repositories may implement the same contract for learning or
     measured service boundaries.
- **Repository strategy:** keep the shell, API, contracts, and optional workers
     independently deployable. Use one selected API writer per environment; do
     not let experimental implementations mutate the same production catalog.
- **Data:** PostgreSQL stores metadata, identity, progress, rights, and job
     state. SSD files or private object storage hold books, ebooks, and media.
- **Product shell:** one app with `/study` and future `/watch` modes. Add
     subdomains only when independent deployment, scaling, or security requires it.
- **Personal server:** use the Ryzen mini PC with PostgreSQL and services on the
     512 GB NVMe, a redundant external four-NVMe pool for active objects, the
     internal 2 TB NVMe for staging/restore, and the SATA SSD for local backups.
- **Media:** only lawful authorized video; keep media separate from document
     routes and use workers, HLS/DASH, signed access, CDN planning, and takedowns.
- **Scaling:** start as a modular monolith, add stateless replicas and queued
     workers, then extract a service only after measurements justify it.

## Personal Project Deployment Decision

This is the default decision for the current solo project. Future changes must
preserve it unless measurements, security requirements, or a documented product
boundary justify an intentional change.

### Use PostgreSQL for metadata

- Use PostgreSQL for `library_items`, accounts, sessions, reading progress,
     bookmarks, upload jobs, catalog metadata, rights records, and future Watch
     metadata. Prefer a local PostgreSQL container or service on owned hardware
     during the personal-server phase.
- Use SQLite only for a deliberately local, single-process prototype. If the API
     needs concurrent browser/WebView clients, uploads, transactions, pagination,
     or future users, use PostgreSQL instead of extending SQLite ad hoc.
- Do not choose Oracle for this project. It is a strong enterprise database but
     adds licensing, administration, and vendor-specific operational weight without
     solving a current requirement.
- Do not choose MongoDB as the primary store. A document database can work, but
     this product benefits more from relational constraints, transactions, joins,
     indexes, stable identifiers, and future row-level authorization. Add a NoSQL
     system only for a measured workload such as a search index, cache, or event
     stream.

### Keep binaries on SSDs or private object storage

- Store Markdown, PDFs, EPUBs, images, office files, and video objects on the
     owned SSD filesystem now. PostgreSQL stores metadata, checksums, sizes,
     relative keys, permissions, and processing state, never large binary rows.
- Keep the storage boundary behind an `ObjectStorage` port so filesystem,
     MinIO, Supabase Storage, or Cloudflare R2 can implement the same API later.
- Serve files only through authorized API routes or short-lived signed access.
     Never expose PostgreSQL, SMB, MinIO, or raw filesystem paths to the internet.

### Access the personal server safely

- For owner-only access, use Tailscale or an equivalent private network. This is
     the default for development and personal devices because it avoids inbound
     router ports and keeps the service private.
- For public browser or Android access, use a domain, HTTPS reverse proxy, and
     Cloudflare Tunnel or another outbound tunnel. Expose only the web/API surface;
     keep PostgreSQL and storage ports private.
- Do not port-forward database, SMB, SSH, MinIO, or development-server ports.
     Authentication and authorization belong in the API even when the tunnel is
     private.

### Backups are part of the design

- Use a 3-2-1 backup plan: the live SSD pool, a separate local backup disk, and
     an encrypted off-site copy. RAID, ZFS, or disk mirroring improves availability
     but is not a backup.
- Back up PostgreSQL with tested dumps or a supported backup mechanism, and back
     up object files with checksums and resumable/idempotent jobs. Retain enough
     history to recover accidental deletion and ransomware, not only the latest copy.
- Perform restore drills before public access. A backup that has not been
     restored is unverified. Record RPO/RTO, backup age, disk health, and failures
     in `OPERATIONS.md`.

### Managed and free-service path

Managed services are convenience and availability options, not replacements for
backups. Provider quotas and prices change, so verify official pricing before
deployment and keep the application portable through adapters.

- **Supabase Free** is suitable for development or a small private catalog:
     PostgreSQL, Auth, and private Storage are included, but the current published
     limits include 500 MB database size, 1 GB Storage, 5 GB egress, two active
     projects, and pausing after one week of inactivity. It has no automatic
     backups on the Free plan. Supabase Pro is the managed option when the project
     needs a non-pausing database, larger quotas, and included backups; it starts at
     the provider's published monthly plan price plus usage rules.
- **Cloudflare R2** is a later object-storage option when remote delivery makes
     egress important. Its current published free allowance is 10 GB-month, one
     million Class A operations, ten million Class B operations, and zero R2
     egress fees. It still charges for storage/operations beyond the allowance and
     does not replace PostgreSQL.
- **Oracle Cloud Free Tier** may host a small personal VM using its Always Free
     resources, but capacity, region availability, account verification, and
     operational maintenance are constraints. It is an optional hosting location,
     not a reason to select Oracle Database.
- **MongoDB Atlas Free** is useful for learning MongoDB and small document
     prototypes, but its free cluster is not the recommended metadata system for
     Study Library. Do not introduce it alongside PostgreSQL without a measured
     need.

### Phased implementation rule

1. Start with PostgreSQL metadata, SSD-backed filesystem objects, Express API,
      Tailscale for private access, and local plus encrypted off-site backups.
2. Add MinIO or Supabase Storage behind `ObjectStorage` when multiple hosts,
      remote delivery, or object lifecycle management requires it.
3. Move metadata to managed PostgreSQL and high-read objects to R2 or another
      object store only when uptime, bandwidth, backup, or worldwide access needs
      exceed the owned-server budget.
4. Keep the REST contracts and database/storage ports stable while changing
      providers. Do not rewrite the main API or add microservices speculatively.

### Repository and deployment shapes

Keeping the shell and compatibility API in this workspace is a development
convenience: one checkout, one contract, one local command, and easy changes to
the Study UI and API together. It is not a requirement that the browser UI and
API deploy from one repository.

Choose one of these deployment shapes:

```text
Unified Node service:
GitHub -> Render/VM -> Webpack static assets + Express API on one port

Split deployment:
GitHub -> Vercel/static host -> Webpack shell
GitHub/API repo -> Render/Cloud Run/VM -> REST API
                            |
                     PostgreSQL + private Storage

Learning lab:
Web shell -> API_ORIGIN -> one selected Node/Python/Java/Go/.NET implementation
```

The current root `server/index.ts` supports the unified service shape: it serves
the Webpack `dist/` directory and API routes from one Node process in
production. The independent `api/` package supports the split API shape. A
Vercel deployment can host the shell, but it should not be treated as a durable
home server: Vercel functions are request-scoped, local disk is ephemeral, and
the current long-running filesystem/SQLite server is not a Vercel serverless
function without an adapter rewrite. Point the Vercel shell at `API_ORIGIN` for
an API deployed elsewhere.

GitHub Actions is the build/deploy automation layer, not the runtime host. It
should install pinned dependencies, run typecheck/lint/tests/build, and invoke
the target provider's deployment action or CLI. Store only deployment tokens
and server configuration in encrypted GitHub secrets; never commit database,
Storage, session, AI, or media credentials.

## Target System Design for Growth

### Architecture decision

The right design for a solo builder with a large product roadmap is a
**domain-oriented modular monolith** with ports and adapters. Keep one web
application, one REST API, one PostgreSQL boundary, and one private object
storage boundary while the product and traffic are still small. Make the
modules explicit so a queue worker, a second client, or an independently
deployed service can be added later without rewriting the product contract.

Do not begin with microservices or runtime module federation. They add network
failure, deployment, observability, authentication, and local-development
cost before this product has independent teams or measurable scaling needs.
Extract a module only when its deployment cadence, workload, security boundary,
or ownership is genuinely different.

### Product modes: Study and Watch

The product has two user modes inside one app shell:

```text
Second Brain
├── Study: notes, PDFs, EPUBs, images, bookmarks, progress, exports
└── Watch: authorized movies/series, seasons, playback, subtitles, watch progress
```

They may share accounts, navigation, preferences, collections, and future
billing entitlements, but they must not share unsafe file assumptions. Study
content is indexed as documents and books. Local Watch is now implemented for
video/audio files under `WATCH_MEDIA_DIR` (Desktop by default), with range
streaming, playback controls, sidecar VTT subtitles, and LRC lyrics. Hosted
Watch remains a separate future media catalog delivered through transcoded
HLS/DASH assets and signed playback access.

### Shell app and domain strategy

Start with one shell URL and explicit mode navigation:

```text
app.example.com
     /study   -> Study library and reader
     /watch   -> Watch catalog and player
```

The shell owns branding, authentication state, navigation, account settings,
and shared collections. A visible Study/Watch switch changes the route and
preserves deep links. Do not iframe separate applications; use normal routes
and shared typed API contracts so cookies, accessibility, back navigation, and
loading/error states remain coherent.

When the domains need independent deployments, place them behind subdomains:

```text
app.example.com       -> shell and navigation
study.example.com     -> Study client, if extracted
watch.example.com     -> Watch client, if extracted
api.example.com       -> REST API
media.example.com     -> CDN or signed media delivery
```

Keep the shell as the Android `LIBRARY_URL`. Subdomains are an infrastructure
choice, not separate products for the user. Use a central identity/session
service or an intentionally scoped secure cookie; do not duplicate password
logic in Study and Watch. Move to subdomains only when deployment cadence,
traffic, security, or team ownership justifies the extra CORS, cookie, DNS,
monitoring, and release complexity.

### Repository boundaries

The long-term repository layout should be:

```text
study-library-web/       React shell, Study UI, Watch UI, Webpack, Android input
study-library-api/       REST API, database/storage adapters, auth, jobs
study-library-contracts/ OpenAPI document and generated browser/client types
study-library-workers/   Optional FFmpeg, AI, OCR, indexing, notification workers
```

This workspace may contain the API during migration, but a separate API
repository is compatible with the design. The web repository should consume a
versioned OpenAPI contract or generated TypeScript client, not duplicate route
shapes by hand. The API language is independent: Node/Express is the current
default, while Python, Java, or Go can implement the same REST contract in its
own repository.

Node is still needed in the web repository because React and Webpack require the
Node/pnpm build toolchain. It is not mandatory for the API repository. If the
API moves to Python, Java, or Go, deploy it separately and keep the browser
contract, auth behavior, error format, range semantics, and storage ports stable.

### Five-API learning lab

You can create five API repositories and connect each to the same Webpack UI if
all five implement the same versioned OpenAPI contract:

```text
study-library-contracts/
     openapi.yaml
     generated browser types/client

study-library-api-node/      Node.js + Express
study-library-api-python/    Python + FastAPI
study-library-api-java/      Java + Spring Boot
study-library-api-go/        Go + net/http or chi
study-library-api-dotnet/    C# + ASP.NET Core
```

The browser selects one implementation with `API_ORIGIN`, for example:

```text
API_ORIGIN=http://localhost:4450   Node
API_ORIGIN=http://localhost:4451   Python
API_ORIGIN=http://localhost:4452   Java
API_ORIGIN=http://localhost:4453   Go
API_ORIGIN=http://localhost:4454   .NET
```

Do not let all five implementations independently mutate the same production
catalog at the same time. Use one selected API per environment, or place a
gateway in front of them with explicit experiment routes. Give each stack an
isolated test database/schema and mocked Storage adapter during comparisons.
Each implementation must pass the same contract suite for health, auth,
library pagination, Markdown/text content, image/PDF range reads, traversal
rejection, upload approval, EPUB creation, errors, and catalog sync.

Compare them on developer time, type safety, p50/p95 latency, memory, CPU,
startup time, binary range correctness, failure recovery, testing ergonomics,
observability, dependency/security updates, and deployment complexity. This is
an excellent learning setup, but it is not a reason to operate five production
backends for one small product.

### UI architecture

The React client should evolve toward a feature-based modular UI:

```text
src/
     app/                    # shell, providers, routes, mode switch
     features/               # user workflows and product capabilities
          study/
               library/
               reader/
               uploads/
               ebooks/
          watch/
               catalog/
               player/
               progress/
          account/
          billing/
     entities/               # book, media item, account, collection
     shared/                 # design system, hooks, formatting, accessibility
     platform/               # auth session, API client, telemetry
     api/                    # generated client adapter and compatibility routes
     types.ts                # browser-facing domain types
```

Feature folders own their screens, workflow state, tests, and view-specific
logic. Shared UI contains primitives and patterns, not product decisions.
Keep server state separate from local presentation state, use route-level
code splitting as the number of workflows grows, and keep loading, empty,
error, auth, and permission states explicit. The current `/api` routes remain
the compatibility boundary while features are extracted from the large root
component.

### API architecture

The independent API should become a modular Express application with this
dependency direction:

```text
routes/controllers -> application services -> ports -> adapters
                                                            |
                                                 domain rules
```

The intended modules are `auth`, `accounts`, `catalog`, `content`, `uploads`,
`ebooks`, `billing`, and `jobs`. Controllers parse HTTP and return stable
responses. Application services enforce workflows and authorization. Ports
describe `CatalogRepository`, `ObjectStorage`, `SessionStore`,
`BillingProvider`, and `JobQueue`. Supabase, filesystem, Stripe, and future
providers stay behind adapters. The root filesystem server remains a local
compatibility implementation of the same contracts.

Keep the existing `/api/library`, `/api/content`, `/api/asset`, `/api/file`,
upload, and ebook routes stable. Add new account and billing capabilities
behind typed routes rather than exposing database or provider details to the
browser. A future shared contracts package may replace duplicated client/API
types once the repository becomes a pnpm workspace.

### Account, subscription, and payment boundary

Even though the first user is the owner, the hosted model should eventually
create one personal `account` or `workspace` and attach resources to it. Add
membership and role checks before public multi-user access. The current shared
password is an MVP compatibility mode, not the final identity model.

The billing model should be provider-neutral and server-authoritative:

```text
account
    -> payment customer
    -> subscription
    -> plan and price
    -> entitlements
```

Persist provider customer IDs, subscription state, renewal timestamps,
entitlements, and processed webhook IDs. Create checkout sessions on the
server, verify signed provider webhooks, make webhook handling idempotent, and
authorize paid features from stored entitlements. Never trust a client-side
plan flag and never store card details. Stripe Billing is a reasonable first
adapter, but the application should depend on a `BillingProvider` port rather
than Stripe-specific calls.

Payment tables and public subscription behavior should be introduced together
with real user identity and an additive migration. Do not add an incomplete
billing schema or a payment dependency to the local filesystem mode merely to
claim future support.

### Growth path

1. Extract the current UI into feature modules and add client/API contract
     tests without changing response shapes.
2. Split the API bootstrap into routers, controllers, application services,
     repositories, and storage adapters.
3. Add real accounts, memberships, stable catalog IDs, and server-side
     reading state when multi-user access is required.
4. Add a queue worker for indexing, AI classification, ebook generation,
     notifications, and billing webhook retries.
5. Add billing, subscriptions, and entitlements through a provider adapter.
6. Add caching, pagination, metrics, and rate limits where measurements show
     pressure. Consider module federation or a separate service only after a
     feature has an independent deployment or scaling need.

This design is intentionally scalable without being distributed by default:
the boundaries are ready for extraction, while local development, debugging,
backups, and deployment remain manageable for one person.

### Future media library boundary

Movies should be a separate product domain from books and notes. Only store and
serve videos that you created, licensed, purchased with redistribution rights,
or that are public domain. Do not rip DRM, bypass access controls, scrape
streaming services, or publish copyrighted films without permission. A public
catalog also needs rights records, takedown handling, age/region restrictions,
and a contact process before launch.

The future media pipeline should be:

```text
Authorized video upload
     -> private original object
     -> queued FFmpeg transcode worker
     -> HLS/DASH renditions and thumbnails
     -> catalog metadata and rights validation
     -> signed manifest/segment access through CDN or API
     -> browser / Android player and watch-progress API
```

Do not add movie bytes to `/api/file` or load them into `/api/library`. Add a
separate `media` boundary with `media_items`, `media_assets`, `media_rights`,
`watch_progress`, and `collections` metadata. Originals and renditions belong
in private object storage; PostgreSQL stores titles, checksums, codecs,
durations, subtitles, license status, and object keys. The API should expose
metadata and short-lived signed playback access, not permanent public file URLs.

The intended routes are `GET /api/media`, `GET /api/media/:id`,
`POST /api/media/uploads`, `POST /api/media/:id/publish`, and
`PUT /api/media/:id/progress`. Transcoding, thumbnail generation, subtitle
processing, virus scanning, and failed-job retries belong in workers, not in an
HTTP request. A home server can host a private or small-audience media library,
but worldwide streaming requires adequate upload bandwidth, CDN egress,
availability, monitoring, and a lawful distribution model; free web hosting is
not a realistic high-volume movie CDN.

## Current Runtime

- React 19 + TypeScript + Webpack 5 client.
- Express 5 + Node server.
- Local Watch media catalog with SQLite metadata at `data/study-library.sqlite`.
- Watch scans `WATCH_MEDIA_DIR` and supports local video/audio, VTT subtitles,
  LRC lyrics, byte-range streams, playback speed, and quality variants.
- Same-origin production serving: the API and built client share the deployed HTTPS URL.
- Optional signed, HttpOnly session cookie controlled by `LIBRARY_ACCESS_PASSWORD` and `SESSION_SECRET`.
- Supabase Storage mode uses a private bucket and server-side path validation.
- PDF requests preserve byte ranges when the upstream storage response supports them.
- Uploads are staged, classified, reviewed, and committed only after approval.
- Unsupported browser-native formats remain indexed and downloadable; Markdown, text, PDF, images, and EPUB have reader paths.
- Bookmarks, completion, theme, and reading-size state are currently browser-local. The SQL schema reserves the next step for cross-device state sync.

## API and Build Tool Choice

### REST for the web/API

Use REST for this app. The resources are naturally addressable (`library`, `content`, `asset`, `file`, `uploads`, and `ebooks`), the browser and WebView can consume them without a special client runtime, and HTTP range requests work directly for large PDFs and downloads. REST also keeps caching, monitoring, curl checks, and free-host debugging simple.

GraphQL is not needed for the current product. Consider it later only if several different clients need deeply variable catalog queries, many nested relationships, and a team is willing to operate schema/versioning/tooling. Even then, keep binary file delivery on object URLs or REST-style download endpoints; GraphQL should not carry PDF or EPUB bytes.

The current API remains same-origin REST:

```text
React browser or Android WebView
    -> HTTPS JSON and streaming REST endpoints
    -> Express server
    -> Supabase Storage and, later, PostgreSQL catalog/progress
```

### Node package tooling for the web/API

Use `pnpm` for this repository because the runtime is Node/Express and the existing lockfile and scripts already use it. `package.json` owns the build, serve, typecheck, lint, and storage-seed commands.

### Why Node.js and Express

Node.js and Express are the right first API stack for this product because:

- The web client is TypeScript/React, so browser-facing contracts, validation
     types, and API adapters can evolve in one language and one toolchain.
- The current workloads are I/O-bound: database queries, object-storage reads,
     upload streams, range requests, metadata scans, and HTTP responses. Node's
     event loop handles these well without making raw CPU performance the primary
     design constraint.
- The repository already uses mature Node libraries for Markdown, PDF/DOCX
     extraction, EPUB/ZIP generation, uploads, and React integration. Rewriting
     these boundaries in another language would add duplicate models and slower
     solo development without improving the initial user experience.
- Express is intentionally small and explicit. It makes REST routes,
     middleware, streaming, authentication boundaries, and compatibility with the
     existing root server easy to inspect and test.
- The Android app consumes HTTPS REST; it does not care whether the API is
     Node, Java, or Go. Keeping the server language aligned with the browser
     contract reduces development and debugging overhead now.

Java would be a strong choice for a larger enterprise team that already uses
Spring Boot, needs JVM-standard observability/compliance, or has several
backend teams. It would require a separate build/toolchain and duplicated
TypeScript contracts for the current solo project. Go would be a strong choice
for a small, high-concurrency streaming gateway or low-memory worker, but a Go
rewrite would duplicate the current document/ebook ecosystem and application
logic. Python with FastAPI or Django would be a strong choice for AI, OCR,
recommendation, and data-processing workers, but making it the main API would
also duplicate the current TypeScript contracts and runtime tooling. Neither
Python, Java, nor Go is a reason to replace the working REST contract.

Use Go, Java, or native FFmpeg workers later for a measured bottleneck such as
video transcoding, media packaging, AI/OCR processing, or a separately operated
high-throughput gateway. Keep those behind `ObjectStorage`, `JobQueue`, and
media-service ports; do not make the main API polyglot before monitoring shows
a need.

Every option can scale as either a monolith or a set of services:

1. Start with a modular Node/Express monolith and explicit ports.
2. Run multiple stateless API replicas behind a reverse proxy when traffic
     requires it.
3. Move indexing, AI, EPUB generation, and FFmpeg work to queue-backed workers.
4. Extract `media-playback`, `transcoding`, `catalog`, identity, or billing
     only when that boundary needs its own scaling, security, or release cycle.

Microservices are an operational decision, not a language feature. Splitting
too early adds network failures, distributed tracing, deployment coordination,
authentication, and local-development cost without making a small library more
reliable.

### Gradle Kotlin DSL for Android

Use Android Studio's Gradle build system for the future native wrapper, preferably `build.gradle.kts`. Gradle is the standard Android toolchain, handles Kotlin/Android plugins, signed release bundles, flavors, and Play Store builds. Maven would add no value to a thin WebView shell and is better reserved for a separate Java/Spring backend, which this architecture does not need.

The Android project should depend on the deployed URL through a build configuration such as `LIBRARY_URL`, not through source code secrets. The web app and API do not use Gradle or Maven.

## Hosted Components

### Web/API service

Deploy the repository as one Node web service on Render's free plan. The service should:

- run `pnpm build` during the build step;
- run `pnpm serve` as the long-running process;
- expose `/api/health` for health checks;
- use `STORAGE_MODE=supabase`;
- never receive a request containing the Supabase service key from the browser.

The free service can sleep. The first request after inactivity may be slow. A custom domain and paid uptime can be added later without changing the app contract.

### Independent API service

The `api/` directory is a separately deployable TypeScript REST service. It reads `library_items` from Supabase PostgreSQL, streams authorized objects from the private Storage bucket, and exposes the web client's catalog, content, asset, file, upload, and EPUB contracts. It also provides `POST /api/catalog/sync` for rebuilding database metadata from Storage.

Deploy `api/` as a second Render service using `api/render.yaml`. Set its `WEB_ORIGIN` to the web origin and set the Webpack build's `API_ORIGIN` to the API origin. The API keeps the Supabase service-role key server-side; the browser sends only session cookies and ordinary REST requests.

### Supabase

Create one Supabase project with:

- a private Storage bucket named `study-library`;
- the SQL objects in `supabase/schema.sql`;
- the service-role key stored only in the Render environment;
- database backups or an export plan before the library becomes important.

Use the dashboard or `pnpm storage:seed` to upload an existing local library. Preserve relative folders because the first path segment becomes the category in the current UI.

### Self-hosted option

Owned hardware can run the web service, API, PostgreSQL, and S3-compatible storage. The current supported hosted adapter is Supabase; a pure PostgreSQL plus MinIO deployment is a planned adapter because the current Supabase client and SQL policies are provider-specific. Do not expose database or object-storage ports directly. Use Cloudflare Tunnel or Tailscale, a reverse proxy, redundant disks, and tested 3-2-1 backups.

The current Ryzen 7 7840 mini PC with 32 GB RAM is sufficient for the personal
server phase. Use the 512 GB NVMe for the operating system, containers,
PostgreSQL metadata, and logs; use the 2 TB PCIe 4 NVMe for active book objects;
use the 2 TB SATA SSD for scheduled local backups and restore staging. The
advertised SSD speeds improve local scans, but internet bandwidth will normally
limit remote reading. Keep an offsite copy because the SATA disk is still in the
same machine. This layout supports the current filesystem mode immediately;
the full self-hosted PostgreSQL plus MinIO API requires the planned adapter. The
four extra 2 TB PCIe 4 drives can sit in a powered four-bay NVMe JBOD enclosure
and form a Linux software RAID10 or ZFS RAIDZ2 pool; USB4/Thunderbolt bandwidth
is shared, so the enclosure will not provide four independent 7,000 MB/s links.
The mini PC can remain a normal personal desktop as well as the server. Keep
PostgreSQL-managed files under `/var/lib/postgresql`, application releases under
`/opt/study-library`, book/media objects under `/srv/study-library`, and backups
under `/srv/backups`; do not manually edit PostgreSQL's data directory. Expect
brief outages during sleep, reboots, network loss, updates, and disk maintenance.

### Mobile app

The Android app is a thin WebView shell around the deployed HTTPS URL. It should:

- enable JavaScript and DOM storage;
- preserve cookies so the hosted password session survives navigation;
- use `WebViewClient` for the app origin;
- open external links in the system browser;
- allow file downloads through the Android download manager;
- handle back navigation inside the WebView before closing the activity;
- avoid shipping any Supabase or AI secret;
- use a build-time `LIBRARY_URL` so staging and production can differ.

The Play Store listing and app must provide value beyond an unsafe URL wrapper. Add offline reading, native share/download handling, or a clear focused reading experience before relying on Play review approval. Require HTTPS and keep the URL configurable.

## Data Model

PostgreSQL is the recommended database because it gives strong constraints, full-text/search extensions later, relational progress/bookmark records, and row-level security if multiple accounts are introduced.

### Tables

- `library_items`: catalog metadata keyed by stable storage path.
- `reading_progress`: per-user position and completion state.
- `bookmarks`: per-user saved files.
- `upload_jobs`: auditable staged/committed upload status.
- Local `catalog_items` SQLite table: a personal metadata index for Study and
     Watch filesystem entries; it is not the source of truth for hosted mode.

The independent API service queries `library_items` for the hosted catalog. `api/src/sync.ts` upserts Storage metadata after seed/upload/rescan, so the UI can query SQL for pagination and search without listing every object on every request. The existing root server still derives its inventory from disk or Storage for local compatibility.

### File lifecycle

Local files live below `STUDY_CONTENT_DIR`. Hosted files use the same relative
keys in the private Storage bucket, for example:

```text
System Design/01-foundations.md
Programming/algorithms.epub
Ebooks/my-study-collection.epub
```

The database stores metadata and a stable reference to each object; it does not
store the PDF, EPUB, or Markdown bytes. A reader requests metadata first and
then reads content through authorized REST routes. Uploads and generated ebooks
are staged, validated, committed, cataloged, and cleaned up as separate steps.
As the library grows, add author/ISBN/language/cover/checksum/parser metadata,
stable catalog IDs, database search, and pagination without changing the file
storage contract. Unsupported formats remain honest download entries.

For a larger library, change the read path to:

```text
GET /api/library?cursor=...&limit=50&category=...&q=...
GET /api/books/:id
GET /api/books/:id/content
GET /api/books/:id/download
```

Keep the storage path opaque to clients once stable database IDs exist. The current path API remains for local mode and compatibility.

## API Contract

All API routes are same-origin and return JSON errors with a `message`; auth failures also return `code: "AUTH_REQUIRED"`.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Deployment health and active storage mode. Public. |
| `GET` | `/api/auth/session` | Reports whether the current browser session is authenticated. |
| `POST` | `/api/auth/login` | Accepts `{ "password": "..." }`; sets a signed HttpOnly cookie. |
| `POST` | `/api/auth/logout` | Clears the session cookie. |
| `GET` | `/api/library` | Returns categories, folder tree, counts, and indexed file metadata. |
| `GET` | `/api/content?path=...` | Returns Markdown/text content and modification time. |
| `GET` | `/api/asset?path=...` | Streams an indexed image. |
| `GET` | `/api/file?path=...` | Streams an indexed PDF, EPUB, or download fallback. |
| `POST` | `/api/uploads` | Stages and classifies a supported multipart file. |
| `POST` | `/api/uploads/:id/commit` | Validates category/name and moves the staged file. |
| `DELETE` | `/api/uploads/:id` | Deletes a staged upload and metadata. |
| `POST` | `/api/ebooks` | Builds an EPUB from selected Markdown/text files. |
| `POST` | `/api/catalog/sync` | Rebuilds `library_items` metadata from Storage; requires `x-catalog-sync-token`. |
| `GET` | `/api/media` | Lists local video/audio files, subtitle tracks, qualities, and LRC lyrics. |
| `GET` | `/api/media/stream?path=...` | Streams a local video/audio file with byte-range support. |
| `GET` | `/api/media/subtitle?path=...` | Serves a validated local WebVTT sidecar. |

Request invariants:

- Paths are relative only; absolute paths and traversal are rejected.
- File extensions are allowlisted server-side.
- Upload size is bounded by `MAX_UPLOAD_BYTES` (100 MB by default).
- AI output is a suggestion. The server validates category, filename, and extension.
- A private Storage bucket is never exposed through a public client URL; the API proxies authorized reads.
- Range headers are forwarded for hosted binary reads where supported.

## Security Model

1. Put the app behind HTTPS. Render's public URL is HTTPS by default.
2. Set both `LIBRARY_ACCESS_PASSWORD` and a long random `SESSION_SECRET` for hosted use.
3. Keep `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`, and any provider credentials in server environment variables only. Never expose secrets through client build variables.
4. Keep the Storage bucket private. Only the server uses the service role.
5. Keep path traversal, hidden-folder, extension, and destination validation on the server. Treat filenames and uploaded documents as untrusted data.
6. Treat extracted text as data, not instructions, when sending it to an AI classifier.
7. Keep the upload approval step. Do not auto-commit model suggestions.
8. Rotate the password, session secret, and service key if a deployment log or client bundle exposes them.
9. Add a managed identity provider, per-user accounts, CSRF protection, and a persistent rate limiter before opening the library to multiple households or public users.
10. Add malware scanning and quarantine for untrusted multi-user uploads before making the service public.

## Free Deployment Runbook

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase/schema.sql`.
3. Create or confirm the private `study-library` bucket.
4. Set local seed variables from `.env.example`, then run `pnpm storage:seed`. The command is repeatable and upserts object paths.
5. Push this repository to a Git provider.
6. Create a Render web service from the repository, or apply the root `render.yaml`.
7. Create a second Render web service with root directory `api/`, or apply `api/render.yaml`.
8. Add Supabase credentials, `LIBRARY_ACCESS_PASSWORD`, `SESSION_SECRET`, and `CATALOG_SYNC_TOKEN` to the API service. Set the web service's `API_ORIGIN` to the API URL. Add AI variables only if classification is wanted in the root compatibility server.
9. Run `pnpm catalog:sync` from `api/`, or call the authenticated sync endpoint, then check the API `/api/health` and sign in through the web URL.
10. Put the web HTTPS URL in the Android app's `LIBRARY_URL` build configuration.
11. Test from cellular data, not only the development machine. Verify login, library listing, Markdown, PDF range loading, image assets, catalog sync, logout, and traversal rejection.

## Limits and Growth Plan

### MVP now

- One deployed web surface, one independent REST API, and one private bucket.
- One shared password session.
- Storage-backed recursive index.
- Browser-local reading state.
- Manual rescan through the UI and safe upload approval.

### Next phase

- Background catalog sync into `library_items`.
- Cursor pagination and server-side search.
- Supabase Auth with per-user accounts.
- Database-backed bookmarks, progress, and last-read position.
- Resumable uploads for large textbooks.
- Thumbnail and text extraction jobs.
- Scheduled orphan cleanup for staged uploads.

### Later scale

- Queue-based parsing workers.
- Full-text search with PostgreSQL `tsvector` or a dedicated search service.
- Signed short-lived download URLs or a CDN for high-volume traffic.
- Virus scanning, audit events, backups, and restore drills.
- Native mobile cache and offline reading rather than only WebView delivery.

## Failure and Edge Cases

- Supabase unavailable: return a server error and keep the client retry state; never fall back to an empty library that looks like data loss.
- Missing or corrupt files: omit them from the index and report server logs without exposing filesystem paths.
- Large PDFs: use range requests and browser viewer fallback; do not load every binary into `/api/library`.
- Unsupported office/Kindle format: keep it indexed as a download instead of claiming it is rendered.
- Duplicate upload names: choose a deterministic `-2`, `-3` suffix on commit.
- Abandoned staged uploads: delete on cancel and add a scheduled cleanup job before public use.
- Prompt injection in an uploaded note: the classifier receives only bounded text and can choose from existing categories; it cannot execute tools or choose an absolute path.
- Mobile session expiry: the WebView receives the login surface and reuses the same HTTPS cookie flow.
````

