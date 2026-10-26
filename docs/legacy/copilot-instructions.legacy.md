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
