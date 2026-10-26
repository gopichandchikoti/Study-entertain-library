import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptFile = fileURLToPath(import.meta.url)
const projectRoot = path.resolve(path.dirname(scriptFile), '..')
const textExtensions = new Set([
  '.css',
  '.d.ts',
  '.html',
  '.java',
  '.json',
  '.js',
  '.jsx',
  '.kt',
  '.kts',
  '.mjs',
  '.md',
  '.pro',
  '.properties',
  '.sql',
  '.svg',
  '.ts',
  '.tsx',
  '.xml',
  '.yaml',
  '.yml',
])
const skipNames = new Set(['node_modules', 'dist', '.git', 'data', 'coverage'])
const skipExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.jar'])

const languageFor = (filePath) => {
  const extension = path.extname(filePath).toLowerCase()
  if (extension === '.ts' || extension === '.tsx' || extension === '.d.ts') return 'ts'
  if (extension === '.js' || extension === '.mjs' || extension === '.jsx') return 'js'
  if (extension === '.json') return 'json'
  if (extension === '.css') return 'css'
  if (extension === '.md') return 'md'
  if (extension === '.xml') return 'xml'
  if (extension === '.kt' || extension === '.kts') return 'kotlin'
  if (extension === '.sql') return 'sql'
  if (extension === '.yaml' || extension === '.yml') return 'yaml'
  if (extension === '.html') return 'html'
  if (extension === '.svg') return 'xml'
  return ''
}

const collectFiles = async (relativePath) => {
  const absolutePath = path.join(projectRoot, relativePath)
  const entries = await readdir(absolutePath, { withFileTypes: true })
  const files = []
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (skipNames.has(entry.name)) continue
    const childRelativePath = path.join(relativePath, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(childRelativePath)))
      continue
    }
    const extension = path.extname(entry.name).toLowerCase()
    if (textExtensions.has(extension) && !skipExtensions.has(extension)) files.push(childRelativePath)
  }
  return files
}

const fileList = async (entries) => {
  const files = []
  for (const entry of entries) {
    if (entry.endsWith('/**')) files.push(...(await collectFiles(entry.slice(0, -3))))
    else files.push(entry)
  }
  return [...new Set(files)].sort()
}

const groups = [
  {
    output: 'REPLICATION_SOURCE_WEB.md',
    title: 'Exact Web Shell Source Bundle',
    entries: [
      'package.json',
      'pnpm-lock.yaml',
      'webpack.config.mjs',
      'index.html',
      'tsconfig.json',
      'tsconfig.app.json',
      'tsconfig.server.json',
      '.oxlintrc.json',
      '.gitignore',
      '.env.example',
      'render.yaml',
      'public/**',
      'src/**',
    ],
  },
  {
    output: 'REPLICATION_SOURCE_SERVER.md',
    title: 'Exact Root Server and Storage Source Bundle',
    entries: ['server/**', 'scripts/**', 'supabase/**'],
  },
  {
    output: 'REPLICATION_SOURCE_API.md',
    title: 'Exact Independent API Source Bundle',
    entries: ['api/**'],
  },
  {
    output: 'REPLICATION_SOURCE_ANDROID.md',
    title: 'Exact Android Wrapper Source Bundle',
    entries: ['android/**'],
  },
  {
    output: 'REPLICATION_SOURCE_DOCS.md',
    title: 'Exact Project Memory and Operations Bundle',
    entries: [
      'README.md',
      'ADDING_CONTENT.md',
      'SYSTEM_DESIGN.md',
      'OPERATIONS.md',
      'FEATURE_LOG.md',
      'REPLICATION_GUIDE.md',
      'CHAT_BOOTSTRAP.md',
      '.github/**',
    ],
  },
]

const renderGroup = async (group) => {
  const files = await fileList(group.entries)
  const sections = [
    `# ${group.title}`,
    '',
    'This file is a generated exact source bundle. Create each target path and copy the corresponding fenced block verbatim. Do not redesign or paraphrase these files during exact replication.',
    '',
    `Generated from the current project on ${new Date().toISOString()}.`,
    '',
  ]

  for (const relativePath of files) {
    const absolutePath = path.join(projectRoot, relativePath)
    const source = await readFile(absolutePath, 'utf8')
    const fence = source.includes('````') ? '`````' : '````'
    sections.push(`## File: ${relativePath}`, '', `${fence}${languageFor(relativePath)}`, source.trimEnd(), `${fence}`, '')
  }

  await writeFile(path.join(projectRoot, group.output), `${sections.join('\n')}\n`, 'utf8')
}

for (const group of groups) await renderGroup(group)
process.stdout.write(`Generated ${groups.length} exact source bundles.\n`)
