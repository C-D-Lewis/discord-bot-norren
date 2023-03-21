const handleRoll = require('../commands/roll');
const handleSearch = require('../commands/search');
const handleAudio = require('../commands/audio');
const handleJoin = require('../commands/join');
const handleLeave = require('../commands/leave');
const handleSay = require('../commands/say');
const handleAsk = require('../commands/ask');
const handleHelp = require('../commands/help');
const handlePing = require('../commands/ping');
const { AUDIO_TYPE_SOUND, AUDIO_TYPE_MUSIC } = require('../constants');

/**
 * Find the command handler function for the named command.
 * Corresponds to all those registered with deploy-slash-commands.js
 *
 * @param {string} name - Command name.
 * @returns {Function} handler function.
 */
const getCommand = (name) => {
  const map = {
    roll: handleRoll,
    search: handleSearch,
    /**
     * Getter for handler for 'sound' command.
     *
     * @param {object} interaction - Discord.js interaction object.
     * @returns {Promise<object>} Reply
     */
    sound: (interaction) => handleAudio(interaction, AUDIO_TYPE_SOUND),
    /**
     * Getter for handler for 'music' command.
     *
     * @param {object} interaction - Discord.js interaction object.
     * @returns {Promise<object>} Reply
     */
    music: (interaction) => handleAudio(interaction, AUDIO_TYPE_MUSIC),
    join: handleJoin,
    leave: handleLeave,
    say: handleSay,
    ask: handleAsk,
    help: handleHelp,
    ping: handlePing,
  };
  if (!map[name]) throw new Error('I don\'t know that command, but I should know it');

  return map[name];
};

module.exports = {
  getCommand,
};
