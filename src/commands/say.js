const fetch = require('node-fetch');
const { writeFileSync } = require('fs');
const { execSync } = require('child_process');
const { replyHidden } = require('../modules/discord');
const { getVoiceAgent } = require('../modules/voice');
const { elevenlabsApiKey, elevenlabsVoiceId } = require('../../config.json');
const { log } = require('../modules/logger');

/** Path to speech file without extension */
const FILE_NO_EXT = `${__dirname}/../../sounds/speech`;
/** Max message lenth */
const MAX_MESSAGE_LENGTH = 128;

let inProgress = false;

/**
 * Handle 'say' command to say things with TTS.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
module.exports = async (interaction) => {
  const { options, member: { voice } } = interaction;
  const message = options.getString('message');

  if (message.length > MAX_MESSAGE_LENGTH) {
    return replyHidden(interaction, {
      content: `Message must be less than ${MAX_MESSAGE_LENGTH} characters (was ${message.length})`,
    });
  }

  if (inProgress) return replyHidden(interaction, { content: 'Speech generation in progress, please wait!' });

  // Feedback to user
  await replyHidden(interaction, { content: `Say: _${message}_\n\nGenerating...` });
  inProgress = true;

  execSync(`rm -f ${FILE_NO_EXT}.*`);

  try {
    // Request sound file
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

    // Convert to opus
    await interaction.editReply(`Say: _${message}_\n\nConverting...`);
    execSync(`ffmpeg -i ${FILE_NO_EXT}.mpg ${FILE_NO_EXT}.opus`);
    log('Converted speech file to opus');

    // Play it!
    const voiceAgent = getVoiceAgent(voice);
    await voiceAgent.join();
    await interaction.editReply(`Say: _${message}_\n\nPlaying...`);
    voiceAgent.play('speech.opus');
    await interaction.editReply(`Say: _${message}_\n\nSpeech complete!`);
  } catch (e) {
    console.log(e);
    await interaction.editReply(`Failed! ${e.message.slice(0, 1000)}`);
  }

  execSync(`rm -f ${FILE_NO_EXT}.*`);

  inProgress = false;
  return undefined;
};
