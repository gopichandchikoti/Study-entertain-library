# Exact Independent API Source Bundle

This file is a generated exact source bundle. Create each target path and copy the corresponding fenced block verbatim. Do not redesign or paraphrase these files during exact replication.

Generated from the current project on 2026-09-30T22:23:55.563Z.

## File: api/README.md

````md
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
- Provides optional shared-password sessions for the private MVP.

The API does not put book bytes in PostgreSQL. It stores only metadata and relative Storage paths.

## Setup

Run `supabase/schema.sql` in the Supabase SQL editor, copy `.env.example` to `.env`, then install and build:

```bash
pnpm install
pnpm catalog:sync
pnpm dev
```

The default port is `4450`. The Webpack web app can point at it with `API_ORIGIN=http://localhost:4450`.

For a hosted service, set `WEB_ORIGIN` to the deployed web URL and keep `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`, and `CATALOG_SYNC_TOKEN` server-side. Deploy this directory as its own Render service with `pnpm install --frozen-lockfile && pnpm build` and `pnpm start`.

## Catalog sync

The sync command is safe to repeat. It lists supported objects in the private bucket and upserts their metadata into `library_items`:

```bash
pnpm catalog:sync
curl -X POST -H "x-catalog-sync-token: $CATALOG_SYNC_TOKEN" http://localhost:4450/api/catalog/sync
```

A future worker can run the same sync after seed, upload commit, or on a schedule. The current web server remains available for local filesystem mode and backward compatibility.

## API routes

