const { Client, Message, MessageAttachment } = require("discord.js");
const Icons = require("../../../src/Data/Icons.json");

module.exports = {
    name: `spook`,
    desc: `AAAAAAAAAAAAAAA`,
    cat: ["senko"],

    /**
     * @param {Client} SenkoClient
     * @param {Message} message
     */
    run: async (SenkoClient, message, args) => {
        message.reply({
            embeds: [
                {
                    title: `Boo ${Icons.exclamation}`,
                    image: {
                        url: `https://media.discordapp.net/attachments/889284097841717258/898649644870012968/Boo.png`
                    },
                    color: SenkoClient.colors.random()
                }
            ]
        });
    }
};