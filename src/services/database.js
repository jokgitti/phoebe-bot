import Database from "better-sqlite3"

import { dbPath } from "../config/index.js"
import logger from "../helpers/logger.js"

let db = null

try {
  db = new Database(dbPath)
  db.pragma("journal_mode = WAL")

  logger.info("okay the database is set up, don't make it weird 🗄️")
} catch (err) {
  logger.warn({ err }, "ugh the database said no, using my brain instead 🧠")
  db = null
}

export function migrate(...statements) {
  if (!db) return
  for (const sql of statements) {
    try {
      db.exec(sql)
    } catch (err) {
      // ignore "duplicate column name" so additive ALTER TABLE migrations are idempotent
      if (!err.message?.includes("duplicate column name")) throw err
    }
  }
}

export default db
