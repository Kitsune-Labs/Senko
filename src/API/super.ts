import type { Guild, User } from "discord.js";
import type { ConfigTypes, GuildData, MarketItems, UserData } from "../types/SupabaseTypes";
import { createClient } from "@supabase/supabase-js";
import { Bitfield } from "bitfields";
import { winston, senkoClient } from "../SenkoClient";

export const Supabase = createClient(process.env["SUPABASE_URL"] as string, process.env["SUPABASE_KEY"] as string, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true
	}
});

/**
 * @deprecated
 */
export function fetchSupabaseApi(): typeof Supabase {
	return Supabase;
}

export async function fetchConfig(): Promise<ConfigTypes | null> {
	const { data, error } = await Supabase.from("config").select("*").eq("id", "all");

	if (error) {
		winston.log("fatal", `ERROR FETCHING CONFIG: ${error}`);
		return null;
	}

	if (data[0]) {
		return data[0] as ConfigTypes;
	}

	return null;
}

export async function fetchMarket(useLocal?: boolean): Promise<MarketItems> {
	const data = await fetchConfig();

	if (data) {
		if (useLocal) return require("../Data/Market/Backup.json");

		return data.MarketItems;
	}

	return require("../Data/Market/Backup.json");
}

export async function fetchSuperGuild(guild: Guild, makeGuild = true): Promise<GuildData | null> {
	const { data, error } = await Supabase.from("Guilds").select("*").eq("guildId", guild.id);

	if (error) {
		winston.log("fatal", `ERROR FETCHING GUILD DATA: ${error}`);
		return null;
	}

	if (data[0]) {
		return data[0] as GuildData;
	} else if (!data[0] && makeGuild) {
		return await makeSuperGuild(guild);
	}

	return null;
}

export async function makeSuperGuild(guild: Guild): Promise<GuildData | null> {
	const { error } = await Supabase.from("Guilds").insert([{
		guildId: guild.id,
		flags: new Bitfield(50).toHex()
	}]);

	if (error) {
		winston.log("fatal", `ERROR MAKING GUILD DATA: ${error}`);
		return null;
	}

	return await fetchSuperGuild(guild);
}

export async function updateSuperGuild(guild: Guild, Data: any): Promise<boolean> {
	Data = JSON.stringify({ guildId: guild.id, ...Data });

	const { error } = await Supabase.from("Guilds").upsert(JSON.parse(Data));

	if (error) {
		winston.log("fatal", `ERROR UPDATING GUILD DATA: ${error}`);
		return false;
	}

	return true;
}

export async function deleteSuperGuild(guild: Guild): Promise<void> {
	const { error } = await Supabase.from("Guilds").delete().eq("guildId", guild.id);

	if (error) {
		winston.log("fatal", `DELETING GUILD DATA FAILED FOR ${guild.id}: ${error}`);
		return;
	}

	winston.log("info", "Deleted guild data");
}

export async function fetchSuperUser(user: User, makeData = true): Promise<UserData | null> {
	const { data, error } = await Supabase.from("Users").select("*").eq("id", user.id);

	if (error) {
		winston.log("fatal", `ERROR FETCHING USER DATA: ${error}`);
		return null;
	}

	if (data[0]) {
		return data[0] as UserData;
	} else if (!data[0] && makeData) {
		return await makeSuperUser(user);
	}

	return null;
}

export async function makeSuperUser(user: User): Promise<UserData> {
	await Supabase.from("Users").insert([{ id: user.id }]);

	const { data } = await Supabase.from("Users").select("*").eq("id", user.id);

	return data![0] as UserData;
}

export async function updateSuperUser(user: User, Data: any): Promise<boolean> {
	if (Data.LocalUser && Data.LocalUser.profileConfig.Currency.Yen >= 100000) Data.LocalUser.profileConfig.Currency.Yen = 100000;
	if (Data.LocalUser && Data.LocalUser.profileConfig.Currency.Tofu >= 50) Data.LocalUser.profileConfig.Currency.Tofu = 50;

	const { error } = await Supabase.from("Users").update(Data).eq("id", typeof user !== "string" ? user.id : user);

	return !error;
}

export async function fetchLevel(user: User): Promise<any> {
	return (await fetchSuperUser(user))!.LocalUser.accountConfig.level;
}

export async function fetchAllGuilds(): Promise<GuildData[] | null> {
	const { data } = await Supabase.from("Guilds").select("*");

	return data as GuildData[];
}