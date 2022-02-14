/* eslint-disable */

const { CommandInteraction } = require("discord.js");
const Icons = require("../Data/Icons.json");
const { stringEndsWithS } = require("../API/Master.js");

module.exports = {
    name: `inventory_revamp`,
    desc: `Inventory Revamp`,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        interaction.reply({
            embeds: [
                {
                    author: {
                        name: `${stringEndsWithS(interaction.user.username)} Inventory`,
                    },
                    description: `Home`,
                }
            ]
        });
    }
};