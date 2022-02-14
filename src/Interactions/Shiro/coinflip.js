const { CommandInteraction } = require("discord.js");
const Icons = require("../../Data/Icons.json");
const { wait } = require("../../API/Master.js");
const { addYen } = require("../../API/v2/Currency");

module.exports = {
    name: "coinflip",
    desc: "Play a game of coinflip with Shiro.",
    options: [
        {
            name: "choice",
            description: "You can choose heads or tails.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "heads",
                    value: "heads"
                },
                {
                    name: "tails",
                    value: "tails"
                }
            ]
        }
    ],
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        await interaction.reply({
            embeds: [
                {
                    title: "Ding!",
                    description: "Shiro flipped the coin and we're now anticipating the outcome.",
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "https://media.discordapp.net/attachments/889284097841717258/928522212980453396/ShiroSmug.png"
                    }
                }
            ],
            fetchReply: true
        });

        const Choices = {
            "0": "heads",
            "1": "tails",
            "heads": "0",
            "tails": "1"
        };

        const RNG = Math.floor(Math.random() * 2);
        const UserChoice = interaction.options.getString("choice");

        await wait(2000);

        if (Choices[RNG] === UserChoice) {
            interaction.editReply({
                embeds: [
                    {
                        title: "Thunk!",
                        description: "The coin flipped and the outcome is...\n\nA tie!?!?",
                        color: SenkoClient.colors.dark,
                        thumbnail: {
                            url: "https://media.discordapp.net/attachments/889284097841717258/928522212745556018/hamster.png"
                        }
                    }
                ]
            });
        }

        if (RNG > Choices[UserChoice]) {
            interaction.editReply({
                embeds: [
                    {
                        title: "Bonk!",
                        description: "The coin flipped and the outcome is...\n\nShiro won...",
                        color: SenkoClient.colors.dark,
                        thumbnail: {
                            url: "https://media.discordapp.net/attachments/889284097841717258/928522213198532648/superior.png"
                        }
                    }
                ]
            });
        }

        if (RNG < Choices[UserChoice]) {
            await addYen(interaction.user, 30);
            interaction.editReply({
                embeds: [
                    {
                        title: "Ting!",
                        description: `The coin flipped and the outcome is...\n\nYou won!\n\n— ${Icons.yen}  30x added`,
                        color: SenkoClient.colors.light,
                        thumbnail: {
                            url: "https://media.discordapp.net/attachments/889284097841717258/928522212745556018/hamster.png"
                        }
                    }
                ]
            });
        }
    }
};