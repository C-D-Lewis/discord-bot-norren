const { getCsprngInt } = require('../util');
const { replyHidden } = require('../modules/discord');
const { POSITIVE_ANSWERS, NEGATIVE_ANSWERS, NEUTRAL_ANSWERS } = require('../constants');

/**
 * Get random answer from random sentiment.
 *
 * @returns {string} The answer.
 */
const getAnswer = () => {
  const max = 100;
  const result = getCsprngInt(0, max);

  if (result < max / 3) return POSITIVE_ANSWERS[getCsprngInt(0, POSITIVE_ANSWERS.length - 1)];
  if (result < ((2 * max) / 3)) return NEUTRAL_ANSWERS[getCsprngInt(0, NEUTRAL_ANSWERS.length - 1)];
  return NEGATIVE_ANSWERS[getCsprngInt(0, NEGATIVE_ANSWERS.length - 1)];
};

/**
 * Handle 'ask' command to find links to roll20.net
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise<string>} Reply text.
 */
module.exports = async (interaction) => {
  const { options } = interaction;
  const question = options.getString('question');

  return replyHidden(interaction, `_You asked "${question}":_
  
🔮 ${getAnswer()}`);
};
