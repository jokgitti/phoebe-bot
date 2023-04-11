import { adminUsernames, userUsernames } from "../config/index.js"
import logger from "../helpers/logger.js"
import { getTelegramBot } from "../telegramBot.js"

const telegramBot = getTelegramBot()

export async function listAdmins(msg) {
  try {
    const text = `Here's the list of all the admins:\n\n${
      adminUsernames.length ? adminUsernames.map((username) => `- @${username}\n`) : "none 😩"
    }`
    telegramBot.sendMessage(msg.chat.id, text)
  } catch (err) {
    logger.error({ err })
  }
}

export async function listUsers(msg) {
  try {
    const text = `Here's the list of all the users:\n\n${
      userUsernames.length ? userUsernames.map((username) => `- @${username}\n`) : "none 😩"
    }`
    telegramBot.sendMessage(msg.chat.id, text)
  } catch (err) {
    logger.error({ err })
  }
}
