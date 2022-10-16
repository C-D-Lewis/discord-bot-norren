const { getClosestFileName, buildFileList } = require('../modules/cache');
const { log } = require('../modules/logger');
const { getCsprngInt } = require('../util');
const { replyHidden } = require('../modules/discord');
const { getVoiceAgent } = require('../modules/voice');

/**
 * Handle 'sound' or 'music' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @param {string} type - Audio type (sound|music).
 * @returns {Promise}
 */
module.exports = async (interaction, type) => {
  const { options, member: { voice } } = interaction;
  const query = options.getString('name');

  // Reply with list
  if (query === 'list') return replyHidden(interaction, buildFileList(type));

  // Not in a voice channel
  if (!voice.channel) throw new Error('I don\'t see you in a voice channel');

  const voiceAgent = getVoiceAgent(voice);

  // Stop sound in progress
  if (query === 'stop') {
    await voiceAgent.leave();
    return replyHidden(interaction, 'I have stopped playing that');
  }

  const results = getClosestFileName(type, query);
  log({ query, results });
  if (!results.length) throw new Error(`I don't know a ${type} for "${query}"`);

  // Multiple results? Pick one at random
  let foundAudio = results[0];
  if (Array.isArray(results) && results.length > 1) {
    foundAudio = results[getCsprngInt(0, results.length - 1)];
  }

  // If user in voice channel, join it
  await voiceAgent.join();
  voiceAgent.play(foundAudio);

  // Reply to client
  return replyHidden(
    interaction,
    `Playing \`${foundAudio.split('/').pop()}\` (query: "${query}", ${results.length} matches)`,
  );
};
