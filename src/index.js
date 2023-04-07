const bingImageSearch = require("./bingImageSearch");
const getTelegramBot = require("./telegramBot");

console.log(process.env.TELEGRAM_API_KEY);
console.log(process.env.BING_SEARCH_API_KEY);

const telegramBot = getTelegramBot();

async function lookfor(msg, match) {
  console.log(msg);
  const query = match[1];

  try {
    const bingImage = await bingImageSearch(query);
    console.log(bingImage);

    if (!bingImage) {
      await telegramBot.sendMessage(
        msg.chat.id,
        "Sorry, I couldn't find anything ¯\\_(ツ)_/¯."
      );
      return;
    }

    switch (bingImage.encodingFormat) {
      case "animatedgif": {
        await telegramBot.sendAnimation(msg.chat.id, bingImage.contentUrl, {
          caption: `here's ${query}`,
        });
        break;
      }
      default: {
        await telegramBot.sendPhoto(msg.chat.id, bingImage.contentUrl, {
          caption: `here's ${query}`,
        });
      }
    }
  } catch (error) {
    console.error(error.message || error);
    telegramBot.sendMessage(msg.chat.id, "something went wrong :(");
  }
}

telegramBot.onText(/phoebe look for (.+)/i, lookfor);

telegramBot.on("polling_error", (error) => {
  console.log(error);
});
