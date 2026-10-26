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

- Account SQLite database (`PERSONAL_DB_PATH`, default `data/study-library.sqlite`): holds accounts, sessions, settings and every user's saved Markdown files. Run `pnpm db:backup <folder>` (a consistent online copy using `VACUUM INTO`) at least daily and copy the results to another disk. Do not copy the `.sqlite` file by hand while the server runs, because the `-wal` file holds recent writes.
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
- Rate limiting for login, upload, sync, saving and expensive scans (in place: see "Security hardening update" below).
- CSRF protection when cookie-authenticated state-changing routes are used across origins (the API checks the web origin and the `X-Requested-With` marker on every write).
- Upload size/type limits, malware scanning or quarantine for untrusted users, and archive extraction limits.
- Privacy policy, book rights review, and Play Store Data Safety answers.
- Tested backup restore and a documented recovery contact.

## Recommended path for this project

1. Keep filesystem mode for local development.
2. Use the current Supabase-linked `api/` service plus Render for the first internet deployment.
3. Put the Android WebView in Play internal testing only after the HTTPS deployment and cookie flow work on cellular data.
4. Build a self-hosted PostgreSQL/MinIO adapter only when you are ready to operate backups, updates, monitoring, and the home network.
5. Use the four SSDs for redundant storage and backups, not as a replacement for the database service or operational discipline.


## Watch (local media) — 2026-10-23

Watch needs **ffmpeg and ffprobe** to repackage or convert files a browser cannot play, to read audio/subtitle tracks, and to make pictures and previews. The server looks for them in `FFMPEG_PATH` (a folder or the ffmpeg executable), then `.tools/ffmpeg/bin`, then `PATH`. Without them the Watch screen still lists titles and plays files the browser can play natively, and shows a notice.

| Setting | Default | Purpose |
| --- | --- | --- |
| `WATCH_MEDIA_DIR` | The root of drive G: on Windows, `data/watch` elsewhere | Folder scanned recursively for video and audio (Watch and Music). Read-only. On Windows it must be on `WATCH_ALLOWED_DRIVE`; any other folder makes `/api/watch`, `/api/music` and `/api/media` answer 403 `WATCH_DRIVE_NOT_ALLOWED` until it is fixed. |
| `WATCH_ALLOWED_DRIVE` | `G` | Windows only: the one drive media may come from. Shortcuts, symlinks and junctions that lead to another drive are not followed. |
| `WATCH_CATALOG_DIR` | `data/watch-catalog` | `catalog.json`, `artwork/`, `thumbs/`, `previews/`, `subs/`. Back it up with the SQLite file; everything except `catalog.json` can be regenerated. |
| `WATCH_MAX_STREAMS` | 3 (1 to 8) | Simultaneous conversions. Each is an ffmpeg process. |
| `WATCH_PREVIEWS` | background | `lazy` makes hover previews only on first hover. In the background they use one low-priority ffmpeg and about 1 MB per title. |
| `WATCH_ENCODER` | `x264` | `amf` uses the AMD hardware H.264 encoder when ffmpeg has it. |

Editing titles: open `catalog.json`, change `title`, `year`, `overview`, `genres`, `languages` or `rating`, or set `poster` / `backdrop` to an image under the catalog folder (for example `custom/film.jpg`). The file is reloaded whenever it changes on disk; an invalid file is reported and never overwritten. Deleting `previews/` or `artwork/` is safe; they are rebuilt.

`/api/watch/diagnostics` lists files ffprobe could not read (usually interrupted downloads) and folders that were skipped.

### Music (local songs) — 2026-10-23

Music plays the audio files in the same media folder (`WATCH_MEDIA_DIR`, drive G: on Windows) and needs the same ffmpeg and ffprobe. It has its own routes (`/api/music/*`) and its own per-account SQLite tables (`music_likes`, `music_plays`, `music_playlists`, `music_playlist_tracks`, `music_radios`), so Watch and Music share files but not trust boundaries. Hosted Storage mode answers `/api/music` with 501, like `/api/watch`.

