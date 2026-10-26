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

Interface text is authored in [`src/content.model.json`](src/content.model.json).
Keep its keys stable and translate its values to change the interface language.
Set `locale` to a valid BCP 47 language tag and `direction` to `ltr` or `rtl`;
restart development or rebuild after editing the model. Named placeholders such
as `{value0}` must be preserved, but may be moved within a sentence. Date and
number formatting follows the model locale. Count forms currently support
`one` and `other`; languages with additional plural categories need expanded
forms and selection logic. There is no runtime language picker yet.

Course documents, uploaded files, media/subtitles, provider responses and server
messages remain owned by their respective sources; the model does not translate
that external content. Protocol identifiers, storage keys and code samples are
not interface translations.

The supplied synthetic courses listed in `course-authoring/course-manifest.json`
belong with the application source. Keep additional personal study material out
of Git and set `STUDY_CONTENT_DIR` to that authorized content folder when needed.
Secrets, databases, build output and dependency directories are excluded by
`.gitignore`.

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

The full architecture and free-host limitations are in [system_design.md](system_design.md). Operational details are in [OPERATIONS.md](OPERATIONS.md).

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


## Supplied course blueprints and interactive learning

The seven supplied courses are available in [study-content](study-content/README.md). Start the local course library with `pnpm dev:local`; Study runs at http://localhost:4444 and the API at http://localhost:4445. If pnpm is not installed, use `npx --yes --package=pnpm@11 pnpm dev:local`.

Run `pnpm courses:validate` and `pnpm test:learning` to check content and learning behavior. Regenerate course files with `pnpm courses:generate` after editing the authoring inputs. Regeneration overwrites generated lesson files.

See [LEARNING_VALIDATION.md](LEARNING_VALIDATION.md) for completed checks and unavailable fixtures, including Python, browser automation, and isolated code execution.


## Accounts and social sign-in

The app now requires an account by default. Start `pnpm dev:local` and open http://localhost:4444 to create an account. Profiles and hashed credentials live in the ignored local SQLite database. Google, Microsoft and Facebook sign-in require registered server-side provider configuration; no fake provider login is enabled.

Read [AUTH_SETUP.md](AUTH_SETUP.md) for provider callbacks, email delivery, owner-mode migration and production storage/TLS requirements. [AUTH_VALIDATION.md](AUTH_VALIDATION.md) records tests and remaining security/runtime limits. Use `pnpm test:auth` and, with the app running, `pnpm test:auth:live`.


## Guest mode and Markdown preview

The sign-in screen has **Continue as guest**. Guests see the app's features and a live Markdown editor: write on the left, read the rendered page on the right, with **Scroll sync**, a light/dark toggle and a draggable divider (50/50 by default). Signed-in users get a **Markdown** button in the top bar and can save, rename and reopen their files, named "Untitled 1", "Untitled 2" and so on by default. Saved files live in the account SQLite database, so back it up with `pnpm db:backup`. Run `pnpm test:markdown` to check it. Full documentation is in [APP_DOCUMENTATION.md](APP_DOCUMENTATION.md), and hosting steps are in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## Security

The security policy is [`SECURITY.md`](SECURITY.md), the design record is the "Security Model" in [`system_design.md`](system_design.md), and the evidence (findings, fixes, proof, limits and what was not covered) is [`SECURITY_VALIDATION.md`](SECURITY_VALIDATION.md). The rules every change must meet are in [`AGENTS.md`](AGENTS.md) (Section 3, SEC-01 to SEC-52; Section 13 for audits).

```powershell
pnpm check                      # typecheck, lint, format
pnpm test:security              # attack tests against the running app (also test:server, test:auth)
pnpm audit:standards            # secrets, unsafe APIs, missing timeouts, error echoes, docs, .gitignore, Android settings
pnpm deps:audit                 # advisories for production dependencies
cd api; pnpm typecheck; pnpm lint; pnpm test; pnpm deps:audit    # the hosted API
```

The hosted API (`api/`) refuses to start in production without `LIBRARY_ACCESS_PASSWORD`, a separate 32-byte `SESSION_SECRET` and an https `WEB_ORIGIN`; see `OPERATIONS.md` ("Security hardening update") before deploying it.

## Publication rules

Maintainer feature logs stay local and are excluded from source control. Do not
force-add or publish them. Enable the repository's push guard after cloning:

```sh
git config core.hooksPath .githooks
```

Run `node --test scripts/publish-guard.checks.mjs` to verify the guard. It checks
the complete history being pushed, including files deleted by later commits.
