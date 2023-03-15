import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "help",
	desc: "Information about commands.",
	defer: true,
	ephemeral: true,
	usableAnywhere: true,
	category: "utility",
	whitelist: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction}) => {
		interaction.followUp({
			embeds: [
				{
					author: {
						name: "Index"
					},
					title: "📑 Messenger Index",
					// @ts-expect-error
					description: `If you find an issue or want to suggest something please find us\n[in our community server!](https://discord.gg/senko)\n\n[Privacy Policy](https://senko.gg/privacy) - [Terms of Use](https://senko.gg/terms)\n\nPing: ${Math.floor(senkoClient.ws.ping)} ms\nUptime: Since <t:${Math.ceil((Date.now() - senkoClient.uptime) / 1000)}> (<t:${Math.ceil((Date.now() - senkoClient.uptime) / 1000)}:R>)\n\n≻ **Fun**\n≻ **Economy**\n≻ **Administration**\n≻ **Account**\n≻ **Utility**`,
					color: senkoClient.api.Theme.random()
				}
			],
			components: [
				{
					type: 1,
					components: [
						{ type: 2, label: "Home", style: 4, custom_id: "help:home", disabled: true },
						{ type: 2, label: "Fun", style: 3, custom_id: "help:fun" },
						{ type: 2, label: "Economy", style: 3, custom_id: "help:economy" },
						{ type: 2, label: "Administration", style: 3, custom_id: "help:admin" },
						{ type: 2, label: "Account", style: 3, custom_id: "help:account", disabled: false }
					]
				},
				{
					type: 1,
					components: [
						{ type: 2, label: "Utility", style: 3, custom_id: "help:utility", disabled: false }
					]
				},
				{
					type: 1,
					components: [
						{ type: 2, label: "Honorable Mentions", style: 2, custom_id: "honorable_mentions" },
						{ type: 2, label: "Invite me", style: 5, url: `https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=${senkoClient.user?.id}&permissions=137439266880` },
						{ type: 2, label: "Support and Community", style: 5, url: "https://senkosworld.com/discord" }
						//{ type: 2, label: "Tutorials & docs", style: 5, url: "https://docs.senkosworld.com/", disabled: true }
					]
				}
			]
		});
	}
} as SenkoCommand;