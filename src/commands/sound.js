const { getClosestSoundName, buildSoundList } = require('../modules/cache');
const { log } = require('../modules/logger');
const { joinVoiceChannelAndPlay } = require('../modules/voice');

/**
 * Handle 'sound' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = async (interaction) => {
  const { options, member: { voice } } = interaction;
  const query = options.getString('query');

  // Reply with list
  if (['help', 'list'].includes(query)) return interaction.reply(buildSoundList());

  const foundSound = getClosestSoundName(query);
  const soundName = `sounds/${foundSound}`;
  log({ query, foundSound, soundName });
  if (!foundSound) throw new Error(`No sound found for "${query}"`);

  // If user in voice channel, join it
  if (voice.channel) {
    await joinVoiceChannelAndPlay(voice, soundName);

    // Reply to client
    return interaction.reply(`Playing ${soundName.split('/').pop()} (query: "${query}")`);
  }

  throw new Error(`Failed to match or play sound ${query}`);
};
