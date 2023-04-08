import { getTelegramBot } from "../telegramBot.js";
import { bingImageSearch } from "../bingImageSearch.js";

const telegramBot = getTelegramBot();

const lookForContext = new Map();

function getOrSetEmptyContext(key, query) {
  if (lookForContext.has(key)) {
    const existingQuery = lookForContext.get(key);
    if (existingQuery.query === query) {
      return existingQuery;
    }
    return { query, index: 0 };
  }

  return { query, index: 0 };
}

export async function lookfor(msg, match) {
  const query = match[1];
  console.log("look for: ", query);

  const contextKey = `${msg.chat.id}-${msg.from.username}`;
  const currentContext = getOrSetEmptyContext(contextKey, query);

  console.log(currentContext);

  try {
    const bingImage = await bingImageSearch(query, currentContext.index);
    console.log(bingImage);

    if (!bingImage) {
      await telegramBot.sendMessage(
        msg.chat.id,
        "Sorry, I couldn't find anything ¯\\_(ツ)_/¯."
      );
      lookForContext.delete(contextKey);

      return;
    }

    lookForContext.set(contextKey, { query, index: currentContext.index + 1 });

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
