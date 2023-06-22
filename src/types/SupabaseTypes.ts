import type { Message } from "discord.js";

export interface CurrentMarket {
	updates: number;
	items: Array<string>;
}

export interface MarketItems {
	[name: string]: MarketItem;
}

export interface MarketItem {
	class: "Other" | "Consumables" | "Banners" | "Materials" | "Misc" | "Music" | "Titles" | "Colors" | "Badges";
	name: string,
	desc: string,
	price: number,
	amount: number,
	max?: number,
	autosale: boolean,
	banner?: string,
	badge?: string,
	status?: string,
	color?: string,
	title?: string,
	soundFile?: string,
	soundVolume?: number,
	manga?: string,
	set?: string,
	url?: string,
	onsale: boolean;
}

export interface ConfigTypes {
	readonly id: string;
	activity: Array<any>;
	market: {
		updates: number;
		items: Array<string>;
	};
	MarketItems: {
		[name: string]: MarketItem;
	};
	OutlawedUsers: {
		[userId: string]: string
	};
	OutlawedGuilds: Array<string>;
	EventMarket: Array<string>;
	SpecialMarket: Array<string>;
	Contributors: Array<string>;
}

export interface GuildWarn {
	userTag: string;
	userId: string;
	reason: string;
	note: string;
	date: number;
	moderator: string;
	moderatorId: string;
	uuid: string;
	userDmd: boolean;
}

export interface GuildData {
	guildId: string;
	flags: string;
	WelcomeChannel: {
		message: Message,
		config: {
			channel: string,
		}
	};
	MessageLogs: string;
	AdvancedMessageLogging: {
		message_edits: string | null;
		message_deletions: string | null;
	};
	ActionLogs: string;
	warns: {
		[id: string]: GuildWarn[];
	};
	Counting: {
		channel: string;
		number: number;
	};
	MemberLogs: string;
	Channels: Array<string>;
	BanAppeal: string;
}

export interface UserData {
	readonly id: string;
	Stats: {
		Rests: number | 0;
		Fluffs: number | 0;
		Pats: number | 0;
		Steps: number | 0;
		Hugs: number | 0;
		Sleeps: number | 0;
		Drinks: number | 0;
		Smiles: number | 0;
	},
	RateLimits: {
		Rest_Rate: {
			Date: number | 1627710691;
			Amount: number | 0;
		},
		Pat_Rate: {
			Date: number | 1627710691;
			Amount: number | 0;
		},
		Step_Rate: {
			Date: number | 1627710691;
			Amount: number | 0;
		},
		Hug_Rate: {
			Date: number | 1627710691;
			Amount: number | 0;
		},
		Drink_Rate: {
			Date: number | 1627710691;
			Amount: number | 0;
		},
		Sleep_Rate: {
			Date: number | 1627710691;
			Amount: number | 0;
		},
		Smile_Rate: {
			Date: number | 1627710691;
			Amount: number | 0;
		},
		Eat_Rate: {
			Date: number | 1627710691;
			Amount: number | 0;
		},
		Walk_Rate: {
			Date: number | 1627710691;
			Amount: number | 0;
		},
		Fluff_Rate: {
			Date: number | 1627710691;
			Amount: number | 0;
		}
	};
	Rewards: {
		Daily: number | 1627604493201;
		Weekly: number | 1627604493201;
		Work: number | 1627604493201;
	};
	LocalUser: {
		profileConfig: {
			Status: string | null;
			title: string | null;
			aboutMe: string | null;
			banner: string |"DefaultBanner";
			cardColor: string | "#FF9933";
			badges: string | "00000000000000000000000000";
			completedQuests: string | "00000000000000000000000000000000000000000000000000";
			achievements: Array<string>;
			activePowers: Array<string>;
			claimableItems: Array<string>;
			Inventory: {
				[name: string]: number;
			};
			Currency: {
				Yen: number | 0;
				Tofu: number | 0;
			}
		},
		accountConfig: {
			flags: string | "00000000000000000000000000";
			rank: string | "00000000000000";
			level: {
				level: number | 1;
				xp: number | 0;
			}
		}
	};
	LastUsed: string;
	DeletionDays: number;
}