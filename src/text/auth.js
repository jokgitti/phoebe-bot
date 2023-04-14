import { adminIds, adminUsernames, userIds, userUsernames } from "../config/index.js"
import logger from "../helpers/logger.js"
import { getTelegramBot } from "../telegramBot.js"

const telegramBot = getTelegramBot()

const logIds = (items) => {
  return items.reduce((acc, val) => acc + `\n- <a href='tg://user?id=${val}'>${val}</a>`, "")
}

const logUsernames = (items) => {
  return items.reduce((acc, val) => acc + `\n- @${val}`, "")
}

export async function listAdmins(msg) {
  try {
    let text
    if (!adminIds.length && !adminUsernames.length) {
      text = "None! 😩"
    } else {
      text = ["Here's the list of all the admins:", logIds(adminIds), logUsernames(adminUsernames)]
        .filter((x) => x)
        .join("\n")
    }
    telegramBot.sendMessage(msg.chat.id, text, { parse_mode: "HTML" })
  } catch (err) {
    logger.error({ err })
  }
}

export async function listUsers(msg) {
  try {
    let text
    if (!userIds.length && !userUsernames.length) {
      text = "None! 😩"
    } else {
      text = ["Here's the list of all the users:", logIds(userIds), logUsernames(userUsernames)]
        .filter((x) => x)
        .join("\n")
    }
    telegramBot.sendMessage(msg.chat.id, text, { parse_mode: "HTML" })
  } catch (err) {
    logger.error({ err })
  }
}
