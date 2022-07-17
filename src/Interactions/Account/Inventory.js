const { fetchMarket } = require("../../API/super");
const Paginate = require("../../API/Pagination/Main");
const Icons = require("../../Data/Icons.json");

module.exports = {
	name: "inventory",
	desc: "View the items you have collected",
	userData: true,
	defer: true,
	ephemeral: true,
	category: "account",
	/**
	 * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction, GuildData, accountData) => {
		const ShopItems = await fetchMarket();
		const PageEstimate = Math.ceil(Object.keys(accountData.LocalUser.profileConfig.Inventory).length / 8) < 1 ? 1 : Math.ceil(Object.keys(accountData.LocalUser.profileConfig.Inventory).length / 8);
		const Pages = [];

		for (let i = 0; i < PageEstimate; i++) {
			const Page = {
				description: "",
				color: SenkoClient.colors.light
			};

			for (let j = 0; j < 8; j++) {
				const Item = Object.keys(accountData.LocalUser.profileConfig.Inventory)[i * 8 + j];
				if (Item) {
					const shopItem = ShopItems[Item];

					Page.description += `**${shopItem ? shopItem.name : `Data missing: ${Item}`}**\n${shopItem ? `> ${shopItem.desc}` : ""}\n> You own **${accountData.LocalUser.profileConfig.Inventory[Item]}**\n\n`;
				}
			}

			Pages.push(Page);
		}

		if (Pages[0].description === "") return interaction.followUp({
			embeds: [
				{
					title: `${Icons.exclamation} It's empty!`,
					description: "We should probably buy some stuff to fill it up",
					color: SenkoClient.colors.dark,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/hat_think.png" }
				}
			],
			ephemeral: true
		});

		Paginate(interaction, Pages, 60000, true);
	}
};