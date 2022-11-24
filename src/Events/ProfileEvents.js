// eslint-disable-next-line no-unused-vars
const { Client, ModalBuilder, InteractionType } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { print } = require("@kitsune-labs/utilities");
const { cleanUserString } = require("../API/Master.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");
const { fetchMarket, fetchSuperUser, updateSuperUser } = require("../API/super.js");

module.exports = {
	/**
     * @param {Client} senkoClient
     */
	// eslint-disable-next-line no-unused-vars
	execute: async (senkoClient) => {
		/**
         * @type {import("discord.js").InteractionCollector}
         */
		senkoClient.on("interactionCreate", async (interaction) => {
			let profile = null;
			for (var index in senkoClient.api.loadedCommands) {
				var entry = senkoClient.api.loadedCommands[index];
				const commandEntry = entry[1];
				const { name } = senkoClient.api.Commands.get(commandEntry.name);

				if (name === "profile") profile = commandEntry;
			}

			if (interaction.isButton()) {
				const userData = await fetchSuperUser(interaction.user);
				const Inventory = userData.LocalUser.profileConfig.Inventory;
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
										custom_id: "submit_about_me_1",
										required: true,
										maxLength: 100,
										minLength: 1
									}
								]
							}
						],
						ephemeral: true
					}));
					break;
				case "profile:title":
					var Selection = [
						{ label: "No Title", value: "title_none", description: "No Title"}
					];

					for (let item of Object.keys(Inventory)) {
						const ShopItem = shopItems[item];

						if (ShopItem && ShopItem.title) {
							Selection.push({ label: `${ShopItem.name}`, value: `title_${item}`, description: `${ShopItem.desc}`});
						}
					}

					if (!Selection[1]) return interaction.reply({
						embeds: [
							{
								title: "You don't own any titles!",
								description: "You can buy them when they're avaliable in the shop!",
								color: senkoClient.api.Theme.light,
								thumbnail: { url: "https://assets.senkosworld.com/media/senko/what.png" }
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
										placeholder: `Currently ${shopItems[userData.LocalUser.profileConfig.title] ? shopItems[userData.LocalUser.profileConfig.title].name : "No Title"}`,
										custom_id: "title_equip",
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
							Selection2.push({ label: `${ShopItem.name}`, value: `banner_change_${item}`, description: `${ShopItem.desc}`});
						}
					}

					if (!Selection2[1]) return interaction.followUp({
						embeds: [
							{
								title: "You don't own any banners!",
								description: "You can buy them when they're avaliable in the shop!",
								color: senkoClient.api.Theme.light,
								thumbnail: { url: "https://assets.senkosworld.com/media/senko/what.png" }
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
										placeholder: `Currently ${shopItems[userData.LocalUser.profileConfig.banner] ? shopItems[userData.LocalUser.profileConfig.banner].name : "Default Banner"}`,
										custom_id: "banner_set",
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

					for (let item of Object.keys(Inventory)) {
						const ShopItem = shopItems[item];

						if (ShopItem && ShopItem.color) {
							Selection3.push({ label: `${ShopItem.name}`, value: `color_change_${item}`, description: `${ShopItem.desc}`});

							if (userData.LocalUser.profileConfig.cardColor === ShopItem.color) {
								CurrentColor = ShopItem.name;
							}
						}
					}

					if (!Selection3[1]) return interaction.followUp({
						embeds: [
							{
								title: "You don't own any card colors!",
								description: "You can buy them when they're avaliable in the shop!",
								color: senkoClient.api.Theme.light,
								thumbnail: { url: "https://assets.senkosworld.com/media/senko/what.png" }
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
										custom_id: "color_equip",
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
						{ label: "No Status", value: "status:remove", description: "Have no status"}
					];

					for (let item of Object.keys(Inventory)) {
						const ShopItem = shopItems[item];

						if (ShopItem && ShopItem.status) {
							Selection4.push({ label: `${ShopItem.name}`, value: `status:${item}`, description: `${ShopItem.desc}`});
						}
					}

					if (!Selection4[1]) return interaction.reply({
						embeds: [
							{
								title: "You don't own any Status'!",
								description: "You can buy them when they're avaliable in the shop!",
								color: senkoClient.api.Theme.light,
								thumbnail: { url: "https://assets.senkosworld.com/media/senko/what.png" }
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
										placeholder: `${shopItems[userData.LocalUser.profileConfig.title] ? shopItems[userData.LocalUser.profileConfig.title].name : "No Status"}`,
										custom_id: "status:equip",
										options: Selection4
									}
								]
							}
						],
						ephemeral: true
					});
					break;
				case "profile:remove":
					userData.LocalUser.profileConfig.aboutMe = null;

					await updateSuperUser(interaction.user, {
						LocalUser: userData.LocalUser
					});

					interaction.reply({
						embeds: [
							{
								title: "All done dear!",
								description: "Your about me has been removed!",
								color: senkoClient.api.Theme.light,
								thumbnail: { url: "https://assets.senkosworld.com/media/senko/smile.png" }
							}
						],
						ephemeral: true
					});
					break;
				}
			}

			if (interaction.type === InteractionType.ModalSubmit) {
				const userData = await fetchSuperUser(interaction.user);
				userData.LocalUser.profileConfig.aboutMe = `${cleanUserString(interaction.fields.getField("submit_about_me_1").value.replaceAll(/[\r\n]+/gm, "\n"))}`;
				await updateSuperUser(interaction.user, {
					LocalUser: userData.LocalUser
				});

				interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  I have updated your About Me ${interaction.user.username}`,
							description: `Check it out using </profile:${profile.id}>`,
							color: senkoClient.api.Theme.light,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/senko/package.png"
							}
						}
					],
					ephemeral: true
				});
			}

			if (interaction.isSelectMenu() && interaction.customId.startsWith("status:")) {
				const userData = await fetchSuperUser(interaction.user);

				userData.LocalUser.profileConfig.Status = interaction.values[0].split(":")[1];

				await updateSuperUser(interaction.user, {
					LocalUser: userData.LocalUser
				});

				interaction.reply({
					embeds: [
						{
							description: `Status Updated, Check it out using </profile:${profile.id}>!`,
							color: senkoClient.api.Theme.light
						}
					],
					ephemeral: true
				});
			}
		});
	}
};