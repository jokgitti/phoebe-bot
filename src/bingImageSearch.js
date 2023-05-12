import request from "request"

import { bingSearchApiKey } from "./config/index.js"

export async function bingImageSearch(query, index = 0) {
  const url = new URL("https://api.bing.microsoft.com/v7.0/images/search")
  const parameters = [
    ["q", query],
    ["safeSearch", "off"],
  ]
  const urlEncodedParamers = new URLSearchParams(parameters).toString()
  url.search = urlEncodedParamers

  const headers = {
    "Ocp-Apim-Subscription-Key": bingSearchApiKey,
  }

  return new Promise((resolve, reject) => {
    request({ url, headers }, (error, _, body) => {
      if (error) return reject(error)

      try {
        const results = JSON.parse(body).value
        if (!results) return resolve(null)

        resolve(results[index] || null)
      } catch (err) {
        reject(err)
      }
    })
  })
}
