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
    message_ids TEXT
  )`,
  // migrate existing rows that only have the old last_message_id column
  `ALTER TABLE look_state ADD COLUMN message_ids TEXT`
)

const MAX_RESULTS = 10

function buildCaption({ url }) {
  if (!url) return {}
  return { caption: "[source](" + url + ")", parse_mode: "MarkdownV2" }
}

// NOTE: in-memory fallback when db is unavailable — state is lost on restart
const memoryFallback = new Map()

function getState(userId) {
  if (!db) return memoryFallback.get(userId) ?? null
  const row = db.prepare("SELECT * FROM look_state WHERE user_id = ?").get(userId)
  if (!row) return null
  // backwards compat: if message_ids not yet populated, seed from last_message_id
  const messageIds = row.message_ids ? JSON.parse(row.message_ids) : row.last_message_id ? [row.last_message_id] : []
  return { ...row, results: JSON.parse(row.results), messageIds }
}

function setState(userId, state) {
  if (!db) {
    memoryFallback.set(userId, state)
    return
  }
  db.prepare(
    `INSERT INTO look_state (user_id, query, results, current_index, message_ids)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       query = excluded.query,
       results = excluded.results,
       current_index = excluded.current_index,
       message_ids = excluded.message_ids`
  ).run(userId, state.query, JSON.stringify(state.results), state.current_index, JSON.stringify(state.messageIds))
}

function makeLookfor(safe) {
  return async function lookfor(ctx) {
    // Both "phoebe look for [safe] <query>" and "phoebe look again" route here.
    // The "look for" regex captures group 1 (the query); "look again" has no capture,
    // so ctx.match[1] is undefined — that's the signal to advance to the next result.
    const query = ctx.match?.[1]?.trim()

    if (query) {
      try {
        const all = await searchImages(query, { safe })
        // shuffle so repeated searches for the same query feel fresh
        for (let i = all.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[all[i], all[j]] = [all[j], all[i]]
        }
        const results = all.slice(0, MAX_RESULTS)
        if (results.length === 0) {
          await ctx.reply("literally nothing came up, maybe try a different vibe? 🤷")
          return
        }
        const sent = await ctx.replyWithPhoto(results[0].image, buildCaption(results[0]))
        setState(ctx.from.id, { query, results, current_index: 0, messageIds: [sent.message_id] })
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
        const result = state.results[nextIndex]
        const sent = await ctx.replyWithPhoto(result.image, buildCaption(result))
        setState(ctx.from.id, {
          ...state,
          current_index: nextIndex,
          messageIds: [...state.messageIds, sent.message_id],
        })
      } catch (err) {
        logger.error({ err })
        await ctx.reply(GENERIC_ERROR)
      }
    }
  }
}

export const lookfor = makeLookfor(false)
export const lookforSafe = makeLookfor(true)

export async function undo(ctx) {
  const state = getState(ctx.from.id)
  if (!state?.messageIds?.length) {
    await ctx.reply("nothing to undo bestie 🫠")
    return
  }
  const messageId = state.messageIds.at(-1)
  const undoQuips = [
    "ew yeah no, let me get rid of that 🫠",
    "gone. pretend it never happened 💅",
    "erased from existence bestie 🙈",
    "okay that one was a flop, deleting 😬",
    "poof! it's like it never existed ✨",
    "undo button acquired and USED 🗑️",
  ]
  try {
    await ctx.api.deleteMessage(ctx.chat.id, messageId)
    await ctx.reply(undoQuips[Math.floor(Math.random() * undoQuips.length)])
    // current_index tracks the last *shown* result, which is messageIds.length - 1
    // after the pop — so we derive it from the new stack length rather than decrementing blindly.
    const newMessageIds = state.messageIds.slice(0, -1)
    setState(ctx.from.id, {
      ...state,
      current_index: Math.max(0, newMessageIds.length - 1),
      messageIds: newMessageIds,
    })
  } catch (err) {
    logger.error({ err })
    await ctx.reply(GENERIC_ERROR)
  }
}
