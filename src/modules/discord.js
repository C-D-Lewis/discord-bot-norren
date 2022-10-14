// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('../../config.json');
const { log } = require('./logger');

let client;

/**
 * Initialise discord.js client.
 *
 * @param {object} opts - Function opts.
 * @param {Function} opts.onCommand - Callback on slash command received.
 * @param {Function} opts.onMessage - Callback on message received.
 * @returns {Promise}
 */
const setupClient = async ({ onCommand, onMessage }) => new Promise((resolve) => {
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
  newClient.once('ready', () => {
    client = newClient;
    client.user.setStatus('online');
    log('Connected to Discord');
    resolve();
  });

  // When a command received
  newClient.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, user: { username }, options } = interaction;
    // eslint-disable-next-line no-underscore-dangle
    const optionsStr = options._hoistedOptions.map(({ name, value }) => `${name}:${value}`).join(', ');
    log(`onCommand (${username}:${commandName}) ${optionsStr}`);
    await onCommand(commandName, interaction);
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
 * @param {string} content - Message content.
 * @returns {Promise}
 */
const replyHidden = (interaction, content) => interaction.reply({ content, ephemeral: true });

module.exports = {
  setupClient,
  getClient,
  replyHidden,
};
