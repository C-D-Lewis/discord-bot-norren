/**
 * Handle 'help' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => interaction.reply(`
🎲 \`/roll <d>\` - Roll a <d> die (using CSPRNG)
🔊 \`/sound <name>/list/stop\` - Play/stop a sound file, or list all available.
🎶 \`/music <name>/list/stop\` - Play/stop a music file, or list all available.
🎲 \`/rolltohit <result>\` - See if your hit will land...
❓ \`/help\` - Show this information
🤖 \`/ping\` - Ping the bot server

⚙️ \`https://github.com/C-D-Lewis/discord-bot-hom\`
`);
