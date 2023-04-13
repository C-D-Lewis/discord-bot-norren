import handleRoll from '../commands/roll';
import handleSearch from '../commands/search';
import handleAudio from '../commands/audio';
import handleJoin from '../commands/join';
import handleLeave from '../commands/leave';
import handleTts from '../commands/tts';
import handleAsk from '../commands/ask';
import handleHelp from '../commands/help';
import handlePing from '../commands/ping';
import { AUDIO_TYPE_SOUND, AUDIO_TYPE_MUSIC } from '../constants';
import { ChatInputCommandInteraction } from 'discord.js';

/** Map of all command handlers. */
const COMMAND_MAP = {
  roll: handleRoll,
  search: handleSearch,
  /**
   * Getter for handler for 'sound' command.
   *
   * @param {ChatInputCommandInteraction} interaction - Discord.js interaction object.
   * @returns {Promise<object>} Reply
   */
  sound: (interaction: ChatInputCommandInteraction) => handleAudio(interaction, AUDIO_TYPE_SOUND),
  /**
   * Getter for handler for 'music' command.
   *
   * @param {ChatInputCommandInteraction} interaction - Discord.js interaction object.
   * @returns {Promise<object>} Reply
   */
  music: (interaction: ChatInputCommandInteraction) => handleAudio(interaction, AUDIO_TYPE_MUSIC),
  join: handleJoin,
  leave: handleLeave,
  tts: handleTts,
  ask: handleAsk,
  help: handleHelp,
  ping: handlePing,
};

/** Special command map type. */
export type CommandMapType = typeof COMMAND_MAP;

/**
 * Find the command handler function for the named command.
 * Corresponds to all those registered with deploy-slash-commands.js
 *
 * @param {CommandName} name - Command name.
 * @returns {Function} handler function.
 */
export const getCommand = (name: keyof CommandMapType) => {
  if (!COMMAND_MAP[name]) throw new Error('I don\'t know that command, but I should know it');

  return COMMAND_MAP[name];
};
