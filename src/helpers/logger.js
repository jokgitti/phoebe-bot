import pino from "pino"

import info from "../../package.json" with { type: "json" }
import { isProd, logLevel } from "../config/index.js"

const censorRegex = /(?<!^).(?!$)/g

export const censor = (s) => (s ? s.replace(censorRegex, "*") : typeof s)

export const logger = pino({
  level: logLevel,
  name: `${info.name} v${info.version}`,
  ...(!isProd && {
    transport: {
      target: "pino-pretty",
      options: {
        singleLine: true,
      },
    },
  }),
})

export default logger
