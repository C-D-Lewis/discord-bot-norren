const { replyHidden } = require('../modules/discord');
const { getVoiceAgent } = require('../modules/voice');

/**
 * Handle 'leaev' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = async (interaction) => {
  const { member: { voice } } = interaction;
  if (!voice.channel) throw new Error('I don\'t see you in a voice channel');

  await getVoiceAgent().leave();
  return replyHidden(interaction, 'Left the voice channel');
};
