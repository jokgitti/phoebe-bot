import { bot } from "./bot.js"
import { listAdmins, listUsers } from "./commands/auth.js"
import { explain } from "./commands/explain.js"
import { generate } from "./commands/generate.js"
import { help, whoami } from "./commands/help.js"
import { inspireMe } from "./commands/inspireme.js"
import { kawaii } from "./commands/kawaii.js"
import { lookfor, undo } from "./commands/lookfor.js"
import { thePertiGame } from "./commands/perticottero.js"
import { telegramApiKey } from "./config/index.js"
import { adminOnly, authOnly } from "./helpers/auth.js"
import logger, { censor } from "./helpers/logger.js"

if (!telegramApiKey) {
  logger.fatal(`Invalid TELEGRAM_API_KEY value: ${telegramApiKey}`)
  process.exit(1)
}

logger.debug({
  telegramApiKey: censor(telegramApiKey),
})

bot.hears(/phoebe list admins/i, adminOnly, listAdmins)
bot.hears(/phoebe list users/i, adminOnly, listUsers)
bot.hears(/phoebe look for (.+)/i, authOnly, lookfor)
bot.hears(/phoebe look again/i, authOnly, lookfor)
bot.hears(/phoebe undo/i, authOnly, undo)
bot.hears(/phoebe inspire me/i, authOnly, inspireMe)
bot.hears(/phoebe help/i, help)
bot.hears(/phoebe whoami/i, whoami)
bot.hears(/phoebe explain (.+)/i, authOnly, explain)
bot.hears(/phoebe generate (.+)/i, authOnly, generate)
bot.hears(/phoebe kawaii (.+)/i, authOnly, kawaii)
bot.hears(/phoebe (.*)perticone(.*)/i, authOnly, thePertiGame)

bot.on("message", (ctx) => {
  logger.debug({ ...ctx.message }, "incoming message")
})

bot.catch((err) => {
  logger.error({ err }, "bot error")
})

bot.start()
logger.info("Phoebe has entered the chat. You're welcome 💅")
