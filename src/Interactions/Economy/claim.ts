import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import Icons from "../../Data/Icons.json";
import { updateSuperUser, fetchMarket } from "../../API/super";
import { spliceArray } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "claim",
	desc: "Claim rewards from Senko",
	userData: true,
	category: "economy",
	options: [
		{
			name: "daily",
			description: "Claim your daily reward",
			type: CommandOption.Subcommand
		},
		{
			name: "weekly",
			description: "Claim your weekly reward",
			type: CommandOption.Subcommand
		},
		{
			name: "items",
			description: "Claim items Senko has given you",
			type: CommandOption.Subcommand
		}
	],
	start: async ({senkoClient, interaction, userData}) => {
		// @ts-expect-error
		const Command = interaction.options.getSubcommand();
		await interaction.deferReply();

		switch (Command) {
		case "daily":
			var DailyTimeStamp = userData.Rewards.Daily;
			var DailyCooldown = 86400000;

			if (DailyCooldown - (Date.now() - DailyTimeStamp) >= 0) return interaction.followUp({
				embeds: [
					{
						title: `${Icons.exclamation}  Sorry dear!`,
						description: `I've already given you your daily yen, come back to me <t:${Math.floor((DailyTimeStamp + DailyCooldown) / 1000)}:R>!`,
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/heh.png"
						}
					}
				],
				ephemeral: true
			});

			userData.LocalUser.profileConfig.Currency.Yen = userData.LocalUser.profileConfig.Currency.Yen + 200;
			userData.Rewards.Daily = Date.now();

			await updateSuperUser(interaction.user, {
				LocalUser: userData.LocalUser,
				Rewards: userData.Rewards
			});

			interaction.followUp({
				embeds: [
					{
						title: `${Icons.heart}  Here you go dear!`,
						description: `Spend it wisely and come back tomorrow!\n\n— ${Icons.yen} 200x added`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/happy.png"
						}
					}
				]
			});

			break;
		case "weekly":
			var WeeklyTimeStamp = userData.Rewards.Weekly;
			var WeeklyCooldown = 604800000;

			if (WeeklyCooldown - (Date.now() - WeeklyTimeStamp) >= 0) return interaction.followUp({
				embeds: [
					{
						title: `${Icons.exclamation}  Sorry dear!`,
						description: `From what I can remember i've given you your weekly yen, come back <t:${Math.floor((WeeklyTimeStamp + WeeklyCooldown) / 1000)}:R>!`,
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/hat_think.png"
						}
					}
				],
				ephemeral: true
			});

			userData.LocalUser.profileConfig.Currency.Yen = userData.LocalUser.profileConfig.Currency.Yen + 1400;
			userData.Rewards.Weekly = Date.now();

			await updateSuperUser(interaction.user, {
				LocalUser: userData.LocalUser,
				Rewards: userData.Rewards
			});

			interaction.followUp({
				embeds: [
					{
						title: `${Icons.heart}  It's that time again!`,
						description: `Here is your Yen for this week; Now spend it wisely!\n\n— ${Icons.yen} 1400x added`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/happy.png"
						}
					}
				]
			});
			break;
		case "items":
			var CI = userData.LocalUser.profileConfig.claimableItems;
			var inventory: any = userData.LocalUser.profileConfig.Inventory;
			var market = await fetchMarket();

			if (CI.length > 0) {
				const claimMessage = {
					embeds: [
						{
							title: "Here we are!",
							description: "I have these items for you to have!\n",
							color: senkoClient.api.Theme.light,
							thumbnail: {
								url: "https://cdn.senko.gg/public/senko/package.png"
							}
						}
					]
				};

				do {
					for (var item of CI) {
						inventory[item] ? inventory[item]++ : inventory[item] = 1;
						claimMessage.embeds[0]!.description += `\n- ${market[item].name}`;
						// @ts-ignore
						spliceArray(CI, item);
					}
				} while (CI.length > 0);

				await updateSuperUser(interaction.user, {
					LocalUser: userData.LocalUser
				});

				return interaction.followUp(claimMessage);
			}

			interaction.followUp({
				embeds: [
					{
						title: "Hmmm.....",
						description: "I've scourged around and couldn't find anything",
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/smile2.png"
						}
					}
				]
			});
			break;
		}
	}
} as SenkoCommand;