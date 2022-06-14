const Icons = require("../Data/Icons.json");
const ShopItems = require("../Data/Shop/Items.json");
const { updateUser } = require("../API/Master");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const { fetchData } = require("../API/Master");

module.exports = {
	name: "award",
	desc: "for use by developers",
	options: [
		{
			name: "user-id",
			description: "User Id",
			type: 3,
			required: true
		},
		{
			name: "item",
			description: "Item ID from the shop",
			type: 3,
			required: true
		}
	],
	defer: true,
	ephemeral: true,
	permissions: "0",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
	start: async (SenkoClient, interaction) => {
		if (interaction.user.id !== "609097445825052701") return interaction.followUp({ content: "🗿" });

		const User = interaction.options.getString("user");
		const DevItem = ShopItems[interaction.options.getString("item")];

		if (!DevItem) return interaction.followUp({ content: "item null", ephemeral: true });

		const FetchedUser = await SenkoClient.users.fetch(User);

		if (!FetchedUser) return interaction.followUp({ content: "user null", ephemeral: true });

		const { Inventory } = await fetchData(FetchedUser);
		const devResponse = {
			content: `Added ${DevItem.name} to inventory`,
			ephemeral: true
		};

		for (var Item of Inventory) {
			if (Item.codename === DevItem) {
				Item.amount++;

				await updateUser(FetchedUser, {
					Inventory: Inventory
				});



				FetchedUser.send({
					embeds: [
						{
							title: `${Icons.package}  You received an item from Senko-san!`,
							description: `__${DevItem.name}__ has been added to your inventory!`,
							color: SenkoClient.colors.light
						}
					]
				}).catch(e=>devResponse.footer.text = e);

				return interaction.followUp(devResponse);
			}
		}

		var InvItem = {
			codename: DevItem,
			amount: DevItem.amount
		};

		Inventory.push(InvItem);

		await updateUser(FetchedUser, {
			Inventory: Inventory
		});

		FetchedUser.send({
			embeds: [
				{
					title: `${Icons.package}  You received an item from Senko-san!`,
					description: `__${DevItem.name}__ has been added to your inventory!`,
					color: SenkoClient.colors.light
				}
			]
		}).catch();

		devResponse.description += "(Created new item)";

		interaction.followUp(devResponse);
	}
};