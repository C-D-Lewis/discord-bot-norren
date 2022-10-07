const fs = require('fs');

const sounds = [];

/**
 * Read sounds in /sounds and cache the names.
 */
const cacheSoundNames = () => {
  fs.readdirSync(`${__dirname}/../../sounds`).forEach((file) => sounds.push(file));
};

/**
 * Use the user query to find the closest sound.
 *
 * @param {string} query - Query to use.
 * @returns {string} Name of the file that matched closest.
 */
const getClosestSoundName = (query) => {
  // Exact partial match
  const found = sounds.find((p) => p.includes(query));
  if (found) return found;

  // Partial or closest match?
  return undefined;
};

module.exports = {
  cacheSoundNames,
  getClosestSoundName,
};
