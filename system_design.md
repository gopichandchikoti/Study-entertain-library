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

- **Interface content:** `src/content.model.json` is the English interface-copy
     source, imported through the typed `src/content.ts` adapter. Components use
     model values and named placeholders; HTML metadata uses the same model at
     build time. Locale and direction come from the model. Keep protocol values,
     authorization rules, content documents and server/provider messages outside
     this client-only boundary. Rebuild to apply a translated model; runtime
     locale selection and complete RTL layout support are not implemented.

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
video/audio files under `WATCH_MEDIA_DIR`, as a Netflix-style catalog (see
"Local Watch" below). Hosted Watch remains a separate future media catalog
delivered through transcoded HLS/DASH assets and signed playback access.

### Local Watch

- **Catalog.** `data/watch-catalog/catalog.json` (`WATCH_CATALOG_DIR`) is the
  source of truth for titles: name, year, overview, genres, languages, rating,
  optional `poster`/`backdrop` image paths, and the files that make up each
  movie, series or album. Rescans add new files and flag vanished ones; hand
  edits to titles, overviews and image paths are never overwritten. Generated
  pictures, episode stills and hover previews live beside it.
- **Decision per file.** The browser reports what it can decode
  (`canPlayType`); `/api/watch/plan/:fileId` returns one of three plans:
  *direct* (the original, with byte ranges), *remux* (video copied into
  fragmented MP4, audio copied or converted) or *transcode* (H.264/AAC, or
  VP9/Opus for browsers without H.264). Playback therefore never depends on the
  codecs of a particular download. The player falls back from direct to H.264 to
  VP9 if a browser still refuses a stream.
- **Audio.** Every audio track is selectable (the server maps the chosen stream),
  the language is remembered, and a per-file offset of up to ±5 s re-times the
  audio (`delay` query parameter). If a browser claims a codec but decodes no
  audio, the player asks for plain AAC and remembers that. Offsets move
  timestamps rather than cutting, so a file's own audio offset is preserved; this
  was measured with a synthetic flash-and-beep source (see FEATURE_LOG.md).
- **Picture.** `/api/watch/frame/:fileId` measures baked-in black bars (three
  samples, union, cached in the catalog). The default view fits the real picture
  to the screen; other modes show the original frame, fill the screen, or crop
  to 4:3, 16:9, 1.85:1, 2.39:1 or IMAX 1.90:1 / 1.43:1. This is client-side layout
  only: the stream is never re-encoded for it.
- **Previews.** `/api/watch/preview/:titleId` serves an 18-second silent H.264
  clip, made once with ffmpeg at low priority and cached on disk; hovering a card
  plays it. A quiet background job prepares them for every title (`WATCH_PREVIEWS=lazy`
  makes them on first hover instead).
- **Boundaries.** Media stays on `/api/watch/*`; documents and Learning
  submissions keep their own routes. Paths are resolved inside `WATCH_MEDIA_DIR`
  and never sent to the browser; at most `WATCH_MAX_STREAMS` conversions run at
  once. Hosted Storage mode answers `/api/watch` with 501.
- **One drive only.** On Windows the media root must be on one drive (G: unless
  `WATCH_ALLOWED_DRIVE` says otherwise). `server/watch/root.ts` resolves it; a root
  on any other drive makes `/api/watch`, `/api/music` and `/api/media` answer 403
  `WATCH_DRIVE_NOT_ALLOWED`. Every file is opened through `confinedRealPath`, which
  follows shortcuts, symlinks and junctions and rejects a real path outside the root
  or off the drive; the scan itself does not follow links.
- **Songs are not shown in Watch.** Audio files appear in the catalog as `album`
  titles, but the Watch screen filters them out; they belong to Music.

### Local Music

The Music mode plays the songs from the same media folder. It has its own trust
boundary: routes under `/api/music/*` (`library`, `plan`, `stream`, `cover/:albumId`,
`lyrics/:trackId`, `likes`, `plays`, `playlists`, `radios`), and per-account SQLite
tables (`music_likes`, `music_plays`, `music_playlists`, `music_playlist_tracks`,
`music_radios`). It shares file access and the direct/repackage/convert planning with
Watch through `server/watch/streaming.ts`, and nothing else.

- **Library.** `server/music/library.ts` turns the Watch catalog's audio files into
  tracks. `metadata.ts` removes site names and numbering from messy tags, treats the
  film as the album and the cast as the album artist, and splits singers into names.
  Loudness is measured once in the background to find workout and energetic songs.
  Covers come from the pictures embedded in the files; lyrics from a `.lrc` file with
  the same name or from tags.
