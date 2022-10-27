const { replyHidden } = require('../modules/discord');

/**
 * Handle 'help' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise} Reply result.
 */
module.exports = (interaction) => replyHidden(interaction, {
  content: `
🎲 \`/roll\` - Roll a die (using CRNG)
📖 \`/search\` - Search Roll20.net compendium
🔊 \`/sound\` - Play/stop/list sound files or see recently played
🎶 \`/music\` - Play/stop/list music files
🎙 \`/join\` - Join the user's voice channel
❌ \`/leave\` - Leave the voice channel
📌 \`/pin\` - Pin links or other text
🎱 \`/ask\` - Ask me a yes/no question
⁉️ \`/help\` - Show this information
🤖 \`/ping\` - Ping the bot server

📜 <https://github.com/C-D-Lewis/discord-bot-hom>
`,
});
