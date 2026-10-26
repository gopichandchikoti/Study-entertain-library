# Accounts and social sign-in setup

The supplied authentication blueprint is preserved in course-blueprints/AUTHENTICATION_PROFILE_ENHANCEMENT.md. This implementation extends the existing React/Webpack and Express app; it does not change the independent api/ service into an identity writer.

## Local start

Run pnpm install, then pnpm dev:local. If pnpm is missing, use npx --yes --package=pnpm@11 pnpm before the command. Open http://localhost:4444; the API listens on 4445. Both development listeners default to loopback. Open the configured origin, rather than switching between localhost and 127.0.0.1, because account writes enforce the exact Origin. In development the Webpack server now redirects the other loopback names (for example the http://127.0.0.1:4444 address it prints) to AUTH_PUBLIC_ORIGIN, and a rejected write names the address to open.

### If you are signed out or cannot sign in during development

Session cookies belong to one host name, so http://localhost:4444 and http://127.0.0.1:4444 do not share a sign-in. An account created on one looks missing or signed out on the other, and every sign-in there is rejected with a 403 before the password is checked. The accounts are still in SQLite. Open the exact AUTH_PUBLIC_ORIGIN.

Without AUTH_SESSION_SECRET the development server generates a new CSRF signing secret each time it restarts (tsx watch restarts on every saved server file). A tab left open across a restart used to fail every sign-in, sign-out and save with "Refresh the page and try again" until it was reloaded. The client now refreshes its token and retries once automatically. Sessions are stored in SQLite and survive restarts.

To check an account without printing secrets, open data/study-library.sqlite read-only and look at the users and auth_audit tables. A normal sign-in writes a signed_in audit event; a missing event after a failed attempt means the request was rejected before authentication (origin, CSRF, rate limit) or the credentials did not match.

### Google and Facebook, step by step

Both are free for sign-in. The adapters already request only the basic scopes (Google: openid email profile; Facebook: email,public_profile), which need no Google verification and no Facebook App Review. Create the registrations in your own accounts and put the values in the ignored .env file, never in chat or source. The same button signs in an existing linked account or creates a new one; there is no separate sign-up flow.

1. Copy .env.example to .env. Keep AUTH_PUBLIC_ORIGIN=http://localhost:4444 for local testing.
2. Google: in Google Cloud Console create a project, configure the OAuth consent screen (External; add your Google account as a test user while it is in Testing), then create an OAuth client of type Web application. Add the authorized redirect URI http://localhost:4444/api/auth/oauth/google/callback. Set GOOGLE_LOGIN_ENABLED=true, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REDIRECT_URI to that same URI. To let people other than test users sign in, publish the app; external production apps must link a homepage, privacy policy and terms of service.
3. Facebook: at developers.facebook.com create an app, add the Facebook Login product, and add the valid OAuth redirect URI http://localhost:4444/api/auth/oauth/facebook/callback (Meta allows localhost while the app is in Development mode, and then only for people with a role on the app). Set FACEBOOK_LOGIN_ENABLED=true, FACEBOOK_CLIENT_ID (the App ID), FACEBOOK_CLIENT_SECRET, FACEBOOK_REDIRECT_URI and FACEBOOK_GRAPH_VERSION (for example v23.0; use a version your dashboard lists as current). To go Live, Meta requires a privacy policy URL and data-deletion instructions or callback in the app settings, and an HTTPS redirect URI.
4. Restart pnpm dev:local and open http://localhost:4444. The provider buttons stop saying Not configured. Test success, denial (click Cancel at the provider), and a second sign-in with the same account.
5. For the public site, register a second redirect URI with the HTTPS origin and set AUTH_PUBLIC_ORIGIN and the redirect variables to it (see DEPLOYMENT_GUIDE.md).

Accounts are now required by default. Create an account using the sign-up form. Local email delivery is unavailable unless configured; the UI labels unverified email and unavailable recovery honestly. No fixture account or default password is shipped.

Copy .env.example to .env only when configuring the app. The development launcher and standalone server load .env without replacing already configured environment variables. .env is ignored, and no provider secret is embedded in Webpack constants. The example uses the generated study-content directory and same-origin API requests.

AUTH_MODE=owner explicitly selects the earlier shared owner-password gate and requires LIBRARY_ACCESS_PASSWORD. It does not create a user or provide profiles/social login. Account mode never accepts the old HMAC cookie as account identity.

## Stored data and password protection

The SQLite identity adapter adds separate users, auth_identities, auth_sessions, auth_tokens, auth_settings, auth_audit and auth_migrations tables to data/study-library.sqlite (or PERSONAL_DB_PATH). Catalog sync still modifies only catalog_items. No migration converts an owner password into an account.

