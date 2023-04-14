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

export async function whoami(msg) {
  try {
    const { id: userId } = msg.from
    telegramBot.sendMessage(msg.chat.id, `Your user id is ${userId} 🤓`, { reply_to_message_id: msg.message_id })
  } catch (err) {
    logger.error({ err })
  }
}
