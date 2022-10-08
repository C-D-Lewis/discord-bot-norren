const { initClient, getClient } = require('./modules/client');
const handlePing = require('./commands/ping');
const handleHelp = require('./commands/help');
const handleRoll = require('./commands/roll');
const handleSound = require('./commands/sound');
const { cacheSoundNames } = require('./modules/cache');
const { log } = require('./modules/logger');

// Corresponds to all those registered with deploy-slash-commands.js
const commandMap = {
  help: handleHelp,
  ping: handlePing,
  roll: handleRoll,
  sound: handleSound,
  // sound list
  // rollToHit $d20 -> that'll do it / Uh go fuck yerself
};

/**
 * When a command is received.
 *
 * @param {string} name - Command name.
 * @param {object} interaction - Discord.js interaction object.
 * @returns {Function|AsyncFunction} Handler that returns reply text.
 */
const onCommand = async (name, interaction) => {
  if (!commandMap[name]) {
    const err = `Unknown command name ${name}`;
    log(err);
    return interaction.reply(err);
  }

  try {
    return await commandMap[name](interaction);
  } catch (e) {
    const err = `Error: ${e.message}`;
    log(err);
    return interaction.reply(err);
  }
};

/**
 * On command via mention.
 *
 * @param {string} content - Message content that mentioned the bot.
 */
const onMessageCommand = (content) => {
  const [keyword, ...args] = content.split(' ');

  // TODO Implement any message commands here
  log({ keyword, args });
};

/**
 * When someone posts a message.
 *
 * @param {object} event - Message event object.
 * @returns {Promise}
 */
const onMessage = (event) => {
  const { /* author: { name }, */ content, mentions } = event;

  // If mentioning me
  const mentionedMe = mentions.users.get(getClient().user.id);
  if (mentionedMe) return onMessageCommand(content);

  // TODO Some special passive reactions?
  return undefined;
};

/**
 * The main function.
 */
const main = async () => {
  // Connect
  await initClient({ onCommand, onMessage });

  // Set status
  const client = getClient();
  client.user.setStatus('online');

  // Cache sound names
  await cacheSoundNames();
};

main();
