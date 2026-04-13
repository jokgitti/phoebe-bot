import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"
import { peekHistory, removeHistoryEntry } from "../services/history.js"

const undoQuips = [
  "ew yeah no, let me get rid of that 🫠",
  "gone. pretend it never happened 💅",
  "erased from existence bestie 🙈",
  "okay that one was a flop, deleting 😬",
  "poof! it's like it never existed ✨",
  "undo button acquired and USED 🗑️",
]

export async function undo(ctx) {
  const entry = peekHistory(ctx.from.id)
  if (!entry) {
    await ctx.reply("nothing to undo bestie 🫠")
    return
  }
  try {
    await ctx.api.deleteMessage(ctx.chat.id, entry.messageId)
    await ctx.reply(undoQuips[Math.floor(Math.random() * undoQuips.length)])
    removeHistoryEntry(ctx.from.id, entry)
  } catch (err) {
    // entry stays in history so the user can retry
    logger.error({ err })
    await ctx.reply(GENERIC_ERROR)
  }
}
