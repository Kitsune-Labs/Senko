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
	defer: true,
	category: "fun",
	start: async ({ Senko, Interaction, MemberData }) => {
		const MessageStruct = {
			embeds: [
				{
					description: `**${randomArrayItem(Responses)}**\n\n*${randomArrayItem(UserActions).replace("_USER_", Interaction.user.username)}*`,
					color: Senko.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/cuddle.png"
					}
				}
			]
		};

		if (calcTimeLeft(MemberData.RateLimits.Rest_Rate.Date, config.cooldowns.daily)) {
			MemberData.RateLimits.Rest_Rate.Amount = 0;
			MemberData.RateLimits.Rest_Rate.Date = Date.now();

			await updateSuperUser(Interaction.user, {
				RateLimits: MemberData.RateLimits
			});

			MemberData.RateLimits.Rest_Rate.Amount = 0;
		}


		if (MemberData.RateLimits.Rest_Rate.Amount >= 5) {
			MessageStruct.embeds[0]!.description = `${randomArrayItem(NoMore).replace("_TIMELEFT_", `<t:${Math.floor(MemberData.RateLimits.Rest_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.embeds[0]!.thumbnail.url = `https://cdn.senko.gg/public/senko/${randomArrayItem(["huh", "think"])}.png`;

			return Interaction.followUp(MessageStruct);
		}


		MemberData.Stats.Rests++;
		MemberData.RateLimits.Rest_Rate.Amount++;
		MemberData.RateLimits.Rest_Rate.Date = Date.now();

		if (randomNumber(100) > 75) {
			addYen(Interaction.user, 50);

			MessageStruct.embeds[0]!.description += `\n\n— ${Icons.yen}  50x added for Interaction`;
		}


		await updateSuperUser(Interaction.user, {
			Stats: MemberData.Stats,

			RateLimits: MemberData.RateLimits
		});

		if (MemberData.RateLimits.Rest_Rate.Amount >= 5) MessageStruct.embeds[0]!.description += `\n\n— ${Icons.bubble}  Senko-san asks you to stop resting for today`;


		Interaction.followUp(MessageStruct);
	}
} as SenkoCommand;