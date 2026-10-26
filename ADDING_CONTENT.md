# Adding Content to the Study Library

This app is a local-first, file-backed study library. Study files live on disk, and the app builds its library view by scanning a configured content directory. Browser imports stage files on the server, ask for a category suggestion, and write the file into the library only after approval.

> Current status: manual filesystem import, browser uploads, PDF/text/image readers, textbook fallbacks, and approval-based categorization are implemented. LLM classification is optional; without a configured provider, a local filename/category suggestion is used.

For internet deployment, set `STORAGE_MODE=supabase` and use the private
Supabase Storage bucket described in [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md).
Hosted files are not written to the web host's local disk. Seed an existing
library with `pnpm storage:seed`, then use the same upload and approval flow
through the REST API. Keep Supabase service-role credentials on the server.

## Storage map

### Local filesystem mode

Store source files below the active content root:

```text
STUDY_CONTENT_DIR/
├── System Design/
│   ├── 01-foundations.md
│   └── distributed-systems.pdf
├── Programming/
│   └── algorithms.epub
└── Ebooks/
  └── my-study-collection.epub
```

The local server scans this tree. It returns metadata through `GET /api/library`,
Markdown/text through `GET /api/content?path=...`, images through
`GET /api/asset?path=...`, and PDFs/EPUBs/other files through
`GET /api/file?path=...`. The browser never receives an absolute machine path.

Do not store study files in `src/`, `public/`, `dist/`, `node_modules/`, or
source control. Those locations are application code or generated output.

### Hosted object-storage mode

Store the same relative folder layout as object keys in the private
`study-library` bucket:

```text
System Design/01-foundations.md
System Design/distributed-systems.pdf
Programming/algorithms.epub
Ebooks/my-study-collection.epub
```

The independent `api/` service records each object in PostgreSQL
`library_items`. The database stores the title, type, size, category, modified
time, and storage key; the file bytes remain in private Storage. The API
validates the key, authorizes the request, and streams the object, including
byte ranges for large PDFs where supported. Never make the bucket public and
never put the service-role key in React, Android, `VITE_*`, or a URL.

### Scaling ebooks

As the collection grows, keep originals immutable and use stable catalog IDs.
Add metadata such as author, ISBN, language, cover key, page count, checksum,
parser status, and extracted-text status to `library_items.metadata` or a
future migration. Search and pagination should query PostgreSQL; opening a book
should fetch only its metadata and the requested content/range. Large PDFs and
EPUBs must never be loaded into the library-list response.

A new format is supported only after its extension and MIME are allowlisted,
its browser behavior is known, and its failure mode is explicit. If a format
cannot be rendered safely, index it as a download instead of pretending it is a
reader. Generated EPUBs follow the same private-storage path as uploaded books.

## 1. Where to add files

The server chooses the content root in this order:

1. `STUDY_CONTENT_DIR`, when that environment variable is set.
2. Otherwise, the directory directly above this repository.

For this checkout, the default content root is `/Users/gchikoti/Music`, while the app itself is `/Users/gchikoti/Music/study-library`. The app directory is excluded from the scan.

A custom content root can be used for development or deployment:

```bash
STUDY_CONTENT_DIR=/absolute/path/to/study-root pnpm dev
```

Put study material inside that root, not inside `src/`, `server/`, `public/`, or the app repository. Those folders contain the application itself or its built assets.

### Example: adding Python notes

With the default content root, create a top-level `Python` folder:

```text
/Users/gchikoti/Music/
├── Python/
│   ├── 00-start-here.md
│   ├── 01-syntax.md
│   ├── data-structures/
│   │   └── lists-and-dicts.md
│   └── images/
│       └── list-model.svg
└── study-library/
```

With a custom root, the same layout would be:

```text
/absolute/path/to/study-root/
└── Python/
    └── 00-start-here.md
```

The first folder below the content root becomes the category shown in the left rail. In this example, `Python` is the category. Nested folders remain part of the folder map and file paths. Files placed directly at the root appear under `Library root`.

The scanner supports these files:

