// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const { updateUser } = require("../../API/Master");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

module.exports = {
    name: "about-me",
    desc: "Modify your about me message!",
    options: [
        {
            name: "change",
            description: "Update your about me message",
            type: 1,
            options: [
                {
                    name: "text",
                    description: "The text to change your about me message to",
                    value: "amt_update",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Remove your about me",
            type: 1
        }
    ],
    usableAnywhere: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const commandType = interaction.options.getSubcommand();
        await interaction.deferReply();

        if (commandType === "change") {
            await updateUser(interaction.user, {
                LocalUser: {
                    AboutMe: `${interaction.options._hoistedOptions[0].value}`
                }
            });

            await SenkoClient.channels.cache.get("957131449675423794").send({
                embeds: [
                    {
                        title: `${interaction.user.id} has updated their about me`,
                        description: `${interaction.options._hoistedOptions[0].value}`,
                        color: SenkoClient.colors.light
                    }
                ]
            });

            return interaction.followUp({
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
        }

        await updateUser(interaction.user, {
            LocalUser: {
                AboutMe: null
            }
        });

        interaction.followUp({
            embeds: [
                {
                    title: `${Icons.question}  I have removed your About Me ${interaction.user.username}`,
                    description: "But I am confused on why you would remove it!",
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/SenkoNervousSpeak.png", name: "image.png" }],
        });
    }
};