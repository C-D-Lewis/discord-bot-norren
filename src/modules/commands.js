const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const { clientId, token } = require('../../config.json');

const rest = new REST({ version: '10' }).setToken(token);

/* All bot slash commands */
const COMMANDS = [
  new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a d<n> die')
    .addNumberOption((option) => option.setName('d')
      .setDescription('The die maximum value, such as d20')
      .setRequired(true)),

  new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search roll20.net DnD compendium')
    .addStringOption((option) => option.setName('query')
      .setDescription('Search query')
      .setRequired(true)),

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

  new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join the user\'s voice channel'),

  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the current voice channel'),

  new SlashCommandBuilder()
    .setName('pin')
    .setDescription('Pin links or other text')
    .addSubcommand((subcommand) => subcommand
      .setName('add')
      .setDescription('Add a pin')
      .addStringOption((option) => option.setName('text')
        .setDescription('Text to pin')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('list')
      .setDescription('List existing pins'))
    .addSubcommand((subcommand) => subcommand
      .setName('delete')
      .setDescription('Delete a pin by ID')
      .addIntegerOption((option) => option.setName('id')
        .setDescription('ID of pin to remove')
        .setRequired(true))),

  new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask me a yes/no for advice')
    .addStringOption((option) => option.setName('question')
      .setDescription('Question to ask')
      .setRequired(true)),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('See all available commands'),

  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot server'),
];

/**
 * Register all slash commands in a given guild.
 *
 * @param {string} guildId - The guild/server ID.
 * @returns {Promise} REST response.
 */
const registerSlashCommands = (guildId) => rest.put(
  Routes.applicationGuildCommands(clientId, guildId),
  { body: COMMANDS.map((command) => command.toJSON()) },
);

module.exports = {
  registerSlashCommands,
};
