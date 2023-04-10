import { createAudioResource, StreamType } from '@discordjs/voice';
import { readdirSync, createReadStream } from 'node:fs';
import { log } from './logger';
import { AUDIO_TYPE_SOUND } from '../constants';
import { AudioType } from '../types';

const soundsDir = `${__dirname}/../../sounds`;
const musicDir = `${__dirname}/../../music`;
const soundNames: string[] = [];
const musicNames: string[] = [];

/**
 * Filter and warn on non-Opus files.
 *
 * @param {string} file - File name.
 * @returns {boolean} true if the file is Opus.
 */
const isOpusFile = (file: string) => {
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
const readAllFiles = (rescan?: boolean) => {
  readdirSync(soundsDir).filter(isOpusFile).forEach((file) => {
    if (soundNames.includes(file)) return;

    soundNames.push(file);
    if (rescan) log(`Read new file ${file}`);
  });
  readdirSync(musicDir).filter(isOpusFile).forEach((file) => {
    if (musicNames.includes(file)) return;

    musicNames.push(file);
    if (rescan) log(`Read new file ${file}`);
  });
};

/**
 * Read all files and schedule regular re-scans.
 */
export const cacheFileNames = () => {
  setInterval(() => readAllFiles(true), 30000);
  readAllFiles();
  log(`Files cached: ${soundNames.length} sounds, ${musicNames.length} music`);
};

/**
 * Use the user query to find the closest sound.
 *
 * @param {AudioType} type - Audio type.
 * @param {string} query - Query to use.
 * @returns {Array<string>} Name of the file(s) that matched query.
 */
export const getClosestFileName = (type: AudioType, query: string) => {
  const list = type === AUDIO_TYPE_SOUND ? soundNames : musicNames;
  return list.filter((p) => p.includes(query));
};

/**
 * Get a pre-loaded sound from cache, then replace it. Ogg preferred for performance.
 *
 * @param {string} name - Audio to get.
 * @returns {object} discord.js audio object.
 */
export const getAudioResource = (name: string) => {
  // Order allows pickup of speech.opus
  const dir = musicNames.includes(name) ? musicDir : soundsDir;

  return createAudioResource(
    createReadStream(`${dir}/${name}`),
    { inputType: StreamType.OggOpus },
  );
};

/**
 * Build a readable list of sound or music options.
 *
 * @param {AudioType} type - Audio type, either sound or mustic.
 * @returns {string} Readable list of sounds.
 */
export const buildFileList = (type: AudioType) => {
  let list = type === AUDIO_TYPE_SOUND ? soundNames : musicNames;
  list = list.map((p) => p.split('.')[0]);

  // Bucket if many variants
  const buckets: {
    singleItems: string[];

    [key: string]: any;
  } = {
    singleItems: [],
  };
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
