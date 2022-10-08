const { createAudioResource } = require('@discordjs/voice');
const fs = require('fs');
const { log } = require('./logger');

const soundsDir = `${__dirname}/../../sounds`;
const soundNames = [];
const audioCache = {};

/**
 * Read sounds in /sounds and cache the names.
 */
const cacheSoundNames = () => {
  fs.readdirSync(soundsDir).forEach((file) => {
    soundNames.push(file);
    audioCache[file] = createAudioResource(`${soundsDir}/${file}`);
    log(`Cached ${file}`);
  });
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
 * Get a pre-loaded sound from cache, then replace it.
 *
 * @param {string} soundName - Sound to get.
 * @returns {object} discord.js audio object.
 */
const getAudioResource = (soundName) => {
  setTimeout(() => {
    // Load another copy ready since these can't be restarted
    audioCache[soundName] = createAudioResource(`${soundsDir}/${soundName}`);
    log(`Cached ${soundName}`);
  }, 1000);

  return audioCache[soundName];
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
  getAudioResource,
};
