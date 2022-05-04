const { fetchSupabaseApi } = require("../API/super.js");
const Supabase = fetchSupabaseApi();

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        // eslint-disable-next-line no-unused-vars
        const Status = [
            { "activities": [{ "name": "do you think Nakano wants to engulf in my tail again?" }] },
            { "activities": [{ "name": "/fluff" }] },
            { "activities": [{ "name": "Uya!" }] },
            { "activities": [{ "name": "Umu~ Umu~" }] },
            { "activities": [{ "name": "nom nom" }] },
            { "activities": [{ "name": "poof!" }] },
            { "activities": [{ "name": "/pat" }] },
            { "activities": [{ "name": "what is Nakano thinking?" }] },
            { "activities": [{ "name": "how much is fried tofu?" }] },
            { "activities": [{ "name": "ヾ(•ω•`)o" }] }
        ];

        async function switchActivity() {
            const { data } = await Supabase.from("config").select("*").eq("id", "all");

            SenkoClient.user.setPresence(data[0].activity[Math.floor(Math.random() * data[0].activity.length)]);
        }

        switchActivity();

        setInterval(switchActivity,  3600000);
    }
};
