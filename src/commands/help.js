import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"

export async function help(ctx) {
  try {
    await ctx.reply("God helps those who help themselves 😌")
  } catch (err) {
    logger.error({ err })
    await ctx.reply(GENERIC_ERROR)
  }
}

export async function whoami(ctx) {
  try {
    await ctx.reply(`Your user id is ${ctx.from.id} 🤓`, {
      reply_parameters: { message_id: ctx.message.message_id },
    })
  } catch (err) {
    logger.error({ err })
    await ctx.reply(GENERIC_ERROR)
  }
}
