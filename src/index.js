const TelegramBot = require("node-telegram-bot-api");
const bingImageSearch = require("./bingImageSearch");

const token = process.env.TELEGRAM_API_KEY;
const bot = new TelegramBot(token, { polling: true });

console.log(process.env.TELEGRAM_API_KEY);
console.log(process.env.BING_SEARCH_API_KEY);

async function lookfor(msg, match) {
  console.log(msg);
  const query = match[1];

  try {
    const bingImage = await bingImageSearch(query);
    console.log(bingImage);

    if (!bingImage) {
      await bot.sendMessage(
        msg.chat.id,
        "Sorry, I couldn't find anything ¯\\_(ツ)_/¯."
      );
      return;
    }

    switch (bingImage.encodingFormat) {
      case "animatedgif": {
        await bot.sendAnimation(msg.chat.id, bingImage.contentUrl, {
          caption: `here's ${query}`,
        });
        break;
      }
      default: {
        await bot.sendPhoto(msg.chat.id, bingImage.contentUrl, {
          caption: `here's ${query}`,
        });
      }
    }
  } catch (error) {
    console.error(error.message || error);
    bot.sendMessage(msg.chat.id, "something went wrong :(");
  }
}

bot.onText(/phoebe look for (.+)/i, lookfor);

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  console.log(msg.text);
  // bot.sendMessage(chatId, "Received your message");
});

bot.on("polling_error", (error) => {
  console.log(error);
});
