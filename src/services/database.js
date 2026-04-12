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
    `CREATE TABLE IF NOT EXISTS perticone_calls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      username TEXT,
      called_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_perticone_calls_chat_called
      ON perticone_calls (chat_id, called_at)`,
  ]

  for (const migration of migrations) {
    db.exec(migration)
  }

  logger.info("Okay the database is set up, don't make it weird 🗄️")
} catch (err) {
  logger.warn({ err }, "Ugh the database said no, using my brain instead 🧠")
  db = null
}

export default db
