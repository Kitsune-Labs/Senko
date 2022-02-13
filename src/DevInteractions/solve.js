
// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client, MessageActionRow, MessageSelectMenu } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");
const math = require("../API/modules/mathjs");

module.exports = {
    name: "solve",
    desc: "Solve a math problem",
    options: [
        {
            name: "problem",
            description: "The problem to solve",
            required: true,
            type: "STRING"
        }
    ],
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    start: async (SenkoClient, interaction) => {
        const problem = interaction.options.getString("problem");

        interaction.reply({
            embeds: [
                {
                    fields: [
                        { name: "How would you like to solve", value: `${problem}`, inline: true },
                    ],
                    footer: {
                        text: "Don't expect this to work or be finished"
                    },
                    color: SenkoClient.colors.light
                }
            ],
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "SELECT_MENU",
                            options: [
                                { label: "Simplify", value: "solve_simplify", description: "Simplify" },
                                { label: "Derivative", value: "solve_derivative", description: "Derivative" }
                            ],
                            customId: "solve_simplify",
                            placeholder: "Select an option"
                        }
                    ]
                }
            ]
        });
    }
};