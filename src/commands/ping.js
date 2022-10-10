const { hostname } = require('os');
const { getClient, replyHidden } = require('../modules/discord');
const { getCommit } = require('../modules/util');

const startTime = Date.now();

/**
 * Handle 'ping' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => {
  const uptime = Date.now() - startTime;
  let uptimeStr = `${Math.round(uptime / 1000)}s`;
  if (uptime > 1000 * 60) {
    uptimeStr = `${Math.round(uptime / (1000 * 60))} mins`;
  }
  if (uptime > 1000 * 60 * 60) {
    uptimeStr = `${Math.round(uptime / (1000 * 60 * 60))} hours`;
  }
  if (uptime > 1000 * 60 * 60 * 24) {
    uptimeStr = `${Math.round(uptime / (1000 * 60 * 60 * 24))} days`;
  }
  return replyHidden(
    interaction,
    `ping: \`${getClient().ws.ping}ms\` | host: \`${hostname()}\` | uptime: \`${uptimeStr}\` | version: \`${getCommit()}\``,
  );
};
