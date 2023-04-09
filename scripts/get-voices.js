/* eslint-disable camelcase */

const fetch = require('node-fetch');
const { elevenlabsApiKey } = require('../config.json');

/**
 * The main function.
 */
const main = async () => {
  const { voices } = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      accept: 'application/json',
      'xi-api-key': elevenlabsApiKey,
    },
  }).then((r) => r.json());

  voices
    .filter(({ category }) => category !== 'premade')
    .forEach(({ name, category, voice_id }) => console.log(`${name}: ${voice_id} [${category}]`));
};

main();
