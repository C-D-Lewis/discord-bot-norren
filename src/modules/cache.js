const { createAudioResource, StreamType } = require('@discordjs/voice');
const fs = require('fs');

const soundsDir = `${__dirname}/../../sounds`;
const soundNames = [];

/**
 * Read sounds in /sounds and cache the names.
 */
const cacheSoundNames = () => fs.readdirSync(soundsDir).forEach((file) => soundNames.push(file));

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
 * Get a pre-loaded sound from cache, then replace it. Ogg preferred for performance.
 *
 * @param {string} soundName - Sound to get.
 * @returns {object} discord.js audio object.
 */
const getAudioResource = (soundName) => createAudioResource(
  fs.createReadStream(`${soundsDir}/${soundName}`),
  { inputType: StreamType.OggOpus },
);

/**
 * Build a readable list of sound options.
 *
 * @returns {string} Readable list of sounds.
 */
const buildSoundList = () => soundNames.map((p) => p.split('.')[0]).map((p) => `\`${p}\``).join(', ');

module.exports = {
  cacheSoundNames,
  getClosestSoundName,
  buildSoundList,
  getAudioResource,
};
