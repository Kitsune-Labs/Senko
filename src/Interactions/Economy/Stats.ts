import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "stats",
	desc: "View your account stats",
	usableAnywhere: true,
	defer: true,
	ephemeral: true,
	category: "account",
	start: async ({ Senko, Interaction, MemberData }) => {
		const StatsTitle = ["Here are your stats dear!", "Here you go!"];

		const Currency = MemberData.LocalUser.profileConfig.Currency;
		const Stats = MemberData.Stats;

		Interaction.followUp({
			embeds: [
				{
					title: `${StatsTitle[Math.floor(Math.random() * StatsTitle.length)]}`,

					fields: [
						{ name: `${Senko.Icons.yen}`, value: `${Currency.Yen}x`, inline: true },
						{ name: `${Senko.Icons.tofu}`, value: `${Currency.Tofu}x`, inline: true },
						{ name: `${Senko.Icons.tail1}`, value: `${Stats.Fluffs}x`, inline: true },
						{ name: "Pats", value: `${Stats.Pats}x`, inline: true },
						{ name: "Hugs", value: `${Stats.Hugs}x`, inline: true },
						{ name: "Sleeps", value: `${Stats.Sleeps}x`, inline: true },
						{ name: "Smiles", value: `${Stats.Smiles}x`, inline: true },
						{ name: "Steps", value: `${Stats.Steps}x`, inline: true },
						{ name: "Drinks", value: `${Stats.Drinks}x`, inline: true }
					],
					color: Senko.Theme.random(),
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/idle.png"
					}
				}
			],
			ephemeral: true
		});
	}
} as SenkoCommand;