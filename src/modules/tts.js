const fetch = require('node-fetch');
const { writeFileSync } = require('fs');
const { execSync } = require('child_process');
const { getVoiceAgent } = require('./voice');
const { elevenlabsApiKey } = require('../../config.json');
const { log } = require('./logger');

/** Speech saved dir */
const SAVED_DIR = `${__dirname}/../../saved`;

/** Path to speech file without extension */
const FILE_NO_EXT = `${__dirname}/../../sounds/speech`;

/**
 * Get voice names available.
 *
 * @returns {Promise<Array<{ name, id }>>} List of voice names and IDs.
 */
const getVoices = async () => {
  const { voices } = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      accept: 'application/json',
      'xi-api-key': elevenlabsApiKey,
    },
  }).then((r) => r.json());

  return voices
    .filter(({ category }) => category !== 'premade')
    // eslint-disable-next-line camelcase
    .map(({ name, voice_id }) => ({ name, id: voice_id }));
};

/**
 * Generate and store speech as a file.
 *
 * @param {string} voiceName - ID of the voice to use.
 * @param {string} message - Message to generate as speech.
 * @param {number} stability - Stability score.
 * @returns {Promise<void>}
 */
const generateSpeech = async (voiceName, message, stability) => {
  // Get voice ID from name
  const voices = await getVoices();
  const found = voices.find(({ name }) => name === voiceName);
  if (!found) throw new Error(`Unknown voice name: ${voiceName}`);

  execSync(`rm -f ${FILE_NO_EXT}.*`);

  log(`Requesting speech: (voice ${found.name}) ${message}`);
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${found.id}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': elevenlabsApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: message,
      voice_settings: {
        stability,
        similarity_boost: 0.9,
      },
    }),
  });
  log(`Response: ${res.status}`);
  if (res.status !== 200) throw new Error(res.text());

  const buffer = await res.buffer();
  writeFileSync(`${FILE_NO_EXT}.mpg`, buffer);
  log('Wrote speech file');

  // Copy in case it's good
  execSync(`mkdir -p ${SAVED_DIR}`);
  execSync(`cp ${FILE_NO_EXT}.mpg ${SAVED_DIR}/${message.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`);
};

/**
 * Convert local speech file.
 */
const convertSpeech = () => {
  execSync(`ffmpeg -i ${FILE_NO_EXT}.mpg ${FILE_NO_EXT}.opus`);
  log('Converted speech file to opus');
};

/**
 * Play stored speech.
 *
 * @param {object} voice - discord.js voice object.
 * @returns {Promise<void>}
 */
const playSpeech = async (voice) => {
  const voiceAgent = getVoiceAgent(voice);
  await voiceAgent.join();
  voiceAgent.play('speech.opus');

  setTimeout(() => execSync(`rm -f ${FILE_NO_EXT}.*`), 5000);
};

module.exports = {
  generateSpeech,
  convertSpeech,
  playSpeech,
  getVoices,
};
