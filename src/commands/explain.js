import pollinationsAI from "../services/pollinationsAI.js"

export async function explain(ctx) {
  const query = ctx.match[1]

  try {
    const { response } = await pollinationsAI.text(query)
    await ctx.reply(response.replace(/^"|"$/g, ""))
  } catch (error) {
    console.error(error)
    await ctx.reply("Mi sento male 😵")
  }
}
