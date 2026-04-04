import { Bot } from "grammy"

import { telegramApiKey } from "./config/index.js"
import logger, { censor } from "./helpers/logger.js"

if (!telegramApiKey) {
  logger.fatal("TELEGRAM_API_KEY is not set")
  process.exit(1)
}

logger.debug({ telegramApiKey: censor(telegramApiKey) })

export const bot = new Bot(telegramApiKey)
