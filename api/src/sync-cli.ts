import { loadConfig } from './config.js'
import { createCatalog } from './database.js'
import { createStorage } from './storage.js'
import { syncCatalog } from './sync.js'

/** `pnpm catalog:sync`: index the bucket into the catalog without starting the web service. */
const config = loadConfig()
syncCatalog(createCatalog(config), createStorage(config))
  .then((result) => process.stdout.write(`${JSON.stringify(result)}\n`))
  .catch((error: unknown) => {
    process.stderr.write(`Catalog sync failed: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  })
