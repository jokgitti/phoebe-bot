import { historyLimit } from "../config/index.js"
import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"
import { searchImages } from "../services/duckDuckGo.js"
import { peekLastLookState, pushHistory } from "../services/history.js"

// in-memory results cache — not persisted across restarts, that's fine
const lookResultsCache = new Map()

function buildCaption({ url }) {
  if (!url) return {}
  return { caption: "[source](" + url + ")", parse_mode: "MarkdownV2" }
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
        const results = all.slice(0, historyLimit)
        if (results.length === 0) {
          await ctx.reply("literally nothing came up, maybe try a different vibe? 🤷")
          return
        }
        const sent = await ctx.replyWithPhoto(results[0].image, buildCaption(results[0]))
        lookResultsCache.set(ctx.from.id, results)
        pushHistory(ctx.from.id, "look_for", { query, current_index: 0 }, sent.message_id)
      } catch (err) {
        logger.error({ err })
        await ctx.reply("my image search is having a meltdown rn, try again in a sec 🫠")
      }
    } else {
      // look again
      const entry = peekLastLookState(ctx.from.id)
      if (!entry) {
        await ctx.reply("look for what bestie? you never told me 👀")
        return
      }
      const { query, current_index } = entry.params
      const results = lookResultsCache.get(ctx.from.id)
      const nextIndex = current_index + 1
      if (!results) {
        await ctx.reply("bestie i lost the results after a restart, try look for again 🧠💨")
        return
      }
      if (nextIndex >= results.length) {
        await ctx.reply("that's literally all i found, i'm not a magician 🪄")
        return
      }
      try {
        const result = results[nextIndex]
        const sent = await ctx.replyWithPhoto(result.image, buildCaption(result))
        pushHistory(ctx.from.id, "look_again", { query, current_index: nextIndex }, sent.message_id)
      } catch (err) {
        logger.error({ err })
        await ctx.reply(GENERIC_ERROR)
      }
    }
  }
}

export const lookfor = makeLookfor(false)
export const lookforSafe = makeLookfor(true)
