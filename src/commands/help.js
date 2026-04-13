import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"

const HELP_TEXT = `ugh fine, here's what I can do 💅

🔍 look for <query> — finds you an image (nsfw included) 🖼️
🔒 look for safe <query> — same but sfw only, you prude 😇
⏭️ look again — next result, because the first one wasn't good enough 🙄
↩️ undo — pretend that never happened 🫣
✨ generate <prompt> — makes you an AI image 🎨
🌸 kawaii <prompt> — anime version bc obviously 🇯🇵
🌟 inspire me — unsolicited wisdom from the universe ✌️
🏆 perti-stats — the Perticone Hall of Shame, last 7 days 🍆
🎮 perticone — you know what this does, bestie 🫦
🪪 whoami — for when you have an existential crisis 🪞

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
    await ctx.reply(`your user id is ${ctx.from.id} 🤓`, {
      reply_parameters: { message_id: ctx.message.message_id },
    })
  } catch (err) {
    logger.error({ err })
    await ctx.reply(GENERIC_ERROR)
  }
}
