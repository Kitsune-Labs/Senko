import type { Guild, User } from "discord.js";
import type { ConfigTypes, GuildData, UserData } from "../types/SupabaseTypes";
import { createClient } from "@supabase/supabase-js";
import { Bitfield } from "bitfields";
import { fatal } from "@kitsune-labs/utilities";

// @ts-ignore
export const Supabase = createClient(process.env["SUPABASE_URL"], process.env["SUPABASE_KEY"], {
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

export async function fetchConfig(): Promise < ConfigTypes > {
	const { data } = await Supabase.from("config").select("*").eq("id", "all");

	return data![0];
}

export async function fetchMarket(useLocal?: boolean): Promise < any > {
	return useLocal ? require("../Data/LocalSave/Market.json") : (await fetchConfig()).MarketItems;
}

export async function fetchSuperGuild(guild: Guild, makeNewGuild = true): Promise < GuildData | null > {
	const { data, error } = await Supabase.from("Guilds").select("*").eq("guildId", guild.id);

	if (error) {
		fatal(error.message);
		return null;
	}

	if (data![0] === undefined && makeNewGuild) {
		return await makeSuperGuild(guild);
	} else if (data![0] === undefined && !makeNewGuild) {
		return null;
	}

	return data![0];
}

export async function makeSuperGuild(guild: Guild): Promise < GuildData > {
	await Supabase.from("Guilds").insert([{
		guildId: guild.id,
		flags: new Bitfield(50).toHex()
	}]);

	console.log("Created super guild");

	const { data } = await Supabase.from("Guilds").select("*").eq("guildId", guild.id);

	return data![0];
}

export async function updateSuperGuild(guild: Guild, Data: any): Promise < boolean > {
	Data = JSON.stringify({ guildId: guild.id, ...Data });

	const { error } = await Supabase.from("Guilds").upsert(JSON.parse(Data));

	if (error) {
		console.log(error);
		return false;
	}

	return true;
}

export async function deleteSuperGuild(guild: Guild): Promise < void > {
	await Supabase.from("Guilds").delete().eq("guildId", guild.id);

	console.log("Deleted super guild");
}

export async function fetchSuperUser(user: User, dontMakeData = false): Promise < UserData | null > {
	const { data, error } = await Supabase.from("Users").select("*").eq("id", user.id);

	if (error || data[0] === undefined) {
		if (dontMakeData) return null;
		return await makeSuperUser(user);
	}

	return data[0];
}

export async function makeSuperUser(user: User): Promise < UserData > {
	await Supabase.from("Users").insert([{ id: user.id }]);

	const { data } = await Supabase.from("Users").select("*").eq("id", user.id);

	return data![0];
}

export async function updateSuperUser(user: User, Data: any): Promise < boolean > {
	if (Data.LocalUser && Data.LocalUser.profileConfig.Currency.Yen >= 100000) Data.LocalUser.profileConfig.Currency.Yen = 100000;
	if (Data.LocalUser && Data.LocalUser.profileConfig.Currency.Tofu >= 50) Data.LocalUser.profileConfig.Currency.Tofu = 50;

	const { error } = await Supabase.from("Users").update(Data).eq("id", typeof user !== "string" ? user.id : user);

	return !error;
}

export async function fetchLevel(user: User): Promise < any > {
	return (await fetchSuperUser(user)) !.LocalUser.accountConfig.level;
}

export async function fetchAllGuilds(): Promise <GuildData[] | null> {
	const { data } = await Supabase.from("Guilds").select("*");

	return data as GuildData[];
}