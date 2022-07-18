// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { Bitfield } = require("bitfields");
const { CheckPermission } = require("../../API/Master.js");
const bits = require("../../API/Bits.json");

module.exports = {
	name: "slowmode",
	desc: "Change the slowmode of a channel",
	options: [
		{
			name: "set",
			description: "Set the slowmode",
			type: 1,
			options: [
				{
					name: "seconds",
					description: "How long should the slowmode be in seconds",
					required: true,
					type: 10,
					minValue: 1,
					maxValue: 21600
				}
			]
		},
		{
			name: "remove",
			description: "Remove this channel's slowmode",
			type: 1
		}
	],
	usableAnywhere: true,
	category: "admin",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, AccountData) => {
		if (!Bitfield.fromHex(GuildData.flags).get(bits.BETAs.ModCommands)) return interaction.reply({
			content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`",
			ephemeral: true
		});

		if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to manage channels to use this!",
					color: SenkoClient.colors.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/huh.png"
					}
				}
			],
			ephemeral: true
		});

		if (!CheckPermission(interaction, "MANAGE_CHANNELS")) return interaction.followUp({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't manage channels! (Make sure I have the \"Manage Channels\" permission)",
					color: SenkoClient.colors.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		await interaction.deferReply();

		const time = interaction.options.getNumber("seconds");

		switch (interaction.options.getSubcommand()) {
		case "set":
			interaction.channel.setRateLimitPerUser(time).then(() => {
				interaction.followUp({
					embeds: [
						{
							title: `${Icons.exclamation} Alright dear!`,
							description: `I've set the channel slowmode to ${time} seconds!`,
							color: SenkoClient.colors.light,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/hat_tip.png" }
						}
					],
					ephemeral: true
				});
			});
			break;
		case "remove":
			interaction.channel.setRateLimitPerUser(0).then(() => {
				interaction.followUp({
					embeds: [
						{
							title: `${Icons.exclamation} Alright dear!`,
							description: "I've removed the channel slowmode!",
							color: SenkoClient.colors.light,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/what.png" }
						}
					],
					ephemeral: true
				});
			});
			break;
		}
	}
};