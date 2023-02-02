// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType: CommandOption, ChannelType, ButtonStyle } = require("discord.js");
const faux = require("@kitsune-labs/faux");

module.exports = {
	name: "faux",
	desc: "Fox fooooxx",
	options: [
		{
			name: "translate",
			description: "Automatically decide for me",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "message",
					description: "The message that will be encoded or decoded with FAUX",
					type: CommandOption.String,
					required: true
				}
			]
		},
		{
			name: "encode",
			description: "Encode a FAUX message",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "message",
					description: "The message that will be encoded with FAUX",
					type: CommandOption.String,
					required: true
				}
			]
		},
		{
			name: "decode",
			description: "Decode a FAUX message",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "message",
					description: "The message that will be decoded with FAUX",
					type: CommandOption.String,
					required: true
				}
			]
		}
	],
	usableAnywhere: true,
	defer: true,
	ephemeral: true,
	category: "fun",
	/**
     * @param {CommandInteraction} interaction
     */
	start: async ({interaction}) => {
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