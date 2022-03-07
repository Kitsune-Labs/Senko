// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "support",
    desc: "Support links, info, and other things.",
    /**
     * @param {Client} SenkoClient
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        interaction.reply({
            embeds: [
                {
                    title: "Hello, I'm Senko-san, a divine messenger Kitsune!",
                    description: "I am here to pamper to your hearts content!",
                    color: SenkoClient.colors.dark,
                    fields: [
                        { name: "Uptime", value: `${ms(SenkoClient.uptime, { long: true })}`, inline: true },
                        { name: "Websocket Ping", value: `${Math.floor(SenkoClient.ws.ping)}`, inline: true },
                        { name: "Contributors", value: "𝕃𝕒𝕫𝕣𝕖𝕒\nsakuya izayoi\nSilkthorne\nKaori Aiko\nTheReal_Enderboy", inline: true },
                    ],
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],

            files: [ { attachment: "./src/Data/content/senko/senko_hat_huh.png", name: "image.png" } ],

            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        { type: 2, label: "Invite me", style: 5, url: "https://senkosworld.com/invite", disabled: false },
                        { type: 2, label: "Submit an issue", style: 5, url: "https://github.com/Kitsune-Softworks/Senko-Issues/issues/new/choose" },
                        // { type: 2, label: "GitHub", style: 5, url: "https://github.com/Kitsune-Softworks/Senko" }
                    ]
                },
                {
                    type: "ACTION_ROW",
                    components: [
                        { type: 2, label: "Support and Community", style: 5, url: "https://senkosworld.com/discord" },
                        // { type: 2, label: "Support and Community", style: 5, url: "https://senkosworld.com/discord" }
                    ]
                }
            ],
            ephemeral: true
        });
    }
};