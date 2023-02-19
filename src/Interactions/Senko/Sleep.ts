import Icons from "../../Data/Icons.json";
import config from "../../Data/DataConfig.json";
import { calcTimeLeft } from "../../API/Master";
import { randomArrayItem } from "@kitsune-labs/utilities";
import { updateSuperUser } from "../../API/super";
import type { SenkoCommand } from "../../types/AllTypes";

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


export default {
	name: "sleep",
	desc: "Sleep on Senko's lap",
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
						url: `https://cdn.senko.gg/public/senko/${randomArrayItem(["cuddle", "sleep"])}.png`
					}
				}
			]
		};

		if (calcTimeLeft(userData.RateLimits.Sleep_Rate.Date, config.cooldowns.daily)) {
			userData.RateLimits.Sleep_Rate.Amount = 0;
			userData.RateLimits.Sleep_Rate.Date = Date.now();

			await updateSuperUser(interaction.user, {
				RateLimits: userData.RateLimits
			});

			userData.RateLimits.Sleep_Rate.Amount = 0;
		}


		if (userData.RateLimits.Sleep_Rate.Amount >= 1) {
			MessageStruct.embeds[0]!.description = `${randomArrayItem(NoMore).replace("_TIMELEFT_", `<t:${Math.floor(userData.RateLimits.Sleep_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.embeds[0]!.thumbnail.url = `https://cdn.senko.gg/public/senko/${randomArrayItem(["huh", "think"])}.png`;

			return interaction.followUp(MessageStruct);
		}

		userData.Stats.Sleeps++;
		userData.RateLimits.Sleep_Rate.Amount++;
		userData.RateLimits.Sleep_Rate.Date = Date.now();

		await updateSuperUser(interaction.user, {
			Stats: userData.Stats,

			RateLimits: userData.RateLimits
		});

		interaction.followUp(MessageStruct);

	}
} as SenkoCommand;