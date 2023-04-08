import TelegramBot from "node-telegram-bot-api";

let telegramBot = null;

export function getTelegramBot() {
  if (!telegramBot) {
    telegramBot = new TelegramBot(process.env.TELEGRAM_API_KEY, {
      polling: true,
    });
  }
  return telegramBot;
}
