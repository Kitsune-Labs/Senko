import { Guild } from "discord.js";
import { Supabase } from "./super";
import { winston } from "../SenkoClient";
import { GuildData } from "../types/SupabaseTypes";
import { Bitfield } from "bitfields";

const CachedData = new Map<string, SenkoGuild>();

export default class SenkoGuild {
	private Guild: Guild;

	public Initialized = false;
	public Flags = "";

	constructor(guild: Guild) {
		this.Guild = guild;

		if (CachedData.has(guild.id)) return CachedData.get(guild.id) as SenkoGuild;
		CachedData.set(guild.id, this);
	}

	public init() {
		if (this.Initialized) return this;

		this.data.fetch().then((data) => {
			if (data) {
				this.Flags = data.flags;
			}
		});

		this.Initialized = true;
		return this;
	}

	public data = {
		fetch: async (makeGuild = true): Promise<GuildData | null> => {
			const { data, error } = await Supabase.from("Guilds").select("*").eq("guildId", this.Guild.id);

			if (error) {
				winston.log("fatal", `ERROR FETCHING GUILD DATA: ${error}`);
				return null;
			}

			if (data[0]) {
				return data[0] as GuildData;
			} else if (!data[0] && makeGuild) {
				return await this.data.create();
			}

			return null;
		},
		update: async (Data: any): Promise<boolean> => {
			Data = JSON.stringify({ guildId: this.Guild.id, ...Data });

			const { error } = await Supabase.from("Guilds").upsert(JSON.parse(Data));

			if (error) {
				winston.log("fatal", `ERROR UPDATING GUILD DATA: ${error}`);
				return false;
			}

			return true;
		},
		create: async (): Promise<GuildData | null> => {
			const { error } = await Supabase.from("Guilds").insert([{
				guildId: this.Guild.id,
				flags: new Bitfield(50).toHex()
			}]);

			if (error) {
				winston.log("fatal", `ERROR MAKING GUILD DATA: ${error}`);
				return null;
			}

			return await this.data.fetch();
		}
	};
}