- `GET /api/health`
- `GET /api/auth/session`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/library?limit=...&offset=...&q=...&category=...`
- `GET /api/content?path=...`
- `GET /api/asset?path=...`
- `GET /api/file?path=...`
- `POST /api/uploads`
- `POST /api/uploads/:id/commit`
- `DELETE /api/uploads/:id`
- `POST /api/ebooks`
- `POST /api/catalog/sync` with `x-catalog-sync-token`

All file paths are relative, validated, and resolved through a private Storage bucket. The API is REST by design; GraphQL is not required for this reading and streaming workload.
````

## File: api/package.json

````json
{
  "name": "study-library-api",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "oxlint .",
    "catalog:sync": "tsx src/sync.ts"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.117.2",
    "express": "^5.2.1",
    "jszip": "^3.10.2",
    "marked": "^18.0.14",
    "multer": "^2.4.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.6",
    "@types/multer": "^2.2.0",
    "@types/node": "^24.13.3",
    "oxlint": "^1.81.0",
    "tsx": "^4.23.15",
    "typescript": "~6.0.2"
  }
}
````

## File: api/pnpm-lock.yaml

````yaml
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    dependencies:
      '@supabase/supabase-js':
        specifier: ^2.117.2
        version: 2.117.2
      express:
        specifier: ^5.2.1
        version: 5.2.1
      jszip:
        specifier: ^3.10.2
        version: 3.10.2
      marked:
        specifier: ^18.0.14
        version: 18.0.14
      multer:
        specifier: ^2.4.0
        version: 2.4.0
    devDependencies:
      '@types/express':
        specifier: ^5.0.6
        version: 5.0.6
      '@types/multer':
        specifier: ^2.2.0
        version: 2.2.0
      '@types/node':
        specifier: ^24.13.3
        version: 24.19.0
      oxlint:
        specifier: ^1.81.0
        version: 1.85.0
      tsx:
        specifier: ^4.23.15
        version: 4.23.15
      typescript:
        specifier: ~6.0.2
        version: 6.0.3

packages:

  '@esbuild/aix-ppc64@0.28.2':
    resolution: {integrity: sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==}
    engines: {node: '>=18'}
    cpu: [ppc64]
    os: [aix]

  '@esbuild/android-arm64@0.28.2':
    resolution: {integrity: sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [android]

  '@esbuild/android-arm@0.28.2':
    resolution: {integrity: sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==}
    engines: {node: '>=18'}
    cpu: [arm]
    os: [android]

  '@esbuild/android-x64@0.28.2':
    resolution: {integrity: sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [android]

  '@esbuild/darwin-arm64@0.28.2':
    resolution: {integrity: sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [darwin]

  '@esbuild/darwin-x64@0.28.2':
    resolution: {integrity: sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [darwin]

  '@esbuild/freebsd-arm64@0.28.2':
    resolution: {integrity: sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [freebsd]

  '@esbuild/freebsd-x64@0.28.2':
    resolution: {integrity: sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [freebsd]

  '@esbuild/linux-arm64@0.28.2':
    resolution: {integrity: sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [linux]

  '@esbuild/linux-arm@0.28.2':
    resolution: {integrity: sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==}
    engines: {node: '>=18'}
    cpu: [arm]
    os: [linux]

  '@esbuild/linux-ia32@0.28.2':
    resolution: {integrity: sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==}
    engines: {node: '>=18'}
    cpu: [ia32]
    os: [linux]

  '@esbuild/linux-loong64@0.28.2':
    resolution: {integrity: sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==}
    engines: {node: '>=18'}
    cpu: [loong64]
    os: [linux]

  '@esbuild/linux-mips64el@0.28.2':
    resolution: {integrity: sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==}
    engines: {node: '>=18'}
    cpu: [mips64el]
    os: [linux]

  '@esbuild/linux-ppc64@0.28.2':
    resolution: {integrity: sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==}
    engines: {node: '>=18'}
    cpu: [ppc64]
    os: [linux]

  '@esbuild/linux-riscv64@0.28.2':
    resolution: {integrity: sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==}
    engines: {node: '>=18'}
    cpu: [riscv64]
    os: [linux]

  '@esbuild/linux-s390x@0.28.2':
    resolution: {integrity: sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==}
    engines: {node: '>=18'}
    cpu: [s390x]
    os: [linux]

  '@esbuild/linux-x64@0.28.2':
    resolution: {integrity: sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [linux]

  '@esbuild/netbsd-arm64@0.28.2':
    resolution: {integrity: sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [netbsd]

  '@esbuild/netbsd-x64@0.28.2':
    resolution: {integrity: sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [netbsd]

  '@esbuild/openbsd-arm64@0.28.2':
    resolution: {integrity: sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [openbsd]

  '@esbuild/openbsd-x64@0.28.2':
    resolution: {integrity: sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [openbsd]

  '@esbuild/openharmony-arm64@0.28.2':
    resolution: {integrity: sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [openharmony]

  '@esbuild/sunos-x64@0.28.2':
    resolution: {integrity: sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [sunos]

  '@esbuild/win32-arm64@0.28.2':
    resolution: {integrity: sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==}
    engines: {node: '>=18'}
    cpu: [arm64]
    os: [win32]

  '@esbuild/win32-ia32@0.28.2':
    resolution: {integrity: sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==}
    engines: {node: '>=18'}
    cpu: [ia32]
    os: [win32]

  '@esbuild/win32-x64@0.28.2':
    resolution: {integrity: sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==}
    engines: {node: '>=18'}
    cpu: [x64]
    os: [win32]

  '@oxlint/binding-android-arm-eabi@1.85.0':
    resolution: {integrity: sha512-q2KO/Zso9UT+OMn0NF9ywn4E4t0MI3yxiDhNyhsQ7DyQJrC4FhFE4TXOi4bktFnOWXTMds8qZSbpv2XwRaNOBg==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm]
    os: [android]

  '@oxlint/binding-android-arm64@1.85.0':
    resolution: {integrity: sha512-SxLN3ALjoT9NNdvpjEevGeHvfzTAFrF0NBYB5tzK7/GtCKMze3j1e/m/X2ozqGj2U9hfGG/dg/OG8vpVK4PiDA==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [android]

  '@oxlint/binding-darwin-arm64@1.85.0':
    resolution: {integrity: sha512-Y/Sup/J4f0f9UGsSd/xyCNTeWL+gepO63GBdEDAfue9nBsnk9zMmnIXx1O6b1V8C90vB5nucYNZ0pbMXAp8zJA==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [darwin]

  '@oxlint/binding-darwin-x64@1.85.0':
    resolution: {integrity: sha512-ApOSNC04ynpDTwvBD+//0wyfODRSbEzvRoKpX8teffmc27z8AockwSNeMXGJXn5KP85eahDgR/2llICWLkzcnw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [x64]
    os: [darwin]

  '@oxlint/binding-freebsd-x64@1.85.0':
    resolution: {integrity: sha512-bNrVrCOA/kHky3Tu79IXWXe5bhIgLXfUuUEDHlAGOHUk96MkvDZ1ecaQF19rwstrnaqfP1o9nBTqzIr9+ZHkUg==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [x64]
    os: [freebsd]

  '@oxlint/binding-linux-arm-gnueabihf@1.85.0':
    resolution: {integrity: sha512-NUrzOJ1s/EqsVvfn2L/1D8Wro2LPIZUbihL8kOJLh5fEdGEN3rdOGUYq3HwnUIL8sjpoP+4N6RaGrgmMJnaMPw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm]
    os: [linux]

  '@oxlint/binding-linux-arm-musleabihf@1.85.0':
    resolution: {integrity: sha512-UJXrAT3E/RWkEqXLIs2ehETja1qfgkPb+5gwLIIS+o/6cf+grHvoOXTa5997a/YNQfcJS0DRBTOfZt95cvOI1g==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm]
    os: [linux]

  '@oxlint/binding-linux-arm64-gnu@1.85.0':
    resolution: {integrity: sha512-lK40QLjI0HxigO7CjDDshEtfYIeiYS0020v5BHFPqN4uuQBQxd2K9LNom2dW15o9F1937quSCRVp4ZsVhdbYdg==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [linux]
    libc: [glibc]

  '@oxlint/binding-linux-arm64-musl@1.85.0':
    resolution: {integrity: sha512-c2zbdBwGKreHXwRx3gWBuFGJxLhxgsg6YlZ+3H+RgRusU/UEV9jNwJ3HGYK+nRo0LvBa7mt6Kj86xoVotUo8cw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [linux]
    libc: [musl]

  '@oxlint/binding-linux-ppc64-gnu@1.85.0':
    resolution: {integrity: sha512-tlt/Hy8lZ97/lCPmCgw/B3k/mwh+BzaIPbPkldZEly7TwLmx0xe2CQcaW2g/rR0dOgS9JNGCZsMEqLhUNMGvaw==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [ppc64]
    os: [linux]
    libc: [glibc]

  '@oxlint/binding-linux-riscv64-gnu@1.85.0':
    resolution: {integrity: sha512-3tNR9Xey82X0zKuY1d8hJ6Rc9gwRDurmqGLnQZa5xqOXy8/YyiqFXjAtugkKLY82obOlpK1eSiDRlgcNPuxtIg==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [riscv64]
    os: [linux]
    libc: [glibc]

  '@oxlint/binding-linux-riscv64-musl@1.85.0':
    resolution: {integrity: sha512-wbGRd5PqCcjkJFHhZuZ2OBSUQY9czlQsoA/cQQB9JK/L9mC5MQgGoKAh+xd8QjA5V+0D3j+Qd1lAWn1I8zlelA==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [riscv64]
    os: [linux]
    libc: [musl]

  '@oxlint/binding-linux-s390x-gnu@1.85.0':
    resolution: {integrity: sha512-3Sn0kSrE4DPZCWV/8o+n4x3aFZxI9ulMnkYlwCbJ8eUVkwRK2IerohE/A/z3SNbCwoPFOCJmGE5Avrq0rrvdvQ==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [s390x]
    os: [linux]
    libc: [glibc]

  '@oxlint/binding-linux-x64-gnu@1.85.0':
    resolution: {integrity: sha512-JY2pxxYfB62bAGfejljVCqc44etItehPuAyaeSAdMuEMtwNA00ggMnS66lC1oIhos6oOXUkuU6mZ9bpFh3BqWg==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [x64]
    os: [linux]
    libc: [glibc]

  '@oxlint/binding-linux-x64-musl@1.85.0':
    resolution: {integrity: sha512-5k74vZ6qJBjBHEOlBk9B/iv68Yu0F1Afw/vvT2ar6OGCqEeXLaSjXz2n/IPCbhLG22UoKoYEJTzpYraRdcp6PA==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [x64]
    os: [linux]
    libc: [musl]

  '@oxlint/binding-openharmony-arm64@1.85.0':
    resolution: {integrity: sha512-GbAl5qt5TCkPLXTaIISZJnugrcBhra6rodcXc9jYt620UtdsTt71NlNmJmm0frxzFpd54x/G+MkitEJA8I/BoA==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [openharmony]

  '@oxlint/binding-win32-arm64-msvc@1.85.0':
    resolution: {integrity: sha512-kjmws5MK0et2swk4ND85D7NVQyDHw162i6whtZDLUA/lo6FQyBZDcmMRCMcVZcNrAhIaftVb00x9ChGDOjjNJA==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [arm64]
    os: [win32]

  '@oxlint/binding-win32-ia32-msvc@1.85.0':
    resolution: {integrity: sha512-eSsIJx9n4yxvOqYTZyPEMyEXRmE60XH7xGAU7i0Qbsn1lf6Za3CWJ9aRd82oSFKXaxhp+sA6/yMJVRIpLpna6A==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [ia32]
    os: [win32]

  '@oxlint/binding-win32-x64-msvc@1.85.0':
    resolution: {integrity: sha512-pBebIPUpKKhWrhSMWhy8TdAZBewiXnfxmaAGxhzxM1068GagqFaTwgKlU6e+UyJ2sPR+VoHouhXuGJkQjsrDvA==}
    engines: {node: ^20.19.0 || >=22.12.0}
    cpu: [x64]
    os: [win32]

  '@supabase/auth-js@2.117.2':
    resolution: {integrity: sha512-Z3WnGwrphYZubrLbxp5Iv0tLA9A5GhvKzJ/ZXglxqwd2QEH2R4dXRltjVJ8sIn4xEW2BSFIGT0yALVJIgZeDYw==}
    engines: {node: '>=22.0.0'}

  '@supabase/functions-js@2.117.2':
    resolution: {integrity: sha512-6DT4ZIjmZxa9ANKaBIrjc86AyKrX8M376ynvNeOBBVad3eP7x3UHqWfDR2ynFkHGzCuOpr1A+kObmnahxuwuog==}
    engines: {node: '>=22.0.0'}

  '@supabase/phoenix@0.4.5':
    resolution: {integrity: sha512-aAn9H9ovVyeApKy11OWOrrOGq8DV68yWeH4ud2lN9fzn4aO8Zb5GLL9m1pUg9nLqIcT+ZDfAcsZe0E/nqdv2lw==}

  '@supabase/postgrest-js@2.117.2':
    resolution: {integrity: sha512-V1Qhn+M8xzJqCasOxHZ2KG19Fj39PxU7weEAmOK65/KTsWCRXboB4hcQwFvxRvM7ZikeP9IZWNvQkfjvSxzYFw==}
    engines: {node: '>=22.0.0'}

  '@supabase/realtime-js@2.117.2':
    resolution: {integrity: sha512-lYXSAIg3eAKA58riUED6Vb+TCzF8jtx18uOoiCaVJ7ZMre6FWBpwB1MPeW+B6vykJT/hPdiuqwcSB7ILMS21ew==}
    engines: {node: '>=22.0.0'}

  '@supabase/storage-js@2.117.2':
    resolution: {integrity: sha512-8gAJoVaxZa/War2kFRfJMxGk4M190Q7lJ70BofwGlRxU/u9pIodd6XyTvmXkxOKXWuIYtkDaYPZrIAUt1T/7FQ==}
    engines: {node: '>=22.0.0'}

  '@supabase/supabase-js@2.117.2':
    resolution: {integrity: sha512-eSG2VKnHR+Clp1PmidZ1/weJ8PJwoybjva3L2GgKqFG4YDS1Iqmc61psKGZP5xw6OMT2O7ZorPR42PY6q1BOXg==}
    engines: {node: '>=22.0.0'}
    peerDependencies:
      '@opentelemetry/api': '>=1.0.0'
    peerDependenciesMeta:
      '@opentelemetry/api':
        optional: true

  '@types/body-parser@1.19.6':
    resolution: {integrity: sha512-HLFeCYgz89uk22N5Qg3dvGvsv46B8GLvKKo1zKG4NybA8U2DiEO3w9lqGg29t/tfLRJpJ6iQxnVw4OnB7MoM9g==}

  '@types/connect@3.4.38':
    resolution: {integrity: sha512-K6uROf1LD88uDQqJCktA4yzL1YYAK6NgfsI0v/mTgyPKWsX1CnJ0XPSDhViejru1GcRkLWb8RlzFYJRqGUbaug==}

  '@types/express-serve-static-core@5.1.3':
    resolution: {integrity: sha512-dPfW8NFiOF4wOHc7+N/QSxlY9cfSsenewGbAz8C8U/MULPd/YZ27LvJUIlzaXie7e6Ove9YunJGgC9tbHD2cKw==}

  '@types/express@5.0.6':
    resolution: {integrity: sha512-sKYVuV7Sv9fbPIt/442koC7+IIwK5olP1KWeD88e/idgoJqDm3JV/YUiPwkoKK92ylff2MGxSz1CSjsXelx0YA==}

  '@types/http-errors@2.0.5':
    resolution: {integrity: sha512-r8Tayk8HJnX0FztbZN7oVqGccWgw98T/0neJphO91KkmOzug1KkofZURD4UaD5uH8AqcFLfdPErnBod0u71/qg==}

  '@types/multer@2.2.0':
    resolution: {integrity: sha512-3U1troeqGV8Ntp7Q3klwf4zr23VEoqYVocYXaswm9+8z3O9UHDYAqLxjJ/h550iRADTjKdOdhhasXw6gD6kYtg==}

  '@types/node@24.19.0':
    resolution: {integrity: sha512-zY+5tKxXdhGh1PYI0ac+7juvEu4OI6vWtVVoj5i2m42jxAY1U+zHGt6QCyOFwykdP62sM3MJ9stoYYUw5aCWew==}

  '@types/qs@6.15.1':
    resolution: {integrity: sha512-GZHUBZR9hckSUhrxmp1nG6NwdpM9fCunJwyThLW1X3AyHgd9IlHb6VANpQQqDr2o/qQp6McZ3y/IA2rVzKzSbw==}

  '@types/range-parser@1.2.7':
    resolution: {integrity: sha512-hKormJbkJqzQGhziax5PItDUTMAM9uE2XXQmM37dyd4hVM+5aVl7oVxMVUiVQn2oCQFN/LKCZdvSM0pFRqbSmQ==}

  '@types/send@1.2.1':
    resolution: {integrity: sha512-arsCikDvlU99zl1g69TcAB3mzZPpxgw0UQnaHeC1Nwb015xp8bknZv5rIfri9xTOcMuaVgvabfIRA7PSZVuZIQ==}

  '@types/serve-static@2.2.0':
    resolution: {integrity: sha512-8mam4H1NHLtu7nmtalF7eyBH14QyOASmcxHhSfEoRyr0nP/YdoesEtU+uSRvMe96TW/HPTtkoKqQLl53N7UXMQ==}

  accepts@2.0.0:
    resolution: {integrity: sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==}
    engines: {node: '>= 0.6'}

  append-field@1.0.0:
    resolution: {integrity: sha512-klpgFSWLW1ZEs8svjfb7g4qWY0YS5imI82dTg+QahUvJ8YqAY0P10Uk8tTyh9ZGuYEZEMaeJYCF5BFuX552hsw==}

  body-parser@2.3.0:
    resolution: {integrity: sha512-2cGmJupaNgg+QUwVLAucDuWuoMZ6EX9iHDRswZ5lsNYEmwPaRknMPCLZz07yTzVq/83p4o/wzbDZbBrTvGGTIw==}
    engines: {node: '>=18'}

  busboy@1.6.0:
    resolution: {integrity: sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==}
    engines: {node: '>=10.16.0'}

  bytes@3.1.2:
    resolution: {integrity: sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==}
    engines: {node: '>= 0.8'}

  call-bind-apply-helpers@1.0.2:
    resolution: {integrity: sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==}
    engines: {node: '>= 0.4'}

  call-bound@1.0.4:
    resolution: {integrity: sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==}
    engines: {node: '>= 0.4'}

  content-disposition@1.1.0:
    resolution: {integrity: sha512-5jRCH9Z/+DRP7rkvY83B+yGIGX96OYdJmzngqnw2SBSxqCFPd0w2km3s5iawpGX8krnwSGmF0FW5Nhr0Hfai3g==}
    engines: {node: '>=18'}

  content-type@1.0.5:
    resolution: {integrity: sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==}
    engines: {node: '>= 0.6'}

  content-type@2.1.0:
    resolution: {integrity: sha512-mj7UPXE0jaqaOsukNZRUEfEi2AcL7C/vwmwcHV0O97eO1E1pxBZuyjlZrx5seTaNBg1U6+o35wpa35Qfcc+7ag==}
    engines: {node: '>=18'}

  cookie-signature@1.2.2:
    resolution: {integrity: sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==}
    engines: {node: '>=6.6.0'}

  cookie@0.7.2:
    resolution: {integrity: sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==}
    engines: {node: '>= 0.6'}

  core-util-is@1.0.3:
    resolution: {integrity: sha512-ZQBvi1DcpJ4GDqanjucZ2Hj3wEO5pZDS89BWbkcrvdxksJorwUDDZamX9ldFkp9aw2lmBDLgkObEA4DWNJ9FYQ==}

  debug@4.4.3:
    resolution: {integrity: sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==}
    engines: {node: '>=6.0'}
    peerDependencies:
      supports-color: '*'
    peerDependenciesMeta:
      supports-color:
        optional: true

  depd@2.0.0:
    resolution: {integrity: sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==}
    engines: {node: '>= 0.8'}

  dunder-proto@1.0.1:
    resolution: {integrity: sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==}
    engines: {node: '>= 0.4'}

  ee-first@1.1.1:
    resolution: {integrity: sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==}

  encodeurl@2.0.0:
    resolution: {integrity: sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==}
    engines: {node: '>= 0.8'}

  es-define-property@1.0.1:
    resolution: {integrity: sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==}
    engines: {node: '>= 0.4'}

  es-errors@1.3.0:
    resolution: {integrity: sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==}
    engines: {node: '>= 0.4'}

  es-object-atoms@1.1.2:
    resolution: {integrity: sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==}
    engines: {node: '>= 0.4'}

  esbuild@0.28.2:
    resolution: {integrity: sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==}
    engines: {node: '>=18'}
    hasBin: true

  escape-html@1.0.3:
    resolution: {integrity: sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==}

  etag@1.8.1:
    resolution: {integrity: sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==}
    engines: {node: '>= 0.6'}

  express@5.2.1:
    resolution: {integrity: sha512-hIS4idWWai69NezIdRt2xFVofaF4j+6INOpJlVOLDO8zXGpUVEVzIYk12UUi2JzjEzWL3IOAxcTubgz9Po0yXw==}
    engines: {node: '>= 18'}

  finalhandler@2.1.1:
    resolution: {integrity: sha512-S8KoZgRZN+a5rNwqTxlZZePjT/4cnm0ROV70LedRHZ0p8u9fRID0hJUZQpkKLzro8LfmC8sx23bY6tVNxv8pQA==}
    engines: {node: '>= 18.0.0'}

  forwarded@0.2.0:
    resolution: {integrity: sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==}
    engines: {node: '>= 0.6'}

  fresh@2.0.0:
    resolution: {integrity: sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==}
    engines: {node: '>= 0.8'}

  fsevents@2.3.3:
    resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}
    engines: {node: ^8.16.0 || ^10.6.0 || >=11.0.0}
    os: [darwin]

  function-bind@1.1.2:
    resolution: {integrity: sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==}

  get-intrinsic@1.3.0:
    resolution: {integrity: sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==}
    engines: {node: '>= 0.4'}

  get-proto@1.0.1:
    resolution: {integrity: sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==}
    engines: {node: '>= 0.4'}

  gopd@1.2.0:
    resolution: {integrity: sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==}
    engines: {node: '>= 0.4'}

  has-symbols@1.1.0:
    resolution: {integrity: sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==}
    engines: {node: '>= 0.4'}

  hasown@2.0.4:
    resolution: {integrity: sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==}
    engines: {node: '>= 0.4'}

  http-errors@2.0.1:
    resolution: {integrity: sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==}
    engines: {node: '>= 0.8'}

  iceberg-js@0.8.1:
    resolution: {integrity: sha512-1dhVQZXhcHje7798IVM+xoo/1ZdVfzOMIc8/rgVSijRK38EDqOJoGula9N/8ZI5RD8QTxNQtK/Gozpr+qUqRRA==}
    engines: {node: '>=20.0.0'}

  iconv-lite@0.7.3:
    resolution: {integrity: sha512-IKXpvIzjnC9XTAUbVBcMfGS0EPaIXtW6v+zr+RRp+hqULEpo0owZax6wyRwPOJbWbzjYspQwusTsfVr0ifh4uQ==}
    engines: {node: '>=0.10.0'}

  immediate@3.0.6:
    resolution: {integrity: sha512-XXOFtyqDjNDAQxVfYxuF7g9Il/IbWmmlQg2MYKOH8ExIT1qg6xc4zyS3HaEEATgs1btfzxq15ciUiY7gjSXRGQ==}

  inherits@2.0.4:
    resolution: {integrity: sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==}

  ipaddr.js@1.9.1:
    resolution: {integrity: sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==}
    engines: {node: '>= 0.10'}

  is-promise@4.0.0:
    resolution: {integrity: sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ==}

  isarray@1.0.0:
    resolution: {integrity: sha512-VLghIWNM6ELQzo7zwmcg0NmTVyWKYjvIeM83yjp0wRDTmUnrM678fQbcKBo6n2CJEF0szoG//ytg+TKla89ALQ==}

  jszip@3.10.2:
    resolution: {integrity: sha512-3l+rb15IOWtUhU0H5MFqES/T6Kh7abYwjosBey/vD6hDt8zoEffkSC5Ws5SGtgVw3gBx2NEbhTeSW1+kWkpyTQ==}

  lie@3.3.0:
    resolution: {integrity: sha512-UaiMJzeWRlEujzAuw5LokY1L5ecNQYZKfmyZ9L7wDHb/p5etKaxXhohBcrw0EYby+G/NA52vRSN4N39dxHAIwQ==}

  marked@18.0.14:
    resolution: {integrity: sha512-mBHK6FBHuBAlhgRe88w9F0O1AbwwXJUcQibUbC/QcdTbVGAD7aWza+xt3N6oT/jCZx3/OMeS+8rnuiHZcQ9s7A==}
    engines: {node: '>= 20'}
    hasBin: true

  math-intrinsics@1.1.0:
    resolution: {integrity: sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==}
    engines: {node: '>= 0.4'}

  media-typer@0.3.0:
    resolution: {integrity: sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==}
    engines: {node: '>= 0.6'}

  media-typer@1.1.1:
    resolution: {integrity: sha512-yz3xRaG20c6/BOzvYoDaGtPmGscs7YivItZEEqe6GbwNfHuxu9YNmvnEkMzKldAGY4/80pRcQRZSEnhquk9XuQ==}
    engines: {node: '>= 0.8'}

  merge-descriptors@2.0.0:
    resolution: {integrity: sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==}
    engines: {node: '>=18'}

  mime-db@1.52.0:
    resolution: {integrity: sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==}
    engines: {node: '>= 0.6'}

  mime-db@1.54.0:
    resolution: {integrity: sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==}
    engines: {node: '>= 0.6'}

  mime-types@2.1.35:
    resolution: {integrity: sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==}
    engines: {node: '>= 0.6'}

  mime-types@3.0.2:
    resolution: {integrity: sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==}
    engines: {node: '>=18'}

  ms@2.1.3:
    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}

  multer@2.4.0:
    resolution: {integrity: sha512-7dqa0ZcFfzbefdTuIkzOSMvZWC0J7FLqBOjJUZvDCXShIURWKxAyTT1wHhnE5q19c7jOJf43IYYKjBmZVZmvhg==}
    engines: {node: '>= 10.16.0'}

  negotiator@1.1.0:
    resolution: {integrity: sha512-NMPBRMJgiQHjbd8phG3Vebdx4kZ1H121rbl5IkMqeOsahptB9BKo/d7oJ3zTXqTgagn2bWlNSXkh0QUGM31RYg==}
    engines: {node: '>=18'}

  object-inspect@1.13.4:
    resolution: {integrity: sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==}
    engines: {node: '>= 0.4'}

  on-finished@2.4.1:
    resolution: {integrity: sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==}
    engines: {node: '>= 0.8'}

  once@1.4.0:
    resolution: {integrity: sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==}

  oxlint@1.85.0:
    resolution: {integrity: sha512-bc26s97nuvPj1ViyPsqmKecVkUWFMEdtayO8MaQ6oiLfs1pj94cQlZZhrh4BPNlr9HQosjhIlwgZKsfcwmcNgg==}
    engines: {node: ^20.19.0 || >=22.12.0}
    hasBin: true
    peerDependencies:
      oxlint-tsgolint: '>=7.0.2001'
      vite-plus: '*'
    peerDependenciesMeta:
      oxlint-tsgolint:
        optional: true
      vite-plus:
        optional: true

  pako@1.0.11:
    resolution: {integrity: sha512-4hLB8Py4zZce5s4yd9XzopqwVv/yGNhV1Bl8NTmCq1763HeK2+EwVTv+leGeL13Dnh2wfbqowVPXCIO0z4taYw==}

  parseurl@1.3.3:
    resolution: {integrity: sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==}
    engines: {node: '>= 0.8'}

  path-to-regexp@8.4.2:
    resolution: {integrity: sha512-qRcuIdP69NPm4qbACK+aDogI5CBDMi1jKe0ry5rSQJz8JVLsC7jV8XpiJjGRLLol3N+R5ihGYcrPLTno6pAdBA==}

  process-nextick-args@2.0.1:
    resolution: {integrity: sha512-3ouUOpQhtgrbOa17J7+uxOTpITYWaGP7/AhoR3+A+/1e9skrzelGi/dXzEYyvbxubEF6Wn2ypscTKiKJFFn1ag==}

  proxy-addr@2.0.8:
    resolution: {integrity: sha512-5nnx0yGyVUcY6t9RnWcARWtwT9F1D8O9rt08htPvnd49W1IgZtmLkhu9WfMzQj1cFxjHIO6connUNVW5k7AVyQ==}
    engines: {node: '>= 0.10'}

  qs@6.16.0:
    resolution: {integrity: sha512-h6fhOIaRrID2CbEY2fqs+7t+UXZo+MLAnU5gRIq85uFtdiUPCdsApMlHhXogKVM4HM2DVbIjGNTTYH2OcmP1vA==}
    engines: {node: '>=0.6'}

  range-parser@1.3.0:
    resolution: {integrity: sha512-hek2mFQpPuI4E1BBKrSto+BU3e3x4xuarsbiwr3+lf7p44juvFMV0XFWQAP3xUyqXA4RrXLIoaSUGbSt056ZMw==}
    engines: {node: '>= 0.6'}

  raw-body@3.0.2:
    resolution: {integrity: sha512-K5zQjDllxWkf7Z5xJdV0/B0WTNqx6vxG70zJE4N0kBs4LovmEYWJzQGxC9bS9RAKu3bgM40lrd5zoLJ12MQ5BA==}
    engines: {node: '>= 0.10'}

  readable-stream@2.3.8:
    resolution: {integrity: sha512-8p0AUk4XODgIewSi0l8Epjs+EVnWiK7NoDIEGU0HhE7+ZyY8D1IMY7odu5lRrFXGg71L15KG8QrPmum45RTtdA==}

  router@2.2.0:
    resolution: {integrity: sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==}
    engines: {node: '>= 18'}

  safe-buffer@5.1.2:
    resolution: {integrity: sha512-Gd2UZBJDkXlY7GbJxfsE8/nvKkUEU1G38c1siN6QP6a9PT9MmHB8GnpscSmMJSoF8LOIrt8ud/wPtojys4G6+g==}

  safer-buffer@2.1.2:
    resolution: {integrity: sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==}

  send@1.2.1:
    resolution: {integrity: sha512-1gnZf7DFcoIcajTjTwjwuDjzuz4PPcY2StKPlsGAQ1+YH20IRVrBaXSWmdjowTJ6u8Rc01PoYOGHXfP1mYcZNQ==}
    engines: {node: '>= 18'}

  serve-static@2.2.1:
    resolution: {integrity: sha512-xRXBn0pPqQTVQiC8wyQrKs2MOlX24zQ0POGaj0kultvoOCstBQM5yvOhAVSUwOMjQtTvsPWoNCHfPGwaaQJhTw==}
    engines: {node: '>= 18'}

  setimmediate@1.0.5:
    resolution: {integrity: sha512-MATJdZp8sLqDl/68LfQmbP8zKPLQNV6BIZoIgrscFDQ+RsvK/BxeDQOgyxKKoh0y/8h3BqVFnCqQ/gd+reiIXA==}

  setprototypeof@1.2.0:
    resolution: {integrity: sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==}

  side-channel-list@1.0.1:
    resolution: {integrity: sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==}
    engines: {node: '>= 0.4'}

  side-channel-map@1.0.1:
    resolution: {integrity: sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==}
    engines: {node: '>= 0.4'}

  side-channel-weakmap@1.0.2:
    resolution: {integrity: sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==}
    engines: {node: '>= 0.4'}

  side-channel@1.1.1:
    resolution: {integrity: sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==}
    engines: {node: '>= 0.4'}

  statuses@2.0.2:
    resolution: {integrity: sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==}
    engines: {node: '>= 0.8'}

  streamsearch@1.1.0:
    resolution: {integrity: sha512-Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==}
    engines: {node: '>=10.0.0'}

  string_decoder@1.1.1:
    resolution: {integrity: sha512-n/ShnvDi6FHbbVfviro+WojiFzv+s8MPMHBczVePfUpDJLwoLT0ht1l4YwBCbi8pJAveEEdnkHyPyTP/mzRfwg==}

  toidentifier@1.0.1:
    resolution: {integrity: sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==}
    engines: {node: '>=0.6'}

  tslib@2.8.1:
    resolution: {integrity: sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==}

  tsx@4.23.15:
    resolution: {integrity: sha512-Yiex1Ovn8z2xPpOWckIiysV1SSyRMY9BkLF++q0yKiDxCqRhosKfMg3janKkiLBwZ5c/YryloKwGZcrEmtwxKw==}
    engines: {node: '>=18.0.0'}
    hasBin: true

  type-is@1.6.18:
    resolution: {integrity: sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==}
    engines: {node: '>= 0.6'}

  type-is@2.1.0:
    resolution: {integrity: sha512-faYHw0anBbc/kWF3zFTEnxSFOAGUX9GFbOBthvDdLsIlEoWOFOtS0zgCiQYwIskL9iGXZL3kAXD8OoZ4GmMATA==}
    engines: {node: '>= 18'}

  typescript@6.0.3:
    resolution: {integrity: sha512-y2TvuxSZPDyQakkFRPZHKFm+KKVqIisdg9/CZwm9ftvKXLP8NRWj38/ODjNbr43SsoXqNuAisEf1GdCxqWcdBw==}
    engines: {node: '>=14.17'}
    hasBin: true

  undici-types@7.24.6:
    resolution: {integrity: sha512-WRNW+sJgj5OBN4/0JpHFqtqzhpbnV0GuB+OozA9gCL7a993SmU+1JBZCzLNxYsbMfIeDL+lTsphD5jN5N+n0zg==}

  unpipe@1.0.0:
    resolution: {integrity: sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==}
    engines: {node: '>= 0.8'}

  util-deprecate@1.0.2:
    resolution: {integrity: sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==}

  vary@1.1.2:
    resolution: {integrity: sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==}
    engines: {node: '>= 0.8'}

  wrappy@1.0.2:
    resolution: {integrity: sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==}

snapshots:

  '@esbuild/aix-ppc64@0.28.2':
    optional: true

  '@esbuild/android-arm64@0.28.2':
    optional: true

  '@esbuild/android-arm@0.28.2':
    optional: true

  '@esbuild/android-x64@0.28.2':
    optional: true

  '@esbuild/darwin-arm64@0.28.2':
    optional: true

  '@esbuild/darwin-x64@0.28.2':
    optional: true

  '@esbuild/freebsd-arm64@0.28.2':
    optional: true

  '@esbuild/freebsd-x64@0.28.2':
    optional: true

  '@esbuild/linux-arm64@0.28.2':
    optional: true

  '@esbuild/linux-arm@0.28.2':
    optional: true

  '@esbuild/linux-ia32@0.28.2':
    optional: true

  '@esbuild/linux-loong64@0.28.2':
    optional: true

  '@esbuild/linux-mips64el@0.28.2':
    optional: true

  '@esbuild/linux-ppc64@0.28.2':
    optional: true

  '@esbuild/linux-riscv64@0.28.2':
    optional: true

  '@esbuild/linux-s390x@0.28.2':
    optional: true

  '@esbuild/linux-x64@0.28.2':
    optional: true

  '@esbuild/netbsd-arm64@0.28.2':
    optional: true

  '@esbuild/netbsd-x64@0.28.2':
    optional: true

  '@esbuild/openbsd-arm64@0.28.2':
    optional: true

  '@esbuild/openbsd-x64@0.28.2':
    optional: true

  '@esbuild/openharmony-arm64@0.28.2':
    optional: true

  '@esbuild/sunos-x64@0.28.2':
    optional: true

  '@esbuild/win32-arm64@0.28.2':
    optional: true

  '@esbuild/win32-ia32@0.28.2':
    optional: true

  '@esbuild/win32-x64@0.28.2':
    optional: true

  '@oxlint/binding-android-arm-eabi@1.85.0':
    optional: true

  '@oxlint/binding-android-arm64@1.85.0':
    optional: true

  '@oxlint/binding-darwin-arm64@1.85.0':
    optional: true

  '@oxlint/binding-darwin-x64@1.85.0':
    optional: true

  '@oxlint/binding-freebsd-x64@1.85.0':
    optional: true

  '@oxlint/binding-linux-arm-gnueabihf@1.85.0':
    optional: true

  '@oxlint/binding-linux-arm-musleabihf@1.85.0':
    optional: true

  '@oxlint/binding-linux-arm64-gnu@1.85.0':
    optional: true

  '@oxlint/binding-linux-arm64-musl@1.85.0':
    optional: true

  '@oxlint/binding-linux-ppc64-gnu@1.85.0':
    optional: true

  '@oxlint/binding-linux-riscv64-gnu@1.85.0':
    optional: true

  '@oxlint/binding-linux-riscv64-musl@1.85.0':
    optional: true

  '@oxlint/binding-linux-s390x-gnu@1.85.0':
    optional: true

  '@oxlint/binding-linux-x64-gnu@1.85.0':
    optional: true

  '@oxlint/binding-linux-x64-musl@1.85.0':
    optional: true

  '@oxlint/binding-openharmony-arm64@1.85.0':
    optional: true

  '@oxlint/binding-win32-arm64-msvc@1.85.0':
    optional: true

  '@oxlint/binding-win32-ia32-msvc@1.85.0':
    optional: true

  '@oxlint/binding-win32-x64-msvc@1.85.0':
    optional: true

  '@supabase/auth-js@2.117.2':
    dependencies:
      tslib: 2.8.1

  '@supabase/functions-js@2.117.2':
    dependencies:
      tslib: 2.8.1

  '@supabase/phoenix@0.4.5': {}

  '@supabase/postgrest-js@2.117.2':
    dependencies:
      tslib: 2.8.1

  '@supabase/realtime-js@2.117.2':
    dependencies:
      '@supabase/phoenix': 0.4.5
      tslib: 2.8.1

  '@supabase/storage-js@2.117.2':
    dependencies:
      iceberg-js: 0.8.1
      tslib: 2.8.1

  '@supabase/supabase-js@2.117.2':
    dependencies:
      '@supabase/auth-js': 2.117.2
      '@supabase/functions-js': 2.117.2
      '@supabase/postgrest-js': 2.117.2
      '@supabase/realtime-js': 2.117.2
      '@supabase/storage-js': 2.117.2

  '@types/body-parser@1.19.6':
    dependencies:
      '@types/connect': 3.4.38
      '@types/node': 24.19.0

  '@types/connect@3.4.38':
    dependencies:
      '@types/node': 24.19.0

  '@types/express-serve-static-core@5.1.3':
    dependencies:
      '@types/node': 24.19.0
      '@types/qs': 6.15.1
      '@types/range-parser': 1.2.7
      '@types/send': 1.2.1

  '@types/express@5.0.6':
    dependencies:
      '@types/body-parser': 1.19.6
      '@types/express-serve-static-core': 5.1.3
      '@types/serve-static': 2.2.0

  '@types/http-errors@2.0.5': {}

  '@types/multer@2.2.0':
    dependencies:
      '@types/express': 5.0.6

  '@types/node@24.19.0':
    dependencies:
      undici-types: 7.24.6

  '@types/qs@6.15.1': {}

  '@types/range-parser@1.2.7': {}

  '@types/send@1.2.1':
    dependencies:
      '@types/node': 24.19.0

  '@types/serve-static@2.2.0':
    dependencies:
      '@types/http-errors': 2.0.5
      '@types/node': 24.19.0

  accepts@2.0.0:
    dependencies:
      mime-types: 3.0.2
      negotiator: 1.1.0

  append-field@1.0.0: {}

  body-parser@2.3.0:
    dependencies:
      bytes: 3.1.2
      content-type: 2.1.0
      debug: 4.4.3
      http-errors: 2.0.1
      iconv-lite: 0.7.3
      on-finished: 2.4.1
      qs: 6.16.0
      raw-body: 3.0.2
      type-is: 2.1.0
    transitivePeerDependencies:
      - supports-color

  busboy@1.6.0:
    dependencies:
      streamsearch: 1.1.0

  bytes@3.1.2: {}

  call-bind-apply-helpers@1.0.2:
    dependencies:
      es-errors: 1.3.0
      function-bind: 1.1.2

  call-bound@1.0.4:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      get-intrinsic: 1.3.0

  content-disposition@1.1.0: {}

  content-type@1.0.5: {}

  content-type@2.1.0: {}

  cookie-signature@1.2.2: {}

  cookie@0.7.2: {}

  core-util-is@1.0.3: {}

  debug@4.4.3:
    dependencies:
      ms: 2.1.3

  depd@2.0.0: {}

  dunder-proto@1.0.1:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-errors: 1.3.0
      gopd: 1.2.0

  ee-first@1.1.1: {}

  encodeurl@2.0.0: {}

  es-define-property@1.0.1: {}

  es-errors@1.3.0: {}

  es-object-atoms@1.1.2:
    dependencies:
      es-errors: 1.3.0

  esbuild@0.28.2:
    optionalDependencies:
      '@esbuild/aix-ppc64': 0.28.2
      '@esbuild/android-arm': 0.28.2
      '@esbuild/android-arm64': 0.28.2
      '@esbuild/android-x64': 0.28.2
      '@esbuild/darwin-arm64': 0.28.2
      '@esbuild/darwin-x64': 0.28.2
      '@esbuild/freebsd-arm64': 0.28.2
      '@esbuild/freebsd-x64': 0.28.2
      '@esbuild/linux-arm': 0.28.2
      '@esbuild/linux-arm64': 0.28.2
      '@esbuild/linux-ia32': 0.28.2
      '@esbuild/linux-loong64': 0.28.2
      '@esbuild/linux-mips64el': 0.28.2
      '@esbuild/linux-ppc64': 0.28.2
      '@esbuild/linux-riscv64': 0.28.2
      '@esbuild/linux-s390x': 0.28.2
      '@esbuild/linux-x64': 0.28.2
      '@esbuild/netbsd-arm64': 0.28.2
      '@esbuild/netbsd-x64': 0.28.2
      '@esbuild/openbsd-arm64': 0.28.2
      '@esbuild/openbsd-x64': 0.28.2
      '@esbuild/openharmony-arm64': 0.28.2
      '@esbuild/sunos-x64': 0.28.2
      '@esbuild/win32-arm64': 0.28.2
      '@esbuild/win32-ia32': 0.28.2
      '@esbuild/win32-x64': 0.28.2

  escape-html@1.0.3: {}

  etag@1.8.1: {}

  express@5.2.1:
    dependencies:
      accepts: 2.0.0
      body-parser: 2.3.0
      content-disposition: 1.1.0
      content-type: 1.0.5
      cookie: 0.7.2
      cookie-signature: 1.2.2
      debug: 4.4.3
      depd: 2.0.0
      encodeurl: 2.0.0
      escape-html: 1.0.3
      etag: 1.8.1
      finalhandler: 2.1.1
      fresh: 2.0.0
      http-errors: 2.0.1
      merge-descriptors: 2.0.0
      mime-types: 3.0.2
      on-finished: 2.4.1
      once: 1.4.0
      parseurl: 1.3.3
      proxy-addr: 2.0.8
      qs: 6.16.0
      range-parser: 1.3.0
      router: 2.2.0
      send: 1.2.1
      serve-static: 2.2.1
      statuses: 2.0.2
      type-is: 2.1.0
      vary: 1.1.2
    transitivePeerDependencies:
      - supports-color

  finalhandler@2.1.1:
    dependencies:
      debug: 4.4.3
      encodeurl: 2.0.0
      escape-html: 1.0.3
      on-finished: 2.4.1
      parseurl: 1.3.3
      statuses: 2.0.2
    transitivePeerDependencies:
      - supports-color

  forwarded@0.2.0: {}

  fresh@2.0.0: {}

  fsevents@2.3.3:
    optional: true

  function-bind@1.1.2: {}

  get-intrinsic@1.3.0:
    dependencies:
      call-bind-apply-helpers: 1.0.2
      es-define-property: 1.0.1
      es-errors: 1.3.0
      es-object-atoms: 1.1.2
      function-bind: 1.1.2
      get-proto: 1.0.1
      gopd: 1.2.0
      has-symbols: 1.1.0
      hasown: 2.0.4
      math-intrinsics: 1.1.0

  get-proto@1.0.1:
    dependencies:
      dunder-proto: 1.0.1
      es-object-atoms: 1.1.2

  gopd@1.2.0: {}

  has-symbols@1.1.0: {}

  hasown@2.0.4:
    dependencies:
      function-bind: 1.1.2

  http-errors@2.0.1:
    dependencies:
      depd: 2.0.0
      inherits: 2.0.4
      setprototypeof: 1.2.0
      statuses: 2.0.2
      toidentifier: 1.0.1

  iceberg-js@0.8.1: {}

  iconv-lite@0.7.3:
    dependencies:
      safer-buffer: 2.1.2

  immediate@3.0.6: {}

  inherits@2.0.4: {}

  ipaddr.js@1.9.1: {}

  is-promise@4.0.0: {}

  isarray@1.0.0: {}

  jszip@3.10.2:
    dependencies:
      lie: 3.3.0
      pako: 1.0.11
      readable-stream: 2.3.8
      setimmediate: 1.0.5

  lie@3.3.0:
    dependencies:
      immediate: 3.0.6

  marked@18.0.14: {}

  math-intrinsics@1.1.0: {}

  media-typer@0.3.0: {}

  media-typer@1.1.1: {}

  merge-descriptors@2.0.0: {}

  mime-db@1.52.0: {}

  mime-db@1.54.0: {}

  mime-types@2.1.35:
    dependencies:
      mime-db: 1.52.0

  mime-types@3.0.2:
    dependencies:
      mime-db: 1.54.0

  ms@2.1.3: {}

  multer@2.4.0:
    dependencies:
      append-field: 1.0.0
      busboy: 1.6.0
      type-is: 1.6.18

  negotiator@1.1.0:
    dependencies:
      content-type: 2.1.0

  object-inspect@1.13.4: {}

  on-finished@2.4.1:
    dependencies:
      ee-first: 1.1.1

  once@1.4.0:
    dependencies:
      wrappy: 1.0.2

  oxlint@1.85.0:
    optionalDependencies:
      '@oxlint/binding-android-arm-eabi': 1.85.0
      '@oxlint/binding-android-arm64': 1.85.0
      '@oxlint/binding-darwin-arm64': 1.85.0
      '@oxlint/binding-darwin-x64': 1.85.0
      '@oxlint/binding-freebsd-x64': 1.85.0
      '@oxlint/binding-linux-arm-gnueabihf': 1.85.0
      '@oxlint/binding-linux-arm-musleabihf': 1.85.0
      '@oxlint/binding-linux-arm64-gnu': 1.85.0
      '@oxlint/binding-linux-arm64-musl': 1.85.0
      '@oxlint/binding-linux-ppc64-gnu': 1.85.0
      '@oxlint/binding-linux-riscv64-gnu': 1.85.0
      '@oxlint/binding-linux-riscv64-musl': 1.85.0
      '@oxlint/binding-linux-s390x-gnu': 1.85.0
      '@oxlint/binding-linux-x64-gnu': 1.85.0
      '@oxlint/binding-linux-x64-musl': 1.85.0
      '@oxlint/binding-openharmony-arm64': 1.85.0
      '@oxlint/binding-win32-arm64-msvc': 1.85.0
      '@oxlint/binding-win32-ia32-msvc': 1.85.0
      '@oxlint/binding-win32-x64-msvc': 1.85.0

  pako@1.0.11: {}

  parseurl@1.3.3: {}

  path-to-regexp@8.4.2: {}

  process-nextick-args@2.0.1: {}

  proxy-addr@2.0.8:
    dependencies:
      forwarded: 0.2.0
      ipaddr.js: 1.9.1

  qs@6.16.0:
    dependencies:
      es-define-property: 1.0.1
      side-channel: 1.1.1

  range-parser@1.3.0: {}

  raw-body@3.0.2:
    dependencies:
      bytes: 3.1.2
      http-errors: 2.0.1
      iconv-lite: 0.7.3
      unpipe: 1.0.0

  readable-stream@2.3.8:
    dependencies:
      core-util-is: 1.0.3
      inherits: 2.0.4
      isarray: 1.0.0
      process-nextick-args: 2.0.1
      safe-buffer: 5.1.2
      string_decoder: 1.1.1
      util-deprecate: 1.0.2

  router@2.2.0:
    dependencies:
      debug: 4.4.3
      depd: 2.0.0
      is-promise: 4.0.0
      parseurl: 1.3.3
      path-to-regexp: 8.4.2
    transitivePeerDependencies:
      - supports-color

  safe-buffer@5.1.2: {}

  safer-buffer@2.1.2: {}

  send@1.2.1:
    dependencies:
      debug: 4.4.3
      encodeurl: 2.0.0
      escape-html: 1.0.3
      etag: 1.8.1
      fresh: 2.0.0
      http-errors: 2.0.1
      mime-types: 3.0.2
      ms: 2.1.3
      on-finished: 2.4.1
      range-parser: 1.3.0
      statuses: 2.0.2
    transitivePeerDependencies:
      - supports-color

  serve-static@2.2.1:
    dependencies:
      encodeurl: 2.0.0
      escape-html: 1.0.3
      parseurl: 1.3.3
      send: 1.2.1
    transitivePeerDependencies:
      - supports-color

  setimmediate@1.0.5: {}

  setprototypeof@1.2.0: {}

  side-channel-list@1.0.1:
    dependencies:
      es-errors: 1.3.0
      object-inspect: 1.13.4

  side-channel-map@1.0.1:
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      object-inspect: 1.13.4

  side-channel-weakmap@1.0.2:
    dependencies:
      call-bound: 1.0.4
      es-errors: 1.3.0
      get-intrinsic: 1.3.0
      object-inspect: 1.13.4
      side-channel-map: 1.0.1

  side-channel@1.1.1:
    dependencies:
      es-errors: 1.3.0
      object-inspect: 1.13.4
      side-channel-list: 1.0.1
      side-channel-map: 1.0.1
      side-channel-weakmap: 1.0.2

  statuses@2.0.2: {}

  streamsearch@1.1.0: {}

  string_decoder@1.1.1:
    dependencies:
      safe-buffer: 5.1.2

  toidentifier@1.0.1: {}

  tslib@2.8.1: {}

  tsx@4.23.15:
    dependencies:
      esbuild: 0.28.2
    optionalDependencies:
      fsevents: 2.3.3

  type-is@1.6.18:
    dependencies:
      media-typer: 0.3.0
      mime-types: 2.1.35

  type-is@2.1.0:
    dependencies:
      content-type: 2.1.0
      media-typer: 1.1.1
      mime-types: 3.0.2

  typescript@6.0.3: {}

  undici-types@7.24.6: {}

  unpipe@1.0.0: {}

  util-deprecate@1.0.2: {}

  vary@1.1.2: {}

  wrappy@1.0.2: {}
````

## File: api/pnpm-workspace.yaml

````yaml
allowBuilds:
  esbuild: set this to true or false
````

## File: api/render.yaml

````yaml
services:
  - type: web
    name: study-library-api
    runtime: node
    plan: free
    buildCommand: corepack enable && pnpm install --frozen-lockfile && pnpm build
    startCommand: pnpm start
    healthCheckPath: /api/health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: '10000'
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: SUPABASE_STORAGE_BUCKET
        value: study-library
      - key: WEB_ORIGIN
        sync: false
      - key: LIBRARY_ACCESS_PASSWORD
        sync: false
      - key: SESSION_SECRET
        sync: false
      - key: CATALOG_SYNC_TOKEN
        sync: false
````

## File: api/src/config.ts

````ts
const required = (name: string): string => {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required.`)
  return value
}

