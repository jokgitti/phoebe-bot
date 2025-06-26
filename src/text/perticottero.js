import { getTelegramBot } from "../telegramBot.js"

let pertiDate = ""

export async function thePertiGame(msg, _) {
  const telegramBot = getTelegramBot()

  try {
    msg = "I can't believe you never though of Perticone, the italian mandrillo. You sounds like a broken AI";

    if pertiDate !== "" {
      msg = `
I know, you couldn't resist thinking about him and his white ciolla. 
You lasted ${daysSince()} days. Congrats, I suppose (?) 👎
Goodbye, little wanker 🍆 Try to not wet the bed tonight
`;
    }

    daysSince = Date.now();

    await telegramBot.sendMessage(msg.chat.id, msg)
  } catch (error) {
    console.error(error)
    telegramBot.sendMessage(msg.chat.id, "PERTICERROR")
  }
}

function daysSince() {
  const now = Date.now();
  const diffTime = Math.abs(now - pertiDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays
}
