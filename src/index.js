const { setupClient, getClient } = require('./modules/discord');
const { cacheFileNames } = require('./modules/cache');
const { log } = require('./modules/logger');
const { replyHidden } = require('./modules/discord');
const { getCommand } = require('./modules/handlers');
const { handleAutoReactions } = require('./modules/reactions');
const { getVoiceAgent } = require('./modules/voice');

/**
 * Handle when a recent sound button is pressed.
 *
 * @param {object} interaction - Message interaction object.
 * @param {object} voice - Discordjs voice object.
 * @param {string} customId - Sound name as custom ID.
 * @returns {Promise} Reply result.
 */
const handleSoundButton = async (interaction, voice, customId) => {
  const voiceAgent = getVoiceAgent(voice);
  await voiceAgent.join();
  voiceAgent.play(customId);

  return replyHidden(interaction, { content: `Playing \`${customId}\`` });
};

/**
 * When a command is received.
 *
 * @param {string} name - Command name.
 * @param {object} interaction - Discord.js interaction object.
 * @returns {Promise} Handler that returns reply text.
 */
const onCommand = async (name, interaction) => {
  try {
    const command = getCommand(name);
    return await command(interaction);
  } catch (e) {
    const err = `⚠️ ${e.message}`;
    log(err);
    console.log(e);
    return replyHidden(interaction, { content: err });
  }
};

/**
 * On command via mention.
 *
 * @param {object} interaction - Message interaction object.
 * @returns {object} Reply result.
 */
const handleMessageCommand = async (interaction) => {
  const { author: { username }, content } = interaction;
  const [, keyword, ...args] = content.split(' ');
  log({ keyword, args });

  try {
    // React to greetings
    if (['hello', 'hey', 'hi'].includes(keyword)) return interaction.react('👋');

    // Implement any other message commands here

    // Else not sure which command
    return replyHidden(
      interaction,
      { content: `Sorry ${username}, I don't know what you want. Try using \`/help\`.` },
    );
  } catch (e) {
    const err = `⚠️ ${e.message}`;
    log(err);
    console.log(e);
    return replyHidden(interaction, { content: err });
  }
};

/**
 * When someone posts a message.
 *
 * @param {object} interaction - Message interaction object.
 * @returns {Promise} Promise
 */
const onMessage = async (interaction) => {
  const { author: { id: callerId }, mentions, content } = interaction;
  const { id: botId } = getClient().user;

  // Auto reactions
  await handleAutoReactions(interaction, content);

  // If mentioning me, and it wasn't me
  if (mentions.users.get(botId) && callerId !== botId) return handleMessageCommand(interaction);

  // Some other chat going by
  return undefined;
};

/**
 * When a message's button is pressed.
 *
 * @param {object} interaction - Message interaction object.
 * @param {object} opts - Function options.
 * @param {string} opts.commandName - Full command name.
 * @param {string} opts.customId - Button custom ID set at creation time.
 * @param {string} opts.username - User who pressed the button.
 * @returns {Promise} Promise
 */
const onMessageButton = async (interaction, { commandName, customId, username }) => {
  const { member: { voice } } = interaction;
  log(`onMessageButton (${username}:${commandName}:${customId})`);

  try {
    // Recent sound list button
    if (commandName === 'sound recent') return handleSoundButton(interaction, voice, customId);

    throw new Error('Unknown message button');
  } catch (e) {
    const err = `⚠️ ${e.message}`;
    log(err);
    console.log(e);
    return replyHidden(interaction, { content: err });
  }
};

/**
 * The main function.
 */
const main = async () => {
  log('Connecting...');
  await setupClient({ onCommand, onMessage, onMessageButton });
  await cacheFileNames();

  log('Ready');
};

main();
