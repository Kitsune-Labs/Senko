// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../src/Data/Icons.json");

module.exports = {
	name: "stonks",
	desc: "Stonkify yourself! Or someone else...",
	options: [
		{
			name: "user",
			description: "Someone",
			type: 6
		}
	],
	category: "fun",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (senkoClient, interaction, guildData, accountData) => {
		const user = interaction.options.getUser("user") || interaction.user;

		interaction.reply({
			content: encodeURI(`https://vacefron.nl/api/stonks?user=${user.displayAvatarURL({ format: "png" })}`)
		});
	}
};