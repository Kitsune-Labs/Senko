// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");

module.exports = {
	name: "",
	desc: "",
	options: [],
	defer: false,
	ephemeral: false,
	usableAnywhere: false,
	category: "admin",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, guildData, userData}) => {

	}
};