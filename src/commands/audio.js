const { getClosestFileName, buildFileList } = require('../modules/cache');
const { log } = require('../modules/logger');
const { joinVoiceChannelAndPlay, stopAndDisconnect } = require('../modules/voice');

/**
 * Handle 'sound' or 'music' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @param {string} type - Audio type (sound|music).
 * @returns {Promise}
 */
module.exports = async (interaction, type) => {
  const { options, member: { voice } } = interaction;
  const query = options.getString('query');

  // Reply with list
  if (query === 'list') return interaction.reply(buildFileList(type));

  // Stop request
  if (query === 'stop') {
    await stopAndDisconnect();
    return interaction.reply('Stopped playing');
  }

  const foundAudio = getClosestFileName(type, query);
  log({ query, foundAudio });
  if (!foundAudio) throw new Error(`No ${type} found for "${query}"`);
  if (!voice.channel) throw new Error('User was not in voice channel');

  // If user in voice channel, join it
  await joinVoiceChannelAndPlay(voice, foundAudio);

  // Reply to client
  return interaction.reply(`Playing \`${foundAudio.split('/').pop()}\` (query: "${query}")`);
};
