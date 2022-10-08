const { initClient, getClient } = require('./modules/client');
const handlePing = require('./commands/ping');
const handleHelp = require('./commands/help');
const handleRoll = require('./commands/roll');
const handleSound = require('./commands/sound');
const handleRollToHit = require('./commands/rollToHit');
const { cacheSoundNames } = require('./modules/cache');
const { log } = require('./modules/logger');

// Corresponds to all those registered with deploy-slash-commands.js
const commandMap = {
  help: handleHelp,
  ping: handlePing,
  roll: handleRoll,
  sound: handleSound,
  rolltohit: handleRollToHit,
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
 * @param {object} interaction - Message interaction object.
 */
const onMessageCommand = (interaction) => {
  const { author: { username }, content } = interaction;
  const [, keyword, ...args] = content.split(' ');
  log({ keyword, args });

  // Implement any message commands here

  // Else not sure
  return interaction.reply(`Sorry ${username}, I don't know what you want`);
};

/**
 * When someone posts a message.
 *
 * @param {object} interaction - Message interaction object.
 * @returns {Promise}
 */
const onMessage = (interaction) => {
  const { author: { id: callerId }, mentions } = interaction;
  const botId = getClient().user.id;

  // If mentioning me, and it wasn't me
  const mentionedMe = mentions.users.get(botId);
  const mentionedSelf = callerId === botId;
  if (mentionedMe && !mentionedSelf) return onMessageCommand(interaction);

  // Some other chat going by
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
