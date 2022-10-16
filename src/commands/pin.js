const { replyHidden } = require('../modules/discord');

/**
 * Handle 'pin' command to remember and list pinned text or links.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = async (interaction) => {
  const { options } = interaction;
  const text = options.getString('text');

  // List existing for this server

  // Add a new pin

  // Delete a pin (how to identify then? Indices?)

  return replyHidden(interaction, text);
};
