const { replyHidden } = require('../modules/discord');
const { askChatGpt } = require('../modules/chatGpt');

let inProgress = false;

/**
 * Handle 'ask' command to reply with ChatGPT
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
module.exports = async (interaction) => {
  const { options, user: { username } } = interaction;
  const prompt = options.getString('prompt');

  // Only one at a time
  if (inProgress) return replyHidden(interaction, { content: 'Generation in progress, please wait!' });

  // Initial response
  await interaction.reply(`${username} asked: _${prompt}_\n\nThinking...`);
  inProgress = true;

  // Update response
  const content = await askChatGpt(prompt);
  inProgress = false;
  return interaction.editReply(`${username} asked: _${prompt}_\n\n**${content.trim()}**`);
};
