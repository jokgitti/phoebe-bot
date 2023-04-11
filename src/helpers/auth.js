import { adminUsernames, userUsernames } from "../config/index.js"
import logger from "./logger.js"
import { getTelegramBot } from "../telegramBot.js"

const telegramBot = getTelegramBot()

export const isAdmin = (username) => [...adminUsernames].includes(username)

export const isUser = (username) => [...userUsernames].includes(username)

export const withAdminAuth = (handler) => (msg, match) => {
  const { username: fromUsername } = msg.from
  if (!fromUsername) {
    logger.fatal(`msg.from.username is falsy: ${fromUsername}`)
    return
  }

  if (!isAdmin(fromUsername)) {
    if (isUser(fromUsername)) {
      logger.warn({ from: msg.from }, "A non-admin user wrote to me")
    } else {
      logger.warn({ from: msg.from }, "An unknown user wrote to me")
    }
    return
  }

  handler(msg, match)
}

export const withAuth = (handler) => (msg, match) => {
  const { username: fromUsername } = msg.from
  if (!fromUsername) {
    logger.fatal(`msg.from.username is falsy: ${fromUsername}`)
    return
  }

  if (!isAdmin(fromUsername) && !isUser(fromUsername)) {
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
