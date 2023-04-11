import { adminUsernames, userUsernames } from "../config/index.js"
import logger from "./logger.js"
import { getTelegramBot } from "../telegramBot.js"

const telegramBot = getTelegramBot()

export const withAuth = (handler) => (msg, match) => {
  const { username: fromUsername } = msg.from
  if (!fromUsername || ![...userUsernames, ...adminUsernames].includes(fromUsername)) {
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
