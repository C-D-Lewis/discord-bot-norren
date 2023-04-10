import { Interaction } from "discord.js";
import { CommandMapType } from "./modules/handlers";

/** Audio types. */
export type AudioType = 'music' | 'sound';

/** Expected ChatGPT response object. */
export type ChatGptResponse = {
  choices: [{
    message: {
      content: string;
    },
  }],
};

/** Recent sounds structure. */
export type RecentSounds = {
  [key: string]: string[];
};

/** Expected app's DB data. */
export type AppDbData = {
  [key: string]: object;

  guildPins: {
    [key: string]: {
      guildName: string;
      pins: string[];
    },
  },
  recentSounds: RecentSounds,
};

/** Options for setupClient funtion. */
export type SetupClientOptions = {
  onCommand: (commandName: keyof CommandMapType, interaction: Interaction) => Promise<void>;
  onMessage: (interaction: Interaction) => Promise<void>;
  onMessageButton: (interaction: Interaction, data: {
    customId: string;
    commandName: string;
    username: string;
  }) => Promise<void>;
};

/** Reply hidden options */
export type ReplyHiddenOptions = {
  content: string;
  components?: any[];
};

/** EleventLabs voices response */
export type ElevenLabsVoicesResponse = {
  voices: [{
    name: string;
    voice_id: string;
    category: 'premade' | 'cloned';
  }],
};

/** VoiceAgent type */
export type VoiceAgentType = {
  join: () => Promise<undefined>;
  leave: () => Promise<undefined>;
  play: (soundName: string) => Promise<undefined>;
  setStayConnected: (stayConnected: boolean) => void | undefined;
};

/** Player type status */
export type StateStatus = { status: string };
