import { ApplicationCommandOptionType as CommandOption } from "discord.js";
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
	start: async ({ Senko, Interaction }) => {
		if (Interaction.user.id !== "609097445825052701") return;
		const ShopItems = await fetchMarket();
		const User = Interaction.options.getString("user-id", true);
		const DevItem = ShopItems[Interaction.options.getString("item", true)];
		const FetchedUser = await Senko.users.fetch(User);

		if (!DevItem) return Interaction.followUp({ content: "item null", ephemeral: true });
		if (!FetchedUser) return Interaction.followUp({ content: "user null", ephemeral: true });

		const accountData = await fetchSuperUser(FetchedUser);

		if (!accountData) return Interaction.followUp({ content: "account data not found", ephemeral: true });

		accountData.LocalUser.profileConfig.claimableItems.push(Interaction.options.getString("item", true));

		await updateSuperUser(FetchedUser, {
			LocalUser: accountData!.LocalUser
		});

		FetchedUser.send({
			embeds: [
				{
					title: `${Senko.Icons.package}  You received an item from Senko-san!`,
					description: `**I-I FOUND THIS FOR YOU!**\n\n__${DevItem.name}__ is now claimable with **/claim items**!`,
					color: Senko.Theme.light,
					thumbnail: { url: "https://cdn.senko.gg/public/senko/excited.png" }
				}
			]
		}).catch();

		Interaction.followUp({
			content: `Added ${DevItem.name} to Claimable Items`,
			ephemeral: true
		});
	}
} as SenkoCommand;