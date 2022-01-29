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
                        { name: "Uptime", value: `${ms(SenkoClient.uptime, { long: true })}`, inline: true }
                    ],
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],

            files: [ new MessageAttachment("./src/Data/content/senko/senko_hat_huh.png", "image.png")],

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
                        { type: 2, label: "Support Server (Kitsune Softworks)", style: 5, url: "https://discord.gg/kitsune-softworks" },
                        { type: 2, label: "Community Server (Senko's World!)", style: 5, url: "https://discord.gg/senko" }
                    ]
                }
            ],
            ephemeral: true
        });
    }
};