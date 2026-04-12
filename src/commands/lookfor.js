import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"
import db, { migrate } from "../services/database.js"
import { searchImages } from "../services/duckDuckGo.js"

migrate(
  `CREATE TABLE IF NOT EXISTS look_state (
    user_id INTEGER PRIMARY KEY,
    query TEXT NOT NULL,
    results TEXT NOT NULL,
    current_index INTEGER NOT NULL DEFAULT 0,
    last_message_id INTEGER
  )`
)

const MAX_RESULTS = 10

// NOTE: in-memory fallback when db is unavailable — state is lost on restart
const memoryFallback = new Map()

function getState(userId) {
  if (!db) return memoryFallback.get(userId) ?? null
  const row = db.prepare("SELECT * FROM look_state WHERE user_id = ?").get(userId)
  if (!row) return null
  return { ...row, results: JSON.parse(row.results), lastMessageId: row.last_message_id }
}

function setState(userId, state) {
  if (!db) {
    memoryFallback.set(userId, state)
    return
  }
  db.prepare(
    `INSERT INTO look_state (user_id, query, results, current_index, last_message_id)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       query = excluded.query,
       results = excluded.results,
       current_index = excluded.current_index,
       last_message_id = excluded.last_message_id`
  ).run(userId, state.query, JSON.stringify(state.results), state.current_index, state.lastMessageId ?? null)
}

export async function lookfor(ctx) {
  // Both "phoebe look for <query>" and "phoebe look again" route here.
  // The "look for" regex captures group 1 (the query); "look again" has no capture,
  // so ctx.match[1] is undefined — that's the signal to advance to the next result.
  const query = ctx.match?.[1]?.trim()

  if (query) {
    try {
      const all = await searchImages(query)
      const results = all.slice(0, MAX_RESULTS)
      if (results.length === 0) {
        await ctx.reply("literally nothing came up, maybe try a different vibe? 🤷")
        return
      }
      const sent = await ctx.replyWithPhoto(results[0])
      setState(ctx.from.id, { query, results, current_index: 0, lastMessageId: sent.message_id })
    } catch (err) {
      logger.error({ err })
      await ctx.reply("my image search is having a meltdown rn, try again in a sec 🫠")
    }
  } else {
    // look again
    const state = getState(ctx.from.id)
    if (!state) {
      await ctx.reply("look for what bestie? you never told me 👀")
      return
    }
    const nextIndex = state.current_index + 1
    if (nextIndex >= state.results.length) {
      await ctx.reply("that's literally all i found, i'm not a magician 🪄")
      return
    }
    try {
      const sent = await ctx.replyWithPhoto(state.results[nextIndex])
      setState(ctx.from.id, { ...state, current_index: nextIndex, lastMessageId: sent.message_id })
    } catch (err) {
      logger.error({ err })
      await ctx.reply(GENERIC_ERROR)
    }
  }
}

export async function undo(ctx) {
  const state = getState(ctx.from.id)
  if (!state?.lastMessageId) {
    await ctx.reply("nothing to undo bestie 🫠")
    return
  }
  try {
    await ctx.api.deleteMessage(ctx.chat.id, state.lastMessageId)
    setState(ctx.from.id, { ...state, current_index: Math.max(0, state.current_index - 1), lastMessageId: null })
  } catch (err) {
    logger.error({ err })
    await ctx.reply(GENERIC_ERROR)
  }
}
