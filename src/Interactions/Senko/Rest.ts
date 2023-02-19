import Icons from "../../Data/Icons.json";
import config from "../../Data/DataConfig.json";
import { addYen, calcTimeLeft } from "../../API/Master";
import { updateSuperUser } from "../../API/super";
import { randomArrayItem, randomNumber } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../../types/AllTypes";

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

export default {
	name: "rest",
	desc: "Rest on Senkos lap",
	userData: true,
	defer: true,
	category: "fun",
	start: async ({senkoClient, interaction, userData}) => {
		const MessageStruct = {
			embeds: [
				{
					description: `**${randomArrayItem(Responses)}**\n\n*${randomArrayItem(UserActions).replace("_USER_", interaction.user.username)}*`,
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/cuddle.png"
					}
				}
			]
		};

		if (calcTimeLeft(userData.RateLimits.Rest_Rate.Date, config.cooldowns.daily)) {
			userData.RateLimits.Rest_Rate.Amount = 0;
			userData.RateLimits.Rest_Rate.Date = Date.now();

			await updateSuperUser(interaction.user, {
				RateLimits: userData.RateLimits
			});

			userData.RateLimits.Rest_Rate.Amount = 0;
		}


		if (userData.RateLimits.Rest_Rate.Amount >= 5) {
			MessageStruct.embeds[0]!.description = `${randomArrayItem(NoMore).replace("_TIMELEFT_", `<t:${Math.floor(userData.RateLimits.Rest_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.embeds[0]!.thumbnail.url = `https://cdn.senko.gg/public/senko/${randomArrayItem(["huh", "think"])}.png`;

			return interaction.followUp(MessageStruct);
		}


		userData.Stats.Rests++;
		userData.RateLimits.Rest_Rate.Amount++;
		userData.RateLimits.Rest_Rate.Date = Date.now();

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 50);

			MessageStruct.embeds[0]!.description += `\n\n— ${Icons.yen}  50x added for interaction`;
		}


		await updateSuperUser(interaction.user, {
			Stats: userData.Stats,

			RateLimits: userData.RateLimits
		});

		if (userData.RateLimits.Rest_Rate.Amount >= 5) MessageStruct.embeds[0]!.description += `\n\n— ${Icons.bubble}  Senko-san asks you to stop resting for today`;


		interaction.followUp(MessageStruct);
	}
} as SenkoCommand;