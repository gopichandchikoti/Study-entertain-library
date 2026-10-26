// Makes a consistent copy of the accounts / saved-Markdown SQLite database.
// Safe to run while the server is running (it uses VACUUM INTO, not a file copy).
//
//   node scripts/backup-db.mjs [destination-folder]
//
// The database path comes from PERSONAL_DB_PATH (environment or .env), else data/study-library.sqlite.
// The destination defaults to data/backups. Keep a copy on a different disk too.
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { parseEnv } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dotEnv = existsSync(path.join(root, '.env')) ? parseEnv(readFileSync(path.join(root, '.env'), 'utf8')) : {}
const source = path.resolve(
  process.env.PERSONAL_DB_PATH ?? dotEnv.PERSONAL_DB_PATH ?? path.join(root, 'data', 'study-library.sqlite'),
)
const folder = path.resolve(process.argv[2] ?? path.join(root, 'data', 'backups'))

if (!existsSync(source)) {
  console.error(`No database found at ${source}. Set PERSONAL_DB_PATH if it lives elsewhere.`)
  process.exit(1)
}

mkdirSync(folder, { recursive: true })
const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19)
const target = path.join(folder, `study-library-${stamp}.sqlite`)
if (existsSync(target)) {
  console.error(`${target} already exists; wait a second and try again.`)
  process.exit(1)
}

const database = new DatabaseSync(source, { readOnly: true })
try {
  // VACUUM INTO does not accept a bound parameter, so quote the path as an SQL string literal.
  database.exec(`VACUUM INTO '${target.replaceAll("'", "''")}'`)
} finally {
  database.close()
}

console.log(`Backed up ${source}\n        to ${target} (${statSync(target).size} bytes)`)