const configuredPort = Number(process.env.PORT ?? 4450)

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number.isFinite(configuredPort) && configuredPort > 0 ? configuredPort : 4450,
  supabaseUrl: required('SUPABASE_URL').replace(/\/$/, ''),
  supabaseServiceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? 'study-library',
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:4444',
  accessPassword: process.env.LIBRARY_ACCESS_PASSWORD,
  sessionSecret: process.env.SESSION_SECRET ?? process.env.LIBRARY_ACCESS_PASSWORD,
  catalogSyncToken: process.env.CATALOG_SYNC_TOKEN,
  sessionCookieName: 'study_library_session',
  sessionLifetimeMs: 30 * 24 * 60 * 60 * 1000,
} as const

if (config.accessPassword && !config.sessionSecret) {
  throw new Error('SESSION_SECRET is required when LIBRARY_ACCESS_PASSWORD is configured.')
}
````

## File: api/src/database.ts

````ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { config } from './config.js'

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type LibraryItemRow = {
  id: string
  storage_path: string
  title: string
  extension: string
  preview_kind: string
  mime_type: string
  size_bytes: number
  category_path: string
  folder_path: string
  modified_at: string
  metadata: Json
  created_at: string
  updated_at: string
}

type LibraryItemInsert = {
  storage_path: string
  title: string
  extension: string
  preview_kind: string
  mime_type: string
  size_bytes: number
  category_path: string
  folder_path: string
  modified_at: string
  metadata?: Json
}

