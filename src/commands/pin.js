const { replyHidden } = require('../modules/discord');
const db = require('../modules/db');
const { DB_KEY_PINS } = require('../constants');

/**
 * Handle 'pin' command to remember and list pinned text or links.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = async (interaction) => {
  const { options, guild: { name: guildName, id: guildId } } = interaction;
  const subcommand = options.getSubcommand();

  // Initialise
  if (!db.exists(DB_KEY_PINS)) db.set(DB_KEY_PINS, {});
  const allPins = db.get(DB_KEY_PINS);
  if (!allPins[guildId]) {
    allPins[guildId] = { guildName, pins: [] };
  }
  const guildPins = allPins[guildId];

  // Add a new pin
  if (subcommand === 'add') {
    const text = options.getString('text');

    guildPins.pins.push(text);
    db.set(DB_KEY_PINS, allPins);
    return interaction.reply(`📌 Pinned "${text}"`);
  }

  // List existing for this server
  if (subcommand === 'list') {
    const pinListStr = guildPins.pins.length > 0
      ? guildPins.pins.map((text, i) => `📌\`${i}\`: <${text}>`).join('\n')
      : 'No pins yet';
    const replyText = `_Pins in ${guildName}:_
${pinListStr}
`;
    return replyHidden(interaction, replyText);
  }

  // Delete a pin
  if (subcommand === 'delete') {
    const id = options.getInteger('id');
    if (!guildPins.pins[id]) throw new Error(`Unknown pin ID ${id}`);

    guildPins.pins.splice(id, 1);
    db.set(DB_KEY_PINS, allPins);

    return interaction.reply(`📌 Deleted pin \`${id}\``);
  }

  throw new Error('Unhandled /pin command');
};
