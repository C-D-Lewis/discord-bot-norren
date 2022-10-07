/**
 * Handle 'roll' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = (interaction) => {
  try {
    const max = parseInt(interaction.options.getString('n'), 10);
    const result = Math.round(Math.random() * max) + 1;
    return interaction.reply(`🎲 ${result}`);
  } catch (e) {
    console.log('Invalid options');
    return interaction.reply('Invalid input');
  }
};
