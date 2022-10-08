const fs = require('fs');

const soundNames = [];
// TODO Cache sound audio?

/**
 * Read sounds in /sounds and cache the names.
 */
const cacheSoundNames = () => {
  fs.readdirSync(`${__dirname}/../../sounds`).forEach((file) => soundNames.push(file));
};

/**
 * Use the user query to find the closest sound.
 *
 * @param {string} query - Query to use.
 * @returns {string} Name of the file that matched closest.
 */
const getClosestSoundName = (query) => {
  // Exact partial match
  const found = soundNames.find((p) => p.includes(query));
  if (found) return found;

  // Partial or closest match?
  return undefined;
};

/**
 * Build a readable list of sound options.
 *
 * @returns {string} Readable list of sounds.
 */
const buildSoundList = () => soundNames.map((p) => `\`${p}\``).join(', ');

module.exports = {
  cacheSoundNames,
  getClosestSoundName,
  buildSoundList,
};
