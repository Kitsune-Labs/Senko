// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
const { Bitfield } = require("bitfields");
const { CheckPermission } = require("../../API/Master.js");
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

	/**
     * @param {Client} SenkoClient
     * @param {Interaction} interaction
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, AccountData) => {
		if (!Bitfield.fromHex(GuildData.flags).get(bits.BETAs.ModCommands)) return interaction.followUp({
			content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`"
		});

		if (!CheckPermission(interaction.guild, "ManageMessages")) return interaction.followUp({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't manage messsages! (Make sure I have the \"Manage Messages\" permission)",
					color: SenkoClient.colors.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}
			]
		});

		if (!interaction.member.permissions.has("ManageMessages")) return interaction.followUp({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to manage messages to use this!",
					color: SenkoClient.colors.dark,
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