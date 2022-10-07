const { getClient } = require('../modules/client');

/**
 * Handle 'ping' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => interaction.reply(`Ping is currently ${getClient().ws.ping}ms`);
