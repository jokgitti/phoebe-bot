import { historyLimit } from "../config/index.js"
import logger from "../helpers/logger.js"
import db, { migrate } from "./database.js"

migrate(`CREATE TABLE IF NOT EXISTS phoebe_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  command TEXT NOT NULL,
  params TEXT,
  message_id INTEGER NOT NULL
)`)

// in-memory fallback when db is unavailable
const memoryHistory = new Map()

export function pushHistory(userId, command, params, messageId) {
  if (!db) {
    const stack = memoryHistory.get(userId) ?? []
    stack.push({ command, params, messageId })
    if (stack.length > historyLimit) stack.shift()
    memoryHistory.set(userId, stack)
    return
  }
  try {
    db.prepare("INSERT INTO phoebe_history (user_id, command, params, message_id) VALUES (?, ?, ?, ?)").run(
      userId,
      command,
      params != null ? JSON.stringify(params) : null,
      messageId
    )
    // trim oldest entries beyond the limit
    db.prepare(
      `DELETE FROM phoebe_history WHERE user_id = ? AND id NOT IN (
        SELECT id FROM phoebe_history WHERE user_id = ? ORDER BY id DESC LIMIT ?
      )`
    ).run(userId, userId, historyLimit)
  } catch (err) {
    logger.error({ err }, "pushHistory failed — history entry lost")
  }
}

// returns the most recent entry without removing it (for undo)
export function peekHistory(userId) {
  if (!db) {
    const stack = memoryHistory.get(userId)
    return stack?.at(-1) ?? null
  }
  const row = db.prepare("SELECT * FROM phoebe_history WHERE user_id = ? ORDER BY id DESC LIMIT 1").get(userId)
  if (!row) return null
  return {
    id: row.id,
    command: row.command,
    params: row.params ? JSON.parse(row.params) : null,
    messageId: row.message_id,
  }
}

// returns the most recent look_for/look_again entry (for look again)
export function peekLastLookState(userId) {
  if (!db) {
    const stack = memoryHistory.get(userId)
    if (!stack) return null
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].command === "look_for" || stack[i].command === "look_again") return stack[i]
    }
    return null
  }
  const row = db
    .prepare(
      `SELECT * FROM phoebe_history
       WHERE user_id = ? AND command IN ('look_for', 'look_again')
       ORDER BY id DESC LIMIT 1`
    )
    .get(userId)
  if (!row) return null
  return { id: row.id, command: row.command, params: JSON.parse(row.params), messageId: row.message_id }
}

// removes a specific entry (call only after a successful delete)
export function removeHistoryEntry(userId, entry) {
  if (!db) {
    const stack = memoryHistory.get(userId)
    if (!stack) return
    const idx = stack.findLastIndex((e) => e.messageId === entry.messageId)
    if (idx !== -1) stack.splice(idx, 1)
    return
  }
  db.prepare("DELETE FROM phoebe_history WHERE id = ?").run(entry.id)
}
