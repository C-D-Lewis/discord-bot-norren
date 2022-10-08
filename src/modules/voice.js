const {
  joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState,
} = require('@discordjs/voice');
const { log } = require('./logger');

let connection;

/**
 * Stop and disconnect.
 */
const stopAndDisconnect = async () => {
  if (!connection) throw new Error('Was not connected to voice');

  await connection.disconnect();
  await connection.destroy();
  connection = null;
  log('Stopped and disconnected');
};

/**
 * Play a given sound.
 *
 * @param {string} soundName - Name of the sound file.
 * @returns {Promise}
 */
const playSound = async (soundName) => {
  const player = createAudioPlayer();
  connection.subscribe(player);

  // Play selected sound
  player.play(createAudioResource(soundName));
  player.on('stateChange', async (old, _new) => {
    log(`Audio player transitioned from ${old.status} to ${_new.status}`);

    // Finished
    if (_new.status === 'idle') await stopAndDisconnect();
  });

  // Some error encountered
  player.on('error', async (error) => {
    log('Error:', error.message, 'with track', error.resource.metadata.title);
    await stopAndDisconnect();
  });
  await entersState(player, AudioPlayerStatus.Playing, 5000);
};

/**
 * Join the caller's voice channel and play a sound.
 *
 * @param {object} voice - discord.js voice object.
 * @param {string} soundName - Name of the sound to play.
 */
const joinVoiceChannelAndPlay = async (voice, soundName) => {
  // Connect
  connection = joinVoiceChannel({
    channelId: voice.channel.id,
    guildId: voice.guild.id,
    adapterCreator: voice.guild.voiceAdapterCreator,
    selfDeaf: false,
  });
  connection.on('stateChange', async (old, _new) => {
    log(`Connection transitioned from ${old.status} to ${_new.status}`);

    // When ready
    if (_new.status === 'ready' && _new.status !== old.status) playSound(soundName);
  });
};

module.exports = {
  joinVoiceChannelAndPlay,
  stopAndDisconnect,
};