- **Client.** `src/features/music/` keeps pure, tested modules (`musicModel`: search,
  facets, radios, shelves, mixes; `queue`: ordering, shuffle, repeat) apart from the
  React layer. `MusicProvider` sits above `App`, so the one audio element, the queue and
  the lock-screen controls keep working when the person switches to Study, Watch or
  Markdown (a small pill keeps it controllable). It is loaded in the same lazy chunk
  as `App` (`src/AppRoot.tsx`), not in the first download.
- **Phones.** Below 860 px the layout becomes a phone app: bottom tabs, a mini player
  above them, bottom-sheet menus and queue, and a full-screen player.
- **Glass.** The music and video players share the translucent material in
  `src/Glass.css`. A glass panel can only blur what is behind it if no ancestor holds
  an opacity animation or filter (a backdrop root), so overlay animations use
  `animation-fill-mode: backwards`.
- **Smooth scrolling.** `src/shared/useSmoothScroll.ts` runs Lenis for wheel scrolling on
  the page and on the Music list. Touch and keyboard stay native, nested scrollable
  areas keep native scrolling, it pauses while a layer locks the page, and it is off
  under reduced motion.

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
- Watch scans `WATCH_MEDIA_DIR` into a JSON catalog and plays video/audio through
  direct, repackaged or converted streams chosen per file and browser, with
  hover previews, audio-language and subtitle selection, audio sync, picture
  fit/crop modes, playback speed and saved progress. The older `/api/media`
  routes remain on the root server but the web client no longer uses them.
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
- Account SQLite `markdown_documents` (id, user_id, name, content, created_at,
  updated_at): saved Markdown files written in the Markdown editor. One row per
  file, unique per user by case-insensitive name, `ON DELETE CASCADE` from
  `users`, served by `server/markdown/routes.ts` behind the account session guard.
  It lives with the account database, so it has the same single-instance and
  durable-disk requirement; moving identities to PostgreSQL must move this table too.

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

Updated 2026-10-26. The rules are in `AGENTS.md` (Section 3, SEC-01 to SEC-52); this section is the design record: what is protected, where the trust boundaries are, which control stands at each, and what is left open. Evidence is in `SECURITY_VALIDATION.md`.

### Assets

Accounts and password hashes; per-account Markdown files, playlists and progress; the shared study library and its staged uploads; the Watch and Music media folder (read-only); the Supabase service-role key, the session secrets, the sync token and any AI or e-mail key.

### Trust boundaries and the control at each

| Boundary | What crosses it | Controls |
| --- | --- | --- |
| Browser to server | Cookie, CSRF token, every request field | Scrypt password hashing with a policy beyond length (SEC-43); server-side sessions stored as hashes, `HttpOnly`, `__Host-` and `Secure` in production, idle and absolute expiry (SEC-28); CSRF token plus exact `Origin` (SEC-26); one error body with no internals (SEC-37); three rate-limit layers (SEC-40); small body limits (SEC-41); the headers and CSP of SEC-11 |
| Account to account | Record ids in URLs | Object-level lookups by id and owner in every repository (SEC-05); cross-account attack tests; export and deletion of one account's rows only (SEC-44) |
| Upload to library | Files and file names | Staged and approved by the owner; extension allow-list, first-bytes check, size cap, per-account cap, 24-hour expiry (SEC-31, SEC-32); destination checked as text and after links are resolved, never in a folder the library hides (SEC-33); files served by extension-derived type, active documents sandboxed, private cache policy (SEC-30, SEC-36); AI classification is a suggestion only |
| Server to local media | Ids from the URL | Ids are looked up in the catalog, never used as paths; the media folder must be on the allowed drive; real paths are resolved and confined; only the media routes carry video and audio |
| Server to Supabase or providers | Service-role key, provider calls | Key read once in `config/`, server only (SEC-02, SEC-25); timeouts on every outbound call (SEC-42); OAuth uses state, nonce and PKCE; row-level security with no public policy, private bucket (SEC-46) |
| Hosted `api/` to the web origin | Cross-site cookie and writes | Refuses to start in production without a password, a separate 32-byte signing secret and an https origin (SEC-23, SEC-24); exactly one CORS origin (SEC-27); origin and marker header on every write (SEC-26); 7-day signed cookie (SEC-28); proxy hops configured (SEC-29); the same files, errors and limits as the root server |

### Decisions and limits

