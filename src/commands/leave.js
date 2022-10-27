const { replyHidden } = require('../modules/discord');
const { getVoiceAgent } = require('../modules/voice');
const { onLeaveSound } = require('../../config.json');

/**
 * Handle 'leave' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
module.exports = async (interaction) => {
  const { member: { voice } } = interaction;
  if (!voice.channel) throw new Error('I don\'t see you in a voice channel');

  const voiceAgent = getVoiceAgent(voice);

  // onLeaveSound?
  if (onLeaveSound) {
    voiceAgent.play(onLeaveSound)
      .then(() => voiceAgent.leave());
  } else {
    await voiceAgent.leave();
  }

  return replyHidden(interaction, { content: 'Leaving the voice channel' });
};
