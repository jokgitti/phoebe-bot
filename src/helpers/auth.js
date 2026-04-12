import { adminIds, adminUsernames, userIds, userUsernames } from "../config/index.js"
import logger from "./logger.js"

export const isAdmin = ({ id, username }) => adminIds.includes(id.toString()) || adminUsernames.includes(username)

export const isUser = ({ id, username }) => userIds.includes(id.toString()) || userUsernames.includes(username)

export const adminOnly = async (ctx, next) => {
  if (!ctx.from || (!ctx.from.id && !ctx.from.username)) {
    logger.fatal({ from: ctx.from }, "invalid ctx.from value")
    return
  }

  if (!isAdmin(ctx.from)) {
    try {
      if (isUser(ctx.from)) {
        logger.warn({ from: ctx.from }, "a non-admin user wrote to me")
        await ctx.reply("nice try bestie, but you're not the main character here 💅")
      } else {
        logger.warn({ from: ctx.from }, "an unknown user wrote to me")
        await ctx.reply("please stop talking to me, i have a boyfriend 😠")
      }
    } catch (err) {
      logger.error({ err })
    }
    return
  }

  await next()
}

export const authOnly = async (ctx, next) => {
  if (!ctx.from || (!ctx.from.id && !ctx.from.username)) {
    logger.fatal({ from: ctx.from }, "invalid ctx.from value")
    return
  }

  if (!isAdmin(ctx.from) && !isUser(ctx.from)) {
    try {
      logger.warn({ from: ctx.from }, "an unknown user wrote to me")
      await ctx.reply("please stop talking to me, i have a boyfriend 😠")
    } catch (err) {
      logger.error({ err })
    }
    return
  }

  await next()
}
