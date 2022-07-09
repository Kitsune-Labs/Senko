// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client } = require("discord.js");
const ShopItems = require("../../Data/Shop/Items.json");

module.exports = {
	name: "read",
	desc: "Read the manga chapters you get from the market!",
	userData: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
	start: async (SenkoClient, interaction, GuildData, accountData) => {
		const OwnedChapters = [];

		new Promise((resolve) => {
			for (var item of Object.keys(accountData.LocalUser.profileConfig.Inventory)) {
				const ShopItem = ShopItems[item];
				if (ShopItem && ShopItem.manga) {
					OwnedChapters.push({ label: `${ShopItem.name}`, value: `read_${ShopItem.manga}`, description: `${ShopItem.desc}`});
				}
			}

			resolve();
		}).then(() => {
			if (OwnedChapters.length === 0) return interaction.followUp({
				embeds: [
					{
						title: "You don't own any chapters!",
						description: "You can buy them when they're avaliable in the shop!",
						color: SenkoClient.colors.light,
						thumbnail: { url: "attachment://image.png" }
					}
				],
				files: [{ attachment: "./src/Data/content/senko/what.png", name: "image.png" }],
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
								custom_id: "read_manga",
								options: OwnedChapters
							}
						]
					}
				]
			});
		});
	}
};
