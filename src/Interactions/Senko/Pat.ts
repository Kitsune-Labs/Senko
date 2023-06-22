import config from "../../Data/DataConfig.json";
import Icons from "../../Data/Icons.json";
import { addYen, calcTimeLeft } from "../../API/Master";
import { updateSuperUser } from "../../API/super";
import type { SenkoCommand } from "../../types/AllTypes";
import { randomArrayItem, randomNumber } from "@kitsune-labs/utilities";

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

export default {
	name: "pat",
	desc: "Pat Senko's Head (Don't touch her ears!)",
	defer: true,
	category: "fun",
	start: async ({ Senko, Interaction, MemberData }) => {
		const MessageStruct = {
			embeds: [
				{
					title: "",
					description: randomArrayItem(Responses).replace("_USER_", Interaction.user.username),
					color: Senko.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/pat.png"
					}
				}
			]
		};

		if (calcTimeLeft(MemberData.RateLimits.Pat_Rate.Date, config.cooldowns.daily)) {
			MemberData.RateLimits.Pat_Rate.Amount = 0;
			MemberData.RateLimits.Pat_Rate.Date = Date.now();

			await updateSuperUser(Interaction.user, {
				RateLimits: MemberData.RateLimits
			});

			MemberData.RateLimits.Pat_Rate.Amount = 0;
		}


		if (MemberData.RateLimits.Pat_Rate.Amount >= 20) {
			MessageStruct.embeds[0]!.description = `${randomArrayItem(MoreResponses).replace("_TIMELEFT_", `<t:${Math.floor(MemberData.RateLimits.Pat_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.embeds[0]!.thumbnail.url = `https://cdn.senko.gg/public/senko/${randomArrayItem(["huh", "think"])}.png`;

			return Interaction.followUp(MessageStruct);
		}


		MemberData.Stats.Pats++;
		MemberData.RateLimits.Pat_Rate.Amount++;
		MemberData.RateLimits.Pat_Rate.Date = Date.now();

		if (randomNumber(100) > 75) {
			addYen(Interaction.user, 50);

			MessageStruct.embeds[0]!.description += `\n\n— ${Icons.yen}  50x added for Interaction`;
		}


		MessageStruct.embeds[0]!.title = randomArrayItem(Sounds);

		await updateSuperUser(Interaction.user, {
			Stats: MemberData.Stats,

			RateLimits: MemberData.RateLimits
		});

		if (MemberData.RateLimits.Pat_Rate.Amount >= 20) MessageStruct.embeds[0]!.description += `\n\n— ${Icons.bubble}  Senko-san asks you to stop patting her for today`;


		Interaction.followUp(MessageStruct);
	}
} as SenkoCommand;