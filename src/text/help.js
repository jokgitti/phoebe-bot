import logger from "../helpers/logger.js"
import { getTelegramBot } from "../telegramBot.js"

const telegramBot = getTelegramBot()

export async function help(msg) {
  try {
    telegramBot.sendMessage(msg.chat.id, "God helps those who help themselves 😌")
  } catch (err) {
    logger.error({ err })
  }
}
