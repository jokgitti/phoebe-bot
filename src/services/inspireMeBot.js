import request from "request"

const INSPIRE_ME_BOT_API_URL = 'https://inspirobot.me/api?generate=true'

export const inspireMeBot = () => {
    return new Promise((resolve, reject) => {
        request(INSPIRE_ME_BOT_API_URL, (error, _, body) => {
            if (error) {
                return reject(error)
            }
            resolve(body)
        })
    })
}