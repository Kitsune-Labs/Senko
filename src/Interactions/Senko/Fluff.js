// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { updateUser, randomArray, randomNumber, addYen, awardAchievement, calcTimeLeft } = require("../../API/Master.js");
const config = require("../../Data/DataConfig.json");

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
	/**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, { Stats, Currency, RateLimits }) => {
		if (!RateLimits.Fluff_Rate) {
			RateLimits.Fluff_Rate = {
				Amount: 0,
				Date: Date.now()
			};

			await updateUser(interaction.user, {
				RateLimits: RateLimits
			});
		}

		if (calcTimeLeft(RateLimits.Fluff_Rate.Date, config.cooldowns.daily)) {
			await updateUser(interaction.user, {
				RateLimits: {
					Fluff_Rate: {
						Amount: 0,
						Date: Date.now()
					}
				}
			});

			RateLimits.Fluff_Rate.Amount = 0;
		}

		if (RateLimits.Fluff_Rate.Amount >= 50) return interaction.followUp({
			embeds: [
				{
					description: `I don't want to right now! W-We can <t:${Math.floor((RateLimits.Fluff_Rate.Date + config.cooldowns.daily) / 1000)}:R> though...`,
					thumbnail: { url: "attachment://image.png" },
					color: SenkoClient.colors.light
				}
			],
			files: [{ attachment: "./src/Data/content/senko/upset2.png", name: "image.png" }]
		});

		// if (Stats.Fluffs >= 10) await awardAchievement(interaction, "NewFloofer");
		// if (Stats.Fluffs >= 50) await awardAchievement(interaction, "AdeptFloofer");
		// if (Stats.Fluffs >= 100) await awardAchievement(interaction, "MasterFloofer");

		await updateUser(interaction.user, {
			Stats: {
				Fluffs: Stats.Fluffs + 1
			},
			RateLimits: {
				Fluff_Rate: {
					Amount: RateLimits.Fluff_Rate.Amount + 1,
					Date: Date.now()
				}
			}
		});

		const MessageStruct = {
			embeds: [
				{
					title: `${randomArray(Sounds)}`,
					description: `${randomArray(Responses)}\n\n*${randomArray(UserInput).replace("_USER_", interaction.user.username)}*`,
					color: SenkoClient.colors.light,
					thumbnail: {
						url: "attachment://image.png"
					}
				}
			],
			files: [{ attachment: `./src/Data/content/senko/${randomArray(["fluffed", "fluffed_2", "pout"])}.png`, name: "image.png" }]
		};

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 10);

			MessageStruct.embeds[0].description += `\n\n— ${Icons.yen}  10x added for interaction`;
		}

		if (randomNumber(500) < 5) {
			MessageStruct.embeds[0].description += `\n\nYou found a rare item!\n— ${Icons.tofu}  1x tofu added`;

			await updateUser(interaction.user, {
				Currency: {
					Tofu: Currency.Tofu + 1
				}
			});
		}

		interaction.followUp(MessageStruct);
	}
};