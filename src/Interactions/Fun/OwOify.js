const { owoify } = require("../../API/modules/owoify");

module.exports = {
    name: "owoify",
    desc: "UwU OwO",
    options: [
        {
            name: "text",
            description: "Text to OwOify",
            type: 3,
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        interaction.reply({
            content: owoify(interaction.options.getString("text"))
        });
    }
};