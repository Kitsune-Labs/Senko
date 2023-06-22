import type { SenkoCommand } from "../../types/AllTypes";
import { fetchMarket } from "../../API/super";
import Paginate from "../../API/Paginate";
import Icons from "../../Data/Icons.json";
import { APIEmbed } from "discord.js";

export default {
	name: "inventory",
	desc: "View the items you have collected",
	defer: true,
	ephemeral: true,
	category: "account",
	start: async ({ Senko, Interaction, MemberData }) => {
		const ShopItems = await fetchMarket();
		const PageEstimate = Math.ceil(Object.keys(MemberData.LocalUser.profileConfig.Inventory).length / 8) < 1 ? 1 : Math.ceil(Object.keys(MemberData.LocalUser.profileConfig.Inventory).length / 8);
		const Pages: APIEmbed[] = [];

		for (let i = 0; i < PageEstimate; i++) {
			const Page = {
				description: "",
				color: Senko.Theme.light
			};

			for (let j = 0; j < 8; j++) {
				const Item = Object.keys(MemberData.LocalUser.profileConfig.Inventory)[i * 8 + j];
				if (Item) {
					const shopItem = ShopItems[Item];

					Page.description += `**${shopItem ? shopItem.name : `Data missing: ${Item}`}**\n${shopItem ? `> ${shopItem.desc}` : ""}\n> You own **${MemberData.LocalUser.profileConfig.Inventory[Item]}**\n\n`;
				}
			}

			Pages.push(Page);
		}

		if (Pages[0]!.description === "") return Interaction.followUp({
			embeds: [
				{
					title: `${Icons.exclamation} It's empty!`,
					description: "We should probably buy some stuff to fill it up",
					color: Senko.Theme.dark,
					thumbnail: { url: "https://cdn.senko.gg/public/senko/hat_think.png" }
				}
			],
			ephemeral: true
		});

		new Paginate(Interaction, Pages);
	}
} as SenkoCommand;