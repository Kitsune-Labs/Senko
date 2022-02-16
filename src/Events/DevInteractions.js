/* eslint-disable */

//? Used in discord.gg/senko

const { Client } = require("discord.js");
const Icons = require("../Data/Icons.json");
const { print } = require("../API/Master.js");
const fs = require("fs");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        const ServerCommands = SenkoClient.guilds.cache.get("777251087592718336").commands;
        // await ServerCommands.set([]);


        for (var file of fs.readdirSync("./src/DevInteractions/")) {
            const pull = require(`../DevInteractions/${file}`);

            await SenkoClient.SlashCommands.set(`${pull.name}`, pull);

            try {
                const CommandData = {
                    name: `${pull.name}`,
                    description: pull.desc || "No description",
                };

                if (pull.options) CommandData.options = pull.options;

                await ServerCommands.create(CommandData);
                print("#FFA72B", "DEV SETUP", `Running ${pull.name}`);
            } catch(e) {
                print("#FF762B", "DEV ERROR", `${pull} - ${e}`);
                console.log(e);
            }
        }
    }
};
