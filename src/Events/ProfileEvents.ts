import { ModalBuilder, InteractionType, Events } from "discord.js";
import { fetchMarket, fetchSuperUser, updateSuperUser } from "../API/super";
import type { SenkoClientTypes } from "../types/AllTypes";

export default class {
	async execute(Senko: SenkoClientTypes) {
		Senko.on(Events.InteractionCreate, async (interaction: any) => {
			const profileCommand = Senko.api.loadedCommands.get("profile");

			if (interaction.isButton()) {
				const userData = await fetchSuperUser(interaction.user);
				const Inventory = userData!.LocalUser.profileConfig.Inventory;
				const shopItems = await fetchMarket();

				switch (interaction.customId) {
					case "profile:about-me":
						interaction.showModal(new ModalBuilder({
							title: "About Me",
							customId: "submit_about_me",
							components: [
								{
									type: 1,
									components: [
										{
											type: 4,
											style: 2,
											label: "Enter your new about me",
											customId: "submit_about_me_1",
											required: true,
											maxLength: 100,
											minLength: 1
										}
									]
								}
							]
						}));
						break;
					case "profile:title":
						var Selection = [
							{ label: "No Title", value: "title_none", description: "No Title" }
						];

						for (const item of Object.keys(Inventory)) {
							const ShopItem = shopItems[item];

							if (ShopItem && ShopItem.title) {
								Selection.push({ label: `${ShopItem.name}`, value: `title_${item}`, description: `${ShopItem.desc}` });
							}
						}

						if (!Selection[1]) return interaction.reply({
							embeds: [
								{
									title: "You don't own any titles!",
									description: "You can buy them when they're avaliable in the shop!",
									color: Senko.Theme.light,
									thumbnail: { url: "https://cdn.senko.gg/public/senko/what.png" }
								}
							],
							ephemeral: true
						});

						interaction.reply({
							components: [
								{
									type: 1,
									components: [
										{
											type: 3,
											// @ts-ignore
											placeholder: `Currently ${userData!.LocalUser.profileConfig.title ? shopItems[userData!.LocalUser.profileConfig.title].name : "No Title"}`,
											customId: "title_equip",
											options: Selection
										}
									]
								}
							],
							ephemeral: true
						});
						break;
					case "profile:banner":
						var Selection2 = [
							{ label: "Default Banner", value: "banner_change_default", description: "The banner everyone gets" }
						];

						for (var item of Object.keys(Inventory)) {
							const ShopItem = shopItems[item];

							if (ShopItem && ShopItem.banner) {
								Selection2.push({ label: `${ShopItem.name}`, value: `banner_change_${item}`, description: `${ShopItem.desc}` });
							}
						}

						if (!Selection2[1]) return interaction.reply({
							embeds: [
								{
									title: "You don't own any banners!",
									description: "You can buy them when they're avaliable in the shop!",
									color: Senko.Theme.light,
									thumbnail: { url: "https://cdn.senko.gg/public/senko/what.png" }
								}
							],
							ephemeral: true
						});

						interaction.reply({
							components: [
								{
									type: 1,
									components: [
										{
											type: 3,
											// @ts-ignore
											placeholder: `Currently ${shopItems[userData!.LocalUser.profileConfig.banner] ? shopItems[userData!.LocalUser.profileConfig.banner].name : "Default Banner"}`,
											customId: "banner_set",
											options: Selection2
										}
									]
								}
							],
							ephemeral: true
						});
						break;
					case "profile:color":
						var CurrentColor = "Default Color";
						var Selection3 = [
							{ label: "Default Color", value: "color_change_default", description: "The color everyone gets" }
						];

						for (const item of Object.keys(Inventory)) {
							const ShopItem = shopItems[item];

							if (ShopItem && ShopItem.color) {
								Selection3.push({ label: `${ShopItem.name}`, value: `color_change_${item}`, description: `${ShopItem.desc}` });

								if (userData!.LocalUser.profileConfig.cardColor === ShopItem.color) {
									CurrentColor = ShopItem.name;
								}
							}
						}

						if (!Selection3[1]) return interaction.reply({
							embeds: [
								{
									title: "You don't own any card colors!",
									description: "You can buy them when they're avaliable in the shop!",
									color: Senko.Theme.light,
									thumbnail: { url: "https://cdn.senko.gg/public/senko/what.png" }
								}
							],
							ephemeral: true
						});

						interaction.reply({
							components: [
								{
									type: 1,
									components: [
										{
											type: 3,
											placeholder: `Currently ${CurrentColor}`,
											customId: "color_equip",
											options: Selection3
										}
									]
								}
							],
							ephemeral: true
						});
						break;
					case "profile:status":
						var Selection4 = [
							{ label: "No Status", value: "status:remove", description: "Have no status" }
						];

						for (const item of Object.keys(Inventory)) {
							const ShopItem = shopItems[item];

							if (ShopItem && ShopItem.status) {
								Selection4.push({ label: `${ShopItem.name}`, value: `status:${item}`, description: `${ShopItem.desc}` });
							}
						}

						if (!Selection4[1]) return interaction.reply({
							embeds: [
								{
									title: "You don't own any Status'!",
									description: "You can buy them when they're avaliable in the shop!",
									color: Senko.Theme.light,
									thumbnail: { url: "https://cdn.senko.gg/public/senko/what.png" }
								}
							],
							ephemeral: true
						});

						interaction.reply({
							components: [
								{
									type: 1,
									components: [
										{
											type: 3,
											// @ts-ignore
											placeholder: `${shopItems[userData.LocalUser.profileConfig.Status] ? shopItems[userData.LocalUser.profileConfig.Status].name : "No Status"}`,
											customId: "status:equip",
											options: Selection4
										}
									]
								}
							],
							ephemeral: true
						});
						break;
					case "profile:remove":
						userData!.LocalUser.profileConfig.aboutMe = null;

						await updateSuperUser(interaction.user, {
							LocalUser: userData!.LocalUser
						});

						interaction.reply({
							embeds: [
								{
									title: "All done dear!",
									description: "Your about me has been removed!",
									color: Senko.Theme.light,
									thumbnail: { url: "https://cdn.senko.gg/public/senko/smile.png" }
								}
							],
							ephemeral: true
						});
						break;
				}
			}

			if (interaction.type === InteractionType.ModalSubmit) {
				const userData = await fetchSuperUser(interaction.user);
				userData!.LocalUser.profileConfig.aboutMe = `${interaction.fields.getField("submit_about_me_1").value.replaceAll(/[\r\n]+/gm, "\n")}`;
				await updateSuperUser(interaction.user, {
					LocalUser: userData!.LocalUser
				});

				interaction.reply({
					embeds: [
						{
							title: `${Senko.Icons.exclamation}  I have updated your About Me ${interaction.user.username}`,
							description: `Check it out using ${profileCommand ? `</profile:${profileCommand.id}>` : "/profile"}`,
							color: Senko.Theme.light,
							thumbnail: {
								url: "https://cdn.senko.gg/public/senko/package.png"
							}
						}
					],
					ephemeral: true
				});
			}

			if (interaction.isStringSelectMenu() && interaction.customId.startsWith("status:")) {
				const userData = await fetchSuperUser(interaction.user);

				userData!.LocalUser.profileConfig.Status = interaction.values[0].split(":")[1];

				await updateSuperUser(interaction.user, {
					LocalUser: userData!.LocalUser
				});

				interaction.reply({
					embeds: [
						{
							description: `Status Updated, Check it out using ${profileCommand ? `</profile:${profileCommand.id}>` : "/profile"}`,
							color: Senko.Theme.light
						}
					],
					ephemeral: true
				});
			}
		});
	}
}