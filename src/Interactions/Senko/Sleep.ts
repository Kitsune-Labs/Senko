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
	defer: true,
	category: "fun",
	start: async ({ Senko, Interaction, MemberData }) => {
		const MessageStruct = {
			embeds: [
				{
					description: `**${randomArrayItem(Responses)}**\n\n*${randomArrayItem(UserActions).replace("_USER_", Interaction.user.username)}*`,
					color: Senko.Theme.light,
					thumbnail: {
						url: `https://cdn.senko.gg/public/senko/${randomArrayItem(["cuddle", "sleep"])}.png`
					}
				}
			]
		};

		if (calcTimeLeft(MemberData.RateLimits.Sleep_Rate.Date, config.cooldowns.daily)) {
			MemberData.RateLimits.Sleep_Rate.Amount = 0;
			MemberData.RateLimits.Sleep_Rate.Date = Date.now();

			await updateSuperUser(Interaction.user, {
				RateLimits: MemberData.RateLimits
			});

			MemberData.RateLimits.Sleep_Rate.Amount = 0;
		}


		if (MemberData.RateLimits.Sleep_Rate.Amount >= 1) {
			MessageStruct.embeds[0]!.description = `${randomArrayItem(NoMore).replace("_TIMELEFT_", `<t:${Math.floor(MemberData.RateLimits.Sleep_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.embeds[0]!.thumbnail.url = `https://cdn.senko.gg/public/senko/${randomArrayItem(["huh", "think"])}.png`;

			return Interaction.followUp(MessageStruct);
		}

		MemberData.Stats.Sleeps++;
		MemberData.RateLimits.Sleep_Rate.Amount++;
		MemberData.RateLimits.Sleep_Rate.Date = Date.now();

		await updateSuperUser(Interaction.user, {
			Stats: MemberData.Stats,

			RateLimits: MemberData.RateLimits
		});

		Interaction.followUp(MessageStruct);

	}
} as SenkoCommand;