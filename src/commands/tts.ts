import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { replyHidden } from '../modules/discord';
import {
  generateSpeech, convertSpeech, playSpeech, getVoices,
} from '../modules/tts';
import { DEFAULT_STABILITY } from '../constants';

/** Max message lenth */
const MAX_MESSAGE_LENGTH = 256;

let inProgress = false;

/**
 * Generate and play speech as a given voice, tracking progress.
 *
 * @param {ChatInputCommandInteraction} interaction - Current interaction.
 * @param {GuildMember['voice']} voice - Guild member voice object.
 * @param {string} voiceName - Name of the voice.
 * @param {string} message - Message to say/
 * @param {number} stability - Voice stability param.
 * @returns {Promise} Promise result.
 */
const generateAndPlaySpeech = async (
  interaction: ChatInputCommandInteraction,
  voice: GuildMember['voice'],
  voiceName: string,
  message: string,
  stability: number,
) => {
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
};

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

    return generateAndPlaySpeech(interaction, voice, voiceName, message, stability);
  }

  if (subcommand === 'cursedglados') {
    const message = options.getString('message')!;
    const finalMessage = `This is Cursed GLaDOS here. ${message}`;

    // GLaDOS voice shall remain in the EleventLabs account with this name
    return generateAndPlaySpeech(interaction, voice, 'GLaDOS', finalMessage, 0.01);
  }

  throw new Error(`Unexpected subcommand ${subcommand}`);
}
