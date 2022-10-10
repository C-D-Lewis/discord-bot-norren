const {
  joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, entersState, NoSubscriberBehavior,
} = require('@discordjs/voice');
const { getAudioResource } = require('./cache');
const { log } = require('./logger');

let connection;

/**
 * Stop and disconnect.
 */
const stopAndDisconnect = async () => {
  try {
    await connection.disconnect();
    await connection.destroy();
    log('Stopped and disconnected');
  } catch (e) {
    log(`Error disconnecting: ${e.message}`);
  }

  connection = null;
};

/**
 * Play a given sound.
 *
 * @param {string} soundName - Name of the sound file.
 * @returns {Promise}
 */
const playSound = async (soundName) => {
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play,
    },
  });
  connection.subscribe(player);

  // Play selected sound
  player.on('stateChange', async (old, _new) => {
    log(`Audio: ${old.status} -> ${_new.status}`);

    // Finished
    if (_new.status === 'idle') await stopAndDisconnect();
  });
  player.on('error', async (error) => {
    log('Player error:', error.message);
    await stopAndDisconnect();
  });
  player.play(getAudioResource(soundName));
  await entersState(player, AudioPlayerStatus.Playing, 1000);
};

/**
 * Join the caller's voice channel and play a sound.
 *
 * @param {object} voice - discord.js voice object.
 * @param {string} soundName - Name of the sound to play.
 */
const joinVoiceChannelAndPlay = async (voice, soundName) => {
  if (connection) throw new Error('A sound is already playing');

  // Connect
  connection = joinVoiceChannel({
    channelId: voice.channel.id,
    guildId: voice.guild.id,
    adapterCreator: voice.guild.voiceAdapterCreator,
    selfDeaf: false,
  });
  connection.on('stateChange', async (old, _new) => {
    log(`Connection: ${old.status} -> ${_new.status}`);

    // When ready
    if (_new.status === 'ready' && _new.status !== old.status) playSound(soundName);
  });
  connection.on('error', async (error) => {
    log('Connection error:', error.message);
    await stopAndDisconnect();
  });
};

module.exports = {
  joinVoiceChannelAndPlay,
  stopAndDisconnect,
};
