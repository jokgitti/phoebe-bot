import Database from "better-sqlite3"

import { dbPath } from "../config/index.js"
import logger from "../helpers/logger.js"

let db = null

try {
  db = new Database(dbPath)
  db.pragma("journal_mode = WAL")

  const migrations = [
    `CREATE TABLE IF NOT EXISTS perticone (
      chat_id INTEGER PRIMARY KEY,
      last_mention TEXT NOT NULL
    )`,
  ]

  for (const migration of migrations) {
    db.exec(migration)
  }

  logger.info("Database initialized")
} catch (err) {
  logger.warn({ err }, "Failed to initialize database, falling back to in-memory")
  db = null
}

export default db
