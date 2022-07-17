// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

const config = require("../../Data/DataConfig.json");
const { randomArray, randomBummedImageName, calcTimeLeft } = require("../../API/Master");
const { randomArrayItem } = require("@kitsune-labs/utilities");
const { updateSuperUser } = require("../../API/super");

const UserActions = [
	"_USER_ rest's on Senko's lap",
	"_USER_ sleeps on Senko's lap",
	"_USER_ passes out while being pampered",
	"_USER_ gets pampered by Senko's tail"
];

const Responses = [
	"There there dear, you've had a stressful day today",
	"Sweet dreams dear",
	`${Icons.ThinkCloud}  *I hope you sleep well...*`,
	"I'll continue to pamper you with my tail dear!"
];

const NoMore = [
	"I do not think you should sleep again\nYou may sleep  _TIMELEFT_",
	"Don't sleep dear!\nYou should sleep _TIMELEFT_"
];


module.exports = {
	name: "sleep",
	desc: "Sleep on Senko's lap",
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
					description: `**${randomArrayItem(Responses)}**\n\n*${randomArrayItem(UserActions).replace("_USER_", interaction.user.username)}*`,
					color: SenkoClient.colors.light,
					thumbnail: {
						url: `https://assets.senkosworld.com/media/senko/${randomArrayItem(["cuddle", "sleep"])}`
					}
				}
			]
		};

		if (calcTimeLeft(accountData.RateLimits.Sleep_Rate.Date, config.cooldowns.daily)) {
			accountData.RateLimits.Sleep_Rate.Amount = 0;
			accountData.RateLimits.Sleep_Rate.Date = Date.now();

			await updateSuperUser(interaction.user, {
				RateLimits: accountData.RateLimits
			});

			accountData.RateLimits.Sleep_Rate.Amount = 0;
		}


		if (accountData.RateLimits.Sleep_Rate.Amount >= 1) {
			MessageStruct.embeds[0].description = `${randomArray(NoMore).replace("_TIMELEFT_", `<t:${Math.floor(accountData.RateLimits.Sleep_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.embeds[0].thumbnail.url = `https://assets.senkosworld.com/media/senko/${randomBummedImageName()}.png`;

			return interaction.followUp(MessageStruct);
		}

		accountData.Stats.Sleeps++;
		accountData.RateLimits.Sleep_Rate.Amount++;
		accountData.RateLimits.Sleep_Rate.Date = Date.now();

		await updateSuperUser(interaction.user, {
			Stats: accountData.Stats,

			RateLimits: accountData.RateLimits
		});

		interaction.followUp(MessageStruct);

	}
};