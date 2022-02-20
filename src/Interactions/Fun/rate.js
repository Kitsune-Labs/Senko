const { spliceArray } = require("../../API/Master.js");

module.exports = {
    name: "rate",
    desc: "Rate something",
    options: [
        {
            name: "thing",
            description: "What should I rate?",
            type: 3,
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        const Item = interaction.options.getString("thing");

        const MessageBuild = {
            embeds: [
                {
                    title: "Let me think...",
                    description: "",
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [ { attachment: "./src/Data/content/senko/senko_think.png", name: "image.png" } ]
        };

        if (Item.toLowerCase() === "senko" || Item.toLowerCase() === "senko-san") {
            MessageBuild.embeds[0].title = "I don't need to think!";
            MessageBuild.embeds[0].description = "I'm obviously a 10/10! But Shiro, she is sneaky!";
            spliceArray(MessageBuild.files, 0);

            MessageBuild.files.push({ attachment: "./src/Data/content/senko/senko_bless.png", name: "image.png" });
        } else {
            MessageBuild.embeds[0].description = `I rate **${Item}** a ${Math.floor(Math.random() * 10)}/10!`;
        }

        interaction.reply(MessageBuild);
    }
};