import request from "request"

export async function imageSearch(query, index = 0) {
  const url = new URL("https://api.qwant.com/v3/search/images")
  const parameters = [
    ["t", "images"],
    ["q", query],
    ["count", 1],
    ["locale", "it_IT"],
    ["offset", index],
    ["device", "desktop"],
    ["safesearch", 0],
  ]
  const urlEncodedParamers = new URLSearchParams(parameters).toString()
  url.search = urlEncodedParamers

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 10.0; MI 9T Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36",
  }

  return new Promise((resolve, reject) => {
    request({ url, headers }, (error, _, body) => {
      if (error) return reject(error)

      try {
        const {
          data: {
            result: { items },
          },
        } = JSON.parse(body)

        if (!items || !items.length) return resolve(null)

        resolve({
          contentUrl: items[0].media,
          hostPageUrl: items[0].url,
          encodingFormat: items[0].thumb_type,
        })
      } catch (err) {
        reject(err)
      }
    })
  })
}
