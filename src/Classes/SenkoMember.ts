import { GuildMember } from "discord.js";
import { fetchConfig, fetchSuperUser, updateSuperUser } from "../API/super";
import { UserData } from "../types/SupabaseTypes";

export interface SenkoMemberInterface {
	Member: GuildMember;
	User: GuildMember["user"];
	_Flags: null;
	_DataExpireDays: null;
	AccessLevels: {
		Blacklisted: boolean;
		Developer: boolean;
	};
	_Profile: {
		Title: null;
		AboutMe: null;
		Status: null;
		Badges: Array<any>;
		Banner: null;
		CardColor: null;
		Achievements: Array<any>;
		Yen: null;
		Tofu: null;
		Rank: {
			Level: null;
			Experience: null;
		};
		Marriage: {
			Partner: null;
			Since: null;
		};
	};

	init(): Promise<void>;
	fetchData(): Promise<UserData | null>;
	updateData(data: any): Promise<boolean>;
}

export class SenkoMember {
	public Member;
	public User;
	public _Flags = null;
	public _DataExpireDays = null;

	public AccessLevels = {
		Blacklisted: false,
		Developer: false
	};

	public _Profile = {
		Title: null,
		AboutMe: null,
		Status: null,
		Badges: [],
		Banner: null,
		CardColor: null,
		Achievements: [],
		Yen: null,
		Tofu: null,
		Rank: {
			Level: null,
			Experience: null
		},
		Marriage: {
			Partner: null,
			Since: null
		}
	};

	constructor(GuildMember: GuildMember) {
		this.Member = GuildMember;
		this.User = GuildMember.user;

		this.init();
	}

	public async init() {
		const config = await fetchConfig();

		if (config?.OutlawedUsers[this.User.id]) {
			this.AccessLevels.Blacklisted = true;
		}
	}

	public async fetchData() {
		return await fetchSuperUser(this.User);
	}

	public async updateData(data: any) {
		return await updateSuperUser(this.User, data);
	}
}