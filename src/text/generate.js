import { getTelegramBot } from "../telegramBot.js"
import pollinationsAI from "../services/pollinationsAI.js"

export async function generate(msg, match) {
    const telegramBot = getTelegramBot()
    const query = match[1]

    try {
        const res = await pollinationsAI.image(query)
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await telegramBot.sendPhoto(msg.chat.id, buffer, {
            parse_mode: "HTML",
        })

    } catch (error) {
        console.error(error)
        telegramBot.sendMessage(msg.chat.id, 'scusa non ho capito')
    }

}