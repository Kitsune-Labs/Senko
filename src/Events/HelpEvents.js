// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Collection } = require("discord.js");
const { default: axios } = require("axios");
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

			const categories = {
				fun: [],
				economy: [],
				social: [],
				admin: [],
				account: [],
				utility: []
			};

			for (var index of SenkoClient.SlashCommands) {
				const category = index[1].category || null;

				if (category) categories[category].push(`**[${index[0]}](https://senkosworld.com "${index[1].desc}")**\n≻ ${index[1].desc}`);
			}

			switch (interaction.customId) {
			case "help_home":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index"
							},
							title: "📄 Messenger Index",
							description: `If you find an issue or want to suggest something please find us\n[in our community server!](https://discord.gg/senko)\n\nPing: ${Math.floor(SenkoClient.ws.ping)} ms\nUptime: Since <t:${Math.ceil((Date.now() - SenkoClient.uptime) / 1000)}> (<t:${Math.ceil((Date.now() - SenkoClient.uptime) / 1000)}:R>)\n\n≻ **Fun**\n≻ **Economy**\n≻ **Social**\n≻ **Administration**\n≻ **Account**\n≻ **Utility**`,
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
								{ type: 2, label: "Administration", style: 3, custom_id: "help_admin" },
								{ type: 2, label: "Account", style: 3, custom_id: "help_account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help_utility", disabled: false }
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
							description: `${categories.fun.map(c=>c).join("\n")}`,
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
								{ type: 2, label: "Administration", style: 3, custom_id: "help_admin", disabled: false },
								{ type: 2, label: "Account", style: 3, custom_id: "help_account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help_utility", disabled: false }
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
							description: `${categories.economy.map(c=>c).join("\n")}`,
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
								{ type: 2, label: "Administration", style: 3, custom_id: "help_admin", disabled: false },
								{ type: 2, label: "Account", style: 3, custom_id: "help_account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help_utility", disabled: false }
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
							description: `${categories.social.map(c=>c).join("\n")}`,
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
								{ type: 2, label: "Administration", style: 3, custom_id: "help_admin", disabled: false },
								{ type: 2, label: "Account", style: 3, custom_id: "help_account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help_utility", disabled: false }
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
							description: `${categories.admin.map(c=>c).join("\n")}`,
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
								{ type: 2, label: "Administration", style: 1, custom_id: "help_admin", disabled: true },
								{ type: 2, label: "Account", style: 3, custom_id: "help_account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help_utility", disabled: false }
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
							description: `${categories.account.map(c=>c).join("\n")}`,
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
								{ type: 2, label: "Administration", style: 3, custom_id: "help_admin", disabled: false },
								{ type: 2, label: "Account", style: 1, custom_id: "help_account", disabled: true }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help_utility", disabled: false }
							]
						},
						bottomButtons
					]
				});
				break;
			case "help_utility":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Utility"
							},
							title: "⚙️ Utility Commands",
							description: `${categories.account.map(c=>c).join("\n")}`,
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
								{ type: 2, label: "Administration", style: 3, custom_id: "help_admin", disabled: false },
								{ type: 2, label: "Account", style: 3, custom_id: "help_account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 1, custom_id: "help_utility", disabled: true }
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
							color: 0xfc844c
						}
					],
					components: interaction.message.components
				});
				break;
			}
		});
	}
};