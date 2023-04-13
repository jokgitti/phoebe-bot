import { bingSearchApiKey, telegramApiKey, openaiApiKey } from "./config/index.js"
import { withAdminAuth, withAuth } from "./helpers/auth.js"
import logger, { censor } from "./helpers/logger.js"
import { getTelegramBot } from "./telegramBot.js"
import { listAdmins, listUsers } from "./text/auth.js"
import { help } from "./text/help.js"
import { lookfor } from "./text/lookfor.js"

if (!telegramApiKey) {
  logger.fatal(`Invalid TELEGRAM_API_KEY value: ${telegramApiKey}`)
  process.exit(1)
}

logger.debug(`BING_SEARCH_API_KEY=${censor(bingSearchApiKey)}`)
logger.debug(`TELEGRAM_API_KEY=${censor(telegramApiKey)}`)
logger.debug(`OPENAI_API_KEY=${censor(openaiApiKey)}`)

const telegramBot = getTelegramBot()

telegramBot.onText(/phoebe list admins/i, withAdminAuth(listAdmins))
telegramBot.onText(/phoebe list users/i, withAdminAuth(listUsers))
telegramBot.onText(/phoebe look for (.+)/i, withAuth(lookfor))
telegramBot.onText(/phoebe look again/i, withAuth(lookfor))
telegramBot.onText(/phoebe help/i, help)

telegramBot.on("message", ({ chat, date, from, message_id, text }) => {
  logger.debug(
    {
      chat_id: chat.id,
      chat_title: chat.title,
      chat_type: chat.type,
      from_id: from.id,
      from_username: from.username,
      message_id: message_id,
      message_date: date,
      message_text: text,
    },
    "message received"
  )
})

telegramBot.on("polling_error", (err) => {
  logger.error({ err }, "polling error")
})
