import { ChatInputCommandInteraction } from 'discord.js';
import { execSync } from 'child_process';
import { replyHidden } from '../modules/discord';
import { adminUsernames } from '../../config.json';
import { log } from '../modules/logger';

/**
 * Handle 'reboot' command.
 *
 * @param {ChatInputCommandInteraction} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
export default async function handlePing(interaction: ChatInputCommandInteraction) {
  const { user: { username } } = interaction;
  log(`${username} tried to request reboot`);

  if (!adminUsernames.includes(username)) {
    log('Reboot was denied');
    return replyHidden(
      interaction,
      { content: 'You are not authorized to use this command' },
    );
  }

  log('Reboot was permitted');
  await replyHidden(
    interaction,
    { content: 'Rebooting...' },
  );
  execSync('sleep 5 && sudo reboot &');

  return undefined;
}
