const { CommandInteraction } = require("discord.js");
const Icons = require("../Data/Icons.json");
const { addYen } = require("../API/v2/Currency.js");

module.exports = {
    name: "pamper",
    desc: "Be pampered by Senko",
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        // addYen(interaction.user, 50);

        interaction.reply({
            embeds: [
                {
                    title: "Pampered!",
                    description: `You have been pampered by Senko!\n\n— ${Icons.yen}  50x added`,
                    color: SenkoClient.colors.light,
                }
            ]
        });
    }
};