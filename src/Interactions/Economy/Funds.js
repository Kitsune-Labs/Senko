const Icons = require("../../Data/Icons.json");

module.exports = {
    name: "funds",
    desc: "View the amount of currency you have saved",
    userData: true,
    options: [
        {
            name: "hidden",
            description: "Optionally show other people your funds (Default: True)",
            type: 5,
            default: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { Currency }) => {
        const IsPrivate = interaction.options.getBoolean("hidden");

        if (IsPrivate === true || IsPrivate === null) {
            interaction.reply({
                embeds: [
                    {
                        title: `${Icons.heart}  Here are your funds dear, Spend them wisely!`,
                        fields: [
                            { name: `${Icons.yen} Yen`, value: `${Currency.Yen}x` },
                            { name: `${Icons.tofu} Tofu`, value: `${Currency.Tofu}x` }
                        ],
                        color: SenkoClient.colors.light,
                        thumbnail: {
                            url: "attachment://image.png"
                        }
                    }
                ],
                files: [  { attachment: "./src/Data/content/senko/senko_hat_tip.png", name: "image.png" }],
                ephemeral: true
            });
        } else {
            interaction.reply({
                embeds: [
                    {
                        title: `${Icons.heart}  Here are your funds dear, Spend them wisely!`,
                        fields: [
                            { name: `${Icons.yen} Yen`, value: `${Currency.Yen}x` },
                            { name: `${Icons.tofu} Tofu`, value: `${Currency.Tofu}x` }
                        ],
                        color: SenkoClient.colors.light,
                        thumbnail: {
                            url: "attachment://image.png"
                        }
                    }
                ],
                files: [  { attachment: "./src/Data/content/senko/senko_hat_tip.png", name: "image.png" }]
            });
        }
    }
};