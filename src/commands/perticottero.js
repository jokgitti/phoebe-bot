import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"
import db, { migrate } from "../services/database.js"

migrate(
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
    ON perticone_calls (chat_id, called_at)`
)

const memoryFallback = new Map()

function getLastMention(chatId) {
  if (db) {
    const row = db.prepare("SELECT last_mention FROM perticone WHERE chat_id = ?").get(chatId)
    return row ? new Date(row.last_mention).getTime() : null
  }
  return memoryFallback.get(chatId) || null
}

function getPertiStats(chatId) {
  if (!db) return null
  return db
    .prepare(
      `SELECT user_id, MAX(username) as username, COUNT(*) as count
       FROM perticone_calls
       WHERE chat_id = ? AND called_at >= datetime('now', '-7 days')
       GROUP BY user_id
       ORDER BY count DESC`
    )
    .all(chatId)
}

// NOTE: in-memory mode does not record stats.
function recordPertiCall(chatId, userId, username) {
  if (!db) return
  db.prepare("INSERT INTO perticone_calls (chat_id, user_id, username) VALUES (?, ?, ?)").run(
    chatId,
    userId,
    username ?? null
  )
}

function setLastMention(chatId) {
  const now = new Date().toISOString()
  if (db) {
    db.prepare(
      "INSERT INTO perticone (chat_id, last_mention) VALUES (?, ?) ON CONFLICT(chat_id) DO UPDATE SET last_mention = ?"
    ).run(chatId, now, now)
  } else {
    memoryFallback.set(chatId, Date.now())
  }
}

export function buildStatsChart(rows) {
  if (rows.length === 0) {
    return "Nobody thought about Perticone this week. Suspicious 👀"
  }

  const BAR_MAX = 12
  const max = rows[0].count
  const nameWidth = Math.max(...rows.map((r) => (r.username ? r.username.length + 1 : String(r.user_id).length)))

  const lines = rows.map((row, i) => {
    const name = row.username ? `@${row.username}` : String(row.user_id)
    const bars = Math.max(1, Math.round((row.count / max) * BAR_MAX))
    return `${i + 1}. ${name.padEnd(nameWidth)}  ${"█".repeat(bars)} ${row.count}`
  })

  return `📊 Perticone Hall of Shame — last 7 days\n\n${lines.join("\n")}`
}

export function formatDuration(diffMs) {
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60)
  const seconds = Math.floor((diffMs / 1000) % 60)

  const parts = []
  if (days) parts.push(`${days} day${days > 1 ? "s" : ""}`)
  if (hours) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`)
  if (minutes) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`)
  if (seconds) parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`)

  return parts.join(", ") || "0 seconds"
}

export async function pertiStats(ctx) {
  try {
    const rows = getPertiStats(ctx.chat.id)

    if (rows === null) {
      await ctx.reply("bestie I'm running on vibes rn, no database no stats 🧠💨")
      return
    }

    await ctx.reply(buildStatsChart(rows))
  } catch (error) {
    logger.error({ err: error })
    await ctx.reply(GENERIC_ERROR)
  }
}

export async function thePertiGame(ctx) {
  try {
    const chatId = ctx.chat.id
    const lastMention = getLastMention(chatId)

    let message = "I can't believe you never thought of Perticone, the italian mandrillo. You sound like a broken AI"

    if (lastMention) {
      const diffMs = Math.abs(Date.now() - lastMention)
      message = `
I know, you couldn't resist thinking about him and his white ciolla.
You lasted ${formatDuration(diffMs)}. Congrats I suppose (?) 👎
Goodbye, little wanker 🍆 try to not wet the bed tonight! 🛏️💦
`
    }

    recordPertiCall(chatId, ctx.from.id, ctx.from.username)
    setLastMention(chatId)

    await ctx.reply(message)
  } catch (error) {
    logger.error({ err: error })
    await ctx.reply(GENERIC_ERROR)
  }
}
