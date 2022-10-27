const { reactions = [] } = require('../../config.json');
const { log } = require('./logger');

/**
 * Handle configured auto-reactions.
 *
 * @param {object} interaction - Discord.js interaction object.
 * @param {string} content - Message content.
 * @returns {Promise} Promise
 */
const handleAutoReactions = (interaction, content) => {
  const lower = content.toLowerCase();
  const toReact = reactions.filter(({ trigger }) => lower.includes(trigger.toLowerCase()));

  return Promise.all(toReact.map(async ({ emoji }) => {
    await interaction.react(emoji);
    log(`Reacted ${emoji}`);
  }));
};

module.exports = {
  handleAutoReactions,
};
