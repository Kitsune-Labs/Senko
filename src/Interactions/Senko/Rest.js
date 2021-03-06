// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

const config = require("../../Data/DataConfig.json");
const { randomBummedImageName, randomNumber, addYen, randomArray, calcTimeLeft } = require("../../API/Master");
const { updateSuperUser } = require("../../API/super");


const UserActions = [
	"_USER_ rest's on Senko's lap",
	"_USER_ gets pampered by Senko-san"
];

const Responses = [
	"It's alright dear, i'm here for you...",
	"Relax dear, don't stress yourself too much",
	"*Senko-san starts to hum*",
	`${Icons.heart}  Rest now, you'll need your energy tomorrow`
];

const NoMore = [
	"I do not think you should rest anymore today\nYou may rest more _TIMELEFT_",
	"If you rest more you won't be tired tonight!\nYou can rest again _TIMELEFT_"
];

module.exports = {
	name: "rest",
	desc: "Rest on Senkos lap",
	userData: true,
	defer: true,
	category: "fun",
	/**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, accountData) => {
		const MessageStruct = {
			embeds: [
				{
					description: `**${randomArray(Responses)}**\n\n*${randomArray(UserActions).replace("_USER_", interaction.user.username)}*`,
					color: SenkoClient.colors.light,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/cuddle.png"
					}
				}
			]
		};

		if (calcTimeLeft(accountData.RateLimits.Rest_Rate.Date, config.cooldowns.daily)) {
			accountData.RateLimits.Rest_Rate.Amount = 0;
			accountData.RateLimits.Rest_Rate.Date = Date.now();

			await updateSuperUser(interaction.user, {
				RateLimits: accountData.RateLimits
			});

			accountData.RateLimits.Rest_Rate.Amount = 0;
		}


		if (accountData.RateLimits.Rest_Rate.Amount >= 5) {
			MessageStruct.embeds[0].description = `${randomArray(NoMore).replace("_TIMELEFT_", `<t:${Math.floor(accountData.RateLimits.Rest_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.embeds[0].thumbnail.url = `https://assets.senkosworld.com/media/senko/${randomBummedImageName()}.png`;

			return interaction.followUp(MessageStruct);
		}


		accountData.Stats.Rests++;
		accountData.RateLimits.Rest_Rate.Amount++;
		accountData.RateLimits.Rest_Rate.Date = Date.now();

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 50);

			MessageStruct.embeds[0].description += `\n\n??? ${Icons.yen}  50x added for interaction`;
		}


		await updateSuperUser(interaction.user, {
			Stats: accountData.Stats,

			RateLimits: accountData.RateLimits
		});

		if (accountData.RateLimits.Rest_Rate.Amount >= 5) MessageStruct.embeds[0].description += `\n\n??? ${Icons.bubble}  Senko-san asks you to stop resting for today`;


		interaction.followUp(MessageStruct);
	}
};