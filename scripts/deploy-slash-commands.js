const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config.json');

const commands = [
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('See all commands'),
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot server'),
  new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a d<n> die')
    .addNumberOption((option) => option.setName('n')
      .setDescription('The die maximum value, such as d20')
      .setRequired(true)),
  new SlashCommandBuilder()
    .setName('sound')
    .setDescription('Play a sound')
    .addStringOption((option) => option.setName('query')
      .setDescription('The sound name, or closest match')
      .setRequired(true)),
  new SlashCommandBuilder()
    .setName('shh')
    .setDescription('Stop any sound playing currently'),
  new SlashCommandBuilder()
    .setName('rolltohit')
    .setDescription('See if you can land a hit')
    .addNumberOption((option) => option.setName('result')
      .setDescription('Roll to hit result')
      .setRequired(true)),
]
  .map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
  .catch(console.error);
