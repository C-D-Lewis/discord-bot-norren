const fetch = require('node-fetch');
const { writeFileSync } = require('fs');
const { execSync } = require('child_process');
const { getVoiceAgent } = require('./voice');
const { elevenlabsApiKey, elevenlabsVoiceId } = require('../../config.json');
const { log } = require('./logger');

/** Path to speech file without extension */
const FILE_NO_EXT = `${__dirname}/../../sounds/speech`;

/**
 * Generate and store speech as a file.
 *
 * @param {string} message - Message to generate as speech.
 * @returns {Promise<void>}
 */
const generateSpeech = async (message) => {
  execSync(`rm -f ${FILE_NO_EXT}.*`);

  log(`Requesting speech: ${message}`);
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${elevenlabsVoiceId}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': elevenlabsApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: message,
      voice_settings: {
        stability: 1.0,
        similarity_boost: 1.0,
      },
    }),
  });
  log(`Response: ${res.status}`);
  if (res.status !== 200) throw new Error(res.text());

  const buffer = await res.buffer();
  writeFileSync(`${FILE_NO_EXT}.mpg`, buffer);
  log('Wrote speech file');
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

  setTimeout(() => execSync(`rm -f ${FILE_NO_EXT}.*`), 10000);
};

module.exports = {
  generateSpeech,
  convertSpeech,
  playSpeech,
};
