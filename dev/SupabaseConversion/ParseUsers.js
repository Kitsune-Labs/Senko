require("dotenv/config");
const guildData = require("./guilds.json");
// eslint-disable-next-line no-unused-vars
const { Guild } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");


const Supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
});

(async () => {
    for (var guild of guildData) {
        const { data, error } = await Supabase.from("Users").insert([
            {
                guildId: guild.ID,
                WelcomeChannel: guild.WelcomeChannel,
                flags: guild.flags
            }
        ]);

        if (error) console.log("Error: " + error);

        console.log("Done");
    }
})();

// {"id":null,"message":null}