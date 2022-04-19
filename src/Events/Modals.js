// eslint-disable-next-line no-unused-vars
const { Client, WebhookClient } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { print, updateUser } = require("../API/Master.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");

const fetch = require("node-fetch");

const { ActionRow, TextInputComponent, TextInputStyle, Modal, ModalActionRowComponent } = require("discord.js");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionTextInput", async (interaction) => {
            await interaction.deferReply();

            switch(interaction.customId) {
                case "submit_suggestion":
                    fetch("https://canary.discord.com/api/webhooks/940774968868880384/UPrHLI2DbmsUgbV5CSFn2gLWKVm4z6IINIOlp5sWFwFAIX49-ANhESPMebpWZ2wKNk_9", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            username: `${interaction.user.tag} [${interaction.user.id}]`,
                            avatar_url: interaction.user.displayAvatarURL({ dynamic: true }),
                            content: "** **",
                            embeds: [
                                {
                                    title: "Suggestion",
                                    description: `${interaction.fields[0].value}`,
                                    color: SenkoClient.colors.dark
                                }
                            ]
                        })
                    });

                    await interaction.editReply({
                        embeds: [
                            {
                                title: `${Icons.check}  Suggestion Submitted!`,
                                description: `Your suggestion: \n\n${interaction.fields[0].value}`,
                            }
                        ]
                    });
                break;

                case "submit_about_me":
                    await updateUser(interaction.user, {
                        LocalUser: {
                            AboutMe: `${interaction.fields[0].value}`
                        }
                    });

                    await interaction.editReply({
                        embeds: [
                            {
                                title: `${Icons.exclamation}  I have updated your About Me ${interaction.user.username}`,
                                description: "Check it out with **/profile**",
                                color: SenkoClient.colors.light,
                                thumbnail: {
                                    url: "attachment://image.png"
                                }
                            }
                        ],
                        files: [{ attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" }],
                    });
                break;

                default:
                    interaction.editReply({
                        embeds: [
                            {
                                title: `${Icons.tick}  Error`,
                                description: "I was unable to submit your content",
                                color: SenkoClient.colors.dark,
                                thumbnail: {
                                    url: "attachment://image.png"
                                }
                            }
                        ],
                        files: [{ attachment: "./src/Data/content/senko/SenkoNervousSpeak.png", name: "image.png" }],
                    });
            }
        });
    }
};