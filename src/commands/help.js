/**
 * Handle 'help' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => interaction.reply(`
🎲 \`/roll <d>\` - Roll a <d> die (using CRNG)
📖 \`/search <query>\` - Search Roll20.net compendium
🔊 \`/sound <name>/list/stop\` - Play/stop/list sound files
🎶 \`/music <name>/list/stop\` - Play/stop/list music files
🎲 \`/rolltohit <result>\` - See if your hit will land...
🎱 \`/ask <question>\` - Ask me a yes/no question
⁉️ \`/help\` - Show this information
🤖 \`/ping\` - Ping the bot server

📜 <https://github.com/C-D-Lewis/discord-bot-hom>
`);
