// eslint-disable-next-line no-unused-vars
const { Client, Message, MessageAttachment } = require("discord.js");
const Icons = require("../../../src/Data/Icons.json");

module.exports = {
	name: "spook",
	desc: "AAAAAAAAAAAAAAA",
	cat: ["senko"],

	/**
     * @param {Client} SenkoClient
     * @param {Message} message
     */
	// eslint-disable-next-line no-unused-vars
	run: async (SenkoClient, message, args) => {
		message.reply({
			embeds: [
				{
					title: `Boo ${Icons.exclamation}`,
					image: {
						url: "https://media.discordapp.net/attachments/889284097841717258/898649644870012968/Boo.png"
					},
					color: SenkoClient.api.Theme.random()
				}
			]
		});
	}
};