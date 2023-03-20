import { ComponentType } from "discord.js";
import Icons from "../../Data/Icons.json";
import { fetchSupabaseApi, fetchMarket } from "../../API/super";
const Supabase = fetchSupabaseApi();
import { warn } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../../types/AllTypes";
import type { MarketItem } from "../../types/SupabaseTypes";

export default {
	name: "shop",
	desc: "Buy item's from Senko's Market",
	userData: true,
	defer: true,
	category: "economy",
	start: async ({ senkoClient, interaction, userData }) => {
		const ShopItems = await fetchMarket();
		// const rawShopData = /*{ data: rawShopData } =*/ process.env.PSEUDO_MARKET === "true" ? require("../../Data/LocalSave/PseudoMarket.json") : await Supabase.from("config").select("*").eq("id", "all");
		const { data: rawShopData } = await Supabase.from("config").select("*").eq("id", "all") as any;
		const shopData = rawShopData[0].market;
		const MenuItems: any[] = [];

		shopData.items.push(...rawShopData[0].SpecialMarket);

		const itemClasses: any = {
			Badges: [],
			Titles: [],
			Banners: [],
			Colors: [],
			Consumables: [],
			Materials: [],
			Manga: [],
			Music: [],
			Events: [],
			Special: [],
			Misc: []
		};

		for (var item of shopData.items) {
			const shopItem = ShopItems[item] as MarketItem;

			if (itemClasses[shopItem.class]) {
				itemClasses[shopItem.class].push({ id: item, data: shopItem });
			} else {
				warn(`Item ${item.name} has no class!`);
				itemClasses.Misc.push({ id: item, data: shopItem });
			}
		}

		for (var eventItem of rawShopData[0].EventMarket) {
			const shopItem = ShopItems[eventItem] as MarketItem;

			itemClasses.Events.push({ id: item, data: shopItem });
			if (!itemClasses[shopItem.class]) warn(`Item ${item.name} has no class!`);
		}

		for (var specialItem of rawShopData[0].SpecialMarket) {
			const shopItem = ShopItems[specialItem] as MarketItem;

			itemClasses.Special.push({ id: item, data: shopItem });
			if (!itemClasses[shopItem.class]) warn(`Item ${item.name} has no class!`);
		}

		const previewCommand = await senkoClient.api.loadedCommands.find((d: any) => d.name === "preview");

		const marketResponse = {
			title: "🛍️ Senko's Market",
			description: `Please take your time to review what is available.\n\nUse </preview:${previewCommand ? previewCommand.id : 0}> to view details about an item like it's description, price, banner preview, and more!\n\n${Icons.package}  Market refresh <t:${shopData.updates}:R>\n${Icons.yen}  **${userData.LocalUser.profileConfig.Currency.Yen}** in your savings`,
			fields: [],
			color: senkoClient.api.Theme.light,
			thumbnail: {
				url: "https://cdn.senko.gg/public/senko/package.png"
			}
		};

		for (var index in itemClasses) {
			// @ts-expect-error
			if (itemClasses[index].length > 0 && !marketResponse.fields.find(f => f.name === index)) marketResponse.fields.push({ name: `${index}`, value: "" });

			itemClasses[index].map((item: any) => {
				// @ts-expect-error
				marketResponse.fields.find(f => f.name === index).value += `> ${Icons.yen}  ${item.data.price == 0 ? "**FREE**" : item.data.price} **≻** ${item.data.name}${item.data.set ? ` **(Part of the ${item.data.set} set)**\n` : "\n"}`;

				if (!MenuItems.find(i => i.label === item.data.name)) MenuItems.push({ label: `${item.data.name}`, value: `shopbuy#${item.id}#${interaction.user.id}#${Math.floor(Math.random() * 100)}` });
			});
		}

		interaction.followUp({
			embeds: [marketResponse],
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.StringSelect,
							placeholder: "Select an item to purchase",
							customId: "shop_purchase",
							options: MenuItems
						}
					]
				}
			]
		});
	}
} as SenkoCommand;