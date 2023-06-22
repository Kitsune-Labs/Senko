import { fetchMarket } from "../../API/super";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "profile-settings",
	desc: "Edit your profile card settings!",
	ephemeral: true,
	usableAnywhere: true,
	category: "account",
	start: async ({ Senko, Interaction, MemberData }) => {
		const ShopItems = await fetchMarket();
		let currentColor = null;

		// @ts-ignore
		MemberData.LocalUser.profileConfig.Inventory.DefaultBanner = {
			"class": "Banners",
			"name": "Default Banner",
			"desc": "The banner everyone gets",
			"price": 0,
			"amount": 1,
			"max": 1,
			"banner": "DefaultBanner.png",
			"onsale": false
		};

		for (const item of Object.keys(MemberData.LocalUser.profileConfig.Inventory)) {
			const ShopItem = ShopItems[item];

			if (ShopItem && ShopItem.color) {
				if (MemberData.LocalUser.profileConfig.cardColor === ShopItem.color) {
					currentColor = ShopItem.name;
				}
			}
		}

		const invLength = Object.keys(MemberData.LocalUser.profileConfig.Inventory).length <= 0;

		Interaction.reply({
			embeds: [
				{
					title: "Profile Settings",
					// @ts-ignore
					description: `Here you can edit your profile card settings!\n\n**Title**: ${MemberData.LocalUser.profileConfig.title && ShopItems[MemberData.LocalUser.profileConfig.title] ? ShopItems[MemberData.LocalUser.profileConfig.title].title : "None!"}\n**Banner**: [${ShopItems[MemberData.LocalUser.profileConfig.banner.replace(".png", "")].name}](${`https://cdn.senko.gg/public/banners/${ShopItems[MemberData.LocalUser.profileConfig.banner.replace(".png", "")].banner}`})\n**Card Color**: ${currentColor || "Default"}\n**About Me**: ${MemberData.LocalUser.profileConfig.aboutMe || "Not Set!"}`,
					color: Senko.Theme.light
				}
			],
			components: [
				{
					type: 1,
					components: [
						// September 14, 2022: This marks when I found out you can use semi-colons in the ID, that makes stuff so much easier
						{ type: 2, label: "Change Title", style: 1, customId: "profile:title", disabled: invLength },
						{ type: 2, label: "Change Banner", style: 1, customId: "profile:banner", disabled: invLength },
						{ type: 2, label: "Change Card Color", style: 1, customId: "profile:color", disabled: invLength }
						// {type: 2, label: "Update Status", style: 1, customId: "profile:status", disabled: invLength}
					]
				},
				{
					type: 1,
					components: [
						{ type: 2, label: "Update About Me", style: 1, customId: "profile:about-me" },
						{ type: 2, label: "Remove About Me", style: 4, customId: "profile:remove" }
					]
				}
			],
			ephemeral: true
		});
	}
} as SenkoCommand;