import type { Bitfield } from "bitfields";
import type { ApplicationCommand, ApplicationCommandOption, BaseMessageOptions, ChatInputCommandInteraction, Client, Events, Guild, WebhookClient } from "discord.js";
import SenkoProfile from "../API/SenkoProfile";
import SenkoGuild from "../API/Guild";
import { UserData } from "./SupabaseTypes";
import { LocaleInterface } from "./Locale";

export const CommandCategories = ["fun", "economy", "social", "admin", "account", "utility", "uncategorized"];
type winstonLevels = "senko" | "fatal" | "error" | "warn" | "info" | "debug" | "trace";

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
	sparkle: string;
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

export interface SenkoTheme {
	dark: number;
	light: number;
	blue: number;
	light_red: number;
	dark_red: number;
	random: () => number;
}

export interface SenkoClientTypes extends Client {
	api: {
		Commands: Map<string, SenkoCommand>;
		Bitfield: Bitfield;
		BitData: BitData;
		loadedCommands: Map<string, ApplicationCommand>;
		statusLog: WebhookClient;
		SenkosWorld: Guild;
	};
	Icons: SenkoIcons;
	UserAgent: string;
	Theme: SenkoTheme;
	winston: SenkoWinston;
	on(event: Events, listener: (...args: any[]) => void): this;
	once(event: Events, listener: (...args: any[]) => void): this;
}

export interface SenkoCommandApi {
	readonly Interaction: ChatInputCommandInteraction;
	readonly Senko: SenkoClientTypes;
	readonly Member: SenkoProfile;
	readonly MemberData: UserData;
	readonly Guild: SenkoGuild;
	readonly GuildData: any;
	readonly CommandLocale: any;
	readonly GeneralLocale: LocaleInterface["general"];
}

export interface SenkoWinston {
	log: (level: winstonLevels, message: string) => void;
}

export interface SenkoCommand {
	name: string;
	desc: string;
	commandOptions?: {
		defer?: boolean;
		ephemeral?: boolean;
		data?: boolean;
		guildData?: boolean;
		usableAnywhere?: boolean;
		whitelisted?: boolean;
	};
	defer?: boolean;
	ephemeral?: boolean;
	usableAnywhere?: boolean;
	whitelist?: boolean;

	category: string;
	permissions?: any;
	options?: ApplicationCommandOption[];
	name_localized?: string;
	description_localized?: {
		"en-US": string;
		"jp": string;
		"fr": string;
	};
	start: (Api: SenkoCommandApi) => Promise<void>;
}

export interface SenkoMessageOptions extends BaseMessageOptions {
	ephemeral?: boolean;
}

export interface Achievement {
	name: string;
	description: string;
	earned: number;
	rewardType: "shopItem" | "yen" | "tofu"
}