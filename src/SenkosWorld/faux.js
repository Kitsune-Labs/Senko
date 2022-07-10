// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const faux = require("@kitsune-labs/faux");

module.exports = {
	name: "faux",
	desc: "Fox fooooxx",
	options: [
		{
			name: "translate",
			description: "translate",
			type: 1,
			options: [
				{
					name: "message",
					description: "The message that will be encoded or decoded with FAUX",
					type: "STRING",
					required: true
				}
			]
		},
		{
			name: "encode",
			description: "encode",
			type: 1,
			options: [
				{
					name: "message",
					description: "The message that will be encoded with FAUX",
					type: "STRING",
					required: true
				}
			]
		},
		{
			name: "decode",
			description: "decode",
			type: 1,
			options: [
				{
					name: "message",
					description: "The message that will be decoded with FAUX",
					type: "STRING",
					required: true
				}
			]
		}
	],
	usableAnywhere: true,
	defer: true,
	ephemeral: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (senkoClient, interaction, guildData, accountData) => {
		switch(interaction.options.getSubcommand()) {
		case "translate":
			interaction.followUp({
				content: faux.translate(interaction.options.getString("message"))
			});
			break;
		case "encode":
			interaction.followUp({
				content: faux.encode(interaction.options.getString("message"))
			});
			break;
		case "decode":
			interaction.followUp({
				content: faux.decode(interaction.options.getString("message"))
			});
			break;
		}
	}
};