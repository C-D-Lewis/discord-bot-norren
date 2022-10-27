const { hostname } = require('os');
const {
  START_TIME, MINS_MULT, HOURS_MULT, DAYS_MULT,
} = require('../constants');
const { getClient, replyHidden } = require('../modules/discord');
const { getCommit } = require('../util');

/**
 * Get readable uptime summary.
 * TODO: fix this
 *
 * @returns {string} Readable updtime string.
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
 * @returns {Promise} Reply result
 */
module.exports = (interaction) => {
  const uptimeStr = getReadableUptime();
  return replyHidden(
    interaction,
    { content: `ping: \`${getClient().ws.ping}ms\` | host: \`${hostname()}\` | uptime: \`${uptimeStr}\` | version: \`${getCommit()}\`` },
  );
};
