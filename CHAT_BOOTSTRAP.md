# Chat-Only Bootstrap Protocol

Use this protocol when the new machine is isolated and the new agent can receive only text pasted into chat. The new agent has no access to the original repository.

You will paste Markdown text only. Do not transfer `.ts`, `.tsx`, `.css`, `.json`,
`.jar`, source directories, archives, or generated dependencies. The source
bundles in this protocol contain those files as verbatim fenced text, and the
new agent creates the files locally.

## Message order

Paste these messages in this order:

1. This file: `CHAT_BOOTSTRAP.md`.
2. `REPLICATION_GUIDE.md`.
3. `REPLICATION_SOURCE_WEB.md`.
4. `REPLICATION_SOURCE_SERVER.md`.
5. `REPLICATION_SOURCE_API.md`.
6. `REPLICATION_SOURCE_ANDROID.md`.
7. `REPLICATION_SOURCE_DOCS.md`.

Paste one file per message. Do not paste all source bundles into one message. If a bundle is too large for the editor/chat limit, split it only between `## File: ...` sections and preserve every fenced code block exactly.

## First prompt to the new agent

Paste this before the files:

```text
You are bootstrapping Second Brain Study Library in a completely empty directory.
You do not have access to the original repository, machine, media, database, or
screenshots. I will paste a standalone guide and exact source bundles in several
messages. Do not invent files or implement anything yet.

For every message containing a bundle, reply only:
RECEIVED: <bundle name>
FILES: <number of File sections seen>
WAITING: yes

Do not summarize or rewrite bundle contents. Do not start from a template. After
all seven payloads are received, reply with:
READY: source payload complete
Then create every file from the exact fenced blocks, preserving paths, whitespace,
package versions, JSX, CSS, routes, and configuration. Run the documented
validation commands after writing the files. The source bundles are normative:
do not replace them with a scaffold, equivalent implementation, approximate CSS,
different component tree, or different API contract. Never add credentials,
fake media, private content, or unlicensed media.
```

## Source extraction rules

Every source bundle uses sections like:

```text
## File: src/App.tsx
```ts
<verbatim file content>
```
```

Create the target directory and write the fenced content exactly. The heading
path is the target path. Do not include the fence markers in the target file.
Use the bundle's language label only as documentation; do not transform code.

The correct extraction order is:

```text
Guide and bootstrap
    -> Web shell and package lock
    -> Root server, SQLite, seed script, schema
    -> Independent API and API lock
    -> Android wrapper
    -> Agent, operations, system design, README, feature log
```

## If chat context becomes limited

Do not claim completion after partial input. Ask the user to continue with the
next bundle or chunk. Keep a checkpoint listing:

```text
received: CHAT_BOOTSTRAP
received: REPLICATION_GUIDE
received: REPLICATION_SOURCE_WEB
received: REPLICATION_SOURCE_SERVER
received: REPLICATION_SOURCE_API
received: REPLICATION_SOURCE_ANDROID
received: REPLICATION_SOURCE_DOCS
```

If the chat platform starts a fresh context, paste this checkpoint and the
remaining bundles again. Never regenerate missing source from memory when an
exact bundle chunk is available.

## Secrets and personal content

Never paste `.env` files containing values, Supabase keys, passwords, session
secrets, AI keys, Android signing keys, personal Study files, personal Desktop
media, database dumps, or `data/study-library.sqlite`. The new agent creates
empty roots and uses synthetic fixtures for validation when real media is absent.

## Expected first run

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm build
WATCH_MEDIA_DIR="$HOME/Desktop" pnpm dev
```

Use `http://localhost:4444`. Keep ports `3000` and `8080` unused. Run the live
checks in `REPLICATION_GUIDE.md`, and report absent PDF/EPUB/audio/video fixtures
or unavailable browser automation honestly.
