import { adminIds, adminUsernames, userIds, userUsernames } from "../config/index.js"
import logger from "../helpers/logger.js"
import { GENERIC_ERROR } from "../helpers/replies.js"

const logIds = (items) => {
  return items.reduce((acc, val) => acc + `\n- <a href='tg://user?id=${val}'>${val}</a>`, "")
}

const logUsernames = (items) => {
  return items.reduce((acc, val) => acc + `\n- @${val}`, "")
}

export async function listAdmins(ctx) {
  try {
    let text
    if (!adminIds.length && !adminUsernames.length) {
      text = "No admins? Bestie this place is literally ungoverned 😩"
    } else {
      text = ["Ugh fine, here are the admins I guess 🙄", logIds(adminIds), logUsernames(adminUsernames)]
        .filter((x) => x)
        .join("\n")
    }
    await ctx.reply(text, { parse_mode: "HTML" })
  } catch (err) {
    logger.error({ err })
    await ctx.reply(GENERIC_ERROR)
  }
}

export async function listUsers(ctx) {
  try {
    let text
    if (!userIds.length && !userUsernames.length) {
      text = "No users? So literally nobody is allowed in here 💀"
    } else {
      text = ["Ugh fine, here are the users I guess 🙄", logIds(userIds), logUsernames(userUsernames)]
        .filter((x) => x)
        .join("\n")
    }
    await ctx.reply(text, { parse_mode: "HTML" })
  } catch (err) {
    logger.error({ err })
    await ctx.reply(GENERIC_ERROR)
  }
}
