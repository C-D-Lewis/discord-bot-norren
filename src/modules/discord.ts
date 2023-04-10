// Require the necessary discord.js classes
import { ButtonInteraction, Client, CommandInteraction, GatewayIntentBits, Interaction, Message } from 'discord.js';
import { token } from '../../config.json';
import { OPTION_UPDATE_COMMANDS } from '../constants';
import { registerSlashCommands } from './commands';
import { log } from './logger';
import { ReplyHiddenOptions, SetupClientOptions } from '../types';
import { CommandMapType } from './handlers';

let client: Client;

/**
 * Register slash commands in all known guilds.
 */
const registerCommandsInAllGuilds = async () => {
  const { cache } = client.guilds;

  console.log(`Updating slash commands in ${cache.size} servers:`);
  await Promise.all(cache.map(async (guild) => {
    try {
      await registerSlashCommands(guild.id);
      console.log(`✔️ ${guild.name}`);
    } catch (error) {
      console.log(`❌ ${guild.name}`);
      console.trace(error);
    }
  }));
};

/**
 * Initialise discord.js client.
 *
 * @param {SetupClientOptions} opts - Function opts.
 * @param {Function} opts.onCommand - Callback on slash command received.
 * @param {Function} opts.onMessage - Callback on message received.
 * @param {Function} opts.onMessageButton - Callback when a message's button is pressed.
 * @returns {Promise} Promise resolving when connection is established and client set up.
 */
export const setupClient = async ({
  onCommand,
  onMessage,
  onMessageButton,
}: SetupClientOptions) => new Promise((resolve) => {
  // Create a new client instance
  const newClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });

  // When ready
  newClient.once('ready', async () => {
    log('Connected to Discord');
    client = newClient;

    // Prepare slash commands?
    if (process.argv.includes(OPTION_UPDATE_COMMANDS)) {
      await registerCommandsInAllGuilds();
    }

    client.user!.setStatus('online');
    resolve(undefined);
  });

  // When a command received
  newClient.on('interactionCreate', async (interaction: Interaction) => {
    // Chat command
    if (interaction.isChatInputCommand()) {
      const { commandName, user: { username }, options } = interaction;
      // eslint-disable-next-line no-underscore-dangle
      // @ts-ignore Use of secret property
      const optionsStr = options._hoistedOptions.map(({ name, value }) => `${name}:${value}`).join(', ');
      log(`onCommand (${username}:${commandName}) ${optionsStr}`);
      await onCommand(commandName as keyof CommandMapType, interaction);
    }

    // Button was pressed
    if (interaction.isButton()) {
      const {
        customId,
        message: { interaction: messageInteraction },
        user: { username },
      } = interaction;
      const { commandName } = messageInteraction!;
      await onMessageButton(interaction, { customId, commandName, username });
    }
  });

  // Server general message
  newClient.on('messageCreate', async (interaction) => {
    log(`onMessage (${interaction.author.username}) ${interaction.content}`);
    // @ts-ignore FIXME: Why bad type?
    await onMessage(interaction);
  });

  // Log in
  newClient.login(token);
});

/**
 * Get the client object.
 *
 * @returns {object} discord.js Client.
 */
export const getClient = () => {
  if (!client) throw new Error('Client was not ready');

  return client;
};

/**
 * Reply just to the caller.
 *
 * @param {Interaction} interaction - Discord.js interaction object.
 * @param {object} opts - Function options.
 * @param {string} opts.content - Message content.
 * @param {Array<object>} [opts.components] - Reply builder components.
 * @returns {Promise} Reply result.
 */
export const replyHidden = (
  interaction: CommandInteraction | ButtonInteraction | Message,
  { content, components }: ReplyHiddenOptions,
  // @ts-ignore FIXME: Why bad type?
) => interaction.reply({
  content,
  components,
  ephemeral: true,
});
