import { bingImageSearch } from "../bingImageSearch.js"
import logger from "../helpers/logger.js"
import { getTelegramBot } from "../telegramBot.js"

const telegramBot = getTelegramBot()

const lookForContext = new Map()

function getOrSetEmptyContext(key, query) {
  if (lookForContext.has(key)) {
    const existingQuery = lookForContext.get(key)
    if (existingQuery.query === query) {
      return existingQuery
    }
    return { query, index: 0 }
  }

  return { query, index: 0 }
}

export async function lookfor(msg, match) {
  const query = match[1]
  logger.debug(`look for: ${query}`)

  const contextKey = `${msg.chat.id}-${msg.from.username}`
  const currentContext = getOrSetEmptyContext(contextKey, query)

  logger.debug(currentContext)

  try {
    const bingImage = await bingImageSearch(query, currentContext.index)
    logger.debug(bingImage)

    if (!bingImage) {
      await telegramBot.sendMessage(msg.chat.id, "Sorry, I couldn't find anything ¯\\_(ツ)_/¯.")
      lookForContext.delete(contextKey)

      return
    }

    lookForContext.set(contextKey, {
      ...currentContext,
      index: currentContext.index + 1,
    })

    switch (bingImage.encodingFormat) {
      case "animatedgif": {
        await telegramBot.sendAnimation(msg.chat.id, bingImage.contentUrl, {
          caption: `here's ${query}`,
        })
        break
      }
      default: {
        await telegramBot.sendPhoto(msg.chat.id, bingImage.contentUrl, {
          caption: `here's ${query}`,
        })
      }
    }
  } catch (error) {
    console.error(error.message || error)
    telegramBot.sendMessage(msg.chat.id, "something went wrong :(")
  }
}

export async function lookAgain(msg, _) {
  logger.debug("look again")

  try {
    const contextKey = `${msg.chat.id}-${msg.from.username}`

    if (!lookForContext.has(contextKey)) {
      await telegramBot.sendMessage(msg.chat.id, "Sorry, look for what?")
      return
    }

    const currentContext = lookForContext.get(contextKey)
    const bingImage = await bingImageSearch(currentContext.query, currentContext.index)
    logger.debug(bingImage)

    if (!bingImage) {
      await telegramBot.sendMessage(msg.chat.id, "Sorry, I couldn't find anything ¯\\_(ツ)_/¯.")
      lookForContext.delete(contextKey)

      return
    }

    lookForContext.set(contextKey, {
      ...currentContext,
      index: currentContext.index + 1,
    })

    const caption = `here's ${currentContext.query}`

    switch (bingImage.encodingFormat) {
      case "animatedgif": {
        await telegramBot.sendAnimation(msg.chat.id, bingImage.contentUrl, {
          caption,
        })
        break
      }
      default: {
        await telegramBot.sendPhoto(msg.chat.id, bingImage.contentUrl, {
          caption,
        })
      }
    }
  } catch (error) {
    console.error(error.message || error)
    telegramBot.sendMessage(msg.chat.id, "something went wrong :(")
  }
}
