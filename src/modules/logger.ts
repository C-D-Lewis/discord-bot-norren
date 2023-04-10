import { existsSync, createWriteStream } from 'node:fs';

/** Log file name */
const FILE_PATH = 'log.txt';

/**
 * Write a log line to file.
 *
 * @param {string} msg - Message to write.
 */
const writeToFile = (msg: string) => {
  let stream;
  if (!existsSync(FILE_PATH)) {
    stream = createWriteStream(FILE_PATH, { flags: 'w' });
    stream.end('New log file!\n');
  }

  stream = createWriteStream(FILE_PATH, { flags: 'a' });
  stream.end(`${msg}\n`);
};

/**
 * Log a structured message.
 *
 * @param {string|object} msg - Message content.
 */
export const log = (msg: string | object) => {
  const [date, timeStr] = new Date().toISOString().split('T');
  const [time] = timeStr.split('.');
  const isObject = typeof msg === 'object';
  const logMsg = `[${process.pid} ${date} ${time}] ${isObject ? '' : msg}`;
  console.log(logMsg);

  // To file
  writeToFile(logMsg);

  // Could be complex object
  if (isObject) console.log(msg);
};
