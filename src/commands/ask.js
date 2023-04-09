const { replyHidden } = require('../modules/discord');
const { askChatGpt } = require('../modules/chatGpt');
const { generateSpeech, convertSpeech, playSpeech } = require('../modules/tts');

let inProgress = false;

/**
 * Handle 'ask' command to reply with ChatGPT
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise<object|undefined>} Reply result or nothing.
 */
module.exports = async (interaction) => {
  const { options, user: { username }, member: { voice } } = interaction;
  const prompt = options.getString('prompt');
  // const voiceName = options.getString('voiceName');

  // Only one at a time
  if (inProgress) return replyHidden(interaction, { content: 'Generation already in progress, please wait!' });

  // Initial response
  await interaction.reply(`${username} asked: _${prompt}_\n\nThinking...`);
  inProgress = true;

  // Update response
  const content = await askChatGpt(prompt);
  inProgress = false;
  if (!content) return interaction.editReply(`${username} asked: _${prompt}_\n\n ⚠️ Something went wrong!`);

  await interaction.editReply(`${username} asked: _${prompt}_\n\n**${content.trim()}**`);

  const subcommand = options.getSubcommand();
  if (subcommand === 'voice') {
    await interaction.editReply(`${username} asked: _${prompt}_ (Generating audio...)\n\n**${content.trim()}**`);

    await generateSpeech(content);
    convertSpeech();
    await playSpeech(voice);
    await interaction.editReply(`${username} asked: _${prompt}_\n\n**${content.trim()}**`);
  }

  return undefined;
};
