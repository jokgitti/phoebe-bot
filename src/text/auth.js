import { adminUsernames, userUsernames } from "../config/index.js"
import logger from "../helpers/logger.js"
import { getTelegramBot } from "../telegramBot.js"

const telegramBot = getTelegramBot()

const logUsers = (userList) => {
  return userList.reduce((users, user) => users + `\n- @${user}`, "")
}

export async function listAdmins(msg) {
  try {
    const text = `Here's the list of all the admins:\n${adminUsernames.length ? logUsers(adminUsernames) : "none 😩"}`
    telegramBot.sendMessage(msg.chat.id, text)
  } catch (err) {
    logger.error({ err })
  }
}

export async function listUsers(msg) {
  try {
    const text = `Here's the list of all the users:\n${userUsernames.length ? logUsers(userUsernames) : "none 😩"}`
    telegramBot.sendMessage(msg.chat.id, text)
  } catch (err) {
    logger.error({ err })
  }
}
