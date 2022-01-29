const Icons = require("../../Data/Icons.json");
const { addYen } = require("../../../src/API/v2/Currency.js");


module.exports = {
    name: "eat",
    desc: "nom nom nom",
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        await addYen(interaction.user, 10);

        interaction.reply({
            embeds: [
                {
                    title: "Umu Umu",
                    description: `You have something to eat with Senko\n\n— ${Icons.yen}  10x added`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [ { attachment: "./src/Data/content/senko/SenkoEat.png", name: "image.png" } ]
        });
    }
};