const { deleteSuperGuild } = require("../API/super.js");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("guildDelete", async guild => {
            await deleteSuperGuild(guild);
        });
    }
};
