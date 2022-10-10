const { initClient, getClient } = require('../src/modules/discord');

const [channelId, messageId, emoji] = process.argv.slice(2);

/**
 * The main function.
 */
const main = async () => {
  await initClient({
    onMessage: () => {},
  });

  const client = getClient();
  const channel = await client.channels.fetch(channelId);
  const message = await channel.messages.fetch(messageId);
  await message.react(emoji);
  console.log('Sent');
  process.exit(0);
};

main();
