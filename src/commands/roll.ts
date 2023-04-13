import { ChatInputCommandInteraction } from 'discord.js';
import { getCsprngInt } from '../util';

/**
 * Handle 'roll' command.
 *
 * @param {ChatInputCommandInteraction} interaction - discord.js interaction object.
 * @returns {Promise} Reply result.
 */
export default function handleRoll(interaction: ChatInputCommandInteraction) {
  const max = interaction.options.getNumber('d')!;

  return interaction.reply(`🎲 I rolled a d${max} and got \`${getCsprngInt(1, max)}\``);
}
