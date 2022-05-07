/* eslint-disable quotes */
// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { randomArray } = require("../API/Master.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async (interaction) => {
            if (!interaction.isButton()) return;
            if (interaction.message.embeds[0].footer.text !== interaction.user.tag) return;

            // eslint-disable-next-line no-unused-vars
            function disableComponents() {
                for (var component of interaction.message.components[0].components) {
                    component.disabled = true;
                }

                interaction.channel.messages.cache.get(interaction.message.id).edit({
                    components: interaction.message.components
                });
            }

            // Styles
                // 1 = Primary
                // 2 = Secondary
                // 3 = Success
                // 4 = Danger
                // 5 = Link

            const possibleResponses = {
                senko_talk_leave: [
                    {
                        embeds: [
                            {
                                title: "Senko-san",
                                description: `See you later!\n\nI wish we could talk together more ${interaction.user.username}...`,
                                color: SenkoClient.colors.dark,
                                thumbnail: { url: "attachment://image.png" },
                                footer: { text: interaction.user.tag }
                            }
                        ],
                        files: [{ attachment: "./src/Data/content/senko/bummed.png", name: "image.png" }],
                    },
                    {
                        embeds: [
                            {
                                title: "Senko-san",
                                description: `Have a good day ${interaction.user.username}!`,
                                color: SenkoClient.colors.dark,
                                thumbnail: { url: "attachment://image.png" },
                                footer: { text: interaction.user.tag }
                            }
                        ],
                        files: [{ attachment: "./src/Data/content/senko/happy.png", name: "image.png" }],
                    },
                    {
                        embeds: [
                            {
                                title: "Senko-san",
                                description: `Sayōnara ${interaction.user.username}!`,
                                color: SenkoClient.colors.dark,
                                thumbnail: { url: "attachment://image.png" },
                                footer: { text: interaction.user.tag }
                            }
                        ],
                        files: [{ attachment: "./src/Data/content/senko/happy.png", name: "image.png" }],
                    }
                ],
                senko_talk_1_hello: [
                    {
                        embeds: [
                            {
                                title: `${Icons.heart} Senko-san`,
                                description: "Well hello then!\n\nI hope you're having a great day!",
                                color: SenkoClient.colors.dark,
                                thumbnail: { url: "attachment://image.png"  },
                                footer: { text: interaction.user.tag }
                            }
                        ],
                        files: [{ attachment: "./src/Data/content/senko/happy.png", name: "image.png" }],
                    },
                ],
                senko_talk_1_hru: [
                    {
                        embeds: [
                            {
                                title: `Senko-san`,
                                description: "Im doing great; Thanks for asking!",
                                color: SenkoClient.colors.light,
                                thumbnail: { url: "attachment://image.png"  },
                                footer: { text: interaction.user.tag }
                            }
                        ],
                        files: [{ attachment: `./src/Data/content/senko/happy.png`, name: "image.png" }],
                        components: [
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Want to go shopping later?", style: 1, custom_id: "senko_talk_1_shop", emoji: Icons.question },
                                    { type: 2, label: "See you later!", style: 2, custom_id: "senko_talk_leave", emoji: "👋" },
                                ]
                            }
                        ]
                    },
                    {
                        embeds: [
                            {
                                title: `${Icons.tears} Senko-san`,
                                description: "Not so great, my favorite spoon broke...",
                                color: SenkoClient.colors.light,
                                thumbnail: { url: "attachment://image.png" },
                                footer: { text: interaction.user.tag }
                            }
                        ],
                        files: [{ attachment: `./src/Data/content/senko/SenkoNervousSpeak.png`, name: "image.png" }],
                        components: [
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Is there any way I can help?", style: 1, custom_id: "senko_talk_1_any_way", emoji: Icons.question },
                                    { type: 2, label: "Sorry I can't help...", style: 4, custom_id: "senko_talk_1_ch", emoji: Icons.tick },
                                ]
                            }
                        ]
                    }
                ],
                senko_talk_1_any_way: [
                    {
                        embeds: [
                            {
                                title: `Senko-san`,
                                description: "Sadly there isn't, unless you can somehow travel back to the past...",
                                color: SenkoClient.colors.dark,
                                thumbnail: { url: "attachment://image.png"  },
                                footer: { text: interaction.user.tag }
                            }
                        ],
                        files: [{ attachment: `./src/Data/content/senko/senko_think.png`, name: "image.png" }],
                    }
                ],
                senko_talk_1_ch: [
                    {
                        embeds: [
                            {
                                title: `Senko-san`,
                                description: "It's okay dear\n\nthere isn't a way to get another one like this anyways...",
                                color: SenkoClient.colors.dark,
                                thumbnail: { url: "attachment://image.png"  },
                                footer: { text: interaction.user.tag }
                            }
                        ],
                        files: [{ attachment: `./src/Data/content/senko/bummed.png`, name: "image.png" }]
                    }
                ],
            };

            if (Object.keys(possibleResponses).includes(interaction.customId)) {
                await interaction.reply(randomArray(possibleResponses[interaction.customId]));
                // disableComponents();
            }
        });
    }
};