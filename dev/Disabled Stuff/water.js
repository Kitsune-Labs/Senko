// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");

module.exports = {
	name: "water",
	desc: "Water is 25 miles away",
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
	start: async (senkoClient, interaction, guildData, accountData) => {
		const text = interaction.options.get("text");

		interaction.reply({
			embeds: [
				{
					image: {
						url: encodeURI(`https://vacefron.nl/api/water?text=${text.value}`)
					}
				}
			]
		});
	}
};