| Purpose | Extensions |
| --- | --- |
| Markdown notes | `.md`, `.markdown`, `.mdx` |
| PDF textbooks | `.pdf` |
| Text and code | `.c`, `.cc`, `.cpp`, `.css`, `.csv`, `.go`, `.h`, `.hpp`, `.html`, `.java`, `.js`, `.json`, `.jsx`, `.mjs`, `.py`, `.rs`, `.sh`, `.sql`, `.tex`, `.toml`, `.ts`, `.tsx`, `.txt`, `.xml`, `.yaml`, `.yml` |
| Textbook and office files | `.azw`, `.azw3`, `.docx`, `.epub`, `.mobi`, `.odp`, `.ods`, `.odt`, `.pptx`, `.xlsx` |
| Images and visual references | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.avif` |

Use numeric prefixes such as `00-`, `01-`, and `02-` when reading order matters. The server sorts paths naturally, so `02-topic.md` follows `01-topic.md`.

Hidden directories and several application/build directories are ignored. Markdown and text files render inside the reading surface, PDFs open in an embedded browser viewer, images use the visual-reference panel, and DOCX/EPUB/office/ebook formats are indexed with an open/download fallback when the browser cannot render them directly.

## 2. How a new file appears in the app

The update path is deliberately simple:

1. Create or copy a supported file into the configured content root, or click **Import study file** in the app.
2. For a manual file, click **Rescan folders**. For an app import, choose or drop the file and wait for the review screen.
3. Review the suggested folder and filename. The file is still in a hidden staging inbox at this point.
4. Click **Add to library** to move it into the selected top-level category. The client requests a fresh library scan after the move.
5. The client requests `GET /api/library`, and `server/index.ts` recursively scans the content root into a fresh in-memory inventory.
6. Selecting Markdown or text requests `GET /api/content?path=...`; images use `GET /api/asset?path=...`; PDFs and other indexed files use `GET /api/file?path=...`.

There is no background filesystem watcher and no persistent index. The library is regenerated when the app first loads, after an approved import, or when **Rescan folders** is pressed. A restart is not normally required after adding a study file.

The relevant implementation surfaces are:

- [server/index.ts](server/index.ts): content-root selection, supported extensions, recursive scan, and API routes.
- [src/api.ts](src/api.ts): client requests for the library, Markdown content, and images.
- [src/App.tsx](src/App.tsx): initial load, **Rescan folders**, search, categories, and reading views.
- [src/types.ts](src/types.ts): the file and library response shapes.

### If a file does not appear

Check these items in order:

- The extension is in the supported list above.
- The file is inside the active `STUDY_CONTENT_DIR` or the default parent directory.
- The file is not hidden and is not inside an ignored directory.
- The app has permission to read the file.
- **Rescan folders** was pressed after the file was copied.
- The file was not accidentally placed inside `study-library/src`, `public`, or another app directory.

## 3. Uploading from the app

Click **Import study file** and choose a file or drop it into the import area. The server:

- validates the extension and upload size;
- stores the file in the hidden `.study-library-inbox` staging directory;
- extracts Markdown/text content, PDF text, or DOCX text when possible;
- creates an AI suggestion when a provider is configured, otherwise uses a local filename/category fallback;
- lets you review the folder and filename before writing into the content root.

The browser never chooses an absolute path. The server validates the category, filename, extension, and destination before moving the staged file. Closing the review dialog discards the staged upload.

The default upload limit is 100 MB. Override it with `MAX_UPLOAD_BYTES` when the server needs to accept larger textbooks:

```bash
MAX_UPLOAD_BYTES=250000000 pnpm dev
```

## 4. Configuring AI classification

AI already sits on the server between upload and the final filesystem move. The browser never receives an LLM API key, and the model cannot choose an arbitrary absolute path. The app accepts any OpenAI-compatible chat-completions endpoint, including hosted providers and local Ollama.

### OpenAI-compatible provider

Set these server-side variables before starting the app. Do not prefix the secret with `VITE_` because that would expose it to the browser.

```bash
AI_BASE_URL=https://api.openai.com/v1 \\
AI_API_KEY=your-server-only-key \\
AI_MODEL=gpt-4o-mini \\
pnpm dev
```

For a local Ollama model:

```bash
AI_BASE_URL=http://127.0.0.1:11434/v1 \\
AI_MODEL=llama3.2 \\
pnpm dev
```

If the provider is unavailable or returns invalid JSON, the upload remains usable and falls back to local rules. The review screen always remains the authority for the final folder.

The import workflow is:

```text
Browser upload
    -> server staging inbox
    -> file validation and text extraction
    -> optional LLM returns a structured category suggestion
    -> server validates the suggestion against safe folder names
    -> user approves or changes the destination
    -> server moves the file into the content root
    -> client requests a fresh library scan
