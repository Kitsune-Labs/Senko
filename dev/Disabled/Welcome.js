// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
const { getGuild } = require("../../src/API/v2/FireData.js");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("guildMemberAdd", async (Member) => {
            const GuildData = await getGuild(Member.guild);
            console.log("New User");

            if (GuildData.WelcomeChannel.id != null) {
                console.log("Welcome Channel");
                SenkoClient.channels.cache.get(GuildData.WelcomeChannel.id).send(JSON.parse(GuildData.WelcomeChannel.message.replace("_USER_", Member.user)));
            }
        });
    }
};