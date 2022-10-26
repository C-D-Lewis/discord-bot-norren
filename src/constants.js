module.exports = {
  /** Sounds */
  AUDIO_TYPE_SOUND: 'sound',
  /** Music */
  AUDIO_TYPE_MUSIC: 'music',

  /** Positive answers */
  POSITIVE_ANSWERS: [
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
  ],
  /** Neutral answers */
  NEUTRAL_ANSWERS: [
    'Reply hazy try again',
    'Better not tell you now',
    'Ask again later',
    'Cannot predict now',
    'Concentrate and ask again',
  ],
  /** Negative answers */
  NEGATIVE_ANSWERS: [
    'Don\'t count on it',
    'Outlook not so good',
    'My sources say no',
    'Very doubtful',
    'My reply is no',
  ],

  /** Minutes multiplier */
  MINS_MULT: 1000 * 60,
  /** Hours multiplier */
  HOURS_MULT: 1000 * 60 * 60,
  /** Days multiplier */
  DAYS_MULT: 1000 * 60 * 60 * 24,

  /** App start time */
  START_TIME: Date.now(),

  /** DB key for pins - DO NOT CHANGE WITHOUT MIGRATION */
  DB_KEY_PINS: 'guildPins',

  /** Start option to update commands */
  OPTION_UPDATE_COMMANDS: '--updateCommands',
};
