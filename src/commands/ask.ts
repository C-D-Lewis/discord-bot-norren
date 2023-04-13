import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { replyHidden } from '../modules/discord';
import { askChatGpt } from '../modules/chatGpt';
import { generateSpeech, convertSpeech, playSpeech } from '../modules/tts';

let inProgress = false;

/**
 * Handle 'ask' command to reply with ChatGPT
 *
 * @param {ChatInputCommandInteraction} interaction - discord.js interaction object.
 * @returns {Promise<object|undefined>} Reply result or nothing.
 */
export default async function handleAsk(interaction: ChatInputCommandInteraction) {
  const { options, user: { username } } = interaction;
  const prompt = options.getString('prompt')!;
  const voiceName = options.getString('voiceName')!;

  // TypeScript denies knowledge unless this form is used
  const { voice } = interaction.member as GuildMember;

  // Only one at a time
  if (inProgress) return replyHidden(interaction, { content: 'Generation already in progress, please wait!' });

  // Initial response
  await interaction.reply(`${username} asked: _${prompt}_\n\nThinking...`);
  inProgress = true;

  // Update response
  const content = await askChatGpt(prompt);
  inProgress = false;
  if (!content) return interaction.editReply(`${username} asked: _${prompt}_\n\n ⚠️ Something went wrong!`);

  await interaction.editReply(`${username} asked: _${prompt}_\n\n**${content.trim()}**`);

  const subcommand = options.getSubcommand();
  if (subcommand === 'voice') {
    await interaction.editReply(`${username} asked: _${prompt}_ (Generating audio...)\n\n**${content.trim()}**`);

    await generateSpeech(voiceName, content);
    convertSpeech();
    await playSpeech(voice);
    await interaction.editReply(`${username} asked: _${prompt}_\n\n**${content.trim()}**`);
  }

  return undefined;
}