type UploadJobRow = {
  id: string
  user_id: string | null
  storage_path: string
  original_name: string
  status: 'staged' | 'committed' | 'discarded' | 'failed'
  classification: Json
  created_at: string
  committed_at: string | null
}

type UploadJobInsert = {
  id?: string
  user_id?: string | null
  storage_path: string
  original_name: string
  status?: UploadJobRow['status']
  classification?: Json
  committed_at?: string | null
}

type Database = {
  public: {
    Tables: {
      library_items: {
        Row: LibraryItemRow
        Insert: LibraryItemInsert
        Update: Partial<LibraryItemInsert>
        Relationships: []
      },
      upload_jobs: {
        Row: UploadJobRow
        Insert: UploadJobInsert
        Update: Partial<UploadJobInsert>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
  storage: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type CatalogRow = LibraryItemRow
export type CatalogInsert = LibraryItemInsert
export type UploadJob = UploadJobRow

export const supabase: SupabaseClient<Database> = createClient<Database>(config.supabaseUrl, config.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export const listCatalogRows = async (): Promise<CatalogRow[]> => {
  const rows: CatalogRow[] = []
  const pageSize = 1000
  let offset = 0

  while (true) {
    const { data, error } = await supabase
      .from('library_items')
      .select('*')
      .order('storage_path', { ascending: true })
      .range(offset, offset + pageSize - 1)

    if (error) throw new Error(`Catalog query failed: ${error.message}`)
    rows.push(...data)
    if (data.length < pageSize) return rows
    offset += pageSize
  }
}

export const findCatalogRow = async (storagePath: string): Promise<CatalogRow | null> => {
  const { data, error } = await supabase
    .from('library_items')
    .select('*')
    .eq('storage_path', storagePath)
    .maybeSingle()

  if (error) throw new Error(`Catalog lookup failed: ${error.message}`)
  return data
}

export const upsertCatalogRows = async (rows: CatalogInsert[]): Promise<void> => {
  const batchSize = 500
  for (let offset = 0; offset < rows.length; offset += batchSize) {
    const batch = rows.slice(offset, offset + batchSize)
    const { error } = await supabase.from('library_items').upsert(batch, { onConflict: 'storage_path' })
    if (error) throw new Error(`Catalog upsert failed: ${error.message}`)
  }
}

export const createUploadJob = async (job: UploadJobInsert): Promise<UploadJobRow> => {
  const { data, error } = await supabase.from('upload_jobs').insert(job).select('*').single()
  if (error) throw new Error(`Upload job creation failed: ${error.message}`)
  return data
}

export const findUploadJob = async (id: string): Promise<UploadJobRow | null> => {
  const { data, error } = await supabase.from('upload_jobs').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`Upload job lookup failed: ${error.message}`)
  return data
}

export const updateUploadJob = async (id: string, update: Partial<UploadJobInsert>): Promise<UploadJobRow> => {
  const { data, error } = await supabase.from('upload_jobs').update(update).eq('id', id).select('*').single()
  if (error) throw new Error(`Upload job update failed: ${error.message}`)
  return data
}
````

## File: api/src/ebooks.ts

````ts
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import JSZip from 'jszip'
import { marked } from 'marked'
import { findCatalogRow } from './database.js'
import { requestObject } from './storage.js'
import { normalizeFileName } from './uploads.js'

const escapeXml = (value: string): string => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const titleFromContent = (content: string, fileName: string): string => content.match(/^\s*#\s+(.+)$/m)?.[1]?.trim().replace(/[*_`]/g, '') ?? fileName.replace(/\.(md|markdown|mdx)$/i, '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ')

export const createEpub = async (relativePaths: string[], requestedTitle: string): Promise<{ path: string; fileName: string; archive: Buffer }> => {
  const sourceFiles: Array<{ path: string; title: string; content: string }> = []
  for (const relativePath of relativePaths) {
    const row = await findCatalogRow(relativePath)
    if (!row || !['.md', '.markdown', '.mdx', '.txt'].includes(row.extension.toLowerCase())) throw new Error(`Only Markdown and text files can be included in an ebook: ${relativePath}`)
    const response = await requestObject(row.storage_path)
    if (!response.ok) throw new Error(`The study note could not be read for the ebook: ${relativePath}`)
    const content = await response.text()
    const fileName = path.posix.basename(row.storage_path)
    sourceFiles.push({ path: row.storage_path, title: row.extension === '.txt' ? path.posix.basename(fileName, row.extension) : titleFromContent(content, fileName), content })
  }

  if (sourceFiles.length === 0) throw new Error('Choose at least one Markdown or text file to create an ebook.')
  const title = requestedTitle.trim() || sourceFiles[0].title || 'Study collection'
  const fileName = normalizeFileName(title, 'study-collection.epub', '.epub')
  const zip = new JSZip()
  const chapters = await Promise.all(sourceFiles.map(async (sourceFile, index) => {
    const chapterId = `chapter-${index + 1}`
    const chapterFileName = `${chapterId}.xhtml`
    const body = sourceFile.path.toLowerCase().endsWith('.txt') ? `<pre>${escapeXml(sourceFile.content)}</pre>` : await marked.parse(sourceFile.content)
    zip.file(`OEBPS/${chapterFileName}`, `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><title>${escapeXml(sourceFile.title)}</title><meta charset="utf-8" /></head><body><h1>${escapeXml(sourceFile.title)}</h1>${body}<p><small>Source: ${escapeXml(sourceFile.path)}</small></p></body></html>`)
    return { chapterId, chapterFileName, title: sourceFile.title }
  }))
  const bookId = `urn:uuid:${randomUUID()}`
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })
  zip.file('META-INF/container.xml', '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument.org:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles></container>')
  zip.file('OEBPS/nav.xhtml', `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en"><head><title>${escapeXml(title)}</title><meta charset="utf-8" /></head><body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${chapters.map((chapter) => `<li><a href="${chapter.chapterFileName}">${escapeXml(chapter.title)}</a></li>`).join('')}</ol></nav></body></html>`)
  zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${bookId}</dc:identifier><dc:title>${escapeXml(title)}</dc:title><dc:language>en</dc:language><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')}</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />${chapters.map((chapter) => `<item id="${chapter.chapterId}" href="${chapter.chapterFileName}" media-type="application/xhtml+xml" />`).join('')}</manifest><spine>${chapters.map((chapter) => `<itemref idref="${chapter.chapterId}" />`).join('')}</spine></package>`)
  return { path: `Ebooks/${fileName}`, fileName, archive: await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }) }
}
````

## File: api/src/library.ts

````ts
import path from 'node:path'
import { findCatalogRow, listCatalogRows, type CatalogRow } from './database.js'
import type { CategorySummary, FileKind, FolderNode, LibraryFile, LibraryResponse, PreviewKind } from './types.js'

const markdownExtensions = new Set(['.md', '.markdown', '.mdx'])
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'])
const pdfExtensions = new Set(['.pdf'])
const textExtensions = new Set([
  '.c', '.cc', '.cpp', '.css', '.csv', '.go', '.h', '.hpp', '.html', '.java', '.js', '.json', '.jsx', '.mjs', '.py', '.rs', '.sh', '.sql', '.tex', '.toml', '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml',
])
const supportedExtensions = new Set([...markdownExtensions, ...imageExtensions, ...pdfExtensions, ...textExtensions, '.azw', '.azw3', '.docx', '.epub', '.mobi', '.odp', '.ods', '.odt', '.pptx', '.xlsx'])
const nameCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })

