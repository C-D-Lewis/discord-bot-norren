const {
  joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState,
} = require('@discordjs/voice');
const { getClosestSoundName } = require('../modules/cache');

/**
 * Handle 'sound' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = async (interaction) => {
  const { options, member: { voice } } = interaction;
  const query = options.getString('query');
  console.log({ query });

  // If user in voice channel, join it
  if (voice.channel) {
    // Connect
    const connection = joinVoiceChannel({
      channelId: voice.channel.id,
      guildId: voice.guild.id,
      adapterCreator: voice.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    connection.on('stateChange', (old, _new) => {
      console.log(`Connection transitioned from ${old.status} to ${_new.status}`);
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    // Play selected sound
    const soundName = `sounds/${getClosestSoundName(query)}`;
    player.play(createAudioResource(soundName));
    player.on('stateChange', (old, _new) => {
      console.log(`Audio player transitioned from ${old.status} to ${_new.status}`);

      // Finished
      if (_new.status === 'idle') connection.disconnect();
    });
    player.on('error', (error) => {
      console.error('Error:', error.message, 'with track', error.resource.metadata.title);
      connection.disconnect();
    });
    await entersState(player, AudioPlayerStatus.Playing, 5000);

    // Reply to client
    return interaction.reply(`Playing ${soundName.split('/').pop()} (query: "${query}")`);
  }

  throw new Error(`Failed to match or play sound ${query}`);
};
