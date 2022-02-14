// eslint-disable-next-line no-unused-vars
const { CommandInteraction, MessageAttachment } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "support",
    desc: "Support links, info, and other things.",
    no_data: true,
    /**
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
                        { name: "Contributors", value: "𝕃𝕒𝕫𝕣𝕖𝕒#1989\nsakuya izayoi#3553\nSilkthorne#3062\nKaori Aiko#6710\nTheReal_Enderboy#0999", inline: true },
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
                        { type: 2, label: "Invite me", style: 5, url: "https://discord.com/api/oauth2/authorize?client_id=777676015887319050&permissions=137439266880&scope=bot%20applications.commands", disabled: false },
                        { type: 2, label: "Submit an issue", style: 5, url: "https://github.com/Kitsune-Softworks/Senko-Issues/issues/new/choose" },
                        // { type: 2, label: "GitHub", style: 5, url: "https://github.com/Kitsune-Softworks/Senko" }
                    ]
                },
                {
                    type: "ACTION_ROW",
                    components: [
                        { type: 2, label: "Support and Community", style: 5, url: "https://discord.gg/senko" }
                    ]
                }
            ],
            ephemeral: true
        });
    }
};