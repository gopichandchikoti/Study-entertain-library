import { createApp } from './app.js'
import { loadConfig } from './config.js'
import { createCatalog } from './database.js'
import { createStorage } from './storage.js'

const SHUTDOWN_GRACE_MS = 10_000
/** Longer than the proxy's idle timeout, so the proxy never reuses a connection this side has just closed. */
const KEEP_ALIVE_MS = 65_000

const config = loadConfig()
const app = createApp(config, { storage: createStorage(config), catalog: createCatalog(config) })

const server = app.listen(config.port, '0.0.0.0', () => {
  process.stdout.write(`Study Library API listening on port ${config.port}\n`)
})
server.keepAliveTimeout = KEEP_ALIVE_MS
server.headersTimeout = KEEP_ALIVE_MS + 1000

/** Stop accepting connections and let in-flight requests finish. */
const shutdown = (): void => {
  const force = setTimeout(() => process.exit(1), SHUTDOWN_GRACE_MS)
  force.unref()
  server.close(() => process.exit(0))
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
