const {
  joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState,
} = require('@discordjs/voice');
const { getClosestSoundName } = require('../modules/cache');

/**
 * Play a given sound.
 *
 * @param {object} connection - Voice connection from discordjs/voice.
 * @param {string} soundName - Name of the sound file.
 * @returns {Promise}
 */
const playSound = async (connection, soundName) => {
  const player = createAudioPlayer();
  connection.subscribe(player);

  // Play selected sound
  player.play(createAudioResource(soundName));
  player.on('stateChange', async (playerOld, playerNew) => {
    console.log(`Audio player transitioned from ${playerOld.status} to ${playerNew.status}`);

    // Finished
    if (playerNew.status === 'idle') {
      await connection.disconnect();
      connection.destroy();
    }
  });
  player.on('error', async (error) => {
    console.error('Error:', error.message, 'with track', error.resource.metadata.title);
    await connection.disconnect();
    connection.destroy();
  });
  await entersState(player, AudioPlayerStatus.Playing, 5000);
};

/**
 * Handle 'sound' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = async (interaction) => {
  const { options, member: { voice } } = interaction;
  const query = options.getString('query');

  const foundSound = getClosestSoundName(query);
  const soundName = `sounds/${foundSound}`;
  console.log({ query, foundSound, soundName });

  if (!foundSound) throw new Error(`No sound found for "${query}"`);

  // If user in voice channel, join it
  if (voice.channel) {
    // Connect
    const connection = joinVoiceChannel({
      channelId: voice.channel.id,
      guildId: voice.guild.id,
      adapterCreator: voice.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    connection.on('stateChange', async (old, _new) => {
      console.log(`Connection transitioned from ${old.status} to ${_new.status}`);

      // When ready
      if (_new.status === 'ready' && _new.status !== old.status) {
        playSound(connection, soundName);
      }
    });

    // Reply to client
    return interaction.reply(`Playing ${soundName.split('/').pop()} (query: "${query}")`);
  }

  throw new Error(`Failed to match or play sound ${query}`);
};
