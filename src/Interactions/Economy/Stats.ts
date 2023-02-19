import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "stats",
	desc: "View your account stats",
	usableAnywhere: true,
	defer: true,
	ephemeral: true,
	category: "account",
	start: async ({senkoClient, interaction, userData}) => {
		const StatsTitle = ["Here are your stats dear!", "Here you go!"];

		const Currency = userData.LocalUser.profileConfig.Currency;
		const Stats = userData.Stats;

		interaction.followUp({
			embeds: [
				{
					title: `${StatsTitle[Math.floor(Math.random() * StatsTitle.length)]}`,

					fields: [
						{ name: `${senkoClient.api.Icons.yen}`, value: `${Currency.Yen}x`, inline: true },
						{ name: `${senkoClient.api.Icons.tofu}`, value: `${Currency.Tofu}x`, inline: true },
						{ name: `${senkoClient.api.Icons.tail1}`, value: `${Stats.Fluffs}x`, inline: true },
						{ name: "Pats", value: `${Stats.Pats}x`, inline: true },
						{ name: "Hugs", value: `${Stats.Hugs}x`, inline: true },
						{ name: "Sleeps", value: `${Stats.Sleeps}x`, inline: true },
						{ name: "Smiles", value: `${Stats.Smiles}x`, inline: true },
						{ name: "Steps", value: `${Stats.Steps}x`, inline: true },
						{ name: "Drinks", value: `${Stats.Drinks}x`, inline: true }
					],
					color: senkoClient.api.Theme.random(),
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/idle.png"
					}
				}
			],
			ephemeral: true
		});
	}
} as SenkoCommand;