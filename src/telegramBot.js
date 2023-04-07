const TelegramBot = require("node-telegram-bot-api");

let telegramBot = null;

function getTelegramBot() {
  if (!telegramBot) {
    telegramBot = new TelegramBot(process.env.TELEGRAM_API_KEY, {
      polling: true,
    });
  }
  return telegramBot;
}

module.exports = getTelegramBot;
