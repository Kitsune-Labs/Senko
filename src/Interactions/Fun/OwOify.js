// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType: CommandOption, ChannelType, ButtonStyle } = require("discord.js");
const { owoify } = require("@kitsune-labs/utilities");

module.exports = {
	name: "owoify",
	desc: "UwU OwO",
	options: [
		{
			name: "text",
			description: "Text to OwOify",
			type: CommandOption.String,
			required: true
		}
	],
	usableAnywhere: true,
	category: "fun",
	/**
     * @param {CommandInteraction} interaction
     */
	start: async ({interaction}) => {
		interaction.reply({
			content: owoify(interaction.options.getString("text")),
			ephemeral: true
		});
	}
};