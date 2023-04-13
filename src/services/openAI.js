import { Configuration, OpenAIApi } from "openai"

import { openaiApiKey } from "../config/index.js"

const openAIConfig = new Configuration({
  apiKey: openaiApiKey,
})

let openAI = null

export const getOpenAI = () => {
  if (!openAI) {
    openAI = new OpenAIApi(openAIConfig)
  }
  return openAI
}
