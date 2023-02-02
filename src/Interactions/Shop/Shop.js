// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits: Permissions, ApplicationCommandOptionType: CommandOption, ChannelType, Colors, ComponentType } = require("discord.js");
const Icons = require("../../Data/Icons.json");
// eslint-disable-next-line no-unused-vars
const { fetchSupabaseApi, fetchMarket } = require("../../API/super.js");
const Supabase = fetchSupabaseApi();
const {warn} = require("@kitsune-labs/utilities");

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

		for (var eventItem of rawShopData[0].EventMarket) {
			const shopItem = ShopItems[eventItem];

			itemClasses.Events.push({ id: item, data: shopItem });
			if (!itemClasses[shopItem.class]) warn(`Item ${item.name} has no class!`);
		}

		for (var specialItem of rawShopData[0].SpecialMarket) {
			const shopItem = ShopItems[specialItem];

			itemClasses.Special.push({ id: item, data: shopItem });
			if (!itemClasses[shopItem.class]) warn(`Item ${item.name} has no class!`);
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
				marketResponse.fields.find(f=>f.name === index).value += `> ${Icons.yen}  ${item.data.price == 0 ? "**FREE**" : item.data.price} **≻** ${item.data.name}${item.data.set ? ` **(Part of the ${item.data.set} set)**\n` : "\n"}`;

				if (!MenuItems.find(i=>i.label === item.data.name)) MenuItems.push({ label: `${item.data.name}`, value: `shopbuy#${item.id}#${interaction.user.id}#${Math.floor(Math.random() * 100)}` });
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
							custom_id: "shop_purchase",
							options: MenuItems
						}
					]
				}
			]
		});
	}
};
