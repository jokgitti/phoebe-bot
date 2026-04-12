const DDG_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
}

async function getVqd(query) {
  const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
    headers: DDG_HEADERS,
  })
  if (!res.ok) throw new Error(`DDG init request failed: ${res.status}`)
  const html = await res.text()
  const match = html.match(/vqd=([\d-]+)/)
  if (!match) throw new Error("Could not extract vqd token from DDG response")
  return match[1]
}

export async function searchImages(query) {
  const vqd = await getVqd(query)
  const url = `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${vqd}&p=1&f=,,,&v7exp=a`
  const res = await fetch(url, {
    headers: { ...DDG_HEADERS, Referer: "https://duckduckgo.com/" },
  })
  if (!res.ok) throw new Error(`DDG image search failed: ${res.status}`)
  const data = await res.json()
  return data.results?.map((r) => r.image) ?? []
}
