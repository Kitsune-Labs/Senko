import { ComponentType } from "discord.js";
import { fetchSupabaseApi, fetchMarket } from "../../API/super";
import type { SenkoCommand } from "../../types/AllTypes.js";

const Supabase = fetchSupabaseApi();

export default {
	name: "preview",
	desc: "Preview an item from Senko's Market",
	usableAnywhere: true,
	category: "economy",
	start: async ({interaction}) => {
		const ShopItems = await fetchMarket();
		const { data: rawShopData } = await Supabase.from("config").select("*").eq("id", "all") as any;

		const shopData = rawShopData[0].market;

		shopData.items.push(...rawShopData[0].SpecialMarket);
		shopData.items.push(...rawShopData[0].EventMarket);

		const messageStruct = {
			ephemeral: true,
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.StringSelect,
							placeholder: "Select an item to preview",
							custom_id: "shop_preview",
							options: []
						}
					]
				}
			]
		};


		shopData.items.map((item: any) => {
			const Item = ShopItems[item];

			// @ts-expect-error
			messageStruct.components[0]!.components[0]!.options.push({ label: `${Item.name}`, value: `preview_${Object.keys(ShopItems).indexOf(item)}` });
		});

		// @ts-expect-error
		interaction.reply(messageStruct);
	}
} as SenkoCommand;