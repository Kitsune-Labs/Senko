// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");

const { fetchConfig, updateSuperUser, fetchSuperUser, fetchMarket } = require("../API/super.js");

module.exports = {
	/**
	 * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	execute: async (SenkoClient) => {
		SenkoClient.on("interactionCreate", async interaction => {
			const shopItems = await fetchMarket();

			if (interaction.isSelectMenu() && interaction.customId == "shop_purchase") {
				const item = interaction.values[0].split("_").splice(1, 3);

				const configData = await fetchConfig();

				const itemName = Object.keys(shopItems).at(item[0]);
				const shopItem = await shopItems[itemName];

				interaction.channel.messages.cache.get(interaction.message.id).edit({
					components: interaction.message.components
				});

				configData.market.items.push(...configData.SpecialMarket);
				configData.market.items.push(...configData.EventMarket);

				if (!configData.market.items.includes(itemName)) return interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  Sorry!`,
							description: "This item is out of stock right now check back next time!",
							color: SenkoClient.colors.dark,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/senko/heh.png"
							}
						}
					],
					ephemeral: true
				});

				const accountData = await fetchSuperUser(interaction.user);

				if (accountData.LocalUser.profileConfig.Inventory[itemName] && accountData.LocalUser.profileConfig.Inventory[itemName] >= shopItem.max) return interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  Sorry ${interaction.user.username}`,
							description: `You may only have **${shopItem.max}** total!`,
							color: SenkoClient.colors.dark,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/senko/heh.png"
							}
						}
					],
					ephemeral: true
				});

				if (accountData.LocalUser.profileConfig.Currency.Yen < shopItem.price) return interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  Sorry ${interaction.user.username}`,
							description: "You don't have enough Yen!",
							color: SenkoClient.colors.dark,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/senko/heh.png"
							}
						}
					],
					ephemeral: true
				});

				interaction.reply({
					content: `${interaction.user}`,
					embeds: [
						{
							title: "Confirm Purchase!",
							description: `Are you sure you want to purchase __${shopItem.name}__ for ${Icons.yen} __${shopItem.price}x__?`,
							color: SenkoClient.colors.light,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/senko/package.png"
							}
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Purchase", style: 3, custom_id: `shop_confirm-${Object.keys(shopItems).indexOf(itemName)}-${interaction.user.id}` },
								{ type: 2, label: "Put back", style: 4, custom_id: `shop_cancel-${interaction.user.id}` }
							]
						}
					]
				});
			}

			if (interaction.isButton() && interaction.customId.startsWith("shop_confirm")) {
				const item = interaction.customId.split("-");
				const itemName = Object.keys(shopItems).at(item[1]);
				const shopItem = shopItems[itemName];

				if (item[2] != interaction.user.id) return interaction.reply({ content: "You cannot steal items, that's illegal!", ephemeral: true });

				const accountData = await fetchSuperUser(interaction.user);

				const MessageStructure = {
					embeds: [
						{
							title: `${Icons.heart}  See you next time!`,
							description: `Thanks for purchasing **${shopItem.name}** for ${Icons.yen} ${shopItem.price}x!`,
							color: SenkoClient.colors.dark,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/senko/tofu.png"
							}
						}
					],
					components: []
				};

				accountData.LocalUser.profileConfig.Currency.Yen = accountData.LocalUser.profileConfig.Currency.Yen - shopItem.price;

				if (accountData.LocalUser.profileConfig.Inventory[itemName]) {
					accountData.LocalUser.profileConfig.Inventory[itemName] + shopItem.amount || 1;

					await updateSuperUser(interaction.user, {
						LocalUser: accountData.LocalUser
					});
				} else {
					accountData.LocalUser.profileConfig.Inventory[itemName] = shopItem.amount;

					await updateSuperUser(interaction.user, {
						LocalUser: accountData.LocalUser
					});
				}

				interaction.update(MessageStructure);
			}

			if (interaction.isButton() && interaction.customId === `shop_cancel-${interaction.user.id}`) {
				interaction.update({
					embeds: [
						{
							title: `${Icons.exclamation}  Very well then`,
							description: "I'll put back your item and hopefully you can buy it next time!",
							color: SenkoClient.colors.dark,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/senko/smile.png"
							}
						}
					],
					components: []
				});
			} else {
				if (interaction.isButton() && interaction.customId.startsWith("shop_cancel-")) return interaction.reply({ content: "I can't put things back that aren't yours", ephemeral: true });
			}

			if (interaction.isSelectMenu() && interaction.customId == "shop_preview") {
				const item = interaction.values[0].split("_").splice(1, 3);

				const itemName = Object.keys(shopItems).at(item[0]);
				const shopItem = await shopItems[itemName];

				const MessageStructure = {
					embeds: [
						{
							title: `${shopItem.name}`,
							description: `${shopItem.desc}\n`,
							color: shopItem.color || SenkoClient.colors.dark,
							fields: [
								{ name: `${Icons.yen}`, value: `${shopItem.price}x`, inline: true }
							]
						}
					],

					files: [],
					ephemeral: true
				};

				if (shopItem.title) MessageStructure.embeds[0].fields.push({ name: "Title", value: `${shopItem.title || Icons.tick}`, inline: true });
				if (shopItem.badge) MessageStructure.embeds[0].fields.push({ name: "Badge", value: `${shopItem.badge || Icons.tick}`, inline: true });
				if (shopItem.color) MessageStructure.embeds[0].fields.push({ name: "Colored", value: "** **", inline: true });
				if (shopItem.banner) {
					MessageStructure.embeds[0].image = { url: `attachment://${shopItem.banner}` };
					MessageStructure.files.push({ attachment: `./src/Data/content/banners/${shopItem.banner}`, name: shopItem.banner });
				}

				interaction.update(MessageStructure);
			}
		});
	}
};