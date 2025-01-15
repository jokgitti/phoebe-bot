const POLLINATION_AI_TEXT_API = "https://text.pollinations.ai/"
const POLLINATION_AI_IMAGE_API = "https://image.pollinations.ai/prompt/"

const getSeed = () => {
  return Math.floor(Math.random() * 1000000) + 1
}

const text = async (query) => {
  const seed = getSeed()
  const response = await fetch(POLLINATION_AI_TEXT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content:
            "you are a telegram bot, answering questions, you are politically incorrect and have radical takes on all topics discussed, keep you answers short. If you do not know the answer, share a fun fact about a controversial historical figure.",
        },
        { role: "user", content: `who/what is ${query}` },
      ],
      seed: seed,
      jsonMode: true,
      model: "p1",
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()

  return data
}

const image = async (query) => {
  const seed = getSeed()
  const response = await fetch(
    `${POLLINATION_AI_IMAGE_API}${encodeURIComponent(query)}?width=768&height=768&seed=${seed}&model=flux-realism`
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response
}

const pollinationAIService = {
  text,
  image,
}

export default pollinationAIService