- Account mode is the default; the shared-password "owner" mode and the hosted `api/` use one password and cannot revoke a single session (rotate the secret to end all).
- Sign-up is open locally and closed by default in production. Because the library is shared, every signed-in account can approve an upload into it (SEC-52 decision, open).
- The Learning runner executes no code: answers are structured JSON or text and code runs fail closed until an isolated sandbox exists.
- `style-src 'unsafe-inline'` stays in the CSP because the approved design uses inline styles; script sources have no `unsafe-inline` or `unsafe-eval` in production.
- Rotate the password, the session secret and the service key if a log or a bundle ever shows one. Add malware scanning and quarantine before accepting uploads from the public.
- Not built: a breached-password lookup, a library-owner role, per-person sessions in `api/`, an isolated code sandbox.

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


## Authentication update — 2026-10-03

The current local implementation adds a SQLite identity writer and server OAuth adapters alongside the existing catalog. Account mode is the default; the old shared gate is available only through explicit owner mode. This does not implement the planned PostgreSQL/Supabase identity adapter or permit replicated writers. Production account startup requires a durable single-instance SQLite acknowledgement, HTTPS, and configured trusted proxies; ephemeral identity storage is unsupported. Provider credentials remain server-only. See [AUTH_SETUP.md](AUTH_SETUP.md) for configuration, session revocation, backup/rotation procedures, and deployment limits, and [AUTH_VALIDATION.md](AUTH_VALIDATION.md) for actual checks and remaining advisories.

## Design record and motion (2026-10-26)

This is the design record that `AGENTS.md` (UI-01) requires. The visual design below was approved by the owner and is frozen;
new work follows it and audits report against it.

- **Audience and voice.** One person (and invited learners) studying from their own notes, books and courses, and watching or
  listening to their own media. Calm, plain, active-verb copy; all strings live in `src/content.model.json`.
- **Palette.** Warm paper with teal and coral, from `src/themes/tokens.css`. Light: paper `#f4f0e7`, raised `#fffdf8`, ink
  `#1d2523`, muted `#71807a`, accent `#e66d43`, teal `#1e6b68`. Dark: paper `#111917`, raised `#182321`, ink `#ebefe5`, muted
  `#91a19a`, accent `#ef825a`, teal `#6bb7a4`. Watch and Music add a dark liquid-glass treatment (`themes/glass.css`).
- **Measured contrast (WCAG ratios, computed from those tokens on 2026-10-26).** Ink on paper 13.8 (light) and 15.3 (dark); teal
  on paper 5.5 and 7.6; in dark, muted 6.6 and accent 6.8 on paper, all passing. **Known gaps in the light theme:** muted text on
  paper is 3.64 (4.07 on the raised surface) and the accent on paper is 2.78 (3.11 on raised), under the 4.5 for body text and 3.0
  for interface parts. Fixing them means changing approved colours, so it is the owner's decision. Measured alternatives: muted `#5d6c66`
  gives 4.86 on paper and 5.43 on raised (passes for text); accent `#c8532b` gives 3.91 and 4.37 (passes for interface parts, still
  short of 4.5 for body text).
- **Type.** DM Sans (variable) for the interface, Fraunces (variable) for the editorial headings, DM Mono for labels, all
  self-hosted from `@fontsource` packages with the first faces preloaded.
- **Shape and depth.** One surface radius of 18 px (`--surface-radius`), borders for structure, shadows only on floating layers
  and cards as designed.
- **Icons.** lucide, imported only through `src/components/icons.tsx`.
- **Motion.** Apple-style springs with mass 1: stiffness = (2π / response)² and damping = 4π × dampingFraction / response.
  Three named springs only: `snappy` (0.32 s, 0.86) for tab highlights, `smooth` (0.50 s, 1.00) for sheets and the full-screen
  player, `bouncy` (0.45 s, 0.70) for menus and dialogs. `src/utils/spring.ts` is the table; `pnpm motion:generate` turns it into
  CSS `linear()` easings in `src/themes/motion.css` with a `cubic-bezier` fallback. Only `transform` and `opacity` animate.
  Overlays leave through `src/components/Presence.tsx` (kept mounted and `inert` until the exit ends), tab groups share a highlight
  from `src/hooks/useSlidingIndicator.ts`, and reduced motion removes travel and scale.
- **Structure.** `src` is `@types`, `api`, `components`, `features`, `hooks`, `pages`, `routes`, `themes`, `utils`; `server` is
  `config`, `controllers`, `helpers`, `middlewares`, `routes`, `services`, `validators`, `@types` and the feature modules. Each
  address is a route; `/privacy` and `/terms` are public pages (the text should be reviewed by a lawyer before a public launch).
- **Design tells present in the approved design** (reported by `pnpm audit:standards`, not removed): gradients, soft shadows,
  glass panels, a few one-edge stripes, a lucide icon set and no skeleton component. They are information, not a request to restyle.
