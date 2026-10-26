# Study Library API

Independent REST API service for the hosted Study Library. It links the web client to Supabase PostgreSQL catalog metadata and private Supabase Storage binaries without exposing the service-role key.

## Responsibilities

- Reads indexed catalog rows from `public.library_items`.
- Streams Markdown, images, PDFs, EPUBs, and fallback files from the private Storage bucket.
- Synchronizes Storage objects into `library_items` with an authenticated catalog endpoint or the CLI command.
- Stages uploads in private Storage and records review state in `upload_jobs`.
- Commits approved uploads with validated category/name moves and refreshes the catalog.
- Creates EPUB 3 archives from indexed Markdown/text files.
- Preserves the web client's existing `/api/library`, `/api/content`, `/api/asset`, and `/api/file` response contracts.
- Provides shared-password sessions for the private MVP.

The API does not put book bytes in PostgreSQL. It stores only metadata and relative Storage paths.

## Setup

Run `supabase/schema.sql` in the Supabase SQL editor, copy `.env.example` to `.env`, then install and build:

```bash
pnpm install
pnpm catalog:sync
pnpm dev
```

The default port is `4450`. The Webpack web app can point at it with `API_ORIGIN=http://localhost:4450`.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start the service with reload |
| `pnpm typecheck` | Type-check the source and the tests |
| `pnpm lint` | oxlint |
| `pnpm test` | Configuration, security and attack tests (in-memory stand-ins for Supabase; no network) |
| `pnpm build`, `pnpm start` | Compile to `dist/` and run it |
| `pnpm deps:audit` | Advisories for production dependencies |
| `pnpm catalog:sync` | Index the bucket into the catalog |

## Hosting and configuration

Deploy this directory as its own Render service with `pnpm install --frozen-lockfile && pnpm build` and `pnpm start` (`render.yaml` does this). Every setting is read once in `src/config.ts`, and **in production the service refuses to start** unless:

- `LIBRARY_ACCESS_PASSWORD` is set (12 characters or more). Production is never open to everyone; only development may run without a password.
- `SESSION_SECRET` is at least 32 bytes and not the password.
- `WEB_ORIGIN` is an `https` origin with no path, and `SUPABASE_URL` is `https`.
- `CATALOG_SYNC_TOKEN`, when set, is at least 32 bytes.

Keep `SUPABASE_SERVICE_ROLE_KEY`, `LIBRARY_ACCESS_PASSWORD`, `SESSION_SECRET` and `CATALOG_SYNC_TOKEN` server-side. `TRUST_PROXY_HOPS` (default 1 in production) says how many reverse proxies sit in front, so rate limits count the real client address and not the proxy's.

### Sessions and cookies

Sign-in sets a signed, `HttpOnly` cookie that expires after 7 days (`__Host-study_library_session` and `Secure` in production). The cookie carries nothing about a person and the service keeps no session table, so a single session cannot be revoked; changing `SESSION_SECRET` ends all of them. `SameSite` is `None` in production by default because the web page and this API are normally on different sites; browsers are phasing out third-party cookies, so the sturdier setup is one registrable domain (for example `library.example.com` and `api.example.com`) with `API_COOKIE_SAMESITE=lax`.

## Browser contract

- **CORS:** exactly one origin, `WEB_ORIGIN`, is allowed with credentials. Every other origin receives no CORS headers, and its preflight is refused. `Vary: Origin` is always set.
- **Writes:** every `POST`, `PUT`, `PATCH` and `DELETE` must carry `Origin: <WEB_ORIGIN>` and `X-Requested-With: StudyLibrary` (the web client adds both) or the answer is `403 CSRF_REJECTED`. The only exception is `POST /api/catalog/sync`, which uses its token and no cookie.
- **Errors:** every error body is `{ "code", "message", "requestId" }`, and `X-Request-Id` repeats the id. Messages never contain a path, a provider message, a key or a stack; the detail goes to the server log with configured secrets blanked out.
- **Rate limits:** 600 requests a minute per client for the whole API, with tighter limits on sign-in (10 attempts in 15 minutes), uploads, ebooks and catalog sync. Refusals are `429` with `Retry-After`.
- **Files:** `GET /api/file` and `/api/asset` serve a file with the type its extension implies, never the type stored with the object or claimed by an uploader. SVG, HTML and XML are served with a `sandbox` Content-Security-Policy. Other files may be framed only by `WEB_ORIGIN`.

## Uploads

An upload is checked before anything is stored: the extension must be supported, the size under `MAX_UPLOAD_BYTES`, and the first bytes must match the extension (a `.pdf` that is HTML is refused). Staged files live under a hidden inbox that is never listed or served. At most 25 uploads can wait for review, uploads are limited to two at a time, and a staged upload nobody approved within 24 hours is deleted and can no longer be committed. AI classification is not used here; the suggestion comes from rules and the owner approves it.

## Catalog sync

The sync command is safe to repeat. It lists supported objects in the private bucket and upserts their metadata into `library_items`:

```bash
pnpm catalog:sync
curl -X POST -H "x-catalog-sync-token: $CATALOG_SYNC_TOKEN" https://your-api.example.com/api/catalog/sync
```

The HTTP route needs only the token (no session, no browser headers) and is limited to six calls a minute. A future worker can run the same sync after seed, upload commit, or on a schedule. The current web server remains available for local filesystem mode and backward compatibility.

## API routes

- `GET /api/health` returns `{ ok, service, authRequired }` and nothing about the storage behind it.
- `GET /api/auth/session`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/library?limit=...&offset=...&q=...&category=...`
- `GET /api/content?path=...` (Markdown and text up to 5 MB)
- `GET /api/asset?path=...`
- `GET /api/file?path=...`
- `POST /api/uploads`
- `POST /api/uploads/:id/commit`
- `DELETE /api/uploads/:id`
- `POST /api/ebooks` (up to 30 indexed Markdown or text files; raw HTML in a note is written as text, not carried into the book)
- `POST /api/catalog/sync` with `x-catalog-sync-token`

All file paths are relative, validated, and resolved through a private Storage bucket; only files in the catalog can be read. The API is REST by design; GraphQL is not required for this reading and streaming workload.

## Not covered

The service has no per-person accounts or revocable sessions (shared password only), so any signed-in browser can stage, approve and discard uploads. Move to Supabase Auth, as `supabase/schema.sql` anticipates, before sharing the password beyond people you trust.