```

### Recommended implementation steps

1. **Upload and stage.** The server accepts a multipart upload, enforces a size limit, allowlists extensions, and assigns a server-generated temporary ID. Staged files stay outside the visible library until approved.
2. **Extract text safely.** Markdown and text are read directly. PDF and DOCX text is extracted for classification. Images and ebook formats still use filename/extension context unless an OCR or ebook parser is added.
3. **Call an LLM from the server.** Send the extracted preview and allowed category names to the configured OpenAI-compatible endpoint.
4. **Require structured output.** The server asks for JSON that matches a schema, for example:

   ```json
   {
     "category": "Python",
     "suggestedFileName": "lists-and-dicts.md",
     "summary": "Working with Python list and dictionary operations.",
     "tags": ["python", "data structures"],
     "confidence": 0.94
   }
   ```

5. **Validate the result in application code.** The server checks the category, normalizes the filename, rejects path separators and traversal segments, enforces the original extension, and keeps the LLM response as a suggestion rather than a filesystem command.
6. **Review before commit.** The dialog shows the suggested category, filename, summary, confidence, tags, and extracted preview. Approve, edit, or cancel the import.
7. **Commit and rescan.** After approval, the server moves the file to a folder such as `Python/`, and the client requests `GET /api/library` so it appears immediately.

### Folder policy

Start with an explicit allowlist rather than letting the model invent folders:

```text
Python
JavaScript
System Design
MCP servers
Unsorted
```

The allowlist can come from existing top-level folders or from a server configuration file. If the model suggests a new subject that has no approved folder, route it to `Unsorted` and let the user create or approve a new category.

### Privacy and security decisions

- Hosted LLMs receive the uploaded content. Do not send private notes to a hosted provider without an explicit privacy decision.
- A local model can keep content on the machine, but it still needs resource and quality checks.
- Keep provider keys in server environment variables, never in React code or `VITE_*` client variables.
- Treat uploaded documents as untrusted data. Prompt injection inside a note must not change the server's folder policy or tool permissions.
- Validate MIME type, extension, file size, filename, and destination path on the server.
- Keep originals and classification decisions auditable so a mistaken move can be reversed.

### Suggested code changes for the AI version

A small implementation could evolve the existing app like this:

- `server/index.ts`: add upload, staging, validation, classification, approval, and commit routes. Split these into server modules if the file grows.
- `src/api.ts`: add typed upload, classify, approve, and refresh requests.
- `src/types.ts`: add upload status and classification suggestion types.
- `src/App.tsx`: add an upload control and an approval view, then reuse the existing rescan behavior after commit.
- Environment configuration: add a server-only provider name, model name, and secret. Document the provider and privacy choice in deployment instructions.

The current implementation is intentionally approval-first. Add OCR, deeper EPUB extraction, automatic approval, or batch processing only after the basic import path is reliable.

## 5. Working with ebooks

### Importing ebooks

EPUB files open in the built-in reader after import. PDF textbooks open in the browser PDF viewer. DOCX, MOBI, AZW, and office formats are indexed and provide safe open/download actions; converting them to EPUB or PDF gives the best in-app reading experience.

To add a book you downloaded legally:

1. Keep the original file on your computer and confirm that the source permits your use of it.
2. Click **Import study file**.
3. Select the `.epub`, `.pdf`, `.docx`, `.mobi`, `.azw`, or other supported file.
4. Review the suggested folder and filename, then click **Add to library**.

The app does not scrape book websites or automatically download copyrighted books. Good starting points for public-domain or openly licensed books include:

| Source | What to look for |
| --- | --- |
| [Project Gutenberg](https://www.gutenberg.org/) | Public-domain books in EPUB and other formats |
| [Standard Ebooks](https://standardebooks.org/) | Carefully edited public-domain ebooks |
| [OpenStax](https://openstax.org/) | Openly licensed college textbooks |
| [Open Textbook Library](https://open.umn.edu/opentextbooks) | Open textbooks with license information |
| [LibreTexts](https://libretexts.org/) | Open educational textbooks and course material |
| [Internet Archive](https://archive.org/) | Public-domain and controlled-lending material; check each item license and lending terms |

For a commercial or copyrighted book, use the publisher, library, or store download that grants you access. Do not upload or share a book when its license does not permit it.

### Creating an ebook from your notes

Open a Markdown or text note and click the book icon in the reading toolbar. The app creates an EPUB 3 file under the `Ebooks/` category, downloads it to your browser, and rescans the library so the generated book is available in the app. The generated EPUB includes the note title, rendered Markdown or text, and the source path.

The current button exports the selected note. The server API can also accept up to 30 Markdown/text paths in one request for multi-chapter collections:

```bash
curl -X POST http://localhost:4445/api/ebooks \\
  -H 'content-type: application/json' \\
  --data '{"paths":["Python/00-start-here.md","Python/01-syntax.md"],"title":"Python Foundations"}'
```

Local images referenced by notes are not embedded into generated EPUBs yet. They continue to work in the app through the normal local asset route.

## Quick answers

- **Where should Python files go?** In a `Python/` folder directly inside the configured content root.
- **What updates the app?** The filesystem scan behind `GET /api/library`, started on initial load or by **Rescan folders**.
- **Can I upload from the app now?** Yes. Use **Import study file**, review the suggestion, and click **Add to library**.
- **Can an LLM categorize files now?** Yes, when `AI_BASE_URL` and optionally `AI_API_KEY` are configured. Without them, the local fallback still produces a reviewable suggestion.
- **Can I read EPUB books?** Yes. EPUBs use the built-in reader; PDFs use the browser viewer, and other ebook formats use open/download fallback actions.
- **Can I create an ebook?** Yes. Open a Markdown/text note and use the book icon, or call `POST /api/ebooks` for a multi-chapter collection.
