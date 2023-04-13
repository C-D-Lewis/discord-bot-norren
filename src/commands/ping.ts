import { hostname } from 'os';
import { ChatInputCommandInteraction } from 'discord.js';
import {
  START_TIME, MINS_MULT, HOURS_MULT, DAYS_MULT,
} from '../constants';
import { getClient, replyHidden } from '../modules/discord';
import { getCommit } from '../util';

/**
 * Get readable uptime summary.
 * TODO: fix this
 *
 * @returns {string} Readable updtime string.
 */
const getReadableUptime = () => {
  const uptime = Date.now() - START_TIME;
  if (uptime > DAYS_MULT) return `${Math.round(uptime / (DAYS_MULT))} days`;
  if (uptime > HOURS_MULT) return `${Math.round(uptime / (HOURS_MULT))} hours`;
  if (uptime > MINS_MULT) return `${Math.round(uptime / (MINS_MULT))} mins`;

  // Seconds
  return `${Math.round(uptime / 1000)}s`;
};

/**
 * Handle 'ping' command.
 *
 * @param {ChatInputCommandInteraction} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
export default function handlePing(interaction: ChatInputCommandInteraction) {
  const uptimeStr = getReadableUptime();

  return replyHidden(
    interaction,
    { content: `ping: \`${getClient().ws.ping}ms\` / host: \`${hostname()}\` / uptime: \`${uptimeStr}\` / version: \`${getCommit()}\`` },
  );
}
