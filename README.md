# discord-bot-hom

Discord bot for the Heroes of Mirren Discord server.


## Setup bot

Create an application and bot in the Discord portal, as per guides.

Ensure the bot has the "Message Content" Privileged Gateway Intents.


## Invite to server

Create an URL using the Discord portal, such as:

```
https://discord.com/api/oauth2/authorize?client_id=1027938271025713163&permissions=3148800&scope=bot%20applications.commands
```

Ensure the URL has the following scopes:

* `bot`
* `application.commands`

And the following permissions:

* `Read Messages/View Channels` general permissions.
* `Send Messages` text permissions.
* `Connect` and `Speak` voice permissions.


## Setup app

1. Install dependencies:

```
sudo apt-get install libtool autoconf automake
```

```
npm ci
```

> Installing `sodium` may take several minutes.

2. Add `config.json` with credentials:

```json
{
  "token": "<app token>",
  "clientId": "<application id>",
  "guildId": "<server id>"
}
```

3. Register slash commands with Discord:

```
node scripts/deploy-commands.js $SERVER_ID
```

4. Pre-load the `sounds` and `music` directories with files to be matched by the `query`.

> Audio files must be in the Opus sound format

5. Start the app:

```
npm start
```

6. If you need to update the slash commands, delete them and re-create them:

```
node scripts/undeploy-commands.js $SERVER_ID
node scripts/deploy-commands.js $SERVER_ID
```
