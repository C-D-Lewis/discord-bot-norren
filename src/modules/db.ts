/* eslint-disable no-underscore-dangle */
import { existsSync, writeFileSync } from 'node:fs';
import { AppDbData } from '../types';

/** Path to DB file */
const DB_PATH = `${__dirname}/../../db.json`;

let dbData: AppDbData;

/**
 * Save the DB data to file.
 *
 * @returns {object} writeFileSync result
 */
const saveDbData = () => writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');

/**
 * Load the DB file data.
 */
const loadDbData = () => {
  if (dbData) return;

  if (!existsSync(DB_PATH)) {
    dbData = {
      guildPins: {},
      recentSounds: {},
    };
    saveDbData();
  }

  dbData = require(DB_PATH);
};

/**
 * Get data by key.
 *
 * @param {string} key - Key to use.
 * @returns {*} Saved key data.
 */
export const get = (key: string) => {
  loadDbData();
  return dbData[key];
};

/**
 * Set key data.
 *
 * @param {string} key - Key to use.
 * @param {object} data - Value to set.
 */
export const set = (key: string, data: object) => {
  loadDbData();
  dbData[key] = data;
  saveDbData();
};
