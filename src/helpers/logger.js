import pino from "pino"

import { logLevel } from "../config/index.js"
import info from "../../package.json" assert { type: "json" }

const censorRegex = /(?<!^).(?!$)/g

export const censor = (s) => s.replace(censorRegex, "*")

export const logger = pino({
  level: logLevel,
  name: info.name,
}).child({
  version: `v${info.version}`,
})

export default logger
