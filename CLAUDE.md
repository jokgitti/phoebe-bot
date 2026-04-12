# Phoebe Bot

A Telegram bot with a sassy gen-z personality. Built with Node.js and grammY.

## Quick Reference

- **Entry point:** `src/index.js`
- **Run:** `npm start` (uses nodemon for hot-reload)
- **Test:** `npm test` (Node built-in test runner)
- **Lint:** `npm run lint` / `npm run lint:fix`
- **Format:** `npm run format`
- **Build Docker:** `./build.sh` (arm64) or push a `v*.*.*` tag for CI
- **Node version:** 24.14.1 (pinned via `.nvmrc` and Volta)
- **Module system:** ES modules (`"type": "module"`)

## Project Structure

```txt
src/
  index.js              # Bot init, command registration, bot.start()
  bot.js                # grammY Bot instance
  config/index.js       # Env var loader
  helpers/
    auth.js             # adminOnly / authOnly grammY middleware
    logger.js           # Pino logger with key censoring
    replies.js          # Shared bot reply constants (GENERIC_ERROR, WIP)
  services/
    pollinationsAI.js   # Pollinations.ai API (image works, text broken)
    inspireMeBot.js     # InspireBot API
    duckDuckGo.js       # DuckDuckGo image search (vqd token scraping)
  commands/
    help.js             # help, whoami
    lookfor.js          # look for, look again, undo (DuckDuckGo images)
    explain.js          # DEPRECATED - pollinations.ai text (broken)
    generate.js         # AI image generation (pollinations.ai)
    kawaii.js           # Anime image generation (pollinations.ai)
    inspireme.js        # InspireBot quotes
    perticottero.js     # Perticone easter egg game + perti-stats
    perticottero.test.js # Tests for formatDuration
    auth.js             # list admins, list users
```

## Commands

All commands are triggered by messages starting with `phoebe` (case-insensitive).

| Command                      | Auth  | Notes                                           |
| ---------------------------- | ----- | ----------------------------------------------- |
| `phoebe help`                | User  | Lists available commands                        |
| `phoebe whoami`              | None  | Shows user's Telegram ID                        |
| `phoebe look for <query>`    | User  | DuckDuckGo image search, returns first result   |
| `phoebe look again`          | User  | Next result from last search (up to 10)         |
| `phoebe undo`                | User  | Deletes the last image Phoebe sent              |
| `phoebe inspire me`          | User  | Random InspireBot image                         |
| `phoebe perti-stats`         | User  | Perticone Hall of Shame — last 7 days           |
| `phoebe <...>perticone<...>` | User  | Easter egg game                                 |
| `phoebe list admins`         | Admin | Lists configured admins                         |
| `phoebe list users`          | Admin | Lists configured users                          |
| `phoebe explain <topic>`     | User  | **DEPRECATED** (pollinations.ai text API)       |
| `phoebe generate <prompt>`   | User  | AI image generation (pollinations.ai)           |
| `phoebe kawaii <prompt>`     | User  | Anime-style image generation (pollinations.ai)  |

## Phoebe's Voice

Phoebe is a sassy gen-z teenager. When writing her messages:

- **Tone:** Dramatic, unbothered, slightly condescending but in a funny way
- **Vocabulary:** Gen-z slang is fine — "bestie", "literally", "I can't rn", "main character", "slay"
- **Emoji usage:** Generous but not excessive — 💅 🫠 😌 😠 🤓 are on-brand
- **Error messages:** Never dry or technical. She's annoyed, confused, or having a meltdown — not reporting a stack trace
- **Examples of good error messages:**
  - "Ugh my brain just glitched, I literally can't rn 🫠"
  - "Something went wrong and honestly? Not my problem 💅"
  - "Mi sento male 😵" (Italian flair is fine)
- **Examples of bad error messages:**
  - "An error occurred. Please try again later."
  - "Error 500"
  - "PERTICERROR"

## Environment Variables

See `.env.example`. Required: `TELEGRAM_API_KEY`.
Optional: `ADMIN_IDS`, `ADMIN_USERNAMES`, `USER_IDS`, `USER_USERNAMES`, `LOG_LEVEL`, `DB_PATH` (defaults to `data/phoebe.db`), `NODE_ENV` (set to `production` to disable pino-pretty).

## Auth Model

Three tiers: public (whoami only), user-level (most commands), admin-level (list commands).
Users/admins are whitelisted via env vars (comma-separated IDs and/or usernames).
Middleware: `authOnly` (users + admins), `adminOnly` (admins only) in `src/helpers/auth.js`.

## Deprecated / To Remove

The pollinations.ai **text** API is broken:

- `src/commands/explain.js` - uses `pollinationsAI.text()`

The pollinations.ai **image** API still works and is used by:

- `src/commands/generate.js`
- `src/commands/kawaii.js`

## Known Tech Debt

- `explain` command still wired up but pollinations.ai text API is broken.
- DuckDuckGo image search relies on scraping a `vqd` token from raw HTML (`src/services/duckDuckGo.js`) — fragile, can break silently if DDG changes their page.
