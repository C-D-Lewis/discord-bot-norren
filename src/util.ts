import { execSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';

const commit = execSync('git rev-parse --short HEAD').toString();

/**
 * Wait some time.
 *
 * @param {number} ms - Time to wait.
 * @returns {Promise} Promise resolving when wait elapses.
 */
export const waitAsync = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

/**
 * Get a random int from CSPRNG.
 *
 * @param {number} min - Min value.
 * @param {number} max - Max value.
 * @returns {number} result.
 */
export const getCsprngInt = (min: number, max: number) => min + Math.round(
  (randomBytes(4).readUInt32LE() / 0x100000000) * (max - min),
);

/**
 * Get commit.
 *
 * @returns {string} commit.
 */
export const getCommit = () => commit;
