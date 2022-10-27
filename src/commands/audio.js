const { getClosestFileName, buildFileList } = require('../modules/cache');
const { log } = require('../modules/logger');
const { getCsprngInt } = require('../util');
const { replyHidden } = require('../modules/discord');
const { getVoiceAgent } = require('../modules/voice');
const { buildRecentSounds, addUserRecentSound } = require('../modules/recentSounds');

/**
 * Handle 'sound' or 'music' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @param {string} type - Audio type (sound|music).
 * @returns {Promise} Reply result.
 */
module.exports = async (interaction, type) => {
  const { user: { username }, options, member: { voice } } = interaction;
  const query = options.getString('name');
  const subcommand = options.getSubcommand();

  // Reply with list
  if (subcommand === 'list') return replyHidden(interaction, { content: buildFileList(type) });

  // List recently
  if (subcommand === 'recent')  {
    return replyHidden(
      interaction,
      { content: '_You recently played:_', components: buildRecentSounds(username) },
    );
  }

  // Not in a voice channel
  if (!voice.channel) throw new Error('I don\'t see you in a voice channel');

  const voiceAgent = getVoiceAgent(voice);

  // Stop sound in progress
  if (subcommand === 'stop') {
    await voiceAgent.leave();
    return replyHidden(interaction, { content: 'I have stopped playing that' });
  }

  // Play a sound
  if (subcommand === 'play') {
    const results = getClosestFileName(type, query);
    log({ query, results });
    if (!results.length) throw new Error(`I don't know a ${type} for "${query}"`);

    // Multiple results? Pick one at random
    let foundAudio = results[0];
    if (Array.isArray(results) && results.length > 1) {
      foundAudio = results[getCsprngInt(0, results.length - 1)];
    }

    // Record in user's recent sounds
    addUserRecentSound(username, foundAudio);

    // If user in voice channel, join it
    await voiceAgent.join();
    voiceAgent.play(foundAudio);

    // Reply to client
    return replyHidden(
      interaction,
      { content: `Playing \`${foundAudio.split('/').pop()}\` (query: "${query}", ${results.length} matches)` },
    );
  }

  throw new Error('Unknown subcommand');
};
