import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"
import db from "../services/database.js"

const memoryFallback = new Map()

function getLastMention(chatId) {
  if (db) {
    const row = db.prepare("SELECT last_mention FROM perticone WHERE chat_id = ?").get(chatId)
    return row ? new Date(row.last_mention).getTime() : null
  }
  return memoryFallback.get(chatId) || null
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

    setLastMention(chatId)

    await ctx.reply(message)
  } catch (error) {
    logger.error({ err: error })
    await ctx.reply(GENERIC_ERROR)
  }
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
