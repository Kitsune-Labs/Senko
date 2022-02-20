const { deleteGuild } = require("../API/Master");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("guildDelete", async guild => {
            await deleteGuild(guild);
        });
    }
};
