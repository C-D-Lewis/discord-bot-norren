import { ChatInputCommandInteraction } from 'discord.js';
import { replyHidden } from '../modules/discord';

/**
 * Handle 'help' command.
 *
 * @param {ChatInputCommandInteraction} interaction - discord.js interaction object.
 * @returns {Promise} Reply result.
 */
export default function handleHelp(interaction: ChatInputCommandInteraction) {
  return replyHidden(interaction, {
    content: `
  🎲 \`/roll\` - Roll a die (using CRNG)
  📖 \`/search\` - Search Roll20.net compendium
  🔊 \`/sound\` / \`/music\` - Play/stop/list sound/music files
  🎙 \`/join\` / \`/leave\` - Join/leave the user's voice channel
  🗣 \`tts\` - Use TTS to say something
  ⁉️ \`/help\` - Show this information
  🤖 \`/ping\` - Ping the bot server

  📜 <https://github.com/C-D-Lewis/discord-bot-norren>
  `,
  });
}

// ❓ \`/ask\` - Ask a question (answered by ChatGPT as Norren)
