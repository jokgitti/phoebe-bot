import logger from "../helpers/logger.js"
import { inspireMeBot } from "../services/inspireMeBot.js"
import { getTelegramBot } from "../telegramBot.js"

const telegramBot = getTelegramBot()

export const inspireMe = async (msg) => {
    try {
        const result = await inspireMeBot()
        console.log(result)
        await telegramBot.sendPhoto(msg.chat.id, result)
    } catch (err) {
        console.log(err)
        logger.error({ err })
        await telegramBot.sendMessage(msg.chat.id, "I couldn't get inspired :(")
    }
} 