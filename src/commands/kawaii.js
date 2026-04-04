import { InputFile } from "grammy"

import pollinationsAI from "../services/pollinationsAI.js"

export async function kawaii(ctx) {
  const query = ctx.match[1]

  try {
    const res = await pollinationsAI.image(`an anime version of ${query}`, "flux-anime")
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await ctx.replyWithPhoto(new InputFile(buffer))
  } catch (error) {
    console.error(error)
    await ctx.reply("めちゃくちゃににゃっちゃった ≽^•⩊•^≼")
  }
}