const previewKindForExtension = (extension: string): PreviewKind => {
  if (markdownExtensions.has(extension)) return 'markdown'
  if (imageExtensions.has(extension)) return 'image'
  if (pdfExtensions.has(extension)) return 'pdf'
  if (textExtensions.has(extension)) return 'text'
  if (extension === '.epub') return 'epub'
  return 'download'
}

const mimeTypeForExtension = (extension: string): string => {
  if (extension === '.svg') return 'image/svg+xml'
  if (extension === '.avif') return 'image/avif'
  if (imageExtensions.has(extension)) return `image/${extension === '.jpg' ? 'jpeg' : extension.slice(1)}`
  if (extension === '.pdf') return 'application/pdf'
  if (extension === '.json') return 'application/json'
  if (extension === '.csv') return 'text/csv'
  if (extension === '.html') return 'text/html'
  if (extension === '.xml') return 'application/xml'
  if (extension === '.docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (extension === '.pptx') return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  if (extension === '.xlsx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (extension === '.epub') return 'application/epub+zip'
  if (textExtensions.has(extension)) return 'text/plain'
  return 'application/octet-stream'
}

const titleFromPath = (filePath: string, extension: string): string => {
  const fileName = path.posix.basename(filePath)
  return fileName.slice(0, -extension.length).replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ') || fileName
}

const rowToFile = (row: CatalogRow): LibraryFile | null => {
  const normalizedPath = row.storage_path.replace(/\\/g, '/')
  const extension = path.posix.extname(normalizedPath).toLowerCase()
  if (!normalizedPath || !supportedExtensions.has(extension)) return null
  const segments = normalizedPath.split('/')
  const previewKind = previewKindForExtension(extension)
  const kind: FileKind = previewKind === 'image' ? 'image' : 'document'
  const name = segments[segments.length - 1] ?? normalizedPath
  const folderPath = segments.slice(0, -1).join('/')
  const categoryPath = segments.length > 1 ? segments[0] : ''

  return {
    path: normalizedPath,
    name,
    kind,
    category: categoryPath || 'Library root',
    categoryPath,
    folderPath,
    extension,
    title: row.title || titleFromPath(normalizedPath, extension),
    previewKind,
    mimeType: row.mime_type || mimeTypeForExtension(extension),
    size: Number(row.size_bytes),
    modifiedAt: row.modified_at,
  }
}

const createFolder = (name: string, folderPath: string): FolderNode => ({ name, path: folderPath, documents: [], images: [], children: [] })

const addFileToTree = (root: FolderNode, file: LibraryFile): void => {
  const segments = file.folderPath ? file.folderPath.split('/') : []
  let current = root
  for (let index = 0; index < segments.length; index += 1) {
    const folderPath = segments.slice(0, index + 1).join('/')
    let child = current.children.find((candidate) => candidate.path === folderPath)
    if (!child) {
      child = createFolder(segments[index], folderPath)
      current.children.push(child)
    }
    current = child
  }
  if (file.kind === 'document') current.documents.push(file)
  else current.images.push(file)
}

const sortFolders = (folders: FolderNode[]): FolderNode[] => [...folders].sort((left, right) => nameCollator.compare(left.path, right.path)).map((folder) => ({ ...folder, children: sortFolders(folder.children), documents: [...folder.documents].sort((left, right) => nameCollator.compare(left.path, right.path)), images: [...folder.images].sort((left, right) => nameCollator.compare(left.path, right.path)) }))

const buildResponse = (rows: CatalogRow[], root: string): LibraryResponse => {
  const files = rows.map(rowToFile).filter((file): file is LibraryFile => file !== null).sort((left, right) => nameCollator.compare(left.path, right.path))
  const rootFolder = createFolder(root, '')
  const categoryMap = new Map<string, CategorySummary>()

  for (const file of files) {
    addFileToTree(rootFolder, file)
    const existing = categoryMap.get(file.categoryPath) ?? { name: file.category, path: file.categoryPath, documents: 0, images: 0, folders: 0 }
    if (file.kind === 'document') existing.documents += 1
    else existing.images += 1
    categoryMap.set(file.categoryPath, existing)
  }

  for (const category of categoryMap.values()) {
    category.folders = new Set(files.filter((file) => file.categoryPath === category.path).map((file) => file.folderPath)).size
  }

  const documents = files.filter((file) => file.kind === 'document')
  const images = files.filter((file) => file.kind === 'image')
  return {
    root,
    generatedAt: new Date().toISOString(),
    stats: {
      documents: documents.length,
      images: images.length,
      folders: new Set(files.map((file) => file.folderPath).filter(Boolean)).size,
      categories: categoryMap.size,
    },
    categories: [...categoryMap.values()].sort((left, right) => nameCollator.compare(left.name, right.name)),
    folders: sortFolders(rootFolder.children),
    files,
  }
}

export const getLibrary = async (query: { search?: string; category?: string; limit?: number; offset?: number }): Promise<LibraryResponse> => {
  const rows = await listCatalogRows()
  const search = query.search?.trim().toLowerCase() ?? ''
  const category = query.category?.trim() ?? ''
  const filteredRows = rows.filter((row) => {
    const file = rowToFile(row)
    if (!file) return false
    const matchesCategory = !category || file.categoryPath === category
    const matchesSearch = !search || [file.title, file.name, file.folderPath].some((value) => value.toLowerCase().includes(search))
    return matchesCategory && matchesSearch
  })
  const offset = Math.max(0, query.offset ?? 0)
  const limit = Math.min(10000, Math.max(1, query.limit ?? 10000))
  return buildResponse(filteredRows.slice(offset, offset + limit), 'study-library')
}

export const getCatalogFile = async (storagePath: string): Promise<LibraryFile | null> => {
  const row = await findCatalogRow(storagePath)
  return row ? rowToFile(row) : null
}

export const isInlineFile = (file: LibraryFile): boolean => file.previewKind === 'markdown' || file.previewKind === 'text'
````

## File: api/src/server.ts

````ts
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import path from 'node:path'
import { Readable } from 'node:stream'
import express, { type NextFunction, type Request, type Response } from 'express'
import multer from 'multer'
import { config } from './config.js'
import { createUploadJob, findUploadJob, updateUploadJob } from './database.js'
import { createEpub } from './ebooks.js'
import { getCatalogFile, getLibrary, isInlineFile } from './library.js'
import { deleteObject, moveObject, requestObject, safeStoragePath, uniqueStorageDestination, uploadObject } from './storage.js'
import { syncCatalog } from './sync.js'
import { classifyUpload, isSafeSegment, maxUploadBytes, mimeTypeForExtension, normalizeFileName, previewKindForExtension, supportedExtensions } from './uploads.js'

const app = express()
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

const sessionSignature = (value: string): string => createHmac('sha256', config.sessionSecret ?? '').update(value).digest('base64url')

const readCookie = (request: Request, name: string): string | null => {
  const cookies = request.headers.cookie?.split(';').map((cookie) => cookie.trim()) ?? []
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`))
  if (!cookie) return null
  try {
    return decodeURIComponent(cookie.slice(name.length + 1))
  } catch {
    return null
  }
}

const isValidSession = (request: Request): boolean => {
  if (!config.accessPassword) return true
  const value = readCookie(request, config.sessionCookieName)
  if (!value) return false
  const separator = value.lastIndexOf('.')
  if (separator < 1) return false
  const payload = value.slice(0, separator)
  const signature = value.slice(separator + 1)
  const expected = sessionSignature(payload)
  const timestamp = Number(payload.split('.')[0])
  if (signature.length !== expected.length || !Number.isFinite(timestamp) || Date.now() - timestamp > config.sessionLifetimeMs || Date.now() - timestamp < 0) return false
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

const sessionCookie = (): string => {
  const payload = `${Date.now()}.${randomUUID()}`
  const secure = config.nodeEnv === 'production' ? '; Secure' : ''
  const sameSite = config.nodeEnv === 'production' ? 'None' : 'Lax'
  return `${config.sessionCookieName}=${encodeURIComponent(`${payload}.${sessionSignature(payload)}`)}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${Math.floor(config.sessionLifetimeMs / 1000)}${secure}`
}

const clearSessionCookie = (): string => `${config.sessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`

const passwordMatches = (password: string): boolean => {
  const expected = createHmac('sha256', config.sessionSecret ?? '').update(config.accessPassword ?? '').digest()
  const actual = createHmac('sha256', config.sessionSecret ?? '').update(password).digest()
  return timingSafeEqual(actual, expected)
}

const clientKey = (request: Request): string => request.ip || request.socket.remoteAddress || 'unknown'

const canAttemptLogin = (request: Request): boolean => {
  const now = Date.now()
  const key = clientKey(request)
  const current = loginAttempts.get(key)
  if (!current || current.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  if (current.count >= 10) return false
  current.count += 1
  return true
}

const queryValue = (value: unknown): string | undefined => typeof value === 'string' ? value : undefined

const parseInteger = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'string' ? Number(value) : NaN
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

const syncTokenMatches = (request: Request): boolean => {
  if (!config.catalogSyncToken) return false
  const supplied = request.header('x-catalog-sync-token') ?? ''
  const expected = config.catalogSyncToken
  return supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
}

const sendRemoteFile = async (request: Request, response: Response, filePath: string, fallbackMimeType: string): Promise<boolean> => {
  const remoteResponse = await requestObject(filePath, {
    headers: request.headers.range ? { range: request.headers.range } : {},
  })
  if (remoteResponse.status === 404) return false
  if (!remoteResponse.ok) throw new Error(`Storage request failed with status ${remoteResponse.status}.`)

  response.status(remoteResponse.status)
  response.setHeader('Content-Type', remoteResponse.headers.get('content-type') ?? fallbackMimeType)
  for (const headerName of ['content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified', 'cache-control']) {
    const value = remoteResponse.headers.get(headerName)
    if (value) response.setHeader(headerName, value)
  }

  if (remoteResponse.body) Readable.fromWeb(remoteResponse.body as unknown as Parameters<typeof Readable.fromWeb>[0]).pipe(response)
  else response.end()
  return true
}

app.disable('x-powered-by')
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', config.webOrigin)
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Headers', 'content-type, range, x-catalog-sync-token')
  response.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, POST, OPTIONS')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('X-Frame-Options', 'SAMEORIGIN')
  response.setHeader('Referrer-Policy', 'same-origin')
  response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  if (request.method === 'OPTIONS') {
    response.status(204).end()
    return
  }
  next()
})
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'study-library-api', storage: config.storageBucket, database: 'supabase-postgres', authRequired: Boolean(config.accessPassword) })
})

app.get('/api/auth/session', (request, response) => {
  response.json({ authenticated: isValidSession(request), required: Boolean(config.accessPassword) })
})

app.post('/api/auth/login', (request, response) => {
  if (!config.accessPassword) {
    response.json({ authenticated: true, required: false })
    return
  }
  if (!canAttemptLogin(request)) {
    response.status(429).json({ message: 'Too many sign-in attempts. Try again later.' })
    return
  }
  const body = request.body as { password?: unknown }
  if (typeof body.password !== 'string' || !passwordMatches(body.password)) {
    response.status(401).json({ message: 'The access password is incorrect.' })
    return
  }
  loginAttempts.delete(clientKey(request))
  response.setHeader('Set-Cookie', sessionCookie())
  response.json({ authenticated: true, required: true })
})

app.post('/api/auth/logout', (_request, response) => {
  response.setHeader('Set-Cookie', clearSessionCookie())
  response.json({ authenticated: false, required: Boolean(config.accessPassword) })
})

app.use('/api', (request, response, next) => {
  const publicPath = ['/health', '/auth/session', '/auth/login', '/auth/logout'].includes(request.path)
  if (!config.accessPassword || publicPath) {
    next()
    return
  }
  if (!isValidSession(request)) {
    response.status(401).json({ code: 'AUTH_REQUIRED', message: 'Sign in to access this study library.' })
    return
  }
  next()
})

app.get('/api/library', async (request, response, next) => {
  try {
    response.json(await getLibrary({
      search: queryValue(request.query.q),
      category: queryValue(request.query.category),
      limit: parseInteger(request.query.limit, 10000),
      offset: parseInteger(request.query.offset, 0),
    }))
  } catch (error) {
    next(error)
  }
})

app.get('/api/content', async (request, response, next) => {
  const requestedPath = queryValue(request.query.path)
  const filePath = requestedPath ? safeStoragePath(requestedPath) : null
  try {
    const file = filePath ? await getCatalogFile(filePath) : null
    if (!file || !isInlineFile(file)) {
      response.status(404).json({ message: 'That study note could not be found.' })
      return
    }
    const remoteResponse = await requestObject(file.path)
    if (!remoteResponse.ok) {
      response.status(404).json({ message: 'That study note could not be found.' })
      return
    }
    response.json({ path: file.path, content: await remoteResponse.text(), modifiedAt: file.modifiedAt })
  } catch (error) {
    next(error)
  }
})

app.get('/api/asset', async (request, response, next) => {
  const requestedPath = queryValue(request.query.path)
  const filePath = requestedPath ? safeStoragePath(requestedPath) : null
  try {
    const file = filePath ? await getCatalogFile(filePath) : null
    if (!file || file.previewKind !== 'image' || !(await sendRemoteFile(request, response, file.path, file.mimeType))) {
      response.status(404).json({ message: 'That visual could not be found.' })
    }
  } catch (error) {
    next(error)
  }
})

app.get('/api/file', async (request, response, next) => {
  const requestedPath = queryValue(request.query.path)
  const filePath = requestedPath ? safeStoragePath(requestedPath) : null
  try {
    const file = filePath ? await getCatalogFile(filePath) : null
    if (!file || !(await sendRemoteFile(request, response, file.path, file.mimeType))) {
      response.status(404).json({ message: 'That study file could not be found.' })
    }
  } catch (error) {
    next(error)
  }
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxUploadBytes },
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase()
    if (!supportedExtensions.has(extension)) {
      callback(new Error(`Unsupported upload type: ${extension || 'unknown'}.`))
      return
    }
    callback(null, true)
  },
})

app.post('/api/uploads', (request, response, next) => {
  upload.single('file')(request, response, async (error: unknown) => {
    if (error) {
      const message = error instanceof Error ? error.message : 'The upload could not be accepted.'
      const status = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE' ? 413 : 400
      response.status(status).json({ message })
      return
    }
    if (!request.file) {
      response.status(400).json({ message: 'Choose a textbook, note, image, or supported study file first.' })
      return
    }

    const extension = path.extname(request.file.originalname).toLowerCase()
    const id = randomUUID()
    const stagedPath = `.study-library-inbox/${id}${extension}`
    try {
      const { classification, previewText } = await classifyUpload(request.file.originalname, request.file.buffer, extension)
      const mimeType = request.file.mimetype || mimeTypeForExtension(extension)
      await uploadObject(stagedPath, request.file.buffer, mimeType)
      await createUploadJob({
        id,
        storage_path: stagedPath,
        original_name: request.file.originalname,
        classification: { ...classification, extension, mimeType, size: request.file.size, previewText: previewText.slice(0, 2400) },
      })
      response.status(201).json({
        upload: {
          id,
          originalName: request.file.originalname,
          extension,
          mimeType,
          previewKind: previewKindForExtension(extension),
          size: request.file.size,
          uploadedAt: new Date().toISOString(),
          classification,
          previewText: previewText.slice(0, 2400),
        },
      })
    } catch (uploadError) {
      await deleteObject(stagedPath).catch(() => undefined)
      next(uploadError)
    }
  })
})

app.post('/api/uploads/:id/commit', async (request, response, next) => {
  const uploadId = request.params.id
  try {
    const job = await findUploadJob(uploadId)
    if (!job || job.status !== 'staged') {
      response.status(404).json({ message: 'That staged upload is no longer available.' })
      return
    }

    const classification = typeof job.classification === 'object' && job.classification !== null && !Array.isArray(job.classification) ? job.classification as Record<string, unknown> : {}
    const extension = typeof classification.extension === 'string' ? classification.extension : path.posix.extname(job.original_name).toLowerCase()
    const suggestedFileName = typeof classification.suggestedFileName === 'string' ? classification.suggestedFileName : normalizeFileName(job.original_name, `untitled${extension}`, extension)
    const body = request.body as { category?: unknown; fileName?: unknown }
    const category = typeof body.category === 'string' && body.category.trim() ? body.category.trim() : 'Unsorted'
    const requestedName = typeof body.fileName === 'string' && body.fileName.trim() ? body.fileName.trim() : suggestedFileName
    if (!isSafeSegment(category) || !isSafeSegment(requestedName)) {
      response.status(400).json({ message: 'Choose a safe folder and filename without path separators or traversal segments.' })
      return
    }

    const requestedExtension = path.posix.extname(requestedName).toLowerCase()
    if (requestedExtension && requestedExtension !== extension) {
      response.status(400).json({ message: `The filename must keep the ${extension} extension.` })
      return
    }
    const fileName = `${requestedExtension ? requestedName.slice(0, -requestedExtension.length) : requestedName}${extension}`
    const destination = await uniqueStorageDestination(path.posix.join(category, fileName))
    await moveObject(job.storage_path, destination)
    await updateUploadJob(uploadId, { status: 'committed', committed_at: new Date().toISOString() })
    await syncCatalog()
    response.status(201).json({ path: destination, file: await getCatalogFile(destination) })
  } catch (error) {
    next(error)
  }
})

app.delete('/api/uploads/:id', async (request, response, next) => {
  try {
    const job = await findUploadJob(request.params.id)
    if (!job) {
      response.status(204).end()
      return
    }
    if (job.status === 'staged') await deleteObject(job.storage_path)
    await updateUploadJob(job.id, { status: 'discarded' })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/ebooks', async (request, response, next) => {
  const body = request.body as { path?: unknown; paths?: unknown; title?: unknown }
  const requestedPaths = Array.isArray(body.paths)
    ? body.paths.filter((value): value is string => typeof value === 'string')
    : typeof body.path === 'string' ? [body.path] : []
  const relativePaths = [...new Set(requestedPaths)].slice(0, 30)
  if (relativePaths.length === 0) {
    response.status(400).json({ message: 'Choose at least one Markdown or text file to create an ebook.' })
    return
  }

  try {
    const result = await createEpub(relativePaths, typeof body.title === 'string' ? body.title : '')
    const destination = await uniqueStorageDestination(result.path)
    await uploadObject(destination, result.archive, 'application/epub+zip')
    await syncCatalog()
    response.status(201).json({ path: destination, fileName: path.posix.basename(destination), file: await getCatalogFile(destination) })
  } catch (error) {
    if (error instanceof Error) {
      response.status(400).json({ message: error.message })
      return
    }
    next(error)
  }
})

app.post('/api/catalog/sync', async (request, response, next) => {
  if (!config.catalogSyncToken || !syncTokenMatches(request)) {
    response.status(config.catalogSyncToken ? 401 : 503).json({ message: 'Catalog sync is not configured for this service.' })
    return
  }
  try {
    response.status(200).json(await syncCatalog())
  } catch (error) {
    next(error)
  }
})

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : 'The API could not complete that request.'
  response.status(500).json({ message })
})

app.listen(config.port, '0.0.0.0', () => {
  process.stdout.write(`Study Library API listening on http://localhost:${config.port}\n`)
})
````

## File: api/src/storage.ts

````ts
import path from 'node:path'
import { config } from './config.js'

export type StorageObject = {
  path: string
  size: number
  modifiedAt: string
  mimeType: string
}

type StorageEntry = {
  name: string
  id?: string | null
  updated_at?: string | null
  metadata?: {
    size?: number | string
    mimetype?: string
  } | null
}

const storageBase = `${config.supabaseUrl}/storage/v1`

const storageHeaders = (headers: Record<string, string> = {}): Record<string, string> => ({
  apikey: config.supabaseServiceRoleKey,
  authorization: `Bearer ${config.supabaseServiceRoleKey}`,
  ...headers,
})

export const safeStoragePath = (filePath: string): string | null => {
  const normalized = path.posix.normalize(filePath.replace(/\\/g, '/'))
  if (!normalized || normalized === '.' || normalized.startsWith('/') || normalized.startsWith('../') || normalized.includes('/../') || normalized.includes('\0')) return null
  return normalized
}

const encodedPath = (filePath: string): string => filePath.split('/').map((segment) => encodeURIComponent(segment)).join('/')

export const requestObject = async (filePath: string, init: RequestInit = {}): Promise<globalThis.Response> => {
  const safePath = safeStoragePath(filePath)
  if (!safePath) throw new Error('That storage path is not allowed.')
  return fetch(`${storageBase}/object/${encodeURIComponent(config.storageBucket)}/${encodedPath(safePath)}`, {
    ...init,
    headers: storageHeaders((init.headers ?? {}) as Record<string, string>),
  })
}

export const uploadObject = async (filePath: string, content: Buffer, mimeType: string): Promise<void> => {
  const response = await requestObject(filePath, {
    method: 'POST',
    headers: {
      'content-type': mimeType,
      'cache-control': '3600',
      'x-upsert': 'false',
    },
    body: content as unknown as BodyInit,
  })
  if (!response.ok) throw new Error(`Storage upload failed with status ${response.status}.`)
}

export const deleteObject = async (filePath: string): Promise<void> => {
  const response = await requestObject(filePath, { method: 'DELETE' })
  if (!response.ok && response.status !== 404) throw new Error(`Storage deletion failed with status ${response.status}.`)
}

export const moveObject = async (sourcePath: string, destinationPath: string): Promise<void> => {
  const safeSource = safeStoragePath(sourcePath)
  const safeDestination = safeStoragePath(destinationPath)
  if (!safeSource || !safeDestination) throw new Error('That storage move is not allowed.')
  const response = await fetch(`${storageBase}/object/move`, {
    method: 'POST',
    headers: storageHeaders({ 'content-type': 'application/json' }),
    body: JSON.stringify({ bucketId: config.storageBucket, sourceKey: safeSource, destinationKey: safeDestination }),
  })
  if (!response.ok) throw new Error(`Storage move failed with status ${response.status}.`)
}

const objectExists = async (filePath: string): Promise<boolean> => {
  const response = await requestObject(filePath, { method: 'HEAD' })
  if (response.status === 404) return false
  if (response.ok) return true
  throw new Error(`Storage lookup failed with status ${response.status}.`)
}

export const uniqueStorageDestination = async (filePath: string): Promise<string> => {
  const safePath = safeStoragePath(filePath)
  if (!safePath) throw new Error('That storage destination is not allowed.')
  const extension = path.posix.extname(safePath)
  const stem = extension ? safePath.slice(0, -extension.length) : safePath
  let candidate = safePath
  let suffix = 2
  while (await objectExists(candidate)) {
    candidate = `${stem}-${suffix}${extension}`
    suffix += 1
  }
  return candidate
}

export const listStorageObjects = async (prefix = '', visitedPrefixes = new Set<string>()): Promise<StorageObject[]> => {
  if (visitedPrefixes.has(prefix)) return []
  visitedPrefixes.add(prefix)
  const objects: StorageObject[] = []
  let offset = 0
  const pageSize = 1000

  while (true) {
    const response = await fetch(`${storageBase}/object/list/${encodeURIComponent(config.storageBucket)}`, {
      method: 'POST',
      headers: storageHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify({ prefix, limit: pageSize, offset, sortBy: { column: 'name', order: 'asc' } }),
    })
    if (!response.ok) throw new Error(`Storage listing failed with status ${response.status}.`)

    const entries = await response.json() as StorageEntry[]
    if (entries.length === 0) break

    for (const entry of entries) {
      const entryPath = prefix ? `${prefix}/${entry.name}` : entry.name
      if (!entryPath || entryPath.split('/').some((segment) => !segment || segment.startsWith('.'))) continue
      if (entry.id) {
        const rawSize = typeof entry.metadata?.size === 'string' ? Number(entry.metadata.size) : entry.metadata?.size
        objects.push({
          path: entryPath,
          size: Number.isFinite(rawSize) ? Number(rawSize) : 0,
          modifiedAt: entry.updated_at ?? new Date(0).toISOString(),
          mimeType: entry.metadata?.mimetype ?? 'application/octet-stream',
        })
      } else {
        objects.push(...await listStorageObjects(entryPath, visitedPrefixes))
      }
    }

    if (entries.length < pageSize) break
    offset += pageSize
  }

  return objects
}
````

## File: api/src/sync.ts

````ts
import path from 'node:path'
import { upsertCatalogRows, type CatalogInsert } from './database.js'
import { listStorageObjects } from './storage.js'
import type { CatalogSyncResult } from './types.js'

const supportedExtensions = new Set([
  '.md', '.markdown', '.mdx', '.pdf', '.txt', '.csv', '.json', '.xml', '.yaml', '.yml', '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.sql', '.c', '.cc', '.cpp', '.go', '.h', '.hpp', '.java', '.mjs', '.rs', '.sh', '.tex', '.toml',
  '.docx', '.epub', '.pptx', '.xlsx', '.odt', '.ods', '.odp', '.azw', '.azw3', '.mobi', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif',
])

const previewKindForExtension = (extension: string): string => {
  if (['.md', '.markdown', '.mdx'].includes(extension)) return 'markdown'
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'].includes(extension)) return 'image'
  if (extension === '.pdf') return 'pdf'
  if (['.c', '.cc', '.cpp', '.css', '.csv', '.go', '.h', '.hpp', '.html', '.java', '.js', '.json', '.jsx', '.mjs', '.py', '.rs', '.sh', '.sql', '.tex', '.toml', '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml'].includes(extension)) return 'text'
  if (extension === '.epub') return 'epub'
  return 'download'
}

const deriveTitle = (storagePath: string, extension: string): string => path.posix.basename(storagePath, extension).replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ')

const syncCatalog = async (): Promise<CatalogSyncResult> => {
  const objects = await listStorageObjects()
  const rows: CatalogInsert[] = []

  for (const object of objects) {
    const extension = path.posix.extname(object.path).toLowerCase()
    if (!supportedExtensions.has(extension)) continue
    const segments = object.path.split('/')
    rows.push({
      storage_path: object.path,
      title: deriveTitle(object.path, extension),
      extension,
      preview_kind: previewKindForExtension(extension),
      mime_type: object.mimeType,
      size_bytes: object.size,
      category_path: segments.length > 1 ? segments[0] : '',
      folder_path: segments.slice(0, -1).join('/'),
      modified_at: object.modifiedAt,
      metadata: {},
    })
  }

  await upsertCatalogRows(rows)
  return { scanned: objects.length, indexed: rows.length, skipped: objects.length - rows.length, generatedAt: new Date().toISOString() }
}

export { syncCatalog }

if (process.argv[1]?.endsWith('/sync.ts')) {
  syncCatalog()
    .then((result) => process.stdout.write(`${JSON.stringify(result)}\n`))
    .catch((error: unknown) => {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
      process.exitCode = 1
    })
}
````

## File: api/src/types.ts

````ts
export type FileKind = 'document' | 'image'
export type PreviewKind = 'markdown' | 'image' | 'pdf' | 'text' | 'epub' | 'download'

export type LibraryFile = {
  path: string
  name: string
  kind: FileKind
  category: string
  categoryPath: string
  folderPath: string
  extension: string
  title: string
  previewKind: PreviewKind
  mimeType: string
  size: number
  modifiedAt: string
}

export type FolderNode = {
  name: string
  path: string
  documents: LibraryFile[]
  images: LibraryFile[]
  children: FolderNode[]
}

export type CategorySummary = {
  name: string
  path: string
  documents: number
  images: number
  folders: number
}

export type LibraryResponse = {
  root: string
  generatedAt: string
  stats: {
    documents: number
    images: number
    folders: number
    categories: number
  }
  categories: CategorySummary[]
  folders: FolderNode[]
  files: LibraryFile[]
}

export type CatalogSyncResult = {
  scanned: number
  indexed: number
  skipped: number
  generatedAt: string
}
````

## File: api/src/uploads.ts

````ts
import path from 'node:path'
import { getLibrary } from './library.js'
import type { PreviewKind } from './types.js'

export type UploadClassification = {
  category: string
  suggestedFileName: string
  summary: string
  tags: string[]
  confidence: number
  source: 'rules'
}

export type UploadPreview = {
  id: string
  originalName: string
  extension: string
  mimeType: string
  previewKind: PreviewKind
  size: number
  uploadedAt: string
  classification: UploadClassification
  previewText: string
}

export const maxUploadBytes = Number.isFinite(Number(process.env.MAX_UPLOAD_BYTES)) && Number(process.env.MAX_UPLOAD_BYTES) > 0 ? Math.floor(Number(process.env.MAX_UPLOAD_BYTES)) : 100 * 1024 * 1024

const markdownExtensions = new Set(['.md', '.markdown', '.mdx'])
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'])
const textExtensions = new Set(['.c', '.cc', '.cpp', '.css', '.csv', '.go', '.h', '.hpp', '.html', '.java', '.js', '.json', '.jsx', '.mjs', '.py', '.rs', '.sh', '.sql', '.tex', '.toml', '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml'])
export const supportedExtensions = new Set([...markdownExtensions, ...imageExtensions, ...textExtensions, '.pdf', '.azw', '.azw3', '.docx', '.epub', '.mobi', '.odp', '.ods', '.odt', '.pptx', '.xlsx'])

export const previewKindForExtension = (extension: string): PreviewKind => {
  if (markdownExtensions.has(extension)) return 'markdown'
  if (imageExtensions.has(extension)) return 'image'
  if (extension === '.pdf') return 'pdf'
  if (textExtensions.has(extension)) return 'text'
  if (extension === '.epub') return 'epub'
  return 'download'
}

export const mimeTypeForExtension = (extension: string): string => {
  if (extension === '.svg') return 'image/svg+xml'
  if (extension === '.avif') return 'image/avif'
  if (imageExtensions.has(extension)) return `image/${extension === '.jpg' ? 'jpeg' : extension.slice(1)}`
  if (extension === '.pdf') return 'application/pdf'
  if (extension === '.json') return 'application/json'
  if (extension === '.csv') return 'text/csv'
  if (extension === '.html') return 'text/html'
  if (extension === '.xml') return 'application/xml'
  if (extension === '.docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (extension === '.pptx') return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  if (extension === '.xlsx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (extension === '.epub') return 'application/epub+zip'
  if (textExtensions.has(extension)) return 'text/plain'
  return 'application/octet-stream'
}

export const isSafeSegment = (value: string): boolean => {
  const trimmed = value.trim()
  return Boolean(trimmed) && trimmed !== '.' && trimmed !== '..' && !trimmed.startsWith('.') && !trimmed.includes('/') && !trimmed.includes('\\') && !trimmed.includes('..')
}

export const normalizeFileName = (value: string, fallback: string, extension: string): string => {
  const cleaned = value.trim().replace(/[\\/]/g, '-').replace(/[^\p{L}\p{N}._ -]/gu, '_').replace(/\s+/g, ' ')
  const candidate = cleaned || fallback
  const candidateExtension = path.posix.extname(candidate).toLowerCase()
  const stem = candidateExtension ? candidate.slice(0, -candidateExtension.length) : candidate
  return `${stem.slice(0, 140)}${extension}`
}

const classificationCategories = async (): Promise<string[]> => {
  const library = await getLibrary({ limit: 10000 })
  return [...new Set([...library.categories.filter((category) => category.path).map((category) => category.name), 'Unsorted'])]
}

export const classifyUpload = async (originalName: string, buffer: Buffer, extension: string): Promise<{ classification: UploadClassification; previewText: string }> => {
  const previewKind = previewKindForExtension(extension)
  const previewText = previewKind === 'markdown' || previewKind === 'text' ? buffer.toString('utf8').slice(0, 16000) : ''
  const categories = await classificationCategories()
  const searchableText = `${originalName}\n${previewText}`.toLowerCase()
  const category = categories.find((candidate) => candidate !== 'Unsorted' && searchableText.includes(candidate.toLowerCase())) ?? 'Unsorted'
  const title = originalName.replace(new RegExp(`${extension.replace('.', '\\.')}$`, 'i'), '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ').trim()
  return {
    previewText,
    classification: {
      category,
      suggestedFileName: normalizeFileName(originalName, `untitled${extension}`, extension),
      summary: title ? `Ready to review: ${title}.` : 'Ready to review this upload.',
      tags: [],
      confidence: category === 'Unsorted' ? 0.25 : 0.45,
      source: 'rules',
    },
  }
}
````

## File: api/tsconfig.json

````json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023", "DOM"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["node"],
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "outDir": "dist",
    "rootDir": "src",
    "sourceMap": true
  },
  "include": ["src"]
}
````

