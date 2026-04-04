import path from "node:path"
import { fileURLToPath } from "node:url"

import Database from "better-sqlite3"

import logger from "../helpers/logger.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH ?? path.resolve(__dirname, "../../data/phoebe.db")

let db = null

try {
  db = new Database(DB_PATH)
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
