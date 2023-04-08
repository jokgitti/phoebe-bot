import { getTelegramBot } from "./telegramBot.js";
import { lookfor } from "./text/lookfor.js";

console.log(process.env.TELEGRAM_API_KEY);
console.log(process.env.BING_SEARCH_API_KEY);

const telegramBot = getTelegramBot();

telegramBot.onText(/phoebe look for (.+)/i, lookfor);

telegramBot.on("message", (msg) => {
  console.log("message received", msg);
});

telegramBot.on("polling_error", (error) => {
  console.log(error);
});
