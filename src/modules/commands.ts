import { REST, SlashCommandBuilder, Routes } from 'discord.js';
import { clientId, token } from '../../config.json';

const rest = new REST({ version: '10' }).setToken(token);

/* All bot slash commands */
const COMMANDS = [
  // Roll a die
  new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a d<n> die')
    .addNumberOption((option) => option.setName('d')
      .setDescription('The die maximum value, such as d20')
      .setRequired(true)),

  // Search roll20.net
  new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search roll20.net DnD compendium')
    .addStringOption((option) => option.setName('query')
      .setDescription('Search query')
      .setRequired(true)),

  // Play pre-stored sounds
  new SlashCommandBuilder()
    .setName('sound')
    .setDescription('Play sound files')
    .addSubcommand((subcommand) => subcommand
      .setName('play')
      .setDescription('Play a sound file')
      .addStringOption((option) => option.setName('name')
        .setDescription('The sound name, or closest match')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('list')
      .setDescription('List all sounds available'))
    .addSubcommand((subcommand) => subcommand
      .setName('stop')
      .setDescription('Stop currently playing sound'))
    .addSubcommand((subcommand) => subcommand
      .setName('recent')
      .setDescription('See buttons for recently played sounds')),

  // Play pre-stored music
  new SlashCommandBuilder()
    .setName('music')
    .setDescription('Play music files')
    .addSubcommand((subcommand) => subcommand
      .setName('play')
      .setDescription('Play a music file')
      .addStringOption((option) => option.setName('name')
        .setDescription('The music file name, or closest match')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('list')
      .setDescription('List all music available'))
    .addSubcommand((subcommand) => subcommand
      .setName('stop')
      .setDescription('Stop currently playing music')),

  // Join the user's voice call
  new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join the user\'s voice channel'),

  // Leave the user's voice call
  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the current voice channel'),

  // Use ElevenLabs TTS features
  new SlashCommandBuilder()
    .setName('tts')
    .setDescription('Use ElevenLabs TTS to say something')
    .addSubcommand((subcommand) => subcommand
      .setName('say')
      .setDescription('Generate some voice audio from text')
      .addStringOption((option) => option.setName('voice')
        .setDescription('Voice name')
        .setRequired(true))
      .addStringOption((option) => option.setName('message')
        .setDescription('Message to speak')
        .setRequired(true))
      .addNumberOption((option) => option.setName('stability')
        .setDescription('Stability score, 0.0 to 1.0')
        .setRequired(false)))
    .addSubcommand((subcommand) => subcommand
      .setName('voices')
      .setDescription('List all avaialble voice names'))
    .addSubcommand((subcommand) => subcommand
      .setName('cursedglados')
      .setDescription('Generate some voice audio as Cursed GLaDOS')
      .addStringOption((option) => option.setName('message')
        .setDescription('Message to speak')
        .setRequired(true))),

  // Voices using ChatGPT and ElevenLabs
  new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask a question (answered by ChatGPT as Norren)')
    .addSubcommand((subcommand) => subcommand
      .setName('text')
      .setDescription('Respond in the original message')
      .addStringOption((option) => option.setName('prompt')
        .setDescription('Prompt content')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('voice')
      .setDescription('Respond with voice if in a voice channel')
      .addStringOption((option) => option.setName('voice')
        .setDescription('Voice name')
        .setRequired(true))
      .addStringOption((option) => option.setName('prompt')
        .setDescription('Prompt content')
        .setRequired(true))
      .addNumberOption((option) => option.setName('stability')
        .setDescription('Stability score, 0.0 to 1.0')
        .setRequired(false))),

  // Help
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('See all available commands'),

  // Ping server
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot server'),

  // Reboot server
  new SlashCommandBuilder()
    .setName('reboot')
    .setDescription('Reboot the bot server'),
];

/**
 * Register all slash commands in a given guild.
 *
 * @param {string} guildId - The guild/server ID.
 * @returns {Promise} REST response.
 */
export const registerSlashCommands = (guildId: string) => rest.put(
  Routes.applicationGuildCommands(clientId, guildId),
  { body: COMMANDS.map((command) => command.toJSON()) },
);
