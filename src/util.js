const { execSync } = require('child_process');
const crypto = require('crypto');

const commit = execSync('git rev-parse --short HEAD').toString();

/**
 * Wait some time.
 *
 * @param {number} ms - Time to wait.
 * @returns {Promise} Promise resolving when wait elapses.
 */
const waitAsync = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

/**
 * Get a random int from CSPRNG.
 *
 * @param {number} min - Min value.
 * @param {number} max - Max value.
 * @returns {number} result.
 */
const getCsprngInt = (min, max) => min + Math.round(
  (crypto.randomBytes(4).readUInt32LE() / 0x100000000) * (max - min),
);

module.exports = {
  waitAsync,
  getCommit: () => commit,
  getCsprngInt,
};
