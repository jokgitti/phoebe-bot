import { bot } from "./bot.js"
import { listAdmins, listUsers } from "./commands/auth.js"
import { explain } from "./commands/explain.js"
import { generate } from "./commands/generate.js"
import { help, whoami } from "./commands/help.js"
import { inspireMe } from "./commands/inspireme.js"
import { kawaii } from "./commands/kawaii.js"
import { lookfor, undo } from "./commands/lookfor.js"
import { pertiStats, thePertiGame } from "./commands/perticottero.js"
import { adminOnly, authOnly } from "./helpers/auth.js"
import logger from "./helpers/logger.js"

bot.use((ctx, next) => {
  if (ctx.message) {
    logger.info(
      {
        chat_id: ctx.message.chat.id,
        from: ctx.message.from?.username ?? ctx.message.from?.id,
        text: ctx.message.text,
      },
      "incoming"
    )
  }
  return next()
})

bot.api.config.use(async (prev, method, payload, signal) => {
  const result = await prev(method, payload, signal)
  logger.info({ method, chat_id: payload.chat_id, text: payload.text ?? payload.photo ?? payload.caption }, "outgoing")
  return result
})

bot.hears(/phoebe list admins/i, adminOnly, listAdmins)
bot.hears(/phoebe list users/i, adminOnly, listUsers)
bot.hears(/phoebe look for (.+)/i, authOnly, lookfor)
bot.hears(/phoebe look again/i, authOnly, lookfor)
bot.hears(/phoebe undo/i, authOnly, undo)
bot.hears(/phoebe inspire me/i, authOnly, inspireMe)
bot.hears(/phoebe help/i, authOnly, help)
bot.hears(/phoebe whoami/i, whoami)
bot.hears(/phoebe explain (.+)/i, authOnly, explain)
bot.hears(/phoebe generate (.+)/i, authOnly, generate)
bot.hears(/phoebe kawaii (.+)/i, authOnly, kawaii)
bot.hears(/phoebe perti-stats/i, authOnly, pertiStats)
bot.hears(/phoebe (.*)perticone(.*)/i, authOnly, thePertiGame)

bot.catch((err) => {
  logger.error({ err }, "bot error")
})

await bot.start({
  onStart: (botInfo) => logger.info(`Phoebe has entered the chat as @${botInfo.username}. You're welcome 💅`),
})
