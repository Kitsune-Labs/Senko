import type { Bitfield } from "bitfields";
import type { ApplicationCommandOption, BaseMessageOptions, ChatInputCommandInteraction, Client, Collection, CommandInteraction, WebhookClient } from "discord.js";
import type { GuildData, UserData } from "./SupabaseTypes";

export interface BitData {
	Private: 1,
	Banned: 2,
	BioBanned: 3,
	FilterEnabled: 5,
	BlockSpecialCharacters: 6,
	DMAchievements: 7,
	IndefiniteData: 12,
	ActionLogs: {
		BanActionDisabled: 8,
		KickActionDisabled: 9,
		TimeoutActionDisabled: 10
	},
	BETAs: {
		ModCommands: 4,
		TimeoutActionEnabled: 11
	}
}

export interface SenkoIcons {
	yen: string;
	tofu: string;
	medal: string;
	powerup: string;
	hojicha: string;
	BANNED: string;
	check: string;
	tick: string;
	package: string;
	LeftArrow: string;
	RightArrow: string;
	disabled: string;
	enabled: string;
	exclamation: string;
	tail1: string;
	ThinkCloud: string;
	zzz: string;
	heart: string;
	flushed: string;
	bubble: string;
	question: string;
	tears: string;
	sparkles: string;
	KitsuneBi_Blue: string;
	Fall: string;
	Winter: string;
	["New Years 2022"]: string;
	Valentines: string;

	StatusIcons: {
		SenkoNervous: string;
		SenkoReading: string;
		SenkoPouting: string;
		SenkosLab: string;
		SenkoWaving: string;
		SmugSenko: string;
		SenkoPinged: string;
		SenkoWhistle: string;
		SenkoBan: string;
		SenkoParty: string;
		SenkoRiot: string;

		ShiroWave: string;
		Shirwoaaaahhhhh: string;
		SuperiorShiro: string;
		ShiroPout: string;

		SuzuWave: string;

		FukudaWave: string;

		YozoraWave: string;
	}
}

export interface SenkoClientTypes extends Client {
	api: {
		Commands: Collection<string, CommandInteraction | SenkoCommand>;
		Icons: SenkoIcons;
		UserAgent: string;
		Theme: {
			dark: number;
			light: number;
			blue: number;
			light_red: number;
			dark_red: number;
			random: () => number;
		};
		Bitfield: Bitfield;
		BitData: BitData;
		loadedCommands: any;
		statusLog: WebhookClient;
		SenkosWorld: () => Promise<any>;
	};
}

export interface SenkoCommandApi {
	readonly senkoClient: SenkoClientTypes;
	readonly interaction: ChatInputCommandInteraction;
	readonly guildData: GuildData;
	readonly userData: UserData;
	readonly xpAmount: number;
	readonly locale: any;
	readonly generalLocale: any;
}

export const CommandCategories = ["fun", "economy", "social", "admin", "account", "utility", "uncategorized"];

export interface SenkoCommand {
	name: string;
	desc: string;
	defer?: boolean;
	ephemeral?: boolean;
	usableAnywhere?: boolean;
	name_localized?: string;
	description_localized?: {
		"en-US": string;
		"jp": string;
		"fr": string;
	};
	category: string;
	permissions?: any;
	whitelist?: boolean;
	options?: ApplicationCommandOption[];
	start: (Api: SenkoCommandApi) => Promise<void>;
}

export interface SenkoMessageOptions extends BaseMessageOptions {
	ephemeral?: boolean;
}