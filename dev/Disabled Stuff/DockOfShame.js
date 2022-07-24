// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../src/Data/Icons.json");

module.exports = {
	name: "dock-of-shame",
	desc: "To the dock of shame!",
	options: [
		{
			name: "user",
			description: "Someone",
			required: true,
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
		const user = interaction.options.getUser("user");

		interaction.reply({
			embeds: [
				{
					image: {
						url: encodeURI(`https://vacefron.nl/api/dockofshame?user=${user.displayAvatarURL({ format: "png" })}`)
					}
				}
			]
		});
	}
};