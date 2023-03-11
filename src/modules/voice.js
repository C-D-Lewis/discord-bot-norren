const {
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  getVoiceConnection,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const { getAudioResource } = require('./cache');
const { log } = require('./logger');

const voiceAgents = {};

/**
 * Abstract away all state and internals related to handling voice connection
 * and player status.
 *
 * @param {object} voice - discord.js voice object.
 * @returns {object} VoiceAgent object.
 */
const VoiceAgent = (voice) => {
  const { id: guildId } = voice.guild;
  let player;
  let readyToPlay = false;
  let willStayConnected = false;
  let playEndCb;

  /**
   * Stop and disconnect.
   */
  const leaveAndReset = async () => {
    try {
      const connection = getVoiceConnection(guildId);
      await connection.disconnect();
      await connection.destroy();
      log('Stopped and disconnected');
    } catch (e) {
      log(`Error disconnecting: ${e.message}`);
    }

    readyToPlay = false;
    willStayConnected = false;
  };

  /**
   * Prepare the player.
   */
  const preparePlayer = async () => {
    player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
    getVoiceConnection(guildId).subscribe(player);

    // Play selected sound
    player.on('stateChange', async (old, _new) => {
      if (old.status === _new.status) return;
      log(`Audio: ${old.status} -> ${_new.status}`);

      // Finished
      if (_new.status === 'idle') {
        if (playEndCb) playEndCb();
        if (!willStayConnected) await leaveAndReset();
      }
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
   * @returns {Promise} Promise
   */
  const join = async () => new Promise((resolve) => {
    // Already connected
    if (readyToPlay) {
      resolve();
      return;
    }

    // Prepare connection
    const connection = joinVoiceChannel({
      channelId: voice.channel.id,
      guildId: voice.guild.id,
      adapterCreator: voice.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    connection.on('stateChange', (old, _new) => {
      if (old.status === _new.status) return;
      log(`Connection: ${old.status} -> ${_new.status}`);

      // Workaround for https://github.com/discordjs/discord.js/issues/9185
      const { Ready, Connecting } = VoiceConnectionStatus;
      if (old.status === Ready && _new.status === Connecting) {
        log('Workaround used...');
        connection.configureNetworking();
      }

      // When connected
      if (_new.status === 'ready' && _new.status !== old.status) {
        preparePlayer();
        resolve();
      }
    });
    connection.on('error', (error) => {
      log(`Connection error: ${error.message}`);
      leaveAndReset();
    });
  });

  /**
   * Play a given sound.
   *
   * @param {string} soundName - Name of the sound file.
   * @returns {Promise} Promise resolving when sound finishes playing.
   */
  const play = async (soundName) => new Promise((resolve) => {
    // Allow waiting for playback
    playEndCb = resolve;

    player.play(getAudioResource(soundName));
  });

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
 * @param {object} voice - Discordjs voice object.
 * @returns {object} The VoiceAgent.
 */
const getVoiceAgent = (voice) => {
  const { id: guildId } = voice.guild;

  // One agent per guild
  if (!voiceAgents[guildId]) {
    voiceAgents[guildId] = VoiceAgent(voice);
  }

  return voiceAgents[guildId];
};

module.exports = {
  getVoiceAgent,
};
