import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export type PersonalCatalogEntry = {
  path: string
  title: string
  kind: 'document' | 'image' | 'video' | 'audio'
  mimeType: string
  size: number
  modifiedAt: string
}

export type PersonalCatalog = {
  sync: (entries: PersonalCatalogEntry[]) => void
  close: () => void
}

export const openPersonalCatalog = (databasePath: string): PersonalCatalog => {
  mkdirSync(path.dirname(databasePath), { recursive: true })
  const database = new DatabaseSync(databasePath)
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS catalog_items (
      path TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('document', 'image', 'video', 'audio')),
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL CHECK (size_bytes >= 0),
      modified_at TEXT NOT NULL,
      indexed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS catalog_items_kind_idx ON catalog_items(kind);
    CREATE INDEX IF NOT EXISTS catalog_items_title_idx ON catalog_items(title);
  `)

  const deleteKind = database.prepare('DELETE FROM catalog_items WHERE kind = ?')
  const insert = database.prepare(`
    INSERT INTO catalog_items (path, title, kind, mime_type, size_bytes, modified_at, indexed_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `)

  return {
    sync: (entries) => {
      database.exec('BEGIN IMMEDIATE')
      try {
        for (const kind of new Set(entries.map((entry) => entry.kind))) {
          deleteKind.run(kind)
        }
        for (const entry of entries) {
          insert.run(entry.path, entry.title, entry.kind, entry.mimeType, entry.size, entry.modifiedAt)
        }
        database.exec('COMMIT')
      } catch (error) {
        database.exec('ROLLBACK')
        throw error
      }
    },
    close: () => database.close(),
  }
}
