const { getCsprngInt } = require('../modules/util');
const { replyHidden } = require('../modules/discord');

/** Positive answers */
const POSITIVE = [
  'It is certain',
  'Without a doubt',
  'You may rely on it',
  'Yes definitely',
  'It is decidedly so',
  'As I see it, yes',
  'Most likely',
  'Yes',
  'Outlook good',
  'Signs point to yes',
];

/** Neutral answers */
const NEUTRAL = [
  'Reply hazy try again',
  'Better not tell you now',
  'Ask again later',
  'Cannot predict now',
  'Concentrate and ask again',
];

/** Negative answers */
const NEGATIVE = [
  'Don\'t count on it',
  'Outlook not so good',
  'My sources say no',
  'Very doubtful',
  'My reply is no',
];

/**
 * Get random answer from random sentiment.
 *
 * @returns {string} The answer.
 */
const getAnswer = () => {
  const max = 100;
  const result = getCsprngInt(0, max);
  if (result < max / 3) return POSITIVE[getCsprngInt(0, POSITIVE.length - 1)];
  if (result < ((2 * max) / 3)) return NEUTRAL[getCsprngInt(0, NEUTRAL.length - 1)];
  return NEGATIVE[getCsprngInt(0, NEGATIVE.length - 1)];
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
