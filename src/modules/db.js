/* eslint-disable no-underscore-dangle */
const fs = require('fs');

/** Path to DB file */
const DB_PATH = `${__dirname}/../../db.json`;

let dbData;

/**
 * Save the DB data to file.
 *
 * @returns {object} writeFileSync result
 */
const saveDbData = () => fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');

/**
 * Load the DB file data.
 */
const loadDbData = () => {
  if (dbData) return;

  if (!fs.existsSync(DB_PATH)) {
    dbData = {};
    saveDbData();
  }

  dbData = require(DB_PATH);
};

/**
 * Get app data by app.
 *
 * @param {string} app - App name to use.
 * @returns {*} Saved app data.
 */
const get = (app) => {
  loadDbData();
  return dbData[app];
};

/**
 * Set app data.
 *
 * @param {string} app - App name to use.
 * @param {*} appData - Value to set.
 */
const set = (app, appData) => {
  loadDbData();
  dbData[app] = appData;
  saveDbData();
};

/**
 * Delete app data by app name.
 *
 * @param {string} app - App name to use.
 */
const _delete = (app) => {
  loadDbData();
  delete dbData[app];
  saveDbData();
};

module.exports = {
  get,
  set,
  exists: (app) => get(app) !== undefined,
  delete: _delete,
};
