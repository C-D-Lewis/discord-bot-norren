const { hostname } = require('os');
const {
  START_TIME, MINS_MULT, HOURS_MULT, DAYS_MULT,
} = require('../modules/constants');
const { getClient, replyHidden } = require('../modules/discord');
const { getCommit } = require('../modules/util');

/**
 * Get readable uptime summary.
 *
 * @returns {string}
 */
const getReadableUptime = () => {
  const uptime = Date.now() - START_TIME;
  if (uptime > MINS_MULT) return `${Math.round(uptime / (MINS_MULT))} mins`;
  if (uptime > HOURS_MULT) return `${Math.round(uptime / (HOURS_MULT))} hours`;
  if (uptime > DAYS_MULT) return `${Math.round(uptime / (DAYS_MULT))} days`;

  // Seconds
  return `${Math.round(uptime / 1000)}s`;
};

/**
 * Handle 'ping' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => {
  const uptimeStr = getReadableUptime();
  return replyHidden(
    interaction,
    `ping: \`${getClient().ws.ping}ms\` | host: \`${hostname()}\` | uptime: \`${uptimeStr}\` | version: \`${getCommit()}\``,
  );
};
