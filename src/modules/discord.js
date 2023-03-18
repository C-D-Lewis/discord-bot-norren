// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('../../config.json');
const { OPTION_UPDATE_COMMANDS } = require('../constants');
const { registerSlashCommands } = require('./commands');
const { log } = require('./logger');

let client;

/**
 * Register slash commands in all known guilds.
 */
const registerCommandsInAllGuilds = async () => {
  const { cache } = client.guilds;

  console.log(`Updating slash commands in ${cache.size} servers:`);
  await Promise.all(cache.map(async (guild) => {
    try {
      await registerSlashCommands(guild.id);
      console.log(`✔️ ${guild.name}`);
    } catch (error) {
      console.log(`❌ ${guild.name}`);
      console.trace(error);
    }
  }));
};

/**
 * Initialise discord.js client.
 *
 * @param {object} opts - Function opts.
 * @param {Function} opts.onCommand - Callback on slash command received.
 * @param {Function} opts.onMessage - Callback on message received.
 * @param {Function} opts.onMessageButton - Callback when a message's button is pressed.
 * @returns {Promise} Promise resolving when connection is established and client set up.
 */
const setupClient = async ({ onCommand, onMessage, onMessageButton }) => new Promise((resolve) => {
  // Create a new client instance
  const newClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });

  // When ready
  newClient.once('ready', async () => {
    log('Connected to Discord');
    client = newClient;

    // Prepare slash commands?
    if (process.argv.includes(OPTION_UPDATE_COMMANDS)) {
      await registerCommandsInAllGuilds();
    }

    client.user.setStatus('online');
    resolve();
  });

  // When a command received
  newClient.on('interactionCreate', async (interaction) => {
    // Chat command
    if (interaction.isChatInputCommand()) {
      const { commandName, user: { username }, options } = interaction;
      // eslint-disable-next-line no-underscore-dangle
      const optionsStr = options._hoistedOptions.map(({ name, value }) => `${name}:${value}`).join(', ');
      log(`onCommand (${username}:${commandName}) ${optionsStr}`);
      await onCommand(commandName, interaction);
    }

    // Button was pressed
    if (interaction.isButton()) {
      const {
        customId,
        message: { interaction: { commandName } },
        user: { username },
      } = interaction;
      await onMessageButton(interaction, { customId, commandName, username });
    }
  });

  // Server general message
  newClient.on('messageCreate', async (interaction) => {
    log(`onMessage (${interaction.author.username}) ${interaction.content}`);
    await onMessage(interaction);
  });

  // Log in
  newClient.login(token);
});

/**
 * Get the client object.
 *
 * @returns {object} discord.js Client.
 */
const getClient = () => {
  if (!client) throw new Error('Client was not ready');

  return client;
};

/**
 * Reply just to the caller.
 *
 * @param {object} interaction - Discord.js interaction object.
 * @param {object} opts - Function options.
 * @param {string} opts.content - Message content.
 * @param {Array<object>} [opts.components] - Reply builder components.
 * @returns {Promise} Reply result.
 */
const replyHidden = (interaction, { content, components }) => interaction.reply({
  content,
  components,
  ephemeral: true,
});

module.exports = {
  setupClient,
  getClient,
  replyHidden,
};
