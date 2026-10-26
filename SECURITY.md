# Security policy

## Reporting a vulnerability

Please report a security problem privately to the repository owner. When this repository is on GitHub, use **Report a
vulnerability** under the Security tab (private vulnerability reporting); otherwise contact the owner directly. Do not open a
public issue or post details until the problem is fixed. Say what you found, how to reproduce it, and what it lets someone do.

Only the current `main` branch is supported. There are no older supported versions.

## What this project protects

The Study Library keeps accounts and password hashes, each person's Markdown notes, playlists and progress, a shared study
library with an upload review step, and read-only access to the owner's Watch and Music media. A separate hosted API
(`api/`) serves the library from Supabase Storage and PostgreSQL behind one shared password. The secrets that matter are the
Supabase service-role key, the session and signing secrets, the catalog sync token, and any e-mail or AI key. They live in
server environment variables only.

## What is in place

The controls are written in [`AGENTS.md`](AGENTS.md) (Section 3, SEC-01 to SEC-52) and described as a design in
[`system_design.md`](system_design.md) ("Security Model"). In short: passwords are hashed with scrypt and checked against a
policy; sessions are server-side, `HttpOnly` and `Secure` in production; every write checks its origin and a CSRF token;
CORS allows one origin; uploads are staged, size- and content-checked, capped, expire, and are served by extension-derived type
with active documents sandboxed; errors never show paths, providers or keys; rate limits cover the API, sign-in, uploads, saving
and scans; outbound calls have timeouts; the database has row-level security and a private bucket; the hosted API refuses to
start in production without its secrets. [`SECURITY_VALIDATION.md`](SECURITY_VALIDATION.md) lists every finding, fix and proof.

## How to check it yourself

```
pnpm check
pnpm test:security && pnpm test:server && pnpm test:auth
pnpm build && pnpm test:build
pnpm audit:standards
pnpm deps:audit
cd api && pnpm typecheck && pnpm lint && pnpm test && pnpm deps:audit
```

`pnpm audit:standards` fails on a tracked secret, debug code, unsafe APIs, a reply that echoes a raw error, an open CORS origin
and the other rules listed in `AGENTS.md` 7.2. Never run an automated attack tool (such as Strix) against anything but your own
running copy with throw-away data and the owner's permission.

## Known limits

No automated penetration test has been run. The hosted API has one shared password and no per-person sessions. Every signed-in
account in the root app can approve an upload into the shared library; production sign-up is closed by default. There is no
breached-password lookup. The full list, with the reasons, is in `SECURITY_VALIDATION.md` ("Not fixed, and why").
