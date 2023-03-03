import axios from "axios";
import Icons from "../Data/Icons.json";
import { winston } from "../SenkoClient";
import type { SenkoClientTypes } from "../types/AllTypes";

export default class {
	async execute(senkoClient: SenkoClientTypes) {
		const bottomButtons = {
			type: 1,
			components: [
				{ type: 2, label: "Honorable Mentions", style: 2, custom_id: "honorable_mentions" },
				{ type: 2, label: "Invite me", style: 5, url: `https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=${senkoClient.user!.id}&permissions=137439266880` },
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

		const contributors: Array<string> = [];

		for (var id of contributorIds) {
			axios({
				method: "GET",
				url: `https://discord.com/api/users/${id}`,
				headers: {
					"User-Agent": senkoClient.api.UserAgent,
					"Authorization": `Bot ${senkoClient.token}`
				}
			}).then(response => {
				contributors.push(response.data.username);
			});
		}

		senkoClient.on("interactionCreate", async (interaction: any) => {
			if (!interaction.isButton()) return;
			if (!interaction.customId.startsWith("help:")) return;
			if (!interaction.customId.startsWith("help:") && !interaction.customId.startsWith("honorable_mentions")) return;

			const categories = {
				fun: [] as Array<any>,
				economy: [] as Array<any>,
				social: [] as Array<any>,
				admin: [] as Array<any>,
				account: [] as Array<any>,
				utility: [] as Array<any>,
				uncategorized: [] as Array<any>
			};

			senkoClient.api.loadedCommands.forEach((cmd: any) => {
				if (!cmd) return;
				const command = senkoClient.api.Commands.get(cmd.name);

				// @ts-ignore
				categories[command.category || "uncategorized"].push(`</${cmd.name}:${cmd.id}> ≻ ${cmd.description}`);
			});

			winston.log("info", "switching interaction");
			switch (interaction.customId) {
			case "help:home":
				interaction.update({
					embeds: [
						{
							author: {
								name: "Index"
							},
							title: "📄 Messenger Index",
							// @ts-ignore
							description: `If you find an issue or want to suggest something please find us\n[in our community server!](https://discord.gg/senko)\n\n[Privacy Policy](https://senkosworld.com/privacy) - [Terms of Use](https://senkosworld.com/terms)\nPing: ${Math.floor(senkoClient.ws.ping)} ms\nUptime: Since <t:${Math.ceil((Date.now() - senkoClient.uptime) / 1000)}> (<t:${Math.ceil((Date.now() - senkoClient.uptime) / 1000)}:R>)\n\n≻ **Fun**\n≻ **Economy**\n≻ **Social**\n≻ **Administration**\n≻ **Account**\n≻ **Utility**`,
							color: senkoClient.api.Theme.random()
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
							description: `${categories.fun.map(c => c).join("\n")}`,
							color: senkoClient.api.Theme.random()
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
							description: `${categories.economy.map(c => c).join("\n")}`,
							color: senkoClient.api.Theme.random()
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
							description: `${categories.social.map(c => c).join("\n")}`,
							color: senkoClient.api.Theme.random()
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
							description: `${categories.admin.map(c => c).join("\n")}`,
							color: senkoClient.api.Theme.random()
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
							description: `${categories.account.map(c => c).join("\n")}`,
							color: senkoClient.api.Theme.random()
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
							description: `${categories.utility.map(c => c).join("\n")}`,
							color: senkoClient.api.Theme.random()
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
				if (interaction.message.components[0]!.components[0]!.data.disabled === true) interaction.message.components[0]!.components[0]!.data.disabled = false;

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
									value: contributors.map(n => `${Icons.RightArrow} ${n}`).join("\n")
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
}