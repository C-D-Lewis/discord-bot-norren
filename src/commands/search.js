const fetch = require('node-fetch');

/**
 * Handle 'search' command to find links to roll20.net
 *
 * @param {object} interaction - discord.js interaction object.
 * @returns {Promise}
 */
module.exports = async (interaction) => {
  const { options } = interaction;
  const query = options.getString('query');
  const url = `https://roll20.net/compendium/compendium/whichone/dnd5e/${query}`;

  // Get results section
  const html = await fetch(url).then((r) => r.text());
  const start = html.indexOf('<p>We found more than one');
  const end = html.indexOf('</div>\n</div>\n</div>', start);
  const lines = html.slice(start, end).split('\n').filter((p) => p.includes('a href'));

  // No lines found
  if (lines.length === 0) throw new Error(`No results found for ${query}`);

  // Extract links
  const links = [];
  lines.forEach((l) => {
    const [, href, text] = l.split('\'');
    const label = text.slice(text.indexOf('>') + 1, text.indexOf('<')).trim();
    links.push({ label, href });
  });

  // Return link list
  const replyText = `📖 Found these results frmm roll20.net:
${links.map(({ label, href }) => `- ${label}:\n    <https://roll20.net${href.split(' ').join('%20')}>`).join('\n')}
`;
  if (replyText.length > 2000) throw new Error('Too many results');
  return interaction.reply(replyText);
};
