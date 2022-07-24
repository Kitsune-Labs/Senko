// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

module.exports = {
	name: "change-my-mind",
	desc: "Change my mind about this!",
	options: [
		{
			name: "text",
			description: "text",
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
		interaction.reply({
			content: encodeURI(`https://vacefron.nl/api/changemymind?text=${interaction.options.get("text").value}`)
		});
	}
};