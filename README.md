# phoebe-bot

A Telegram bot with the personality of a sassy gen-z teen. She generates images, shares inspirational quotes, and keeps track of how long you can go without mentioning Perticone.

## Features

- **Image generation** (`phoebe generate <prompt>`) - generates an image from a text prompt via pollinations.ai.
- **Kawaii mode** (`phoebe kawaii <prompt>`) - generates an anime-style image via pollinations.ai.
- **Inspiration** (`phoebe inspire me`) - fetches a random inspirational quote image from InspireBot.
- **Perticone game** (`phoebe <...>perticone<...>`) - tracks how long since someone last mentioned Perticone.
- **Admin tools** (`phoebe list admins`, `phoebe list users`) - inspect configured access lists.
- **Identity** (`phoebe whoami`) - returns your Telegram user ID.

### WIP commands

- `phoebe look for <query>` / `phoebe look again` / `phoebe undo` - image search (being reworked)

### Deprecated commands

- `phoebe explain <topic>` - AI-generated explanations (pollinations.ai text API, currently broken)

## Setup

### Prerequisites

- Node.js 24.14.1 (pinned via `.nvmrc` and [Volta](https://volta.sh/))
- A [Telegram Bot API](https://core.telegram.org/bots#botfather) token

### Installation

```sh
npm i
```

### Configuration

Copy `.env.example` to `.env` and fill in the values:

```sh
cp .env.example .env
```

| Variable           | Required | Description                                                  |
| ------------------ | -------- | ------------------------------------------------------------ |
| `TELEGRAM_API_KEY` | Yes      | Telegram Bot API token                                       |
| `ADMIN_IDS`        | No       | Comma-separated Telegram user IDs with admin access          |
| `ADMIN_USERNAMES`  | No       | Comma-separated Telegram usernames with admin access         |
| `USER_IDS`         | No       | Comma-separated Telegram user IDs allowed to use the bot     |
| `USER_USERNAMES`   | No       | Comma-separated Telegram usernames allowed to use the bot    |
| `LOG_LEVEL`        | No       | Pino log level (default: `debug`)                            |
| `DB_PATH`          | No       | Path to the SQLite database file (default: `data/phoebe.db`) |

### Running

```sh
npm start
```

This starts the bot with nodemon for auto-reload during development. In production, the entry point is `node src/index.js`.

### Testing

```sh
npm test
```

Uses Node's built-in test runner.

### Linting & Formatting

```sh
npm run lint        # check for issues
npm run lint:fix    # auto-fix (includes import sorting)
npm run format      # run Prettier
```

## Docker

Build and run with Docker:

```sh
docker build -t phoebe-bot .
docker run --env-file .env -v /your/host/path:/usr/src/app/data phoebe-bot
```

The `/usr/src/app/data` volume is where the SQLite database lives. Mount a host directory there to persist data across restarts.

Or use the included `build.sh` for a local multi-platform build (arm64).

## CI/CD

Pushing a git tag matching `v*.*.*` triggers a GitHub Actions workflow that builds a multi-arch Docker image (`amd64` + `arm64`) and pushes it to Docker Hub. Requires `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` repository secrets.

## Architecture

The bot uses long-polling via [grammY](https://grammy.dev/). Commands are registered as `bot.hears()` regex listeners in `src/index.js`. Access control is handled by `authOnly` / `adminOnly` grammY middleware.

## License

ISC