Passwords use Node scrypt with a fresh 16-byte salt, N=131072, r=8, p=1 and a 32-byte derived hash. The encoded record includes parameters and salt. Passwords need 15–128 characters. At most two password derivations run simultaneously. Plain SHA-256 is not a password-storage algorithm; SHA-256 is used to hash unpredictable 256-bit session and recovery tokens.

Profiles store normalized email, ASCII username, names, validated international phone number, verification timestamps, sign-in identities and a private PNG avatar. Provider access/refresh tokens are discarded after validation. No provider password is received. Public session responses exclude hashes and provider tokens.

All members share this deployment's authorized Study/Watch library. Staged uploads belong to their uploader; another account cannot commit or discard them. Learning progress, bookmarks and completion are namespaced per account in this browser, and are not hosted cross-device state.

## Register and configure each provider

Create your own provider registrations. Never paste client secrets into chat, source files or client-side settings. Store them in the server environment or ignored .env file. Configure one provider at a time and test a complete success/denial/replay/callback flow before enabling it for public users.

Each enabled provider needs its LOGIN_ENABLED flag set to true, CLIENT_ID, CLIENT_SECRET, and an exact REDIRECT_URI. The configuration loader refuses incomplete or off-origin callbacks. In private development, unavailable provider buttons are disabled and labeled Not configured; production omits them.

| Provider | Required callback path | Additional choice |
| --- | --- | --- |
| Google | /api/auth/oauth/google/callback | Web OAuth client and consent screen |
| Microsoft | /api/auth/oauth/microsoft/callback | consumers or an explicit tenant GUID |
| Facebook | /api/auth/oauth/facebook/callback | Explicit supported FACEBOOK_GRAPH_VERSION from your Meta dashboard |

For local registration the callback begins with http://localhost:4444. A production callback begins with the chosen public HTTPS origin. Set AUTH_PUBLIC_ORIGIN to that exact origin. Provider dashboards decide whether localhost callbacks are accepted for your app type; use a registered HTTPS testing environment if needed.

Google: create a Web application OAuth client in Google Cloud, configure the consent screen/test audience, and register the callback exactly. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI and GOOGLE_LOGIN_ENABLED.

Microsoft: register a Web app in Microsoft Entra, choose the supported account audience, add the callback, and create a server-side credential. Set MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_REDIRECT_URI, MICROSOFT_TENANT_ID and MICROSOFT_LOGIN_ENABLED. This first adapter deliberately supports consumers or one tenant GUID. common/organizations are rejected because their variable issuer policy requires additional validation. Some Microsoft accounts supply no email claim; new-account creation then fails honestly. A signed-in existing user can link the verified provider subject instead.

Facebook: register a Meta app with the appropriate Facebook Login product, exact valid OAuth redirect, required domains and dashboard policy URLs. Set FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_REDIRECT_URI, FACEBOOK_GRAPH_VERSION and FACEBOOK_LOGIN_ENABLED. Confirm the version and app-review requirements in the current dashboard. The adapter uses authorization-code exchange, app-bound token introspection, subject matching, expiry checks and appsecret_proof. Graph email is not treated as a verified email address.

Google/Microsoft use server-side authorization-code flow with PKCE and signed OIDC token verification through jose. Issuer, audience, signature, expiry, issued-at, nonce and Microsoft tenant are checked. Facebook uses an opaque token, so authoritative token introspection replaces OIDC signature/issuer validation. All three flows use an expiring single-use server state and an HttpOnly browser-binding cookie. The server returns an allowlisted authorization URL from /api/auth/oauth/:provider/start; the browser then navigates there. GET is retained for header-authenticated clients; the web UI uses POST so Origin and CSRF checks apply.

A provider subject returns its linked account. Matching email never silently merges accounts, whether verified or not. Sign in to the existing account and explicitly Link from My profile after a recent sign-in. A provider-only account cannot remove its last sign-in method. Unlinking revokes all sessions.

## Email verification and reset

The optional email adapter uses Resend through the server. Configure RESEND_API_KEY and an authorized AUTH_EMAIL_FROM sender. No email is sent during the test suite or live fixture check. Delivery quotas, domain verification and provider costs are deployment concerns.

Verification links expire in 24 hours; password reset links expire in 30 minutes. Only token hashes are stored; consumption is transactional and single-use. Links put the raw recovery token in a fragment that the account view removes from browser history. Tokens are never returned through the forgot-password response or logged. Reset requests return the same message for unknown/eligible accounts, with bounded background delivery. A global delivery failure can be silent in that generic reset response; signup reports delivery failure separately.

