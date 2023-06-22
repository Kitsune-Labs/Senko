import { GuildMember } from "discord.js";
import { Supabase, fetchConfig, fetchMarket } from "../API/super";
import { ConfigTypes, UserData } from "../types/SupabaseTypes";
import bits from "../API/Bits.json";
import { Bitfield } from "bitfields";
import { MarketItem } from "../types/SupabaseTypes";
import DefaultMarket from "../Data/Market/Market.json";
import { PostgrestError } from "@supabase/supabase-js";
import { Locales, winston } from "../SenkoClient";
import { randomNumber } from "@kitsune-labs/utilities";
import config from "../Data/DataConfig.json";

export interface SenkoProfileInterface {
	GuildMember: GuildMember;
	User: GuildMember["user"];
	Flags: string;
	DataExpiryDays: number;

	Profile: {
		Title: MarketItem | null;
		AboutMe: string | null;
		Status: string | null;
		Badges: Map<string, boolean>;
		Banner: MarketItem;
		CardColor: string | null;
		Achievements: Map<string, boolean>;
		Yen: number;
		Tofu: number;
		Rank: {
			Level: number;
			Experience: number;
		};
	};
}

const CachedData = new Map<string, SenkoProfile>();

export default class SenkoProfile implements SenkoProfileInterface {
	public Initialized = false;

	public GuildMember: GuildMember;
	public User: GuildMember["user"];
	public Flags = "0000000000";
	public DataExpiryDays = 30;
	public Locale = Locales["en-US"];
	public Blacklisted = false;
	public Profile = {
		Title: null,
		AboutMe: null,
		Status: null,
		Badges: new Map(),
		Banner: DefaultMarket.DefaultBanner as MarketItem,
		CardColor: null,
		Achievements: new Map(),
		Yen: 0,
		Tofu: 0,
		Rank: {
			Level: 1,
			Experience: 0,
			AmountLeft: 0
		}
	};

	constructor(Member: GuildMember) {
		this.GuildMember = Member;
		this.User = Member.user;

		if (CachedData.has(Member.user.id)) return CachedData.get(Member.user.id) as SenkoProfile;
		CachedData.set(Member.user.id, this);
	}

	public async init() {
		if (this.Initialized) {
			winston.log("info", "Already initialized. Returning cached profile.");
			return this;
		}

		const [Data, Configuration, RawMarket] = await Promise.all([
			this.data.fetch(),
			fetchConfig(),
			fetchMarket()
		]);

		if (!Data || !Configuration || !RawMarket) throw new Error("Failed to load data.");
		const Market = new Map(Object.entries(RawMarket));

		this.Flags = Data.LocalUser.accountConfig.flags;
		this.DataExpiryDays = Data.DeletionDays;
		this.Profile.Banner = Market.get(Data.LocalUser.profileConfig.banner.replace(".png", "").replace(".gif", "")) as MarketItem;

		if (Configuration.OutlawedUsers[this.User.id]) this.Blacklisted = true;

		Supabase.channel("Users").on("postgres_changes", { event: "*", schema: "public", table: "Users" }, (payload) => {
			const Data = payload.new as UserData;

			if (Data.id === this.User.id) {
				this.Flags = Data.LocalUser.accountConfig.flags;
			}
		}).subscribe();

		Supabase.channel("Configuration").on("postgres_changes", { event: "*", schema: "public", table: "config" }, (payload) => {
			const Data = payload.new as ConfigTypes;

			if (Data.OutlawedUsers[this.User.id]) {
				this.Blacklisted = true;
			} else {
				this.Blacklisted = false;
			}
		}).subscribe();

		this.Initialized = true;
		winston.log("info", "Initialized");
		return this;
	}

	public async isDeveloper() {
		if (!this.Initialized) throw new Error("Not yet initialized");

		return Bitfield.fromHex(this.Flags).get(bits.Account.Developer);
	}

	public data = {
		update: async (Data: Partial<UserData>): Promise<PostgrestError | string> => {
			if (Data.LocalUser && Data.LocalUser.profileConfig.Currency.Yen >= 100000) Data.LocalUser.profileConfig.Currency.Yen = 100000;
			if (Data.LocalUser && Data.LocalUser.profileConfig.Currency.Tofu >= 50) Data.LocalUser.profileConfig.Currency.Tofu = 50;

			const { statusText, error } = await Supabase.from("Users").update(Data).eq("id", this.User.id);

			if (error) return error;

			return statusText;
		},
		fetch: async (makeData = true): Promise<UserData | null> => {
			const { data, error } = await Supabase.from("Users").select("*").eq("id", this.User.id);

			if (error) {
				winston.log("fatal", `Data fetch error: ${error}`);
				return null;
			}

			if (!data[0] && makeData) {
				return await this.data.create();
			}

			return data![0] as UserData;
		},
		create: async (): Promise<UserData> => {
			await Supabase.from("Users").insert([{ id: this.User.id }]);

			const { data } = await Supabase.from("Users").select("*").eq("id", this.User.id);

			return data![0] as UserData;
		},
		addYen: async (Amount: number) => {
			const Data = await this.data.fetch();

			Data!.LocalUser.profileConfig.Currency.Yen = Data!.LocalUser.profileConfig.Currency.Yen + Amount * config.multiplier;

			this.data.update({
				LocalUser: Data!.LocalUser
			});
		},
		removeYen: async (Amount: number) => {
			const Data = await this.data.fetch();

			Data!.LocalUser.profileConfig.Currency.Yen = Data!.LocalUser.profileConfig.Currency.Yen - Amount;

			this.data.update({
				LocalUser: Data!.LocalUser
			});
		}
	};

	public async getBannerUrl() {
		if (!this.Initialized) throw new Error("Not yet initialized");

		return this.Profile.Banner.url as string;
	}

	public async activityTick() {
		if (!this.Initialized) throw new Error("Not yet initialized");

		let xp = this.Profile.Rank.Experience;
		let level = this.Profile.Rank.Level;
		const Amount = 1500 * level;

		if (xp > Amount) {
			level += Math.floor(xp / Amount);
			xp %= Amount;
			// interaction.channel?.send({
			// 	content: `${interaction.user}`,
			// 	embeds: [{
			// 		title: "Congratulations dear!",
			// 		description: `You are now level **${level}**`,
			// 		color: SenkoClient.api.Theme.light,
			// 		thumbnail: {
			// 			url: interaction.user.displayAvatarURL()
			// 		}
			// 	}]
			// });
		} else {
			xp += randomNumber(25);
		}

		this.Profile.Rank.Experience = xp;
		this.Profile.Rank.Level = level;
		this.Profile.Rank.AmountLeft = Amount;

		Supabase.from("Users").update({
			LocalUser: {
				accountConfig: {
					level: {
						level: this.Profile.Rank.Level,
						xp: this.Profile.Rank.Experience
					}
				}
			},
			LastUsed: new Date().toISOString()
		}).eq("id", this.User.id);
	}
}