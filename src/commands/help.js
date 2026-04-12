import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"

const HELP_TEXT = `ugh fine, here's what I can do 💅

✨ phoebe generate <prompt> — makes you an AI image, you're welcome 🎨
🌸 phoebe kawaii <prompt> — anime version bc obviously 🇯🇵
🌟 phoebe inspire me — unsolicited wisdom from the universe ✌️
🏆 phoebe perti-stats — the Perticone Hall of Shame, last 7 days 🍆
🎮 phoebe perticone — you know what this does, bestie 🫦
🪪 phoebe whoami — for when you have an existential crisis 🪞

don't make me repeat myself 🙄`

export async function help(ctx) {
  try {
    await ctx.reply(HELP_TEXT)
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
