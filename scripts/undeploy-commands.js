const { REST, Routes } = require('discord.js');
const { clientId, token } = require('../config.json');

const [SERVER_ID] = process.argv.slice(2);
if (!SERVER_ID) throw new Error('Please specify SERVER_ID');

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, SERVER_ID), { body: [] })
  .then(() => console.log('Successfully deleted all guild commands.'))
  .catch(console.error);
