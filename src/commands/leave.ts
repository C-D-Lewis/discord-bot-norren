import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { replyHidden } from '../modules/discord';
import { getVoiceAgent } from '../modules/voice';
import { onLeaveSound } from '../../config.json';

/**
 * Handle 'leave' command.
 *
 * @param {ChatInputCommandInteraction} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
export default async function handleLeave(interaction: ChatInputCommandInteraction) {
  const { voice } = interaction.member as GuildMember;

  if (!voice.channel) {
    return replyHidden(interaction, { content: "I don't see you in a voice channel" });
  }

  const voiceAgent = getVoiceAgent(voice);

  // onLeaveSound?
  if (onLeaveSound) {
    voiceAgent.play(onLeaveSound)
      .then(() => voiceAgent.leave());
  } else {
    await voiceAgent.leave();
  }

  return replyHidden(interaction, { content: 'Leaving the voice channel' });
}
