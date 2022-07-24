// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

module.exports = {
	name: "drip",
	desc: "Yo, that drip!",
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
			content: encodeURI(`https://vacefron.nl/api/drip?user=${user.displayAvatarURL({ format: "png" })}`)
		});
	}
};