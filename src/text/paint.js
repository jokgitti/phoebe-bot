import logger from "../helpers/logger.js"
import { getOpenAI } from "../services/openAI.js"
import { getTelegramBot } from "../telegramBot.js"

const telegramBot = getTelegramBot()
const openAI = getOpenAI()

export async function paint(msg, match) {
  const query = match[1]

  if (!query) {
    await telegramBot.sendMessage(msg.chat.id, "Sorry, what do you want me to pain? 🎨")
  }

  try {
    const imageResponse = await openAI.createImage({
      prompt: query,
      n: 1,
      size: "1024x1024",
    })

    const captionResponse = await openAI.createCompletion({
      model: "text-davinci-003",
      prompt: `acting as bob ross, describe your "${query}" painting, max 16 words`,
      max_tokens: 30,
      temperature: 1.1,
    })

    const imageUrl = imageResponse.data.data[0].url
    const caption = captionResponse.data.choices[0].text

    await telegramBot.sendPhoto(msg.chat.id, imageUrl, {
      caption,
      parse_mode: "HTML",
    })
  } catch (err) {
    logger.error({ err })
    telegramBot.sendMessage(msg.chat.id, "Something went wrong :(")
  }
}
