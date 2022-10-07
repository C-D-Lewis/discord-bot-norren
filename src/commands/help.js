/**
 * Handle 'help' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => interaction.reply(`
Here are the available commands:
  - \`help\` - Show all commands
  - \`ping\` - Ping the bot server
  - \`roll n\` - Roll a d<n> dice

Check out my source code on GitHub: C-D-Lewis/discord-bot-hom
`);
