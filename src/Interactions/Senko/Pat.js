
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const { updateUser, randomArray, randomBummedImageName, randomNumber, addYen, calcTimeLeft } = require("../../API/Master");

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
	/**
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction, GuildData, { RateLimits, Stats }) => {
		const MessageStruct = {
			embeds: [
				{
					description: randomArray(Responses).replace("_USER_", interaction.user.username),
					color: SenkoClient.colors.light,
					thumbnail: {
						url: "attachment://image.png"
					}
				}
			],
			files: [{ attachment: "./src/Data/content/senko/pat.png", name: "image.png" }]
		};

		if (calcTimeLeft(RateLimits.Pat_Rate.Date, config.cooldowns.daily)) {
			await updateUser(interaction.user, {
				RateLimits: {
					Pat_Rate: {
						Amount: 0,
						Date: Date.now()
					}
				}
			});

			RateLimits.Pat_Rate.Amount = 0;
		}


		if (RateLimits.Pat_Rate.Amount >= 20) {
			MessageStruct.embeds[0].description = `${randomArray(MoreResponses).replace("_TIMELEFT_", `<t:${Math.floor(RateLimits.Pat_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.files = [{ attachment: `./src/Data/content/senko/${randomBummedImageName()}.png`, name: "image.png" }];

			return interaction.followUp(MessageStruct);
		}


		Stats.Pats++;
		RateLimits.Pat_Rate.Amount++;

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 50);

			MessageStruct.embeds[0].description += `\n\n— ${Icons.yen}  50x added for interaction`;
		}


		MessageStruct.embeds[0].title = randomArray(Sounds);

		await updateUser(interaction.user, {
			Stats: { Hugs: Stats.Hugs },

			RateLimits: {
				Pat_Rate: {
					Amount: RateLimits.Pat_Rate.Amount,
					Date: Date.now()
				}
			}
		});

		if (RateLimits.Pat_Rate.Amount >= 20) MessageStruct.embeds[0].description += `\n\n— ${Icons.bubble}  Senko-san asks you to stop patting her for today`;


		interaction.followUp(MessageStruct);
	}
};