import TelegramBot from "node-telegram-bot-api"

import { telegramApiKey } from "./config/index.js"

let telegramBot = null

export function getTelegramBot() {
  if (!telegramBot) {
    telegramBot = new TelegramBot(telegramApiKey, {
      polling: true,
    })
  }
  return telegramBot
}
