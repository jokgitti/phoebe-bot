import request from "request";

export async function bingImageSearch(query, index = 0) {
  const url = new URL("https://api.bing.microsoft.com/v7.0/images/search");
  const parameters = [
    ["q", query],
    ["safeSearch", "off"],
  ];
  const urlEncodedParamers = new URLSearchParams(parameters).toString();
  url.search = urlEncodedParamers;

  const headers = {
    "Ocp-Apim-Subscription-Key": process.env.BING_SEARCH_API_KEY,
  };

  return new Promise((resolve, reject) => {
    request({ url, headers }, (error, _, body) => {
      const results = JSON.parse(body).value;

      if (error) {
        reject(error);
      }

      resolve(results[index] || null);
    });
  });
}
