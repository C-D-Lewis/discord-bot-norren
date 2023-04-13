/** Sounds */
export const AUDIO_TYPE_SOUND = 'sound';
/** Music */
export const AUDIO_TYPE_MUSIC = 'music';

/** Positive answers */
export const POSITIVE_ANSWERS = [
  'It is certain',
  'Without a doubt',
  'You may rely on it',
  'Yes definitely',
  'It is decidedly so',
  'As I see it, yes',
  'Most likely',
  'Yes',
  'Outlook good',
  'Signs point to yes',
];
/** Neutral answers */
export const NEUTRAL_ANSWERS = [
  'Reply hazy try again',
  'Better not tell you now',
  'Ask again later',
  'Cannot predict now',
  'Concentrate and ask again',
];
/** Negative answers */
export const NEGATIVE_ANSWERS = [
  'Don\'t count on it',
  'Outlook not so good',
  'My sources say no',
  'Very doubtful',
  'My reply is no',
];

/** Minutes multiplier */
export const MINS_MULT = 1000 * 60;
/** Hours multiplier */
export const HOURS_MULT = 1000 * 60 * 60;
/** Days multiplier */
export const DAYS_MULT = 1000 * 60 * 60 * 24;

/** App start time */
export const START_TIME = Date.now();

/** DB key for pins - DO NOT CHANGE WITHOUT MIGRATION */
export const DB_KEY_PINS = 'guildPins';
/** DB key for recent sounds */
export const DB_KEY_RECENT_SOUNDS = 'recentSounds';

/** Start option to update commands */
export const OPTION_UPDATE_COMMANDS = '--updateCommands';

/** Max looping recent sounds */
export const MAX_RECENT_SOUNDS = 8;
