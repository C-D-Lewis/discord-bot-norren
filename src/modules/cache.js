const { createAudioResource, StreamType } = require('@discordjs/voice');
const fs = require('fs');
const { log } = require('./logger');
const { AUDIO_TYPE_SOUND } = require('../constants');

const soundsDir = `${__dirname}/../../sounds`;
const musicDir = `${__dirname}/../../music`;
const soundNames = [];
const musicNames = [];

/**
 * Filter and warn on non-Opus files.
 *
 * @param {string} file - File name.
 * @returns {boolean} true if the file is Opus.
 */
const isOpusFile = (file) => {
  if (file.split('.')[1] !== 'opus') {
    log(`WARN: ${file} is not an Opus audio file`);
    return false;
  }

  return true;
};

/**
 * Read sounds in /sounds and music in /music and cache the names.
 *
 * @param {boolean} [rescan] - true if this is not the initial scan.
 */
const readAllFiles = (rescan) => {
  fs.readdirSync(soundsDir).filter(isOpusFile).forEach((file) => {
    if (soundNames.includes(file)) return;

    soundNames.push(file);
    if (rescan) log(`Read new file ${file}`);
  });
  fs.readdirSync(musicDir).filter(isOpusFile).forEach((file) => {
    if (musicNames.includes(file)) return;

    musicNames.push(file);
    if (rescan) log(`Read new file ${file}`);
  });
};

/**
 * Read all files and schedule regular re-scans.
 */
const cacheFileNames = () => {
  setInterval(() => readAllFiles(true), 30000);
  readAllFiles();
  log(`Files cached: ${soundNames.length} sounds, ${musicNames.length} music`);
};

/**
 * Use the user query to find the closest sound.
 *
 * @param {string} type - Audio type (sound|music).
 * @param {string} query - Query to use.
 * @returns {Array<string>} Name of the file(s) that matched query.
 */
const getClosestFileName = (type, query) => {
  const list = type === AUDIO_TYPE_SOUND ? soundNames : musicNames;
  return list.filter((p) => p.includes(query));
};

/**
 * Get a pre-loaded sound from cache, then replace it. Ogg preferred for performance.
 *
 * @param {string} name - Audio to get.
 * @returns {object} discord.js audio object.
 */
const getAudioResource = (name) => {
  // Order allows pickup of speech.opus
  const dir = musicNames.includes(name) ? musicDir : soundsDir;

  return createAudioResource(
    fs.createReadStream(`${dir}/${name}`),
    { inputType: StreamType.OggOpus },
  );
};

/**
 * Build a readable list of sound or music options.
 *
 * @param {string} type - Audio type, either sound or mustic.
 * @returns {string} Readable list of sounds.
 */
const buildFileList = (type) => {
  let list = type === AUDIO_TYPE_SOUND ? soundNames : musicNames;
  list = list.map((p) => p.split('.')[0]);

  // Bucket if many variants
  const buckets = { singleItems: [] };
  list.forEach((p) => {
    // Single
    if (!p.includes('_')) {
      buckets.singleItems.push(p);
      return;
    }

    // One of a set
    const [prefix] = p.split('_');
    if (!buckets[prefix]) buckets[prefix] = [];
    buckets[prefix].push(p);
  });

  // Format
  const { singleItems, ...rest } = buckets;
  let reply = `*🔊 Single:*
${singleItems.map((p) => `\`${p}\``).join(', ')}
`;
  if (Object.keys(rest).length > 0) {
    reply += `*🔀 Random sets:*
${Object.entries(rest).map(([prefix, items]) => `\`${prefix}\` (${items.length})`).join(', ')}`;
  }
  return reply;
};

module.exports = {
  cacheFileNames,
  getClosestFileName,
  buildFileList,
  getAudioResource,
};
