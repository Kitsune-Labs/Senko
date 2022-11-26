// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const Icons = require("../../Data/Icons.json");
// eslint-disable-next-line no-unused-vars
const { fetchSupabaseApi, fetchMarket } = require("../../API/super.js");
const Supabase = fetchSupabaseApi();
const {print, warn} = require("@kitsune-labs/utilities");

module.exports = {
	name: "shop",
	desc: "Buy item's from Senko's Market",
	userData: true,
	defer: true,
	category: "economy",
	/**
	 * @param {CommandInteraction} interaction
     */
	start: async ({senkoClient, interaction, userData}) => {
		const ShopItems = await fetchMarket();
		// const rawShopData = /*{ data: rawShopData } =*/ process.env.PSEUDO_MARKET === "true" ? require("../../Data/LocalSave/PseudoMarket.json") : await Supabase.from("config").select("*").eq("id", "all");
		const { data: rawShopData } = await Supabase.from("config").select("*").eq("id", "all");
		const shopData = rawShopData[0].market;
		const MenuItems = [];

		shopData.items.push(...rawShopData[0].SpecialMarket);

		const itemClasses = {
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
			const shopItem = ShopItems[item];

			if (itemClasses[shopItem.class]) {
				itemClasses[shopItem.class].push({ id: item, data: shopItem });
			} else {
				warn(`Item ${item.name} has no class!`);
				itemClasses.Misc.push({ id: item, data: shopItem });
			}
		}

		const previewCommand = await senkoClient.api.loadedCommands.find(d => d.name === "preview");

		const marketResponse = {
			title: "🛍️ Senko's Market",
			description: `Please take your time to review what is available.\n\nUse </preview:${previewCommand ? previewCommand.id : 0}> to view details about an item like it's description, price, banner preview, and more!\n\n${Icons.package}  Market refresh <t:${shopData.updates}:R>\n${Icons.yen}  **${userData.LocalUser.profileConfig.Currency.Yen}** in your savings`,
			fields: [],
			color: senkoClient.api.Theme.light,
			thumbnail: {
				url: "https://assets.senkosworld.com/media/senko/package.png"
			}
		};

		for (var index in itemClasses) {
			if (itemClasses[index].length > 0 && !marketResponse.fields.find(f=>f.name === index)) marketResponse.fields.push({ name: `${index}`, value: "" });

			itemClasses[index].map(item => {
				marketResponse.fields.find(f=>f.name === index).value += `> ${Icons.yen}  ${item.data.price == 0 ? "**FREE**" : item.data.price} **≻** ${item.data.name}\n`;

				MenuItems.push({ label: `${item.data.name}`, value: `shopbuy#${item.id}#${interaction.user.id}` });
			});
		}

		// rawShopData[0].SpecialMarket.map(item => {
		// 	if (!marketResponse.fields.find(f=>f.name === "Special")) marketResponse.fields.push({ name: "Special", value: "" });
		// 	var si = ShopItems[item];

		// 	marketResponse.fields.find(f=>f.name === "Special").value += `> ${Icons.yen}  ${si.price == 0 ? "**FREE**" : si.price} **≻** ${si.name} - (Part of the ${si.set} set)\n`;
		// 	MenuItems.push({ label: `${si.name}`, value: `shopbuy#${item}#${interaction.user.id}` });
		// });

		// superConfig.EventMarket.map(eventItem => {
		// 	const eI = ShopItems[eventItem];

		// 	if (eI) {
		// 		EventItems += `[${Icons.yen}  ${eI.price}] **${eI.name}**`; // ${Icons.package}  —  **${eI.name}** [${Icons.yen}  ${eI.price}]\n`;

		// 		MenuItems.push({ label: `${eI.name}`, value: `shopbuy_${Object.keys(ShopItems).indexOf(eventItem)}_${interaction.user.id}` });
		// 	}
		// });

		interaction.followUp({
			embeds: [marketResponse],
			components: [
				{
					type: 1,
					components: [
						{
							type: 3,
							placeholder: "Select an item to purchase",
							custom_id: "shop_purchase",
							options: MenuItems
						}
					]
				}
			]
		});
	}
};
