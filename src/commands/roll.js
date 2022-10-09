const { getCsprngInt } = require('../modules/util');

/**
 * Handle 'roll' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => {
  const param = interaction.options.getNumber('d');
  const max = parseInt(param, 10);
  const result = getCsprngInt(1, max);
  return interaction.reply(`🎲 I rolled a d${max} and got \`${result}\``);
};
