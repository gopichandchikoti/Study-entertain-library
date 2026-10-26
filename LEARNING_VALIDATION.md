# Learning implementation validation

Validated on 2026-10-02 in the supplied Windows workspace.

## Delivered

- Seven courses follow the supplied filename manifests: 172 required Markdown files, 85 local SVG diagrams, 158 lessons, and 790 quiz questions.
- Original attachments are preserved in `course-blueprints/`. Course content is in `study-content/`; authoring inputs and the reproducible generator are in `course-authoring/` and `scripts/generate-study-courses.mjs`.
- The existing Study reader supports read confirmation, five-question assignments, an 80% pass gate, feedback and section review, retry with best-score preservation, CodeMirror practical editing, result review, and gated Next navigation.
- Progress persists in this browser's local storage. Hosted cross-device progress is not implemented.
- The practice API supports bounded JSON/text validation, queued results, cancellation, ownership, expiry, concurrency and rate limits. It does not execute submitted code.

## Checks

- Dependency installation completed with pnpm 11; lifecycle scripts stayed disabled.
- Root typecheck, lint, and production build passed. Webpack reports bundle-size warnings.
- All 24 learning parser, scoring, policy, component, and DOM workflow tests passed.
- Course validation passed: all required files, internal links, section references, exercise IDs, five-question schemas, SVG safety checks, and A-to-Z indexes.
- Node study-notes example: two tests passed, including HTTP CRUD and failure cases.
- Java study-notes example: compiled with Java 17 target and ran successfully.
- Spring Boot study-notes example: Gradle 8.9 test and build passed using Java 17. Gradle reports deprecations before upgrading to version 9.
- MCP safe-adapter and system-design failure simulation examples ran successfully.
- Live UI on http://localhost:4444 returned 200; the library API on http://localhost:4445 returned the generated library.
- The Watch `/api/media` endpoint returned successfully with an empty media list; no playback fixture was available.
- A live structured practical returned 202 then completed with three passing checks. An unknown challenge returned 404; an untrusted Origin returned 403.

## Available and unavailable fixtures

The local app is started with `pnpm dev:local` on ports 4444 and 4445. It uses `study-content/` and the existing local Watch data directory.

Python is not installed, so the pinned FastAPI example and its tests could not run here. No browser is connected to the in-app browser tool: DOM workflow tests passed, but rendered screenshots and real-browser accessibility testing remain unavailable. Submitted Java/Python/JavaScript/TypeScript code Run is intentionally unavailable until an isolated worker is supplied; those practicals cannot unlock Next through execution here.

No original TM Schedule repository or authoritative endpoint specification was provided. Its course case studies are explicitly illustrative. The MCP example validates adapter inputs; it is not a complete MCP wire-protocol server. Spring's example is a working vertical slice, with later exercises describing production extensions.

No private content, secrets, media fixtures, or unlicensed media were added. PDF, EPUB, audio, and video playback were not validated with actual media fixtures. Android was not changed or rebuilt as part of this learning enhancement.

Structured exercises use an explicit field/keyword rubric, not semantic grading. Source validation does not establish the pedagogical completeness of every generated lesson or the visual quality of every diagram.
