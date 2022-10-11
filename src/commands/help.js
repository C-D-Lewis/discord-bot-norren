const { replyHidden } = require('../modules/discord');

/**
 * Handle 'help' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => replyHidden(interaction, `
🎲 \`/roll <d>\` - Roll a die (using CRNG)
📖 \`/search <query>\` - Search Roll20.net compendium
🔊 \`/sound <name>/list/stop\` - Play/stop/list sound files
🎶 \`/music <name>/list/stop\` - Play/stop/list music files
🎙 \`/join\` - Join the user's voice channel
❌ \`/leave\` - Leave the voice channel
🎱 \`/ask <question>\` - Ask me a yes/no question
⁉️ \`/help\` - Show this information
🤖 \`/ping\` - Ping the bot server

📜 <https://github.com/C-D-Lewis/discord-bot-hom>
`);
