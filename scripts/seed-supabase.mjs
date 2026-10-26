import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'study-library'
const contentRoot = path.resolve(process.env.STUDY_CONTENT_DIR ?? path.join(process.cwd(), '..'))
const appDirectoryName = path.basename(process.cwd())
const ignoredDirectories = new Set([
  appDirectoryName,
  '.git',
  '.idea',
  '.vscode',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.study-library-inbox',
])
const supportedExtensions = new Set([
  '.md',
  '.markdown',
  '.mdx',
  '.pdf',
  '.txt',
  '.csv',
  '.json',
  '.xml',
  '.yaml',
  '.yml',
  '.py',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.html',
  '.css',
  '.sql',
  '.c',
  '.cc',
  '.cpp',
  '.go',
  '.h',
  '.hpp',
  '.java',
  '.mjs',
  '.rs',
  '.sh',
  '.tex',
  '.toml',
  '.docx',
  '.epub',
  '.pptx',
  '.xlsx',
  '.odt',
  '.ods',
  '.odp',
  '.azw',
  '.azw3',
  '.mobi',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
])

const mimeTypeFor = (extension) => {
  if (extension === '.pdf') return 'application/pdf'
  if (extension === '.epub') return 'application/epub+zip'
  if (extension === '.json') return 'application/json'
  if (extension === '.csv') return 'text/csv'
  if (extension === '.svg') return 'image/svg+xml'
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'].includes(extension))
    return extension === '.jpg' ? 'image/jpeg' : `image/${extension.slice(1)}`
  if (extension === '.docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (extension === '.pptx') return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  if (extension === '.xlsx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (['.html', '.xml'].includes(extension)) return extension === '.html' ? 'text/html' : 'application/xml'
  if (supportedExtensions.has(extension)) return 'text/plain'
  return 'application/octet-stream'
}

const encodePath = (relativePath) =>
  relativePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

const collectFiles = async (directory, relativeDirectory = '') => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name, undefined, { numeric: true, sensitivity: 'base' }),
  )) {
    if (entry.name.startsWith('.')) continue
    const relativePath = relativeDirectory ? path.join(relativeDirectory, entry.name) : entry.name
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) files.push(...(await collectFiles(absolutePath, relativePath)))
      continue
    }
    const extension = path.extname(entry.name).toLowerCase()
    if (entry.isFile() && supportedExtensions.has(extension))
      files.push({ absolutePath, path: relativePath.split(path.sep).join('/'), extension })
  }
  return files
}

const main = async () => {
  if (!supabaseUrl || !serviceRoleKey) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
  const files = await collectFiles(contentRoot)
  for (const file of files) {
    const response = await fetch(`${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodePath(file.path)}`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        'content-type': mimeTypeFor(file.extension),
        'cache-control': '3600',
        'x-upsert': 'true',
      },
      body: await readFile(file.absolutePath),
    })
    if (!response.ok) throw new Error(`Upload failed for ${file.path} with status ${response.status}.`)
    process.stdout.write(`Uploaded ${file.path}\n`)
  }
  process.stdout.write(`Seeded ${files.length} files into ${bucket}.\n`)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
