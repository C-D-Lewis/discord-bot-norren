import { setupClient, getClient, replyHidden } from './modules/discord';
import { cacheFileNames } from './modules/cache';
import { log } from './modules/logger';
import { CommandMapType, getCommand } from './modules/handlers';
import { handleAutoReactions } from './modules/reactions';
import { getVoiceAgent } from './modules/voice';
import { ButtonInteraction, ChatInputCommandInteraction, ClientUser, CommandInteraction, GuildMember, Message, MessageInteraction, VoiceState } from 'discord.js';
import { MessageButtonData } from './types';

/**
 * Handle when a recent sound button is pressed.
 *
 * @param {ButtonInteraction} interaction - Message interaction object.
 * @param {VoiceState} voice - Discordjs voice object.
 * @param {string} customId - Sound name as custom ID.
 * @returns {Promise} Reply result.
 */
const handleSoundButton = async (interaction: ButtonInteraction, voice: VoiceState, customId: string) => {
  const voiceAgent = getVoiceAgent(voice);
  await voiceAgent.join();
  voiceAgent.play(customId);

  return replyHidden(interaction, { content: `Playing \`${customId}\`` });
};

/**
 * When a command is received.
 *
 * @param {string} name - Command name.
 * @param {object} interaction - Discord.js interaction object.
 * @returns {Promise} Handler that returns reply text.
 */
const onCommand = async (name: keyof CommandMapType, interaction: ChatInputCommandInteraction) => {
  try {
    const command = getCommand(name);
    return await command(interaction);
  } catch (e: any) {
    const err = `⚠️ ${e.message}`;
    log(err);
    console.log(e);
    return replyHidden(interaction, { content: err });
  }
};

/**
 * On command via mention.
 *
 * @param {object} interaction - Message interaction object.
 * @returns {object} Reply result.
 */
const handleMessageCommand = async (interaction: Message) => {
  const { author: { username }, content } = interaction;
  const [, keyword, ...args] = content.split(' ');
  log({ keyword, args });

  try {
    // React to greetings
    if (['hello', 'hey', 'hi'].includes(keyword)) return interaction.react('👋');

    // Implement any other message commands here

    // Else not sure which command
    return replyHidden(
      interaction,
      { content: `Sorry ${username}, I don't know what you want. Try using \`/help\`.` },
    );
  } catch (e: any) {
    const err = `⚠️ ${e.message}`;
    log(err);
    console.log(e);
    return replyHidden(interaction, { content: err });
  }
};

/**
 * When someone posts a message.
 *
 * @param {Message} message - Message message object.
 * @returns {Promise} Promise
 */
const onMessage = async (message: Message) => {
  const { author: { id: callerId }, mentions, content } = message;
  const { id: botId } = getClient().user as ClientUser;

  // Auto reactions
  await handleAutoReactions(message, content);

  // If mentioning me, and it wasn't me
  if (mentions.users.get(botId) && callerId !== botId) return handleMessageCommand(message);

  // Some other chat going by
  return undefined;
};

/**
 * When a message's button is pressed.
 *
 * @param {ButtonInteraction} interaction - Message interaction object.
 * @param {MessageButtonData} opts - Function options.
 * @returns {Promise} Promise
 */
const onMessageButton = async (
  interaction: ButtonInteraction,
  { commandName, customId, username }: MessageButtonData
) => {
  const { voice } = interaction.member as GuildMember;
  log(`onMessageButton (${username}:${commandName}:${customId})`);

  try {
    // Recent sound list button
    if (commandName === 'sound recent') return handleSoundButton(interaction, voice, customId);

    throw new Error('Unknown message button');
  } catch (e: any) {
    const err = `⚠️ ${e.message}`;
    log(err);
    console.log(e);
    return replyHidden(interaction, { content: err });
  }
};

/**
 * The main function.
 */
const main = async () => {
  log('Connecting...');
  await setupClient({ onCommand, onMessage, onMessageButton });
  await cacheFileNames();

  log('Ready');
};

main();
