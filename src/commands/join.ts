import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { replyHidden } from '../modules/discord';
import { getVoiceAgent } from '../modules/voice';
import { onJoinSound } from '../../config.json';

/**
 * Handle 'join' command.
 *
 * @param {ChatInputCommandInteraction} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
export default async function handleJoin(interaction: ChatInputCommandInteraction) {
  const { voice } = interaction.member as GuildMember;

  // Not in a channel
  if (!voice.channel) {
    return replyHidden(interaction, { content: "I don't see you in a voice channel" });
  }

  const voiceAgent = getVoiceAgent(voice);
  await voiceAgent.join();
  voiceAgent.setStayConnected(true);

  // onJoinSound?
  if (onJoinSound) voiceAgent.play(onJoinSound);

  return replyHidden(interaction, { content: 'Joined the voice channel' });
}
