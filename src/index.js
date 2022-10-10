const { initClient, getClient } = require('./modules/discord');
const handlePing = require('./commands/ping');
const handleHelp = require('./commands/help');
const handleRoll = require('./commands/roll');
const handleSearch = require('./commands/search');
const handleAudio = require('./commands/audio');
const handleAsk = require('./commands/ask');
const { cacheFileNames } = require('./modules/cache');
const { log } = require('./modules/logger');
const { AUDIO_TYPE_SOUND, AUDIO_TYPE_MUSIC } = require('./modules/constants');
const { replyHidden } = require('./modules/discord');
const { reactions } = require('../config.json');

// Corresponds to all those registered with deploy-slash-commands.js
const commandMap = {
  roll: handleRoll,
  search: handleSearch,
  sound: (interaction) => handleAudio(interaction, AUDIO_TYPE_SOUND),
  music: (interaction) => handleAudio(interaction, AUDIO_TYPE_MUSIC),
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
 * On command via mention.
 *
 * @param {object} interaction - Message interaction object.
 */
const onMessageCommand = (interaction) => {
  const { author: { username }, content } = interaction;
  const [, keyword, ...args] = content.split(' ');
  log({ keyword, args });

  // Implement any message commands here

  // Else not sure
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
  const lower = content.toLowerCase();
  const toReact = reactions.filter(({ trigger }) => lower.includes(trigger));
  await Promise.all(toReact.map((p) => interaction.react(p.emoji)));

  // If mentioning me, and it wasn't me
  if (mentions.users.get(botId) && callerId !== botId) return onMessageCommand(interaction);

  // Some other chat going by
  return undefined;
};

/**
 * The main function.
 */
const main = async () => {
  await initClient({ onCommand, onMessage });
  log('Connected to Discord');

  getClient().user.setStatus('online');

  await cacheFileNames();

  log('Ready');
};

main();
