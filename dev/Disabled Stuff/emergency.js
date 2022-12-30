// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");

module.exports = {
	name: "emergency",
	desc: "Emergency meeting!",
	options: [
		{
			name: "text",
			description: "Why?",
			required: true,
			type: 3
		}
	],
	category: "fun",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async ({interaction}) => {
		const text = interaction.options.get("text");

		interaction.reply({
			embeds: [
				{
					image: {
						url: encodeURI(`https://vacefron.nl/api/emergencymeeting?text=${text.value}`)
					}
				}
			]
		});
	}
};