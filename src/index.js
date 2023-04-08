import { bingSearchApiKey, telegramApiKey } from "./config/index.js"
import logger, { censor } from "./helpers/logger.js"
import { getTelegramBot } from "./telegramBot.js"
import { lookAgain, lookfor } from "./text/lookfor.js"

if (!telegramApiKey) {
  logger.fatal(`Invalid TELEGRAM_API_KEY value: ${telegramApiKey}`)
  process.exit(1)
}

logger.debug(`BING_SEARCH_API_KEY=${censor(bingSearchApiKey)}`)
logger.debug(`TELEGRAM_API_KEY=${censor(telegramApiKey)}`)

const telegramBot = getTelegramBot()

telegramBot.onText(/phoebe look for (.+)/i, lookfor)
telegramBot.onText(/phoebe look again/i, lookAgain)

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
