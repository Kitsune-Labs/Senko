
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const { randomArray, randomNumber, addYen, calcTimeLeft } = require("../../API/Master");
const { updateSuperUser } = require("../../API/super");

const Responses = [
	"_USER_ pats Senko's head",
	"_USER_ pats Senko-san",
	"_USER_ gives Senko a pat on her head",
	"_USER_ ruffles Senko's hair",
	"_USER_ caresses Senko's ears",
	"_USER_ touches Senko's ears",
	`${Icons.flushed}  _USER_, Please be more gentle with my ears, they're very precious!`
];

const Sounds = [
	"Uya...",
	"Umu~",
	"euH",
	"mhMh",
	"Uh-Uya!",
	"mmu",
	"Hnng"
];

const MoreResponses = [
	`${Icons.heart}  You can pat me more _TIMELEFT_`,
	`${Icons.exclamation}  No more patting today, come back _TIMELEFT_!`,
	`${Icons.heart}  You can expect more pats _TIMELEFT_, look forward to it!`
];

module.exports = {
	name: "pat",
	desc: "Pat Senko's Head (Don't touch her ears!)",
	userData: true,
	defer: true,
	category: "fun",
	/**
     * @param {CommandInteraction} interaction
     */
	start: async ({senkoClient, interaction, userData}) => {
		const MessageStruct = {
			embeds: [
				{
					description: randomArray(Responses).replace("_USER_", interaction.user.username),
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/pat.png"
					}
				}
			]
		};

		if (calcTimeLeft(userData.RateLimits.Pat_Rate.Date, config.cooldowns.daily)) {
			userData.RateLimits.Pat_Rate.Amount = 0;
			userData.RateLimits.Pat_Rate.Date = Date.now();

			await updateSuperUser(interaction.user, {
				RateLimits: userData.RateLimits
			});

			userData.RateLimits.Pat_Rate.Amount = 0;
		}


		if (userData.RateLimits.Pat_Rate.Amount >= 20) {
			MessageStruct.embeds[0].description = `${randomArray(MoreResponses).replace("_TIMELEFT_", `<t:${Math.floor(userData.RateLimits.Pat_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.embeds[0].thumbnail.url = `https://assets.senkosworld.com/media/senko/${randomArray(["huh", "think"])}.png`;

			return interaction.followUp(MessageStruct);
		}


		userData.Stats.Pats++;
		userData.RateLimits.Pat_Rate.Amount++;
		userData.RateLimits.Pat_Rate.Date = Date.now();

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 50);

			MessageStruct.embeds[0].description += `\n\n— ${Icons.yen}  50x added for interaction`;
		}


		MessageStruct.embeds[0].title = randomArray(Sounds);

		await updateSuperUser(interaction.user, {
			Stats: userData.Stats,

			RateLimits: userData.RateLimits
		});

		if (userData.RateLimits.Pat_Rate.Amount >= 20) MessageStruct.embeds[0].description += `\n\n— ${Icons.bubble}  Senko-san asks you to stop patting her for today`;


		interaction.followUp(MessageStruct);
	}
};