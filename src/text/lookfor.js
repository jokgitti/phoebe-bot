import { getOpenAI } from "../services/openAI.js"
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

const sassyImageCaptionPrompt = (image) =>
  `act as sassy gen z teen, provide caption for image of "${image}", max 16 words`
const sassyObessedAboutPrompt = (obsession) =>
  `act as sassy gen z teen, reply to someone obsessed about "${obsession}", max 16 words`

const getImageCaption = async (prompt, defaultCaption) => {
  try {
    const openAI = getOpenAI()

    const openAIResponse = await openAI.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 30,
      temperature: 1.1,
    })

    return openAIResponse.data.choices[0].text
  } catch (err) {
    logger.error({ err })
    return defaultCaption
  }
}

export async function lookfor(msg, match) {
  logger.debug("look for handler")

  const query = match[1]
  const contextKey = `${msg.chat.id}-${msg.from.username}`

  if (!query && !lookForContext.has(contextKey)) {
    logger.debug("no query was provided and no context is stored.")
    await telegramBot.sendMessage(msg.chat.id, "Sorry, what do you want?")
  }

  const currentContext = query ? getOrSetEmptyContext(contextKey, query) : lookForContext.get(contextKey)

  logger.debug(`looking for:  ${JSON.stringify(currentContext)}`)

  try {
    const bingImage = await bingImageSearch(currentContext.query, currentContext.index)
    logger.debug(bingImage)

    if (!bingImage) {
      await telegramBot.sendMessage(msg.chat.id, "Sorry, I couldn't find anything ¯\\_(ツ)_/¯.")
      lookForContext.delete(contextKey)

      return
    }

    const prompt =
      currentContext.index > 2
        ? sassyObessedAboutPrompt(currentContext.query)
        : sassyImageCaptionPrompt(currentContext.query)
    const caption = await getImageCaption(prompt, `here's ${currentContext.query}`)

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

    lookForContext.set(contextKey, {
      ...currentContext,
      index: currentContext.index + 1,
    })
  } catch (err) {
    logger.error({ err })
    telegramBot.sendMessage(msg.chat.id, "something went wrong :(")
  }
}
