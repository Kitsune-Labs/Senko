// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");

module.exports = {
    name: "pages",
    desc: "page test",
    options: [],
    userData: true,
    defer: true,
    usableAnywhere: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, { Inventory }) => {
        const math = Inventory % 2;

        interaction.followUp({ content: `${math}` });
    }
};