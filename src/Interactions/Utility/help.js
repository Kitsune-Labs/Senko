// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "help",
    desc: "Help",
    defer: true,
    usableAnywhere: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    start: async (SenkoClient, interaction) => {
        interaction.followUp({
            embeds: [
                {
                    author: {
                        name: "Index",
                    },
                    title: "📑 Messenger Index (Help)",
                    description: "If you find an issue or want to suggest something please find us\n[in our community server!](https://discord.gg/senko)\n\n≻ **Fun**\n≻ **Economy**\n≻ **Social**\n≻ **Administration**\n≻ **Account**",
                    color: SenkoClient.colors.random()
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        { type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: true },
                        { type: 2, label: "Fun", style: 2, custom_id: "help_fun" },
                        { type: 2, label: "Economy", style: 2, custom_id: "help_economy" },
                        { type: 2, label: "Social", style: 2, custom_id: "help_social" },
                        { type: 2, label: "Administration", style: 2, custom_id: "help_admin" }
                    ]
                },
                {
                    type: 1,
                    components: [
                        { type: 2, label: "Account", style: 2, custom_id: "help_account" }
                    ]
                }
            ]
        });
    }
};