const { deleteGuild } = require("../API/v4/Fire");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("guildDelete", async guild => {
            await deleteGuild(guild);
            console.log("Finished Guild Removal");
        });
    }
};
