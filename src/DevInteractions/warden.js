// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "warden",
	desc: "Warden test",
	options: [
		{
			name: "settings",
			description: "Warden settings",
			type: 1
		},
		{
			name: "new-member-logging",
			description: "New member logging",
			type: 2,
			options: [
				{
					name: "set-channel",
					description: "Set the member logging channel",
					type: 1
				},
				{
					name: "remove",
					description: "Remove the member logging channel",
					type: 1
				}
			]
		}
	],
	permissions: [PermissionFlagsBits.Administrator],
	usableAnywhere: true,
	category: "admin",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction}) => {
		const wardenData = require("../Data/PseudoWarden.json"); // guildData.warden;

		switch (interaction.options.getSubcommand()) {
		case "settings":
			await interaction.reply({
				embeds: [
					{
						title: "Warden settings",
						description: `When a user joins: \n > ${wardenData.settings.blockJoin ? `${wardenData.settings.joinPunishment} if there is a blocked word in their name` : "Do nothing"}`,
						color: senkoClient.api.Theme.light
					}
				],
				ephemeral: true
			});
			break;
		}
	}
};