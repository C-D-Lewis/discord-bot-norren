const fs = require('fs');

/** Log file name */
const FILE_PATH = 'discord-bot-norren.txt';

/**
 * Write a log line to file.
 *
 * @param {string} msg - Message to write.
 */
 const writeToFile = (msg) => {
  let stream;
  if (!fs.existsSync(FILE_PATH)) {
    stream = fs.createWriteStream(FILE_PATH, { flags: 'w' });
    stream.end(`New log file!\n`);
  }

  stream = fs.createWriteStream(FILE_PATH, { flags: 'a' });
  stream.end(`${msg}\n`);
};

/**
 * Log a structured message.
 *
 * @param {string|object} msg - Message content.
 */
const log = (msg) => {
  const [date, timeStr] = new Date().toISOString().split('T');
  const [time] = timeStr.split('.');
  const isObject = typeof msg === 'object';
  const logMsg = `[${date} ${time}] ${isObject ? '' : msg}`;
  console.log(logMsg);

  // To file
  writeToFile(logMsg);

  // Could be complex object
  if (isObject) console.log(msg);
};

module.exports = { log };