When email delivery is configured, sensitive account actions and shared-library writes require verified email. Offline local mode permits local account use while explicitly retaining unverified status. No email change or OTP delivery is implemented.

## Production and operations

Production requires HTTPS, AUTH_PUBLIC_ORIGIN and a server-only AUTH_SESSION_SECRET of at least 32 random bytes. The server refuses insecure production requests other than health checks. For a reverse proxy, set AUTH_TRUST_PROXY to its exact trusted IP/CIDR or loopback; hop-count trust is rejected. The proxy must overwrite forwarded headers, and the backend must not be publicly reachable around it.

The installed identity writer is SQLite only. Production startup refuses account mode unless AUTH_ALLOW_PERSISTENT_SQLITE=true acknowledges a durable, single-instance deployment. PostgreSQL/Supabase identity adapters are not installed; unsupported identity store names fail closed. Supabase content storage can coexist with this single identity writer, but an ephemeral hosted filesystem cannot hold identities. Do not deploy multiple app replicas against this SQLite file. Preserve the prior PostgreSQL architecture decision for a future hosted adapter.

Production signup is closed unless AUTH_SIGNUP_ENABLED=true is deliberately configured. Open signup grants access to this deployment's shared library, so choose the audience before enabling it.

Session cookies are HttpOnly, SameSite=Lax, host-only, and Secure in production. Sessions expire after 12 hours idle or seven days absolute. CSRF uses a signed HttpOnly cookie plus the response-provided request token and exact Origin checks. Login has IP rate limits and a bounded progressive delay after repeated failure. Password change, reset, unlink and sign-out-all revoke sessions. Audit records contain event names, user IDs and times, not passwords, tokens or profile contents. Expired records are removed hourly and audits after 90 days.

Avatar upload accepts only static, non-interlaced 8-bit PNG, 16–512 pixels per side, at most 512 KB. Chunk structure, dimensions and CRCs are checked before/while bounded decoding; output is re-encoded and stored privately in the database. SVG/HTML/XML library responses receive a sandbox CSP to prevent active uploaded documents from acting as the application. Hidden/ignored paths and symlinks escaping the content root are refused. Backup and protect the SQLite database with appropriate filesystem access controls; it contains personal information.

Before rotating AUTH_SESSION_SECRET, stop the service, revoke active sessions (the token hashes are independent of the CSRF signing secret), replace the environment secret and restart. Rotate provider secrets in their dashboards, update the server and test callbacks again. Back up SQLite with its backup API or while stopped, including a consistent WAL checkpoint; protect backups and test restoration. Do not print database hashes or link tokens while diagnosing errors.

Account export/deletion require current password, or a provider sign-in within five minutes, plus typed username confirmation. Server export includes profile, settings and safe audit/identity metadata. Browser progress is outside that server export. Account deletion removes DB identities, sessions, settings and avatar; anonymous event records remain until audit retention expires. Shared library documents remain.

## Checks and known limitations

Run pnpm test:auth, pnpm test:learning, pnpm typecheck, pnpm lint and pnpm build. With the app already running locally, pnpm test:auth:live creates temporary synthetic accounts/uploads, checks authorization and deletes them.

See AUTH_VALIDATION.md for actual results. Real social-provider callbacks, email delivery, rendered screenshots, mobile layout and reduced-motion browser behavior have not been tested in this environment because no registered credentials, sender or connected browser were supplied. Tests establish specific boundaries; they do not prove the absence of every vulnerability.

The production dependency audit is clean after overriding EPUB's @xmldom/xmldom to 0.8.15. The full audit retains one unpatched development-only braces advisory in the Webpack toolchain. Keep development listeners local and do not let request data become glob configuration. Audit reports are not suppressed.

## Official references checked

Checked during 2026-10-02–03 against selected jose 6.2.12, pngjs 7.0.0, libphonenumber-js 1.13.14 and @xmldom/xmldom 0.8.15.

- [Google OIDC](https://developers.google.com/identity/openid-connect/openid-connect)
- [Microsoft OIDC](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc)
- [Meta manual flow](https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow/) and [Meta security](https://developers.facebook.com/docs/facebook-login/security/): retrieval returned HTTP 429 here; dashboard validation and live acceptance remain required.
- [Node 22 crypto](https://nodejs.org/docs/latest-v22.x/api/crypto.html)
- [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [jose](https://github.com/panva/jose)
- [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)
- [XML parser security release](https://github.com/xmldom/xmldom/releases/tag/0.8.15)
- [Unpatched braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
