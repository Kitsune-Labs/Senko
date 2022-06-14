const ShopItems = require("../../Data/Shop/Items.json");
const Paginate = require("../../API/Pagination/Main");
const Icons = require("../../Data/Icons.json");

module.exports = {
	name: "inventory",
	desc: "View the items you have collected",
	userData: true,
	defer: true,
	ephemeral: true,
	/**
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction, GuildData, { Inventory }) => {
		const PageEstimate = Math.ceil(Inventory.length / 8) < 1 ? 1 : Math.ceil(Inventory.length / 8);
		const Pages = [];

		for (let i = 0; i < PageEstimate; i++) {
			const Page = {
				description: "",
				color: SenkoClient.colors.light
			};

			for (let j = 0; j < 8; j++) {
				const Item = Inventory[i * 8 + j];
				if (Item) {
					const shopItem = ShopItems[Item.codename];

					Page.description += `**${shopItem ? shopItem.name : `Data missing: ${Item.codename}`}**\n${shopItem ? `> "${shopItem.desc}"` : ""}\n> You own **${Item.amount}**\n\n`;
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
					thumbnail: { url: "attachment://image.png" }
				}
			],
			files: [{ attachment: "./src/Data/content/senko/hat_think.png", name: "image.png" }],
			ephemeral: true
		});

		Paginate(interaction, Pages, 60000, true);
	}
};