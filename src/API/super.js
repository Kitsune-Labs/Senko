// eslint-disable-next-line no-unused-vars
const { Guild } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");
const { Bitfield } = require("bitfields");
// const extend = require("extend");


const Supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
});

function fetchSupabaseApi() {
    return Supabase;
}

async function fetchConfig() {
    const { data } = await Supabase.from("config").select("*").eq("id", "all");

    return data[0];
}

/**
 * @deprecated
 */
async function fetchMarket() {
    return fetchConfig().MarketItems;
}

/**
 * @param {Guild} guild
 */
async function fetchSuperGuild(guild) {
    let { data, error } = await Supabase.from("Guilds").select("*").eq("guildId", guild.id);

    if (error || data[0] === undefined) return await makeSuperGuild(guild);

    return data[0];
}

/**
 * @param {Guild} guild
 */
async function makeSuperGuild(guild) {
    await Supabase.from("Guilds").insert([
        {
            guildId: guild.id,
            Channels: [],
            flags: new Bitfield(50).toHex(),
            WelcomeChannel: {
                message: {
                    embeds: [
                        {
                            title: "Welcome to _GUILD_ _USER_!",
                            description: "We hope you have fun in our server!",
                            color: "_ACCENT_",
                            thumbnail: {
                                url: "_AVATAR_"
                            }
                        }
                    ]
                },
                config: {
                    channel: null
                }
            },
            MessageLogs: null,
            ActionLogs: null,
            warns: {}
        }
    ]);

    console.log("Created super guild");

    const { data } = await Supabase.from("Guilds").select("*").eq("guildId", guild.id);

    return data[0];
}

/**
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
 * @param {Guild} guild
 */
async function deleteSuperGuild(guild) {
    await Supabase.from("Guilds").delete().eq("guildId", guild.id);

    console.log("Deleted super guild");
}


async function fetchSuperUser(user, dontMakeData) {
    const { data, error } = await Supabase.from("Users").select("*").eq("id", user.id);

    if (error || data[0] === undefined) {
        if (dontMakeData) return;
        return await makeSuperUser(user);
    }

    return data[0];
}

async function makeSuperUser(user) {
    await Supabase.from("Users").insert([{ id: user.id }]);

    console.log("Created super user");

    const { data } = await Supabase.from("Users").select("*").eq("id", user.id);

    return data[0];
}

/**
 * @deprecated
 */
async function updateSuperUser(user, Data) {
    // extend(true, currentData, Data);

    if (Data.Currency.Yen >= 100000) Data.Currency.Yen = 100000; // 99998
    if (Data.Currency.Tofu >= 50) Data.Currency.Tofu = 50;

    const { error } = await Supabase.from("Users").update(Data).eq("id", user.id);

    if (error) {
        console.log(error);
        return false;
    }

    return true;
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
};