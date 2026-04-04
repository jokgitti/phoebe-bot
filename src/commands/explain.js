import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"
import pollinationsAI from "../services/pollinationsAI.js"

export async function explain(ctx) {
  const query = ctx.match[1]

  try {
    const { response } = await pollinationsAI.text(query)
    await ctx.reply(response.replace(/^"|"$/g, ""))
  } catch (error) {
    logger.error({ err: error })
    await ctx.reply(GENERIC_ERROR)
  }
}
