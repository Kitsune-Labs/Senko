import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import Icons from "../Data/Icons.json";
import { updateSuperUser, fetchSuperUser, fetchMarket } from "../API/super";
import type { SenkoCommand } from "../types/AllTypes";

export default {
	name: "award",
	defer: true,
	ephemeral: true,
	options: [
		{
			name: "user-id",
			description: "User Id",
			type: CommandOption.String,
			required: true
		},
		{
			name: "item",
			description: "Item ID from the shop",
			type: CommandOption.String,
			required: true
		}
	],
	start: async ({senkoClient, interaction}) => {
		if (interaction.user.id !== "609097445825052701") return;
		const ShopItems = await fetchMarket();
		// @ts-ignore
		const User = interaction.options.getString("user-id");
		// @ts-ignore
		const DevItem = ShopItems[interaction.options.getString("item")];
		const FetchedUser = await senkoClient.users.fetch(User);

		if (!DevItem) return interaction.followUp({ content: "item null", ephemeral: true });
		if (!FetchedUser) return interaction.followUp({ content: "user null", ephemeral: true });

		const accountData = await fetchSuperUser(FetchedUser);
		// @ts-ignore
		accountData.LocalUser.profileConfig.claimableItems.push(interaction.options.getString("item"));

		await updateSuperUser(FetchedUser, {
			LocalUser: accountData!.LocalUser
		});

		FetchedUser.send({
			embeds: [
				{
					title: `${Icons.package}  You received an item from Senko-san!`,
					description: `**I-I FOUND THIS FOR YOU!**\n\n__${DevItem.name}__ is now claimable with **/claim items**!`,
					color: senkoClient.api.Theme.light,
					thumbnail: { url: "https://cdn.senko.gg/public/senko/excited.png" }
				}
			]
		}).catch();

		interaction.followUp({
			content: `Added ${DevItem.name} to Claimable Items`,
			ephemeral: true
		});
	}
} as SenkoCommand;