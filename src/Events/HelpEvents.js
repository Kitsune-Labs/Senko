// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Collection } = require("discord.js");
const { default: axios } = require("axios");
const Icons = require("../Data/Icons.json");
const {print} = require("@kitsune-labs/utilities");

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
					"User-Agent": SenkoClient.api.UserAgent,
					"Authorization": `Bot ${SenkoClient.token}`
				}
			}).then(response => {
				contributors.push(response.data.username);
			});
		}

		/**
         * @param {CommandInteraction} interaction
         */
		SenkoClient.on("interactionCreate", async (interaction) => {
			if (!interaction.isButton() || !interaction.customId.startsWith("help:") || !interaction.customId.startsWith("honorable_mentions")) return;

			const categories = {
				fun: [],
				economy: [],
				social: [],
				admin: [],
				account: [],
				utility: [],
				uncategorized: []
			};

			SenkoClient.api.loadedCommands.forEach(cmd => {
				if (!cmd) return;
				const command = SenkoClient.api.Commands.get(cmd.name);

				categories[command.category || "uncategorized"].push(`</${cmd.name}:${cmd.id}> ≻ ${cmd.description}`);
			});

			// for (var index in SenkoClient.api.loadedCommands) {
			// 	var commandEntry = SenkoClient.api.loadedCommands[index];
			// 	const { category } = SenkoClient.api.Commands.get(commandEntry.name);

			// 	categories[category].push(`</${commandEntry.name}:${commandEntry.id}> ≻ ${commandEntry.description}`);
			// }

			switch (interaction.customId) {
			case "help:home":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index"
							},
							title: "📄 Messenger Index",
							description: `If you find an issue or want to suggest something please find us\n[in our community server!](https://discord.gg/senko)\n\n[Privacy Policy](https://senkosworld.com/privacy) - [Terms of Use](https://senkosworld.com/terms)\nPing: ${Math.floor(SenkoClient.ws.ping)} ms\nUptime: Since <t:${Math.ceil((Date.now() - SenkoClient.uptime) / 1000)}> (<t:${Math.ceil((Date.now() - SenkoClient.uptime) / 1000)}:R>)\n\n≻ **Fun**\n≻ **Economy**\n≻ **Social**\n≻ **Administration**\n≻ **Account**\n≻ **Utility**`,
							color: SenkoClient.api.Theme.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 1, custom_id: "help:home", disabled: true },
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
						bottomButtons
					]
				});
				break;
			case "help:fun":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Fun"
							},
							title: "📑 Fun Commands",
							description: `${categories.fun.map(c=>c).join("\n")}`,
							color: SenkoClient.api.Theme.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help:home", disabled: false },
								{ type: 2, label: "Fun", style: 1, custom_id: "help:fun", disabled: true },
								{ type: 2, label: "Economy", style: 3, custom_id: "help:economy", disabled: false },
								{ type: 2, label: "Administration", style: 3, custom_id: "help:admin", disabled: false },
								{ type: 2, label: "Account", style: 3, custom_id: "help:account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help:utility", disabled: false }
							]
						},
						bottomButtons
					]
				});
				break;
			case "help:economy":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Economy"
							},
							title: "📑 Economy Commands",
							description: `${categories.economy.map(c=>c).join("\n")}`,
							color: SenkoClient.api.Theme.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help:home", disabled: false },
								{ type: 2, label: "Fun", style: 3, custom_id: "help:fun", disabled: false },
								{ type: 2, label: "Economy", style: 1, custom_id: "help:economy", disabled: true },
								{ type: 2, label: "Administration", style: 3, custom_id: "help:admin", disabled: false },
								{ type: 2, label: "Account", style: 3, custom_id: "help:account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help:utility", disabled: false }
							]
						},
						bottomButtons
					]
				});
				break;
			case "help:social":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Social"
							},
							title: "📑 Social Commands",
							description: `${categories.social.map(c=>c).join("\n")}`,
							color: SenkoClient.api.Theme.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help:home", disabled: false },
								{ type: 2, label: "Fun", style: 3, custom_id: "help:fun", disabled: false },
								{ type: 2, label: "Economy", style: 3, custom_id: "help:economy", disabled: false },
								{ type: 2, label: "Administration", style: 3, custom_id: "help:admin", disabled: false },
								{ type: 2, label: "Account", style: 3, custom_id: "help:account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help:utility", disabled: false }
							]
						},
						bottomButtons
					]
				});
				break;
			case "help:admin":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Administration"
							},
							title: "📑 Administration Commands",
							description: `${categories.admin.map(c=>c).join("\n")}`,
							color: SenkoClient.api.Theme.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help:home", disabled: false },
								{ type: 2, label: "Fun", style: 3, custom_id: "help:fun", disabled: false },
								{ type: 2, label: "Economy", style: 3, custom_id: "help:economy", disabled: false },
								{ type: 2, label: "Administration", style: 1, custom_id: "help:admin", disabled: true },
								{ type: 2, label: "Account", style: 3, custom_id: "help:account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help:utility", disabled: false }
							]
						},
						bottomButtons
					]
				});
				break;
			case "help:account":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Account"
							},
							title: "📑 Account Commands",
							description: `${categories.account.map(c=>c).join("\n")}`,
							color: SenkoClient.api.Theme.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help:home", disabled: false },
								{ type: 2, label: "Fun", style: 3, custom_id: "help:fun", disabled: false },
								{ type: 2, label: "Economy", style: 3, custom_id: "help:economy", disabled: false },
								{ type: 2, label: "Administration", style: 3, custom_id: "help:admin", disabled: false },
								{ type: 2, label: "Account", style: 1, custom_id: "help:account", disabled: true }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 3, custom_id: "help:utility", disabled: false }
							]
						},
						bottomButtons
					]
				});
				break;
			case "help:utility":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Utility"
							},
							title: "⚙️ Utility Commands",
							description: `${categories.utility.map(c=>c).join("\n")}`,
							color: SenkoClient.api.Theme.random()
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Home", style: 4, custom_id: "help:home", disabled: false },
								{ type: 2, label: "Fun", style: 3, custom_id: "help:fun", disabled: false },
								{ type: 2, label: "Economy", style: 3, custom_id: "help:economy", disabled: false },
								{ type: 2, label: "Administration", style: 3, custom_id: "help:admin", disabled: false },
								{ type: 2, label: "Account", style: 3, custom_id: "help:account", disabled: false }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Utility", style: 1, custom_id: "help:utility", disabled: true }
							]
						},
						bottomButtons
					]
				});
				break;
			case "honorable_mentions":
				if (interaction.message.components[0].components[0].data.disabled === true) interaction.message.components[0].components[0].data.disabled = false;

				interaction.update({
					embeds: [
						{
							author: {
								name: "Index ≻ Honorable Mentions"
							},
							title: "🏅 Honorable Mentions",
							description: "[Wikipedia](https://wikipedia.org/) for some market ideas\n[Rimukoro](https://twitter.com/Rimukoro) for creating the Sewayaki Kitsune no Senko-san series\n[VACEfron](https://github.com/VACEfron) for some command API's",
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