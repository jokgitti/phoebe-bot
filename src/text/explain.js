import { getTelegramBot } from "../telegramBot.js"
import pollinationsAI from "../services/pollinationsAI.js"

export async function explain(msg, match) {
  const telegramBot = getTelegramBot()
  const query = match[1]

  try {
    const { response } = await pollinationsAI.text(query)
    await telegramBot.sendMessage(msg.chat.id, response.replace(/^"|"$/g, ""))
  } catch (error) {
    console.error(error)
    telegramBot.sendMessage(msg.chat.id, "Mi sento male 😵")
  }
}
