/**
 * Handle 'help' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => interaction.reply(`
Here are the available commands:
  🎲 \`/roll <max>\` - Roll a die
  🔊 \`/sound <query>/list/stop\` - Play/stop a sound file, or list all available.
  🎶 \`/music <query>/list/stop\` - Play/stop a music file, or list all available.
  ❓ \`/help\` - Show all commands
  🤖 \`/ping\` - Ping the bot server

⚙️ Check out the source code on GitHub:
  \`https://github.com/C-D-Lewis/discord-bot-hom\`
`);
