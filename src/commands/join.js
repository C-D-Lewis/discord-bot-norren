const { replyHidden } = require('../modules/discord');
const { getVoiceAgent } = require('../modules/voice');

/**
 * Handle 'join' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = async (interaction) => {
  const { member: { voice } } = interaction;
  if (!voice.channel) throw new Error('I don\'t see you in a voice channel');

  const voiceAgent = getVoiceAgent();
  await voiceAgent.join(voice);
  voiceAgent.setStayConnected(true);

  return replyHidden(interaction, 'Joined the voice channel');
};
