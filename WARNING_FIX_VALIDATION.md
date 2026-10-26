# Warning fixes — 2026-10-03

## Fixed

- Webpack now reads the explicit CLI mode. Previously, `webpack --mode production` minimized code while the configuration still selected development eval source maps and unhashed filenames when NODE_ENV was absent.
- Production uses separate source maps, hashed filenames, and production HTML processing. This removes the development eval wrapper that could violate the production CSP.
- App, Watch, EPUB support, and the practical editor load through async boundaries. Existing UI, routes, package dependencies, and CSS are preserved.
- Vendor chunks have a 200,000-byte splitting target. Existing production warning limits remain enabled and unchanged.
- Development builds do not apply production performance budgets to debugging bundles; production build and artifact-budget regression tests enforce those budgets.
- The lazy entry component lives in AppLoader.tsx, resolving the fast-refresh lint warning.
- EPUB page actions retain their rendition receiver, and pending imports ignore disposed readers.

## Verification

- Production build: zero Webpack warnings.
- Initial production scripts: approximately 223 KiB, previously 11.5 MiB.
- Largest generated JavaScript asset: 203,113 bytes, below the existing 250,000-byte limit.
- TypeScript checks and lint pass; lint emits no warnings.
- 2 production configuration/artifact tests, 24 learning tests, and 23 authentication tests pass.
- Live account/Study/Watch/practice/upload-security smoke checks pass after restarting the app.
- Production dependency audit: no known vulnerabilities.
- Local app running on loopback ports 4444 and 4445.

## Still unavailable or unresolved

- Integrated browser selection failed twice with `Browser is not available: iab`; discovery returned an empty list. No shared-browser console or visual checks were possible. Browser reconnection or pasted console messages are needed to inspect additional browser warnings.
- Installed Node v22.13.1 emits an intrinsic ExperimentalWarning for node:sqlite. It was not suppressed and the database implementation was not replaced merely to hide it. Node documents that SQLite remains experimental in this runtime: https://nodejs.org/docs/latest-v22.x/api/sqlite.html .
- Development-only braces advisory GHSA-vfj7-8cjw-p6xm remains without an upstream patched version; production dependencies are unaffected. https://github.com/advisories/GHSA-vfj7-8cjw-p6xm .
- OAuth/email credentials, real media fixtures, and Android SDK remain unavailable as previously documented.
