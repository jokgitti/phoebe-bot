import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"
import { pushHistory } from "../services/history.js"
import { inspireMeBot } from "../services/inspireMeBot.js"

export async function inspireMe(ctx) {
  try {
    const result = await inspireMeBot()
    const sent = await ctx.replyWithPhoto(result)
    pushHistory(ctx.from.id, "inspire_me", null, sent.message_id)
  } catch (err) {
    logger.error({ err })
    await ctx.reply(GENERIC_ERROR)
  }
}
