import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { replyHidden } from '../modules/discord';
import {
  generateSpeech, convertSpeech, playSpeech, getVoices,
} from '../modules/tts';

/** Max message lenth */
const MAX_MESSAGE_LENGTH = 256;
/** Default stability score */
const DEFAULT_STABILITY = 0.9;

let inProgress = false;

/**
 * Handle 'say' command to say things with TTS.
 *
 * @param {ChatInputCommandInteraction} interaction - discord.js interaction object.
 * @returns {Promise|undefined} Result
 */
export default async function handleTts(interaction: ChatInputCommandInteraction) {
  const { options } = interaction;
  const { voice } = interaction.member as GuildMember;
  const subcommand = options.getSubcommand();

  if (subcommand === 'voices') {
    const voices = await getVoices();
    await replyHidden(interaction, { content: `Voice available:\n\n${voices.map(({ name }) => `"${name}"`).join(', ')}` });
    return undefined;
  }

  if (subcommand === 'say') {
    const voiceName = options.getString('voice')!;
    const message = options.getString('message')!;
    const stability = options.getNumber('stability') || DEFAULT_STABILITY;

    if (message.length > MAX_MESSAGE_LENGTH) {
      return replyHidden(interaction, {
        content: `Message must be less than ${MAX_MESSAGE_LENGTH} characters (was ${message.length})`,
      });
    }

    // Only one at a time
    if (inProgress) return replyHidden(interaction, { content: 'Speech generation already in progress, please try again shortly!' });

    // Feedback to user
    await replyHidden(interaction, { content: `Say: _${message}_\n\nGenerating...` });
    inProgress = true;

    try {
      // Request sound file
      await generateSpeech(voiceName, message, stability);

      // Convert to opus
      await interaction.editReply(`Say: _${message}_\n\nConverting...`);
      convertSpeech();

      // Play it!
      await interaction.editReply(`Say: _${message}_\n\nPlaying...`);
      await playSpeech(voice);
      await interaction.editReply(`Say: _${message}_`);
    } catch (e) {
      const error = e as Error;
      console.log(error);
      await interaction.editReply(`Failed! ${error.message.slice(0, 1000)}`);
    }

    inProgress = false;
    return undefined;
  }

  throw new Error(`Unexpected subcommand ${subcommand}`);
}