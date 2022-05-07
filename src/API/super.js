// eslint-disable-next-line no-unused-vars
const { Guild } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");
const { Bitfield } = require("bitfields");

const Supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
});

function fetchSupabaseApi() {
    return Supabase;
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

    const { data, error } = await Supabase.from("Guilds").upsert(JSON.parse(Data));

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

module.exports = {
    fetchSuperGuild,
    makeSuperGuild,
    updateSuperGuild,
    deleteSuperGuild,
    fetchSupabaseApi
};