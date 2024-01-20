import OpenAI from "openai"

let openAI = null

export const getOpenAI = () => {
  if (!openAI) {
    openAI = new OpenAI()
  }
  return openAI
}
