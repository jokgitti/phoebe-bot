const INSPIRE_ME_BOT_API_URL = "https://inspirobot.me/api?generate=true"

export const inspireMeBot = async () => {
  const response = await fetch(INSPIRE_ME_BOT_API_URL)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.text()
}
