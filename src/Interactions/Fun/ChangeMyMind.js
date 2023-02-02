// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType: CommandOption, ChannelType, ButtonStyle } = require("discord.js");
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
			type: CommandOption.String
		}
	],
	category: "fun",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction}) => {
		interaction.reply({
			embeds: [
				{
					image: {
						url: encodeURI(`https://vacefron.nl/api/changemymind?text=${interaction.options.get("text").value}`)
					},
					color: senkoClient.api.Theme.light
				}
			]
		});
	}
};