# discord-hom-bot

Discord bot for the Heroes of Mirren Discord server.


## Setup app

Install dependencies:

```
npm ci
```

```
sudo apt-get install libtool autoconf automake
```

Add `config.json` with credentials:

```json
{
  "token": "<app token>",
  "clientId": "<application id>",
  "guildId": "<server id>"
}
```

Register slash commands with Discord:

```
node scripts/deploy-slash-commands.js
```

Start the app:

```
npm start
```


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


## Commands

TODO
