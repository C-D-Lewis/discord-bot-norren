const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState } = require('@discordjs/voice');

/**
 * Handle 'sound' command.
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = async (interaction) => {
  const { options, member: { voice } } = interaction;
  const param = options.getString('query');

  // If user in voice channel, join it
  if (voice.channel) {
    // Connect
    const connection = joinVoiceChannel({
      channelId: voice.channel.id,
      guildId: voice.guild.id,
      adapterCreator: voice.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    const player = createAudioPlayer();
    connection.subscribe(player);

    // Determine closes sound name
    let soundName = param;

    // Play selected sound
    const resource = createAudioResource('assets/angels.mp3');
    player.play(resource);
    player.on('stateChange', (old, nnew) => {
      console.log(`Audio player transitioned from ${old.status} to ${nnew.status}`);

      // Finished
      if (nnew.status === 'idle') connection.disconnect();
    });
    player.on('error', (error) => {
      console.error('Error:', error.message, 'with track', error.resource.metadata.title);
      connection.disconnect();
    });
    await entersState(player, AudioPlayerStatus.Playing, 5000);
    connection.subscribe(player);
    connection.on('stateChange', (old, nnew) => {
      console.log(`Connection transitioned from ${old.status} to ${nnew.status}`);
    });
    await interaction.reply(`Playing ${param} -> ${soundName}`);

    // Disconnect?
  }
};
