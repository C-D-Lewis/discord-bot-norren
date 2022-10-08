/**
 * Handle 'help' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => interaction.reply(`
Here are the available commands:
  - \`/roll <max>\` - Roll a die
  - \`/sound <query>\` - Query and play a sound file
  - \`/sound list\` - List all known sound files
  - \`/help\` - Show all commands
  - \`/ping\` - Ping the bot server

Check out the source code on GitHub:
  C-D-Lewis/discord-bot-hom
`);
