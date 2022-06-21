// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");

module.exports = {
	name: "help",
	desc: "Help",
	defer: true,
	ephemeral: true,
	usableAnywhere: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
	start: async (SenkoClient, interaction) => {
		interaction.followUp({
			embeds: [
				{
					author: {
						name: "Index"
					},
					title: "📑 Messenger Index",
					description: `If you find an issue or want to suggest something please find us\n[in our community server!](https://discord.gg/senko)\n\nPing: ${Math.floor(SenkoClient.ws.ping)} ms\nUptime: Since <t:${Math.ceil((Date.now() - SenkoClient.uptime) / 1000)}> (<t:${Math.ceil((Date.now() - SenkoClient.uptime) / 1000)}:R>)\n\n≻ **Fun**\n≻ **Economy**\n≻ **Social**\n≻ **Administration**\n≻ **Account**`,
					color: SenkoClient.colors.random()
				}
			],
			components: [
				{
					type: 1,
					components: [
						{ type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: true },
						{ type: 2, label: "Fun", style: 3, custom_id: "help_fun" },
						{ type: 2, label: "Economy", style: 3, custom_id: "help_economy" },
						{ type: 2, label: "Social", style: 3, custom_id: "help_social" },
						{ type: 2, label: "Administration", style: 3, custom_id: "help_admin" }
					]
				},
				{
					type: 1,
					components: [
						{ type: 2, label: "Account", style: 3, custom_id: "help_account" }
					]
				},
				{
					type: 1,
					components: [
						{ type: 2, label: "Honorable Mentions", style: 2, custom_id: "honorable_mentions" },
						{ type: 2, label: "Invite me", style: 5, url: `https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=${SenkoClient.user.id}&permissions=137439266880` },
						{ type: 2, label: "Support and Community", style: 5, url: "https://senkosworld.com/discord" },
						{ type: 2, label: "Tutorials & docs", style: 5, url: "https://docs.senkosworld.com/", disabled: true }
					]
				}
			]
		});
	}
};