- **Where things are kept.** Album covers cut from the songs are cached in `data/watch-catalog/music-art/`; the loudness measurements that find workout and energetic songs are in `data/watch-catalog/music-analysis.json`. Both can be deleted and are rebuilt (the loudness pass runs in the background, one low-priority ffmpeg at a time, after the first Music load).
- **Back up** the SQLite file (likes, history, playlists) with the rest of the account data; the catalog folder only holds files that can be regenerated, except `catalog.json` edits.
- **Lyrics** are read from a `.lrc` file next to the song (same name) or from tags embedded in the file. Nothing is fetched from the internet.
- **Messy tags.** Site names in titles, artists, albums and genres (for example `[iSongs.info] 01 - …`) are removed when the library is built; the file on disk is never changed.
- **Not on G: yet?** If `WATCH_MEDIA_DIR` points off the allowed drive the Music tab shows the server's message instead of songs; move the files to G: (or set `WATCH_ALLOWED_DRIVE` and `WATCH_MEDIA_DIR` together) and restart.

## Authentication update — 2026-10-03

The current local implementation adds a SQLite identity writer and server OAuth adapters alongside the existing catalog. Account mode is the default; the old shared gate is available only through explicit owner mode. This does not implement the planned PostgreSQL/Supabase identity adapter or permit replicated writers. Production account startup requires a durable single-instance SQLite acknowledgement, HTTPS, and configured trusted proxies; ephemeral identity storage is unsupported. Provider credentials remain server-only. See [AUTH_SETUP.md](AUTH_SETUP.md) for configuration, session revocation, backup/rotation procedures, and deployment limits, and [AUTH_VALIDATION.md](AUTH_VALIDATION.md) for actual checks and remaining advisories.

## Security hardening update — 2026-10-26

The evidence, findings and limits are in `SECURITY_VALIDATION.md`. What an operator needs to know:

### The hosted API (`api/`) now refuses to start without its secrets

In production (`NODE_ENV=production`) the service exits at start-up, with a plain message, unless all of these are set. Before this change it started open to everyone when `LIBRARY_ACCESS_PASSWORD` was missing. **Set these in the host's secret store before deploying this version, or the deploy will fail its health check.**

| Setting | Rule |
| --- | --- |
| `LIBRARY_ACCESS_PASSWORD` | Required, 12 characters or more. |
| `SESSION_SECRET` | Required, at least 32 bytes, different from the password (`openssl rand -base64 48`). |
| `WEB_ORIGIN` | Required, an `https` origin with no path. Exactly this origin may call the API with credentials. |
| `SUPABASE_URL` | `https` in production. |
| `CATALOG_SYNC_TOKEN` | At least 32 bytes when set; leave unset to switch `POST /api/catalog/sync` off. |
| `TRUST_PROXY_HOPS` | `1` on Render (already in `api/render.yaml`). Without it every visitor shares the proxy's address, so one person's failed sign-ins could lock everyone out. |
| `API_COOKIE_SAMESITE` | `none` by default in production (web page and API on different sites). Use `lax` when both share one registrable domain; third-party cookies are being phased out by browsers. |

Everyone is signed out once when this version deploys (the cookie is now `__Host-study_library_session`, valid 7 days instead of 30). A signed-in session cannot be revoked one by one; rotating `SESSION_SECRET` ends them all.

### Root server settings

| Setting | Default | Purpose |
| --- | --- | --- |
| `SESSION_SECRET` (owner mode, production) | none | Now required, at least 32 bytes and not the access password. Before, it fell back to the password, which meant anyone who saw one cookie could guess the password offline. |
| `WEB_ORIGIN` | empty | Split deployments only: the one origin (https, no path) allowed to post to the practice runner. A wrong value stops the server at start-up. |
| `WATCH_ENCODER` | `x264` | Now read once in the configuration; any value other than `amf` means `x264`. |

### Limits an operator may notice

- An account can have **10 staged uploads** waiting for review; a staged upload nobody approves is deleted after **24 hours**. The hosted API allows 25 staged uploads in total.
- Saving (Markdown files, playlists, playback positions) is limited to **240 writes a minute per address**, and `POST /api/watch/rescan` to **6 a minute**. Reading and streaming are not counted.
- An upload whose first bytes do not match its extension (a `.pdf` that is HTML) is refused with `UPLOAD_CONTENT_MISMATCH`.
- The SQLite database file is created readable by its owner only on Linux and macOS. Windows ignores this; keep the `data/` folder out of shared locations.
- An unreadable `catalog.json` now answers with a generic message; the reason is in the server log (`Watch catalog problem: ...`).

### Still your decision

Every signed-in account in the root app can add files to the shared library through the staged upload review, because the library itself is shared. Keep sign-up closed in production (the default) or add a library-owner role first. The mobile release APK is signed with the public debug key and is for your own devices only; create a private keystore before giving it to anyone (`mobile apps\Cine Music Wave Mobile\OPERATIONS.md`).
