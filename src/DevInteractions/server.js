// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");

module.exports = {
	name: "server",
	desc: "Server related stuff",
	options: [
		{
			name: "settings",
			description: "Change the server settings",
			type: 1
		}
	],
	defer: false,
	ephemeral: false,
	usableAnywhere: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, guildData, userData}) => {

	}
};