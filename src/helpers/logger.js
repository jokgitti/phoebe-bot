import pino from "pino"

import info from "../../package.json" with { type: "json" }
import { logLevel } from "../config/index.js"

const censorRegex = /(?<!^).(?!$)/g

export const censor = (s) => (s ? s.replace(censorRegex, "*") : typeof s)

export const logger = pino({
  level: logLevel,
  name: `${info.name} v${info.version}`,
  transport: {
    target: "pino-pretty",
  },
})

export default logger
