const { getClosestFileName, buildFileList } = require('../modules/cache');
const { log } = require('../modules/logger');
const { getCsprngInt } = require('../modules/util');
const { replyHidden } = require('../modules/discord');
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
  const query = options.getString('name');

  // Reply with list
  if (query === 'list') return replyHidden(interaction, buildFileList(type));

  // Stop request
  if (query === 'stop') {
    await stopAndDisconnect();
    return replyHidden(interaction, 'I have stopped playing that');
  }

  if (!voice.channel) throw new Error('I don\'t see you in a voice channel');

  const results = getClosestFileName(type, query);
  log({ query, results });
  if (!results.length) throw new Error(`I don't know a ${type} for "${query}"`);

  // Multiple results?
  let foundAudio = results[0];
  if (Array.isArray(results) && results.length > 1) {
    const index = getCsprngInt(0, results.length - 1);
    log(`Multiple matches: ${query} -> ${results[index]} ${index}/${results.length} (${results.join(', ')})`);
    foundAudio = results[index];
  }

  // If user in voice channel, join it
  await joinVoiceChannelAndPlay(voice, foundAudio);

  // Reply to client
  // const names = Array.isArray(results)
  //   ? results.map((p) => p.split('.')[0]).map((p) => `\`${p}\``).join(', ')
  //   : `\`${results.split('.')[0]}\``;
  return replyHidden(
    interaction,
    `Playing \`${foundAudio.split('/').pop()}\` (query: "${query}", matches: ${results.length})`,
  );
};
