import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"
import { inspireMeBot } from "../services/inspireMeBot.js"

export async function inspireMe(ctx) {
  try {
    const result = await inspireMeBot()
    await ctx.replyWithPhoto(result)
  } catch (err) {
    logger.error({ err })
    await ctx.reply(GENERIC_ERROR)
  }
}
