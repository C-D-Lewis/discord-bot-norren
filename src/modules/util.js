/**
 * Wait some time.
 *
 * @param {number} ms - Time to wait.
 * @returns {Promise}
 */
const waitAsync = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

module.exports = {
  waitAsync,
};
