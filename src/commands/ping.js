const { hostname } = require('os');
const { getClient } = require('../modules/client');

/**
 * Handle 'ping' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => interaction.reply(`\`${getClient().ws.ping}ms\` via \`${hostname()}\``);
