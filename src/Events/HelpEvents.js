// eslint-disable-next-line no-unused-vars
const { default: axios } = require("axios");
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { print, wait } = require("../API/Master.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");




module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	execute: async (SenkoClient) => {
		const bottomButtons = {
			type: 1,
			components: [
				{ type: 2, label: "Honorable Mentions", style: 2, custom_id: "honorable_mentions" },
				{ type: 2, label: "Invite me", style: 5, url: `https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=${SenkoClient.user.id}&permissions=137439266880` },
				{ type: 2, label: "Support & Community", style: 5, url: "https://senkosworld.com/discord" },
				{ type: 2, label: "Tutorials & docs", style: 5, url: "https://docs.senkosworld.com/", disabled: true }
			]
		};

		const contributorIds = [
			"806732697652822028", // 𝕃𝕒𝕫𝕣𝕖𝕒
			"899381978791559218", // sakuya izayoi
			"683181180371468364", // Eve
			"782075669165113355", // Kaori Aiko
			"776844036530241537", // TheReal_Enderboy
			"643530439239401472" // Tat2feuille
		];

		const contributors = [];

		for (var id of contributorIds) {
			axios({
				method: "GET",
				url: `https://discord.com/api/users/${id}`,
				headers: {
					"User-Agent": SenkoClient.tools.UserAgent,
					"Authorization": `Bot ${SenkoClient.token}`
				}
			}).then(response => {
				contributors.push(response.data.username);
			});
		}

		/**
         * @param {CommandInteraction} interaction
         */
		SenkoClient.on("interactionCreate", (interaction) => {
			if (!interaction.isButton()) return;

			switch (interaction.customId) {
			case "help_home":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index"
							},
							title: "📄 Messenger Index",
							description: `If you find an issue or want to suggest something please find us\n[in our community server!](https://discord.gg/senko)\n\nPing: ${Math.floor(SenkoClient.ws.ping)} ms\nUptime: Since <t:${Math.ceil((Date.now() - SenkoClient.uptime) / 1000)}> (<t:${Math.ceil((Date.now() - SenkoClient.uptime) / 1000)}:R>)\n\n≻ **Fun**\n≻ **Economy**\n≻ **Social**\n≻ **Administration**\n≻ **Account**`,
							color: SenkoClient.colors.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 1, custom_id: "help_home", disabled: true },
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
						bottomButtons
					]
				});
				break;
			case "help_fun":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Fun"
							},
							title: "📑 Fun Commands",
							description: "≻ **Fluff** — Mofumofu!\n≻ **Pat** — Pat Senko's Head (Don't touch her ears!)\n≻ **Hug** — Hug Senko-san or another kitsune in your guild!\n≻ **Cuddle** — Cuddle with Senko-san!\n≻ **Drink** — Have Senko-san prepare you a drink\n≻ **Eat** — Eat something with Senko\n≻ **Rest** — Rest on Senkos lap\n≻ **Sleep** — Sleep on Senko's lap",
							color: SenkoClient.colors.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: false },
								{ type: 2, label: "Fun", style: 1, custom_id: "help_fun", disabled: true },
								{ type: 2, label: "Economy", style: 3, custom_id: "help_economy", disabled: false },
								{ type: 2, label: "Social", style: 3, custom_id: "help_social", disabled: false },
								{ type: 2, label: "Administration", style: 3, custom_id: "help_admin", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Account", style: 3, custom_id: "help_account" }
							]
						},
						bottomButtons
					]
				});
				break;
			case "help_economy":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Economy"
							},
							title: "📑 Economy Commands",
							description: "≻ **Shop** — Buy item's from Senko's Market\n≻ **Preview** — Preview an item from Senko's Market\n≻ **Inventory** — View the items you have collected\n≻ **Claim** — Claim rewards from Senko\n≻ **Stats** — View your account stats\n≻ **Work** — Have Nakano go to work to provide us with income",
							color: SenkoClient.colors.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: false },
								{ type: 2, label: "Fun", style: 3, custom_id: "help_fun", disabled: false },
								{ type: 2, label: "Economy", style: 1, custom_id: "help_economy", disabled: true },
								{ type: 2, label: "Social", style: 3, custom_id: "help_social", disabled: false },
								{ type: 2, label: "Administration", style: 3, custom_id: "help_admin", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Account", style: 3, custom_id: "help_account" }
							]
						},
						bottomButtons
					]
				});
				break;
			case "help_social":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Social"
							},
							title: "📑 Social Commands",
							description: "≻ **OwOify** — UwU OwO\n≻ **Rate** — Rate something\n≻ **Read** — Read the manga chapters you get from the market!\n≻ **Poll** — Create a poll",
							color: SenkoClient.colors.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: false },
								{ type: 2, label: "Fun", style: 3, custom_id: "help_fun", disabled: false },
								{ type: 2, label: "Economy", style: 3, custom_id: "help_economy", disabled: false },
								{ type: 2, label: "Social", style: 1, custom_id: "help_social", disabled: true },
								{ type: 2, label: "Administration", style: 3, custom_id: "help_admin", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Account", style: 3, custom_id: "help_account" }
							]
						},
						bottomButtons
					]
				});
				break;
			case "help_admin":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Administration"
							},
							title: "📑 Administration Commands",
							description: "≻ **channel** — Add/Remove channels where Senko can be used in; **Member must be able to Manage Channels for use**\n≻ **avatar** — View someone's avatar, and banner if they have one\n≻ **whois** — Public account information\n≻ **server** — Server configuration; **Member must be an Administrator to edit (Not needed for server info)**\n≻ **warn** — Warn a user; **Member must be able to Moderate Members**\n**warns** — View warns that a user has\n≻ **clean** — Clean a channel of it's messages; **Member must be able to Manage Messages**\n**ban** — Ban members from your guild **Member must be able to Ban Members**\n**unban** — Unban members from your guild **Member must be able to Ban Members**\n**slowmode** — Change the channel slowmode (In seconds) **Member must be able to Manage Channels**",
							color: SenkoClient.colors.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: false },
								{ type: 2, label: "Fun", style: 3, custom_id: "help_fun", disabled: false },
								{ type: 2, label: "Economy", style: 3, custom_id: "help_economy", disabled: false },
								{ type: 2, label: "Social", style: 3, custom_id: "help_social", disabled: false },
								{ type: 2, label: "Administration", style: 1, custom_id: "help_admin", disabled: true }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Account", style: 3, custom_id: "help_account" }
							]
						},
						bottomButtons
					]
				});
				break;
			case "help_account":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Account"
							},
							title: "📑 Account Commands",
							description: "≻ **delete data** — Delete all your Account data\n≻ **AboutMe** — Modify your about me message!\n≻ **config** — Configure your profile and account settings\n≻ **Profile** — View yours or someone's profile",
							color: SenkoClient.colors.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: false },
								{ type: 2, label: "Fun", style: 3, custom_id: "help_fun", disabled: false },
								{ type: 2, label: "Economy", style: 3, custom_id: "help_economy", disabled: false },
								{ type: 2, label: "Social", style: 3, custom_id: "help_social", disabled: false },
								{ type: 2, label: "Administration", style: 3, custom_id: "help_admin", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Account", style: 1, custom_id: "help_account", disabled: true }
							]
						},
						bottomButtons
					]
				});
				break;
			case "honorable_mentions":
				if (interaction.message.components[0].components[0].disabled === true) interaction.message.components[0].components[0].disabled = false;

				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Honorable Mentions"
							},
							title: "🏅 Honorable Mentions",
							description: "[Wikipedia](https://wikipedia.org/) for some shop item ideas\n[Rimukoro](https://twitter.com/Rimukoro) for creating the Sewayaki Kitsune no Senko-san series!",
							fields: [
								{
									name: "Contributors",
									value: contributors.map(n=>`${Icons.RightArrow} ${n}`).join("\n")
								}
							],
							color: "#fc844c"
						}
					],
					components: interaction.message.components
				});
				break;
			}
		});
	}
};