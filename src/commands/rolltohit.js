const { log } = require('../modules/logger');

/**
 * Handle 'rolltohit' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => {
  const result = interaction.options.getNumber('result');

  const ac = Math.round(Math.random() * 15) + 5;
  log(`ac: ${ac} vs result: ${result}`);
  const reply = result >= ac ? '😒 That\'ll do it' : '😎 Go fuck yerself';
  return interaction.reply(reply);
};
