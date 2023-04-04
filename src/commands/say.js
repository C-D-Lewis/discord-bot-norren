const { replyHidden } = require('../modules/discord');
const { generateSpeech, convertSpeech, playSpeech } = require('../modules/tts');

/** Max message lenth */
const MAX_MESSAGE_LENGTH = 256;

let inProgress = false;

/**
 * Handle 'say' command to say things with TTS.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
module.exports = async (interaction) => {
  const { options, member: { voice } } = interaction;
  const message = options.getString('message');

  if (message.length > MAX_MESSAGE_LENGTH) {
    return replyHidden(interaction, {
      content: `Message must be less than ${MAX_MESSAGE_LENGTH} characters (was ${message.length})`,
    });
  }

  // Only one at a time
  if (inProgress) return replyHidden(interaction, { content: 'Speech generation in progress, please wait!' });

  // Feedback to user
  await replyHidden(interaction, { content: `Say: _${message}_\n\nGenerating...` });
  inProgress = true;

  try {
    // Request sound file
    await generateSpeech(message);

    // Convert to opus
    await interaction.editReply(`Say: _${message}_\n\nConverting...`);
    await convertSpeech();

    // Play it!
    await interaction.editReply(`Say: _${message}_\n\nPlaying...`);
    await playSpeech(voice);
    await interaction.editReply(`Say: _${message}_`);
  } catch (e) {
    console.log(e);
    await interaction.editReply(`Failed! ${e.message.slice(0, 1000)}`);
  }

  inProgress = false;
  return undefined;
};
