import type { SenkoCommand } from "../../types/AllTypes";
import { fetchMarket } from "../../API/super";
import Paginate from "../../API/Pagination/Command";
import Icons from "../../Data/Icons.json";

export default {
	name: "inventory",
	desc: "View the items you have collected",
	defer: true,
	ephemeral: true,
	category: "account",
	// @ts-ignore
	start: async ({senkoClient, interaction, userData}) => {
		const ShopItems = await fetchMarket();
		const PageEstimate = Math.ceil(Object.keys(userData.LocalUser.profileConfig.Inventory).length / 8) < 1 ? 1 : Math.ceil(Object.keys(userData.LocalUser.profileConfig.Inventory).length / 8);
		const Pages: any[] = [];

		for (let i = 0; i < PageEstimate; i++) {
			const Page = {
				description: "",
				color: senkoClient.api.Theme.light
			};

			for (let j = 0; j < 8; j++) {
				const Item = Object.keys(userData.LocalUser.profileConfig.Inventory)[i * 8 + j];
				if (Item) {
					const shopItem = ShopItems[Item];

					// @ts-ignore
					Page.description += `**${shopItem ? shopItem.name : `Data missing: ${Item}`}**\n${shopItem ? `> ${shopItem.desc}` : ""}\n> You own **${userData.LocalUser.profileConfig.Inventory[Item]}**\n\n`;
				}
			}

			Pages.push(Page);
		}

		if (Pages[0].description === "") return interaction.followUp({
			embeds: [
				{
					title: `${Icons.exclamation} It's empty!`,
					description: "We should probably buy some stuff to fill it up",
					color: senkoClient.api.Theme.dark,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/hat_think.png" }
				}
			],
			ephemeral: true
		});

		Paginate(interaction, Pages, 60000, true);
	}
} as SenkoCommand;