// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits: Permissions, ApplicationCommandOptionType: CommandOption, ChannelType, Colors } = require("discord.js");
const { randomArray, randomNumber, addYen, calcTimeLeft } = require("../../API/Master.js");
const config = require("../../Data/DataConfig.json");
const { updateSuperUser } = require("../../API/super");

// const reactions = [
// 	{
// 		image: "fluffed.png",
// 		sounds: ["Uya", "Uya...", "mhMh"],
// 		text: ["D-Do you have to be so verbose?", "Please be more gentle with my tail!"]
// 	},
// 	{
// 		image: "fluffed_2.png",
// 		sounds: ["Uya!", "HYaa", "mhMh"]
// 	}
// ];

// const Sounds = [
// 	"euHa",
// 	"Mhmh",
// 	"Uya!",
// 	"HYaa",
// 	"Umu~",
// 	"Uya...",
// 	"EHYAAAAA!!"
// ];

module.exports = {
	name: "fluff",
	desc: "Mofumofu!",
	userData: true,
	defer: true,
	category: "fun",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, userData, locale, generalLocale}) => {
		if (calcTimeLeft(userData.RateLimits.Fluff_Rate.Date, config.cooldowns.daily)) {
			userData.RateLimits.Fluff_Rate.Amount = 0;
			userData.RateLimits.Fluff_Rate.Date = Date.now();

			await updateSuperUser(interaction.user, {
				RateLimits: userData.RateLimits
			});

			userData.RateLimits.Fluff_Rate.Amount = 0;
		}

		if (userData.RateLimits.Fluff_Rate.Amount >= 50) return interaction.followUp({
			embeds: [
				{
					description: locale.RateLimit.replace("_TIME_", `<t:${Math.floor((userData.RateLimits.Fluff_Rate.Date + config.cooldowns.daily) / 1000)}:R>`), //`I don't want to right now! W-We can <t:${Math.floor((userData.RateLimits.Fluff_Rate.Date + config.cooldowns.daily) / 1000)}:R> though...`,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/upset2.png" },
					color: senkoClient.api.Theme.light
				}
			]
		});

		// if (Stats.Fluffs >= 10) await awardAchievement(interaction, "NewFloofer");
		// if (Stats.Fluffs >= 50) await awardAchievement(interaction, "AdeptFloofer");
		// if (Stats.Fluffs >= 100) await awardAchievement(interaction, "MasterFloofer");

		userData.Stats.Fluffs++;
		userData.RateLimits.Fluff_Rate.Amount++;
		userData.RateLimits.Fluff_Rate.Date = Date.now();

		await updateSuperUser(interaction.user, {
			Stats: userData.Stats,
			RateLimits: userData.RateLimits
		});

		const MessageStruct = {
			embeds: [
				{
					title: randomArray(locale.UserInput).replace("_USER_", interaction.user.username),
					description: randomArray(locale.Responses),
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: `https://assets.senkosworld.com/media/senko/${randomArray(["fluffed", "fluffed2", "pout"])}.png`
					}
				}
			]
		};

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 10);

			MessageStruct.embeds[0].description += generalLocale.YenAwarded.replace("_AMOUNT_", "10"); // `\n\n— ${Icons.yen}  10x added for interaction`;
		}

		if (randomNumber(500) < 5) {
			MessageStruct.embeds[0].description += generalLocale.TofuAwarded.replace("_AMOUNT_", "1"); // `\n\nYou found a rare item!\n— ${Icons.tofu}  1x tofu added`;
			userData.LocalUser.profileConfig.Currency.Tofu++;
			await updateSuperUser(interaction.user, {
				LocalUser: userData.LocalUser
			});
		}

		interaction.followUp(MessageStruct);
	}
};