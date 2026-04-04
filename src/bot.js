import { Bot } from "grammy"

import { telegramApiKey } from "./config/index.js"

export const bot = new Bot(telegramApiKey)
