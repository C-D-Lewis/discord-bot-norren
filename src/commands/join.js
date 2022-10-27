const { replyHidden } = require('../modules/discord');
const { getVoiceAgent } = require('../modules/voice');
const { onJoinSound } = require('../../config.json');

/**
 * Handle 'join' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
module.exports = async (interaction) => {
  const { member: { voice } } = interaction;
  if (!voice.channel) throw new Error('I don\'t see you in a voice channel');

  const voiceAgent = getVoiceAgent(voice);
  await voiceAgent.join();
  voiceAgent.setStayConnected(true);

  // onJoinSound?
  if (onJoinSound) voiceAgent.play(onJoinSound);

  return replyHidden(interaction, { content: 'Joined the voice channel' });
};
