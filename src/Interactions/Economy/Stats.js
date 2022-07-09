const Icons = require("../../Data/Icons.json");

module.exports = {
	name: "stats",
	desc: "View your account stats",
	userData: true,
	usableAnywhere: true,
	defer: true,
	ephemeral: true,
	/**
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction, GuildData, accountData) => {
		const StatsTitle = ["Here are your stats dear!", "Here you go!"];

		const Currency = accountData.LocalUser.profileConfig.Currency;
		const Stats = accountData.Stats;

		interaction.followUp({
			embeds: [
				{
					title: `${StatsTitle[Math.floor(Math.random() * StatsTitle.length)]}`,

					fields: [
						{ name: `${Icons.yen}`, value: `${Currency.Yen}x`, inline: true },
						{ name: `${Icons.tofu}`, value: `${Currency.Tofu}x`, inline: true },
						{ name: `${Icons.tail1}`, value: `${Stats.Fluffs}x`, inline: true },
						{ name: "Pats", value: `${Stats.Pats}x`, inline: true },
						{ name: "Hugs", value: `${Stats.Hugs}x`, inline: true },
						{ name: "Sleeps", value: `${Stats.Sleeps}x`, inline: true },
						{ name: "Smiles", value: `${Stats.Smiles}x`, inline: true },
						{ name: "Steps", value: `${Stats.Steps}x`, inline: true },
						{ name: "Drinks", value: `${Stats.Drinks}x`, inline: true }
					],
					color: SenkoClient.colors.random(),
					thumbnail: {
						url: "attachment://image.png"
					}
				}
			],
			files: [{ attachment: "./src/Data/content/senko/idle.png", name: "image.png" }],
			ephemeral: true
		});
	}
};