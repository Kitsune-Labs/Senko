// eslint-disable-next-line no-unused-vars
const { Guild, User } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");
const { Bitfield } = require("bitfields");
const { fatal } = require("@kitsune-labs/utilities");

const Supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
	autoRefreshToken: true,
	persistSession: true,
	detectSessionInUrl: true
});

/**
 * @returns {Supabase}
 */
function fetchSupabaseApi() {
	return Supabase;
}

/**
 * @async
 * @returns {Promise<JSON>}
 */
async function fetchConfig() {
	const { data } = await Supabase.from("config").select("*").eq("id", "all");

	return data[0];
}

/**
 * @async
 * @param {Boolean} useLocal
 * @returns {Promise<JSON>}
 */
async function fetchMarket(useLocal) {
	return useLocal ? require("../Data/LocalSave/Market.json") : (await fetchConfig()).MarketItems;
}

/**
 * @async
 * @param {Guild} guild
 * @returns {Promise<JSON>}
 */
async function fetchSuperGuild(guild) {
	let { data, error } = await Supabase.from("Guilds").select("*").eq("guildId", guild.id);

	if (error) return fatal(error.message);
	if (data[0] === undefined) return await makeSuperGuild(guild);

	return data[0];
}

/**
 * @async
 * @param {Guild} guild
 */
async function makeSuperGuild(guild) {
	await Supabase.from("Guilds").insert([
		{
			guildId: guild.id,
			flags: new Bitfield(50).toHex()
		}
	]);

	console.log("Created super guild");

	const { data } = await Supabase.from("Guilds").select("*").eq("guildId", guild.id);

	return data[0];
}

/**
 * @async
 * @param {Guild} guild
 * @param {JSON} Data
 */
async function updateSuperGuild(guild, Data) {
	Data = JSON.stringify({ guildId: guild.id, ...Data });

	const { error } = await Supabase.from("Guilds").upsert(JSON.parse(Data));

	if (error) {
		console.log(error);
		return false;
	}

	return true;
}

/**
 * @async
 * @param {Guild} guild
 */
async function deleteSuperGuild(guild) {
	await Supabase.from("Guilds").delete().eq("guildId", guild.id);

	console.log("Deleted super guild");
}

/**
 * @async
 * @param {User} user
 * @param {boolean} dontMakeData
 * @returns {Promise<JSON>}
 */
async function fetchSuperUser(user, dontMakeData) {
	const { data, error } = await Supabase.from("Users").select("*").eq("id", user.id);

	if (error || data[0] === undefined) {
		if (dontMakeData) return;
		return await makeSuperUser(user);
	}

	return data[0];
}

/**
 * @async
 * @param {User} user
 * @returns {Promise<JSON>}
 */
async function makeSuperUser(user) {
	await Supabase.from("Users").insert([{ id: user.id }]);

	const { data } = await Supabase.from("Users").select("*").eq("id", user.id);

	return data[0];
}

/**
 * @async
 * @param {User} user
 * @param {JSON} Data
 * @returns {Promise<boolean>}
 */
async function updateSuperUser(user, Data) {
	if (Data.LocalUser && Data.LocalUser.profileConfig.Currency.Yen >= 100000) Data.LocalUser.profileConfig.Currency.Yen = 100000;
	if (Data.LocalUser && Data.LocalUser.profileConfig.Currency.Tofu >= 50) Data.LocalUser.profileConfig.Currency.Tofu = 50;

	const { error } = await Supabase.from("Users").update(Data).eq("id", typeof user !== "string" ? user.id : user);

	return !error;
}


/**
 * @async
 * @param {User} user
 * @returns {Promise<JSON>}
 */
async function fetchLevel(user) {
	return (await fetchSuperUser(user)).LocalUser.accountConfig.level;
}

module.exports = {
	fetchSuperGuild,
	makeSuperGuild,
	updateSuperGuild,
	deleteSuperGuild,
	fetchSuperUser,
	makeSuperUser,
	updateSuperUser,
	fetchSupabaseApi,
	fetchConfig,
	fetchMarket,
	fetchLevel
};