import fetch from 'node-fetch';
import { replyHidden } from '../modules/discord';
import { ChatInputCommandInteraction } from 'discord.js';
import { Roll20ParsedLink } from '../types';

/**
 * Handle 'search' command to find links to roll20.net
 *
 * @param {ChatInputCommandInteraction} interaction - discord.js interaction object.
 * @returns {Promise} Reply result
 */
export default async function (interaction: ChatInputCommandInteraction) {
  const { options } = interaction;
  const query = options.getString('query')!;
  const url = `https://roll20.net/compendium/compendium/whichone/dnd5e/${query}`;

  // Get results section
  const html = await fetch(url).then((r) => r.text());
  const start = html.indexOf('<p>We found more than one');
  const end = html.indexOf('</div>\n</div>\n</div>', start);
  const lines = html.slice(start, end).split('\n').filter((p) => p.includes('a href'));

  // No lines found
  if (lines.length === 0) {
    return replyHidden(interaction, { content: `No results found for ${query}` });
  }

  // Extract links
  const max = 10;
  const links: Roll20ParsedLink[] = [];
  lines
    .slice(0, max)
    .forEach((l) => {
      const [, href, text] = l.split('\'');
      const label = text.slice(text.indexOf('>') + 1, text.indexOf('<')).trim();
      links.push({ label, href });
    });

  // Return link list
  let replyText = `📖 _Found these results from roll20.net:_
${links.map(({ label, href }, i) => `${i + 1}: **${label}**\n<https://roll20.net${href.split(' ').join('%20')}>`).join('\n')}
`;
  if (lines.length > max) {
    replyText += `
⚠️ _There were more than ${max} results_`;
  }
  return replyHidden(interaction, { content: replyText });
};
