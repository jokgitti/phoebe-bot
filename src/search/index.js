import { imageSearch as bingImageSearch } from "../search/bing.js"
import { imageSearch as qwantImageSearch } from "../search/qwant.js"

import { bingSearchApiKey } from "../config/index.js"

export const imageSearch = bingSearchApiKey ? bingImageSearch : qwantImageSearch
