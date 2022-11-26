// eslint-disable-next-line no-unused-vars
const { Client, Interaction, PermissionFlagsBits } = require("discord.js");
const { Bitfield } = require("bitfields");
const bits = require("../../API/Bits.json");

module.exports = {
	name: "clean",
	desc: "clean",
	usableAnywhere: true,
	category: "admin",
	defer: true,
	ephemeral: true,
	permissions: ["ManageMessages"],
	options: [
		{
			name: "amount",
			description: "The amount of messages to delete",
			required: true,
			type: 10,
			minValue: 1,
			maxValue: 100
		}
	],
	whitelist: true,

	/**
     * @param {Client} senkoClient
     * @param {Interaction} interaction
     */
	start: async ({senkoClient, interaction, guildData}) => {
		if (!Bitfield.fromHex(guildData.flags).get(bits.BETAs.ModCommands)) return interaction.followUp({
			content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`"
		});

		if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.followUp({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't manage messsages! (Make sure I have the \"Manage Messages\" permission)",
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}
			]
		});

		if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.followUp({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to manage messages to use this!",
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}
			]
		});

		const amount = interaction.options.getNumber("amount");

		interaction.channel.bulkDelete(amount).then((data) => {
			interaction.followUp({
				content: data.size > 1 ? `I have removed ${data.size} messages` : `I have removed ${data.size} message`
			});
		}).catch(error => {
			interaction.followUp({
				content: `There was an error!\n\n__${error}__`
			});
		});
	}
};