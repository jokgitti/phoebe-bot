import * as dotenv from "dotenv"
dotenv.config()

export const adminUsernames = process.env.ADMIN_USERNAMES ? process.env.ADMIN_USERNAMES.split(",") : []
export const bingSearchApiKey = process.env.BING_SEARCH_API_KEY
export const logLevel = process.env.LOG_LEVEL
export const telegramApiKey = process.env.TELEGRAM_API_KEY
export const userUsernames = process.env.USER_USERNAMES ? process.env.USER_USERNAMES.split(",") : []
