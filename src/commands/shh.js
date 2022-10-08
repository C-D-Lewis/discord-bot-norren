const { stopAndDisconnect } = require('../modules/voice');
/**
 * Handle 'shh' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = async (interaction) => {
  await stopAndDisconnect();
  return interaction.reply('Stopped playing');
};
