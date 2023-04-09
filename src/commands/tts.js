const { replyHidden } = require('../modules/discord');
const {
  generateSpeech, convertSpeech, playSpeech, getVoices,
} = require('../modules/tts');

/** Max message lenth */
const MAX_MESSAGE_LENGTH = 256;

let inProgress = false;

/**
 * Handle 'say' command to say things with TTS.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise|undefined} Result
 */
module.exports = async (interaction) => {
  const { options, member: { voice } } = interaction;
  const subcommand = options.getSubcommand();

  if (subcommand === 'voices') {
    const voices = await getVoices();
    await replyHidden(interaction, { content: voices.map(({ name }) => `"${name}"`).join(', ') });
    return undefined;
  }

  if (subcommand === 'say') {
    const voiceName = options.getString('voice');
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
      await generateSpeech(voiceName, message);

      // Convert to opus
      await interaction.editReply(`Say: _${message}_\n\nConverting...`);
      convertSpeech();

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
  }

  throw new Error(`Unexpected subcommand ${subcommand}`);
};
