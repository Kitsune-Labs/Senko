import type { SenkoCommand } from "../../types/AllTypes";
import { fetchMarket } from "../../API/super";
import type { MarketItem } from "../../types/SupabaseTypes";

export default {
	name: "read",
	desc: "Read the manga chapters you get from the market!",
	category: "fun",
	start: async ({ senkoClient, interaction, userData }) => {
		const ShopItems = await fetchMarket();
		const OwnedChapters: any = [];

		new Promise<void>((resolve) => {
			for (var item of Object.keys(userData.LocalUser.profileConfig.Inventory)) {
				const ShopItem = ShopItems[item] as MarketItem;
				if (ShopItem && ShopItem.manga) {
					OwnedChapters.push({ label: `${ShopItem.name}`, value: `read_${ShopItem.manga}`, description: `${ShopItem.desc}` });
				}
			}

			resolve();
		}).then(() => {
			if (OwnedChapters.length === 0) return interaction.reply({
				embeds: [
					{
						title: "You don't own any chapters!",
						description: "You can buy them when they're avaliable in the shop!",
						color: senkoClient.api.Theme.light,
						thumbnail: { url: "https://cdn.senko.gg/public/senko/what.png" }
					}
				],
				ephemeral: true
			});

			interaction.reply({
				content: "** **",
				components: [
					{
						type: 1,
						components: [
							{
								type: 3,
								placeholder: "What should I read?",
								customId: "read_manga",
								options: OwnedChapters
							}
						]
					}
				]
			});
		});
	}
} as SenkoCommand;