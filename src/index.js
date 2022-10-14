const { setupClient, getClient } = require('./modules/discord');
const handleRoll = require('./commands/roll');
const handleSearch = require('./commands/search');
const handleAudio = require('./commands/audio');
const handleAsk = require('./commands/ask');
const handleJoin = require('./commands/join');
const handleLeave = require('./commands/leave');
const handleHelp = require('./commands/help');
const handlePing = require('./commands/ping');
const { cacheFileNames } = require('./modules/cache');
const { log } = require('./modules/logger');
const { AUDIO_TYPE_SOUND, AUDIO_TYPE_MUSIC } = require('./modules/constants');
const { replyHidden } = require('./modules/discord');
const { reactions = [] } = require('../config.json');

// Corresponds to all those registered with deploy-slash-commands.js
const commandMap = {
  roll: handleRoll,
  search: handleSearch,
  sound: (interaction) => handleAudio(interaction, AUDIO_TYPE_SOUND),
  music: (interaction) => handleAudio(interaction, AUDIO_TYPE_MUSIC),
  join: handleJoin,
  leave: handleLeave,
  ask: handleAsk,
  help: handleHelp,
  ping: handlePing,
};

/**
 * When a command is received.
 *
 * @param {string} name - Command name.
 * @param {object} interaction - Discord.js interaction object.
 * @returns {Function|AsyncFunction} Handler that returns reply text.
 */
const onCommand = async (name, interaction) => {
  try {
    if (!commandMap[name]) throw new Error('I don\'t know that command, but I should know it');

    return await commandMap[name](interaction);
  } catch (e) {
    const err = `⚠️ ${e.message}`;
    log(err);
    return replyHidden(interaction, err);
  }
};

/**
 * Handle configured auto-reactions.
 *
 * @param {object} interaction - Discord.js interaction object.
 * @param {string} content - Message content.
 * @returns {Promise}
 */
const handleAutoReactions = (interaction, content) => {
  const lower = content.toLowerCase();
  const toReact = reactions.filter(({ trigger }) => lower.includes(trigger));
  return Promise.all(toReact.map(async ({ emoji }) => {
    await interaction.react(emoji);
    log(`Reacted ${emoji}`);
  }));
};

/**
 * On command via mention.
 *
 * @param {object} interaction - Message interaction object.
 */
const onMessageCommand = (interaction) => {
  const { author: { username }, content } = interaction;
  const [, keyword, ...args] = content.split(' ');
  log({ keyword, args });

  // Implement any message commands here

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
  const botId = getClient().user.id;

  // Auto reactions
  await handleAutoReactions(interaction, content);

  // If mentioning me, and it wasn't me
  if (mentions.users.get(botId) && callerId !== botId) return onMessageCommand(interaction);

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
