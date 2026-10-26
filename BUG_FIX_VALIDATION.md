# Bug-fix validation — 2026-10-03

Fixed:
- Profile menu no longer prevents Escape inside profile/settings dialogs; native dialog cancel can close them.
- Upload deletion surfaces non-success responses and both UI cleanup callers catch failures.
- Closed upload dialogs, replaced uploads, and changed sessions ignore stale upload/commit responses.
- Library requests ignore older refreshes and responses belonging to a previous session.
- Account settings responses cannot apply preferences after a session changes.
- Expired library sessions clear library/content/upload state and learning account scope.
- Aborted document requests cannot replace current content.
- Watch displays sign-out/cleanup errors.
- Production start/serve use a portable Node launcher instead of POSIX environment assignments.

Validation:
- TypeScript client/server checks and lint pass.
- Production build passes; three existing bundle-size performance warnings remain.
- 23 authentication/API/DOM regression tests pass, including dialog Escape propagation and failed/204 upload deletion.
- 24 learning tests pass.
- Live signup/login/profile/session, Study/Watch API access, structured practice ownership, CSRF/private-file protection, and staged-upload ownership pass. Temporary accounts are removed.
- Production dependency audit reports no known vulnerabilities.
- Local app runs on loopback ports 4444 (web) and 4445 (API).

Limits:
- Browser automation is unavailable in this environment; DOM tests are not a visual or real-browser acceptance test.
- No real PDF/EPUB/audio/video fixtures or Android SDK verification were added.
- Google/Facebook/Microsoft registrations and email credentials are absent; live provider/email flows remain untested and unconfigured.
- Full dependency audit still reports development-only braces advisory GHSA-vfj7-8cjw-p6xm; GitHub lists no patched version as of this check. Development listeners remain loopback-only.
- These results establish the checks above, not an assurance that every possible defect has been eliminated.
