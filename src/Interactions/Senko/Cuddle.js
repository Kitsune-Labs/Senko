const { MessageAttachment } = require("discord.js");
const { addYen } = require("../../../src/API/v2/Currency.js");
const Icons = require("../../Data/Icons.json");

module.exports = {
    name: "cuddle",
    desc: "Cuddle with Senko!",
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        addYen(interaction.user, 10);

        interaction.reply({
            embeds: [
                {
                    title: "ZZzzzz",
                    color: SenkoClient.colors.light,
                    description: `You cuddle with Senko.\n\n— ${Icons.yen}  10x added`,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [ new MessageAttachment("./src/Data/content/senko/cuddle.png", "image.png")]
        });
    }
};