const { createAudioResource, StreamType } = require('@discordjs/voice');
const fs = require('fs');
const { log } = require('./logger');
const { AUDIO_TYPE_SOUND } = require('./constants');

const soundsDir = `${__dirname}/../../sounds`;
const musicDir = `${__dirname}/../../music`;
const soundNames = [];
const musicNames = [];

/**
 * Read sounds in /sounds and music in /music and cache the names.
 */
const cacheFileNames = () => {
  fs.readdirSync(soundsDir).forEach((file) => soundNames.push(file));
  fs.readdirSync(musicDir).forEach((file) => musicNames.push(file));
};

/**
 * Use the user query to find the closest sound.
 *
 * @param {string} type - Audio type (sound|music).
 * @param {string} query - Query to use.
 * @returns {string|Array<string>} Name of the file(s) that matched query.
 */
const getClosestFileName = (type, query) => {
  const list = type === AUDIO_TYPE_SOUND ? soundNames : musicNames;

  // Exact match
  let found = list.find((p) => p === query);
  if (found) {
    log(`Exact match ${query} -> ${found}`);
    return found;
  }

  // Partial match
  found = list.filter((p) => p.includes(query));
  if (found.length === 1) {
    const [result] = found;
    log(`Partial single match ${query} -> ${result}`);
    return result;
  }

  // Multiple
  return found;
};

/**
 * Get a pre-loaded sound from cache, then replace it. Ogg preferred for performance.
 *
 * @param {string} name - Audio to get.
 * @returns {object} discord.js audio object.
 */
const getAudioResource = (name) => {
  const dir = soundNames.includes(name) ? soundsDir : musicDir;
  return createAudioResource(
    fs.createReadStream(`${dir}/${name}`),
    { inputType: StreamType.OggOpus },
  );
};

/**
 * Build a readable list of sound or music options.
 *
 * @returns {string} Readable list of sounds.
 */
const buildFileList = (type) => {
  const list = type === AUDIO_TYPE_SOUND ? soundNames : musicNames;
  return list.map((p) => p.split('.')[0]).map((p) => `\`${p}\``).join(', ');
};

module.exports = {
  cacheFileNames,
  getClosestFileName,
  buildFileList,
  getAudioResource,
};
