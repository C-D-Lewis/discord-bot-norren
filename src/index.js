const { setupClient, getClient } = require('./modules/discord');
const { cacheFileNames } = require('./modules/cache');
const { log } = require('./modules/logger');
const { replyHidden } = require('./modules/discord');
const { getCommand } = require('./modules/handlers');
const { handleAutoReactions } = require('./modules/reactions');

/**
 * When a command is received.
 *
 * @param {string} name - Command name.
 * @param {object} interaction - Discord.js interaction object.
 * @returns {Function|AsyncFunction} Handler that returns reply text.
 */
const onCommand = async (name, interaction) => {
  try {
    const command = getCommand(name);
    return await command(interaction);
  } catch (e) {
    const err = `⚠️ ${e.message}`;
    log(err);
    return replyHidden(interaction, err);
  }
};

/**
 * On command via mention.
 *
 * @param {object} interaction - Message interaction object.
 */
const handleMessageCommand = (interaction) => {
  const { author: { username }, content } = interaction;
  const [, keyword, ...args] = content.split(' ');
  log({ keyword, args });

  // Implement any message commands here
  if (['hello', 'hey', 'hi'].includes(keyword)) {
    return interaction.react('👋');
  }

  // Else not sure which command
  return replyHidden(
    interaction,
    `Sorry ${username}, I don't know what you want. Try using \`/help\`.`,
  );
};

/**
 * When someone posts a message.
 *
 * @param {object} interaction - Message interaction object.
 * @returns {Promise}
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
 * The main function.
 */
const main = async () => {
  await setupClient({ onCommand, onMessage });
  await cacheFileNames();

  log('Ready');
};

main();
