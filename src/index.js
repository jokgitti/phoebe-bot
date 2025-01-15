import { bingSearchApiKey, telegramApiKey, openaiApiKey } from "./config/index.js"
import { withAdminAuth, withAuth } from "./helpers/auth.js"
import logger, { censor } from "./helpers/logger.js"
import { getTelegramBot } from "./telegramBot.js"
import { listAdmins, listUsers } from "./text/auth.js"
import { explain } from "./text/explain.js"
import { generate } from "./text/generate.js"
import { help, whoami } from "./text/help.js"
import { inspireMe } from "./text/inspireme.js"
import { kawaii } from "./text/kawaii.js"
import { lookfor, undo } from "./text/lookfor.js"

if (!telegramApiKey) {
  logger.fatal(`Invalid TELEGRAM_API_KEY value: ${telegramApiKey}`)
  process.exit(1)
}

logger.debug({
  bingSearchApiKey: censor(bingSearchApiKey),
  openaiApiKey: censor(openaiApiKey),
  telegramApiKey: censor(telegramApiKey),
})

const telegramBot = getTelegramBot()

telegramBot.onText(/phoebe list admins/i, withAdminAuth(listAdmins))
telegramBot.onText(/phoebe list users/i, withAdminAuth(listUsers))
telegramBot.onText(/phoebe look for (.+)/i, withAuth(lookfor))
telegramBot.onText(/phoebe look again/i, withAuth(lookfor))
telegramBot.onText(/phoebe undo/i, withAuth(undo))
telegramBot.onText(/phoebe inspire me/i, withAuth(inspireMe))
telegramBot.onText(/phoebe help/i, help)
telegramBot.onText(/phoebe whoami/i, whoami)
telegramBot.onText(/phoebe explain (.+)/i, withAuth(explain))
telegramBot.onText(/phoebe generate (.+)/i, withAuth(generate))
telegramBot.onText(/phoebe kawaii (.+)/i, withAuth(kawaii))

telegramBot.on("message", (msg) => {
  logger.debug({ ...msg }, "incoming message")
})

telegramBot.on("polling_error", (err) => {
  logger.error({ err }, "polling error")
})
