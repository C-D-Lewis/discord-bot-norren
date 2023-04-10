import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { MAX_RECENT_SOUNDS, DB_KEY_RECENT_SOUNDS } from '../constants';
import * as db from './db';
import { RecentSounds } from '../types';

/**
 * Get recent sounds for this user.
 *
 * @param {string} username - User name.
 * @returns {object} Recent sounds and user recent sounds.
 */
const getRecentSounds = (username: string) => {
  const recentSounds = db.get(DB_KEY_RECENT_SOUNDS) as RecentSounds || [];
  if (!recentSounds[username]) {
    recentSounds[username] = [];
    db.set(DB_KEY_RECENT_SOUNDS, recentSounds);
  }

  return {
    recentSounds,
    userSounds: recentSounds[username],
  };
};

/**
 * Add recent sound for a user.
 *
 * @param {string} username - User name.
 * @param {string} soundName - Sound name.
 * @returns {undefined}
 */
export const addUserRecentSound = (username: string, soundName: string) => {
  // Add
  const { userSounds, recentSounds } = getRecentSounds(username);
  if (userSounds.includes(soundName)) return;

  // Add to start and tim to max size
  userSounds.unshift(soundName);
  while (userSounds.length > MAX_RECENT_SOUNDS) userSounds.pop();

  db.set(DB_KEY_RECENT_SOUNDS, recentSounds);
};

/**
 * Build component rows for latets used sounds.
 *
 * @param {string} username - User who asked for their recent sounds.
 * @returns {Array<object>} List of rows of components.
 */
export const buildRecentSounds = (username: string) => {
  const { userSounds } = getRecentSounds(username);
  if (!userSounds.length) throw new Error('No recent sounds for you yet');

  // 4 per row
  const actionRows = [];
  const copy = [...userSounds];
  while (copy.length) {
    const rowSounds = copy.splice(0, 4);
    actionRows.push(new ActionRowBuilder()
      .addComponents(
        rowSounds.map((fileName) => {
          const label = fileName.split('.')[0];
          return new ButtonBuilder()
            .setCustomId(fileName)
            .setLabel(label)
            .setStyle(ButtonStyle.Primary);
        }),
      ));
  }

  return actionRows;
};
