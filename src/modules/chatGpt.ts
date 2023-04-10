import fetch from 'node-fetch';
import { ChatGptResponse } from '../types';
import { openAiApiKey } from '../../config.json';
import { log } from './logger';

/** Context framing the user's query */
const CONTEXT = 'You are Norren, a friendly Druid from the town of Kernwall. Respond in three sentences or less.';

/**
 * Prompt ChatGPT with a context to the user's query.
 *
 * @param {string} prompt - User's prompt.
 * @returns {string} ChatGPT response.
 */
export const askChatGpt = async (prompt: string) => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: CONTEXT },
        { role: 'user', content: prompt },
      ],
    }),
  });

  const json: ChatGptResponse = await res.json() as ChatGptResponse;
  if (!json.choices) {
    log('Invalid ChatGPT response');
    console.log(json);
    return undefined;
  }

  const { content } = json.choices[0].message;
  console.log({ prompt, content });
  return content;
};
