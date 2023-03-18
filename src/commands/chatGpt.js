const fetch = require('node-fetch');
const { replyHidden } = require('../modules/discord');
const { openAiApiKey } = require('../../config.json');

let inProgress = false;

/**
 * Handle 'say' command to say things with TTS.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
module.exports = async (interaction) => {
  const { options } = interaction;
  const prompt = options.getString('prompt');

  // Only one at a time
  if (inProgress) return replyHidden(interaction, { content: 'Generation in progress, please wait!' });

  // Initial response
  inProgress = true;
  await interaction.reply(`Prompt: _${prompt}_\n\nThinking...`);

  // Get ChatGPT response
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt },
      ],
    }),
  });

  const json = await res.json();
  const { content } = json.choices[0].message;
  console.log({ prompt, content });

  // Update response
  inProgress = false;
  return interaction.editReply(`Prompt: _${prompt}_\n\n**${content.trim()}**`);
};
