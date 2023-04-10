import { Message } from 'discord.js';
import { reactions } from '../../config.json';
import { log } from './logger';

/**
 * Handle configured auto-reactions.
 *
 * @param {Message} message - Discord.js message object.
 * @param {string} content - Message content.
 * @returns {Promise} Promise
 */
export const handleAutoReactions = (message: Message, content: string) => {
  const lower = content.toLowerCase();
  const toReact = reactions.filter(({ trigger }) => lower.includes(trigger.toLowerCase()));

  return Promise.all(toReact.map(async ({ emoji }) => {
    await message.react(emoji);
    log(`Reacted ${emoji}`);
  }));
};
