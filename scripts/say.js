const { setupClient, getClient } = require('../src/modules/discord');

const [channelId, message] = process.argv.slice(2);

/**
 * The main function.
 */
const main = async () => {
  await setupClient({
    onMessage: () => {
      console.log('Sent');
      process.exit(0);
    },
  });

  const client = getClient();
  const channel = client.channels.cache.get(channelId);
  channel.send(message);
};

main();
