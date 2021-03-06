// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { randomArray, randomNumber, addYen, awardAchievement, calcTimeLeft } = require("../../API/Master.js");
const config = require("../../Data/DataConfig.json");
const { updateSuperUser } = require("../../API/super");

const reactions = [
	{
		image: "fluffed.png",
		sounds: ["Uya", "Uya...", "mhMh"],
		text: ["D-Do you have to be so verbose?", "Please be more gentle with my tail!"]
	},
	{
		image: "fluffed_2.png",
		sounds: ["Uya!", "HYaa", "mhMh"]
	}
];

const UserInput = [
	"_USER_ strokes Senko's tail",
	"_USER_ fluffs Senko-san",
	"_USER_ caresses Senko's tail",
	"_USER_ ingulfs in Senko's fluffy tail",
	"_USER_ hugs Senko's silky tail",
	"_USER_ cuddles Senko's tail"
];

const Responses = [
	`${Icons.flushed}  Please be more gentle with my tail!`,
	`${Icons.exclamation}  Do you have to be so verbose?`,
	`${Icons.question}  You can't stay like that forever, can you?`,
	"Be more careful! It's very delicate...",
	"I'm not sure how much I can handle...",
	Icons.flushed,
	"...",
	"How dare you!",
	`${Icons.exclamation}  EHYAAAAA!!`
];

const Sounds = [
	"euHa",
	"Mhmh",
	"Uya!",
	"HYaa",
	"Umu~",
	"Uya...",
	"EHYAAAAA!!"
];


module.exports = {
	name: "fluff",
	desc: "Mofumofu!",
	userData: true,
	defer: true,
	category: "fun",
	/**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, accountData) => {
		if (calcTimeLeft(accountData.RateLimits.Fluff_Rate.Date, config.cooldowns.daily)) {
			accountData.RateLimits.Fluff_Rate.Amount = 0;
			accountData.RateLimits.Fluff_Rate.Date = Date.now();

			await updateSuperUser(interaction.user, {
				RateLimits: accountData.RateLimits
			});

			accountData.RateLimits.Fluff_Rate.Amount = 0;
		}

		if (accountData.RateLimits.Fluff_Rate.Amount >= 50) return interaction.followUp({
			embeds: [
				{
					description: `I don't want to right now! W-We can <t:${Math.floor((accountData.RateLimits.Fluff_Rate.Date + config.cooldowns.daily) / 1000)}:R> though...`,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/upset2.png" },
					color: SenkoClient.colors.light
				}
			]
		});

		// if (Stats.Fluffs >= 10) await awardAchievement(interaction, "NewFloofer");
		// if (Stats.Fluffs >= 50) await awardAchievement(interaction, "AdeptFloofer");
		// if (Stats.Fluffs >= 100) await awardAchievement(interaction, "MasterFloofer");

		accountData.Stats.Fluffs++;
		accountData.RateLimits.Fluff_Rate.Amount++;
		accountData.RateLimits.Fluff_Rate.Date = Date.now();

		await updateSuperUser(interaction.user, {
			Stats: accountData.Stats,
			RateLimits: accountData.RateLimits
		});

		const MessageStruct = {
			embeds: [
				{
					title: randomArray(UserInput).replace("_USER_", interaction.user.username),
					description: randomArray(Responses),
					color: SenkoClient.colors.light,
					thumbnail: {
						url: `https://assets.senkosworld.com/media/senko/${randomArray(["fluffed", "fluffed2", "pout"])}.png`
					}
				}
			]
		};

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 10);

			MessageStruct.embeds[0].description += `\n\n??? ${Icons.yen}  10x added for interaction`;
		}

		if (randomNumber(500) < 5) {
			MessageStruct.embeds[0].description += `\n\nYou found a rare item!\n??? ${Icons.tofu}  1x tofu added`;
			accountData.LocalUser.profileConfig.Currency.Tofu++;
			await updateSuperUser(interaction.user, {
				LocalUser: accountData.LocalUser
			});
		}

		interaction.followUp(MessageStruct);
	}
};