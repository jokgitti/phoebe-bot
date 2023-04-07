const TelegramBot = require("node-telegram-bot-api");
const request = require("request");

const token = process.env.TELEGRAM_API_KEY;
const bot = new TelegramBot(token, { polling: true });

console.log(process.env.TELEGRAM_API_KEY);
console.log(process.env.BING_SEARCH_API_KEY);

const again = {};

async function lookfor(msg, match) {
  console.log(msg);
  const query = match[1];

  const url = new URL("https://api.bing.microsoft.com/v7.0/images/search");
  const parameters = [
    ["q", query],
    ["safeSearch", "off"],
  ];
  const urlEncodedParamers = new URLSearchParams(parameters).toString();
  url.search = urlEncodedParamers;

  const headers = {
    "Ocp-Apim-Subscription-Key": process.env.BING_SEARCH_API_KEY,
  };

  request({ url, headers }, async (error, response, body) => {
    try {
      const results = JSON.parse(body).value;

      if (error) {
        throw error;
      }

      const firstImage = results[0] || null;

      if (!firstImage) {
        await bot.sendMessage(
          msg.chat.id,
          "Sorry, I couldn't find any images for that query."
        );
        return;
      }

      console.log("encodingFormat", firstImage.encodingFormat);

      switch (firstImage.encodingFormat) {
        case "animatedgif": {
          await bot.sendAnimation(msg.chat.id, firstImage.contentUrl, {
            caption: `here's ${query}`,
          });
          break;
        }
        default: {
          await bot.sendPhoto(msg.chat.id, firstImage.contentUrl, {
            caption: `here's ${query}`,
          });
        }
      }
    } catch (error) {
      console.error(error.message || error);
      bot.sendMessage(msg.chat.id, "something went wrong :(");
    }
  });
}

bot.onText(/look for (.+)/i, lookfor);

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, "Received your message");
});

bot.on("polling_error", (error) => {
  console.log(error);
});
