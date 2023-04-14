import { adminIds, adminUsernames, userIds, userUsernames } from "../config/index.js"
import logger from "./logger.js"
import { getTelegramBot } from "../telegramBot.js"

const telegramBot = getTelegramBot()

export const isAdmin = ({ id, username }) => adminIds.includes(id.toString()) || adminUsernames.includes(username)

export const isUser = ({ id, username }) => userIds.includes(id.toString()) || userUsernames.includes(username)

export const withAdminAuth = (handler) => (msg, match) => {
  if (!msg.from || (!msg.from.id && !msg.from.username)) {
    logger.fatal({ from: msg.from }, "Invalid msg.from value")
    return
  }

  if (!isAdmin(msg.from)) {
    if (isUser(msg.from)) {
      logger.warn({ from: msg.from }, "A non-admin user wrote to me")
    } else {
      logger.warn({ from: msg.from }, "An unknown user wrote to me")
    }
    return
  }

  handler(msg, match)
}

export const withAuth = (handler) => (msg, match) => {
  if (!msg.from || (!msg.from.id && !msg.from.username)) {
    logger.fatal({ from: msg.from }, "Invalid msg.from value")
    return
  }

  if (!isAdmin(msg.from) && !isUser(msg.from)) {
    try {
      logger.warn({ from: msg.from }, "An unknown user wrote to me")
      telegramBot.sendMessage(msg.chat.id, "Please stop talking to me, i have a boyfriend 😠")
    } catch (err) {
      logger.error({ err })
    }
    return
  }

  handler(msg, match)
}

export default withAuth
