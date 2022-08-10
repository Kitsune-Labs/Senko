// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const { randomArrayItem } = require("@kitsune-labs/utilities");
const { updateSuperUser } = require("../../API/super");

module.exports = {
	name: "work",
	desc: "Have Nakano go to work to provide income",
	userData: true,
	category: "economy",
	/**
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction, GuildData, accountData) => {
		const DestructibleItems = [
			{
				name: "air conditioner",
				price: 300,
				type: "replace"
			},
			{
				name: "refrigerator",
				price: 500,
				type: "repair"
			},
			{
				name: "rice cooker",
				price: 100,
				type: "replace"
			},
			{
				name: "TV",
				price: 500,
				type: "replace"
			},
			{
				name: "vacuum",
				price: 300,
				type: "repair"
			}
		];

		const DestroyedItem = Math.floor(Math.random() * DestructibleItems.length);
		const Item = DestructibleItems[DestroyedItem];
		const RNG = Math.floor(Math.random() * 100);

		const Cooldown = config.cooldowns.daily;

		if (Cooldown - (Date.now() - accountData.Rewards.Work) >= 0) {
			interaction.reply({
				embeds: [
					{
						title: `${Icons.exclamation}  Not going to happen.`,
						description: `Come back <t:${Math.floor((accountData.Rewards.Work + Cooldown) / 1000)}:R> if you want your next paycheck.`,
						color: SenkoClient.colors.dark,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/Yotsutani/Yotsutani.png"
						}
					}
				],
				ephemeral: true
			});
		} else {
			if (RNG <= 30) {
				accountData.LocalUser.profileConfig.Currency.Yen = accountData.LocalUser.profileConfig.Currency.Yen + 600 - Item.price;
				accountData.Rewards.Work = Date.now();

				await updateSuperUser(interaction.user, {
					LocalUser: accountData.LocalUser,
					Rewards: accountData.Rewards
				});

				interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  You arrived at your home and something happened.`,
							description: `Senko told you ${Item.name} had broken. It cost you ${Icons.yen}  ${Item.price}x to ${Item.type}.\n\n— ${Icons.yen}  ${600 - Item.price}x added`,
							color: SenkoClient.colors.dark,
							thumbnail: {
								url: `https://assets.senkosworld.com/media/senko/${randomArrayItem(["heh", "heh2", "judgement", "upset"])}.png`
							}
						}
					]
				});
			} else {
				accountData.LocalUser.profileConfig.Currency.Yen = accountData.LocalUser.profileConfig.Currency.Yen + 600;
				accountData.Rewards.Work = Date.now();

				await updateSuperUser(interaction.user, {
					LocalUser: accountData.LocalUser,
					Rewards: accountData.Rewards
				});

				interaction.reply({
					embeds: [
						{
							title: `${Icons.yen}  Here is your check.`,
							description: `I'll make sure to pay you again tomorrow.\n\n— ${Icons.yen} 600x added`,
							color: SenkoClient.colors.light,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/Yotsutani/Yotsutani.png"
							}
						}
					]
				});
			}
		}
	}
};