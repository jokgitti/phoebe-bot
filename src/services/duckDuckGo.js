const DDG_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRetry(url, options, { attempts = 3, baseDelay = 500 } = {}) {
  let lastErr
  for (let i = 0; i < attempts; i++) {
    if (i > 0) await sleep(baseDelay * 2 ** (i - 1))
    try {
      const res = await fetch(url, options)
      return res
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr
}

async function getVqd(query) {
  const res = await fetchWithRetry(
    `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
    { headers: DDG_HEADERS }
  )
  if (!res.ok) throw new Error(`DDG init request failed: ${res.status}`)
  const html = await res.text()
  const match = html.match(/vqd=["']?([\d-]+)["']?/) ?? html.match(/vqd=([\w-]+)/)
  if (!match) throw new Error("Could not extract vqd token from DDG response")
  return match[1]
}

export async function searchImages(query) {
  const vqd = await getVqd(query)
  const url = `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${vqd}&p=1&f=,,,`
  const res = await fetchWithRetry(url, {
    headers: { ...DDG_HEADERS, Accept: "application/json", Referer: "https://duckduckgo.com/" },
  })
  if (!res.ok) throw new Error(`DDG image search failed: ${res.status}`)
  const data = await res.json()
  return data.results?.map((r) => r.image) ?? []
}
