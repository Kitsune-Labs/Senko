// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const { fetchMarket } = require("../API/super");

module.exports = {
	name: "profile-settings",
	desc: "Edit your profile card settings!",
	ephemeral: true,
	usableAnywhere: true,
	category: "account",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, userData}) => {
		const ShopItems = await fetchMarket();
		let currentColor = null;

		userData.LocalUser.profileConfig.Inventory.DefaultBanner = {
			"class": "Banners",
			"name": "Default Banner",
			"desc": "The banner everyone gets",
			"price": 0,
			"amount": 1,
			"max": 1,
			"banner": "DefaultBanner.png",
			"onsale": false
		};

		for (let item of Object.keys(userData.LocalUser.profileConfig.Inventory)) {
			const ShopItem = ShopItems[item];

			if (ShopItem && ShopItem.color) {
				if (userData.LocalUser.profileConfig.cardColor === ShopItem.color) {
					currentColor = ShopItem.name;
				}
			}
		}

		const invLength = Object.keys(userData.LocalUser.profileConfig.Inventory).length <= 0;

		interaction.reply({
			embeds: [
				{
					title: "Profile Settings",
					description: `Here you can edit your profile card settings!\n\n**Title**: ${ShopItems[userData.LocalUser.profileConfig.title] ? ShopItems[userData.LocalUser.profileConfig.title].title : "None!"}\n**Banner**: [${ShopItems[userData.LocalUser.profileConfig.banner.replace(".png", "")].name}](${`https://assets.senkosworld.com/media/banners/${ShopItems[userData.LocalUser.profileConfig.banner.replace(".png", "")].banner}`})\n**Card Color**: ${currentColor || "Default"}\n**About Me**: ${userData.LocalUser.profileConfig.aboutMe || "Not Set!"}`,
					color: senkoClient.api.Theme.light
				}
			],
			components: [
				{
					type: 1,
					components: [
						// September 14, 2022: This marks when I found out you can use semi-colons in the ID, that makes stuff so much easier
						{type: 2, label: "Change Title", style: 1, custom_id: "profile:title", disabled: invLength},
						{type: 2, label: "Change Banner", style: 1, custom_id: "profile:banner", disabled: invLength},
						{type: 2, label: "Change Card Color", style: 1, custom_id: "profile:color", disabled: invLength}
						// {type: 2, label: "Update Status", style: 1, custom_id: "profile:status", disabled: invLength}
					]
				},
				{
					type: 1,
					components: [
						{type: 2, label: "Update About Me", style: 1, custom_id: "profile:about-me"},
						{type: 2, label: "Remove About Me", style: 4, custom_id: "profile:remove"}
					]
				}
			],
			ephemeral: true
		});
	}
};