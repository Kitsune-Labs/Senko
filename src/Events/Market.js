// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { print } = require("../API/Master.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");


module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async interaction => {
            if (interaction.isButton()) {
                // console.log(interaction);

                // console.log(interaction.message.prototype);
            }
        });
    }
};