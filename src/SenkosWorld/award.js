const Icons = require("../Data/Icons.json");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const { updateSuperUser, fetchSuperUser, fetchMarket } = require("../API/super");


module.exports = {
	name: "award",
	desc: "for use by developers",
	defer: true,
	ephemeral: true,
	permissions: "0",
	noGlobal: true,
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
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction}) => {
		if (interaction.user.id !== "609097445825052701") return;
		const ShopItems = await fetchMarket();
		const User = interaction.options.getString("user-id");
		const DevItem = ShopItems[interaction.options.getString("item")];
		const FetchedUser = await senkoClient.users.fetch(User);

		if (!DevItem) return interaction.followUp({ content: "item null", ephemeral: true });
		if (!FetchedUser) return interaction.followUp({ content: "user null", ephemeral: true });

		const accountData = await fetchSuperUser(FetchedUser);

		accountData.LocalUser.profileConfig.claimableItems.push(interaction.options.getString("item"));

		await updateSuperUser(FetchedUser, {
			LocalUser: accountData.LocalUser
		});

		FetchedUser.send({
			embeds: [
				{
					title: `${Icons.package}  You received an item from Senko-san!`,
					description: `**I-I FOUND THIS FOR YOU!**\n\n__${DevItem.name}__ is now claimable with **/claim items**!`,
					color: senkoClient.api.Theme.light,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/excited.png" }
				}
			]
		}).catch();

		interaction.followUp({
			content: `Added ${DevItem.name} to Claimable Items`,
			ephemeral: true
		});
	}
};