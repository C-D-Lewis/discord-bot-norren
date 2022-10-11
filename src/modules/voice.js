const {
  joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, entersState, NoSubscriberBehavior,
} = require('@discordjs/voice');
const { getAudioResource } = require('./cache');
const { log } = require('./logger');

let agent;

/**
 * Abstract away all state and internals related to handling voice connection
 * and player status.
 */
const VoiceAgent = () => {
  let connection;
  let player;
  let readyToPlay = false;
  let willStayConnected = false;

  /**
   * Stop and disconnect.
   */
  const leaveAndReset = async () => {
    try {
      await connection.disconnect();
      await connection.destroy();
      log('Stopped and disconnected');
    } catch (e) {
      log(`Error disconnecting: ${e.message}`);
    }

    connection = null;
    readyToPlay = false;
    willStayConnected = false;
  };

  /**
   * Prepare the player.
   */
  const preparePlayer = async () => {
    player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
    connection.subscribe(player);

    // Play selected sound
    player.on('stateChange', async (old, _new) => {
      if (old.status === _new.status) return;
      log(`Audio: ${old.status} -> ${_new.status}`);

      // Finished
      if (_new.status === 'idle' && !willStayConnected) await leaveAndReset();
    });
    player.on('error', async (error) => {
      log('Player error:');
      log(error);
      await leaveAndReset();
    });

    readyToPlay = true;
  };

  /**
   * Set whether to stay connected after a sound completes.
   *
   * @param {boolean} stayConnected - Whether to stay connected after sounds play this join.
   */
  const setStayConnected = (stayConnected) => {
    willStayConnected = stayConnected;
    log(`willStayConnected: ${stayConnected}`);
  };

  /**
   * Join a voice connection.
   *
   * @param {object} voice - discord.js voice object.
   * @returns {Promise}
   */
  const join = async (voice) => new Promise((resolve) => {
    // Already connected
    if (readyToPlay) {
      resolve();
      return;
    }

    // Prepare connection
    connection = joinVoiceChannel({
      channelId: voice.channel.id,
      guildId: voice.guild.id,
      adapterCreator: voice.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    connection.on('stateChange', (old, _new) => {
      if (old.status === _new.status) return;
      log(`Connection: ${old.status} -> ${_new.status}`);

      // When connected
      if (_new.status === 'ready' && _new.status !== old.status) {
        preparePlayer();
        resolve();
      }
    });
    connection.on('error', (error) => {
      log('Connection error:', error.message);
      leaveAndReset();
    });
  });

  /**
   * Play a given sound.
   *
   * @param {string} soundName - Name of the sound file.
   * @returns {Promise}
   */
  const play = async (soundName) => {
    player.play(getAudioResource(soundName));
    await entersState(player, AudioPlayerStatus.Playing, 3000);
  };

  return {
    join,
    leave: leaveAndReset,
    play,
    setStayConnected,
  };
};

/**
 * Prepare the voice agent.
 *
 * @returns {object} The VoiceAgent.
 */
const getVoiceAgent = () => {
  // First call
  if (!agent) {
    agent = VoiceAgent();
  }

  return agent;
};

module.exports = {
  getVoiceAgent,
};
