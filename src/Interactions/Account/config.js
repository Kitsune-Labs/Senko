/* eslint-disable no-async-promise-executor */
// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const Icons = require("../../Data/Icons.json");

const ShopItems = require("../../Data/Shop/Items.json");
const { Bitfield } = require("bitfields");
const BitData = require("../../API/Bits.json");


module.exports = {
	name: "config",
	desc: "Configure your profile and account settings",
	userData: true,
	options: [
		{
			name: "banner",
			description: "Change your Profile Card banner",
			type: 1
		},
		{
			name: "settings",
			description: "Change your account settings",
			type: 1
		},
		{
			name: "title",
			description: "Change your Profile Card title",
			type: 1
		},
		{
			name: "color",
			description: "Change your Profile Card color",
			type: 1
		}
	],
	usableAnywhere: true,
	/**
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction, GuildData, AccountData) => {
		const Command = interaction.options.getSubcommand();

		await interaction.deferReply({ ephemeral: true, fetchReply: true });

		switch (Command) {
		case "banner":
			if (!AccountData.Inventory[0]) return interaction.followUp({
				embeds: [
					{
						title: "You don't own anything!",
						description: "You can buy banners when they're avaliable in the shop!",
						color: SenkoClient.colors.light,
						thumbnail: { url: "attachment://image.png" }
					}
				],
				files: [{ attachment: "./src/Data/content/senko/what.png", name: "image.png" }],
				ephemeral: true
			});

			var Banners = [
				{ label: "Default Banner", value: "banner_change_default", description: "The banner everyone gets" }
			];

			for (let Item of AccountData.Inventory) {
				const ShopItem = ShopItems[Item.codename];

				if (ShopItem && ShopItem.banner) {
					Banners.push({ label: `${ShopItem.name}`, value: `banner_change_${Item.codename}`, description: `${ShopItem.desc}`});
				}
			}

			if (!Banners[1]) return interaction.followUp({
				embeds: [
					{
						title: "You don't own any banners!",
						description: "You can buy them when they're avaliable in the shop!",
						color: SenkoClient.colors.light,
						thumbnail: { url: "attachment://image.png" }
					}
				],
				files: [{ attachment: "./src/Data/content/senko/what.png", name: "image.png" }],
				ephemeral: true
			});

			interaction.followUp({
				content: "Select a banner to equip in the dropdown menu! (Will equip on click)",
				components: [
					{
						type: 1,
						components: [
							{
								type: 3,
								placeholder: `Currently ${ShopItems[AccountData.LocalUser.Banner] ? ShopItems[AccountData.LocalUser.Banner].name : "Default Banner"}`,
								custom_id: "banner_set",
								options: Banners
							}
						]
					}
				],
				ephemeral: true
			});
			break;
		case "settings":
			var AccountFlags = Bitfield.fromHex(await AccountData.LocalUser.config.flags);

			var AccountEmbed = {
				title: "Account Settings",
				fields: [],
				color: SenkoClient.colors.light
			};

			var Components = [
				{
					type: 1,
					components: [
						{ type: 2, label: "Change Privacy", style: 3, custom_id: "user_privacy" },
						{ type: 2, label: "DM Achievements", style: 3, custom_id: "user_dm_achievements", disabled: true }
					]
				}
			];

			if (AccountFlags.get(BitData.privacy)) {
				AccountEmbed.fields.push({ name: "Private Profile", value: Icons.check, inline: true });
				Components[0].components[0].style = 3;
			} else {
				AccountEmbed.fields.push({ name: "Private Profile", value: Icons.tick, inline: true });
				Components[0].components[0].style = 4;
			}

			if (AccountFlags.get(BitData.DMAchievements)) {
				AccountEmbed.fields.push({ name: "DM Achievements", value: Icons.check, inline: true });
				Components[0].components[1].style = 3;
			} else {
				AccountEmbed.fields.push({ name: "DM Achievements", value: Icons.tick, inline: true });
				Components[0].components[1].style = 4;
			}

			interaction.followUp({
				embeds: [AccountEmbed],
				ephemeral: true,
				components: Components
			});
			break;
		case "title":
			if (!AccountData.Inventory[0]) return interaction.followUp({
				embeds: [
					{
						title: "You don't own anything!",
						description: "You can buy banners when they're avaliable in the shop!",
						color: SenkoClient.colors.light,
						thumbnail: { url: "attachment://image.png" }
					}
				],
				files: [{ attachment: "./src/Data/content/senko/what.png", name: "image.png" }],
				ephemeral: true
			});

			var TitleColors = [
				{ label: "No Title", value: "title_none", description: "No Title"}
			];

			for (let Item of AccountData.Inventory) {
				const ShopItem = ShopItems[Item.codename];

				if (ShopItem && ShopItem.title) {
					TitleColors.push({ label: `${ShopItem.name}`, value: `title_${Item.codename}`, description: `${ShopItem.desc}`});
				}
			}
			if (!TitleColors[1]) return interaction.followUp({
				embeds: [
					{
						title: "You don't own any titles!",
						description: "You can buy them when they're avaliable in the shop!",
						color: SenkoClient.colors.light,
						thumbnail: { url: "attachment://image.png" }
					}
				],
				files: [{ attachment: "./src/Data/content/senko/what.png", name: "image.png" }],
				ephemeral: true
			});

			interaction.followUp({
				content: "Select a title to equip in the dropdown menu! (Will equip on click)",
				components: [
					{
						type: 1,
						components: [
							{
								type: 3,
								placeholder: `Currently ${ShopItems[AccountData.LocalUser.config.title] ? ShopItems[AccountData.LocalUser.config.title].name : "No Title"}`,
								custom_id: "title_equip",
								options: TitleColors
							}
						]
					}
				],
				ephemeral: true
			});
			break;
		case "color":
			if (!AccountData.Inventory[0]) return interaction.followUp({
				embeds: [
					{
						title: "You don't own anything!",
						description: "You can buy banners when they're avaliable in the shop!",
						color: SenkoClient.colors.light,
						thumbnail: { url: "attachment://image.png" }
					}
				],
				files: [{ attachment: "./src/Data/content/senko/what.png", name: "image.png" }],
				ephemeral: true
			});

			var CurrentColor = "Unknown";
			var ColorColors = [{ label: "Default Color", value: "color_change_default", description: "The color everyone gets" }];

			for (let Item of AccountData.Inventory) {
				const ShopItem = ShopItems[Item.codename];

				if (ShopItem && ShopItem.color) {
					ColorColors.push({ label: `${ShopItem.name}`, value: `color_change_${Item.codename}`, description: `${ShopItem.desc}`});

					if (AccountData.LocalUser.config.color === ShopItem.color) {
						CurrentColor = ShopItem.name;
					}
				}
			}

			if (!ColorColors[1]) return interaction.followUp({
				embeds: [
					{
						title: "You don't own any card colors!",
						description: "You can buy them when they're avaliable in the shop!",
						color: SenkoClient.colors.light,
						thumbnail: { url: "attachment://image.png" }
					}
				],
				files: [{ attachment: "./src/Data/content/senko/what.png", name: "image.png" }],
				ephemeral: true
			});

			interaction.followUp({
				content: "Select a color to equip in the dropdown menu! (Will equip on click)",
				components: [
					{
						type: 1,
						components: [
							{
								type: 3,
								placeholder: `Currently ${CurrentColor}`,
								custom_id: "banner_set",
								options: ColorColors
							}
						]
					}
				],
				ephemeral: true
			});
			break;
		}
	}
};