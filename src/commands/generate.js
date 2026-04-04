import { InputFile } from "grammy"

import { GENERIC_ERROR } from "../helpers/replies.js"
import pollinationsAI from "../services/pollinationsAI.js"

export async function generate(ctx) {
  const query = ctx.match[1]

  try {
    const res = await pollinationsAI.image(query)
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await ctx.replyWithPhoto(new InputFile(buffer))
  } catch (error) {
    console.error(error)
    await ctx.reply(GENERIC_ERROR)
  }
}
