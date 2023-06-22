import Icons from "../../Data/Icons.json";
import config from "../../Data/DataConfig.json";
import { addYen, calcTimeLeft } from "../../API/Master";
import { updateSuperUser } from "../../API/super";
import { randomNumber, randomArrayItem } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../../types/AllTypes";

const Responses = [
	"Senko-san takes a drink of her Hojicha",
	`${Icons.flushed}  You compliment Senko-san with her skills of Tea making`,
	"You tell Senko-san that her tea is the best"
];

const NoMore = [
	"I think you've had enough for today",
	"If you drink anymore we won't have any more for tomorrow!",
	"Senko-san thinks you're drinking too much Hojicha"
];

const Sounds = [
	"Umu~",
	"Umu Umu"
];

const MoreResponses = [
	`${Icons.bubble}  Senko-san says you can have more _TIMELEFT_`,
	`${Icons.exclamation}  Senko-san tells you to drink more _TIMELEFT_`
];

export default {
	name: "drink",
	desc: "Have Senko-san prepare you a drink",
	MemberData: true,
	defer: true,
	category: "fun",
	start: async ({ Senko, Interaction, MemberData }) => {
		const MessageStruct = {
			embeds: [
				{
					title: "",
					description: `${Icons.hojicha}  ${randomArrayItem(Responses)}`,
					color: Senko.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/drink.png"
					}
				}
			]
		};

		if (calcTimeLeft(MemberData.RateLimits.Drink_Rate.Date, config.cooldowns.daily)) {
			MemberData.RateLimits.Drink_Rate.Amount = 0;
			MemberData.RateLimits.Drink_Rate.Date = Date.now();

			await updateSuperUser(Interaction.user, {
				RateLimits: MemberData.RateLimits
			});

			MemberData.RateLimits.Drink_Rate.Amount = 0;
		}

		if (MemberData.RateLimits.Drink_Rate.Amount >= 5) {
			MessageStruct.embeds[0]!.description = `**${randomArrayItem(NoMore).replace("_USER_", Interaction.user.username)}**\n\n${randomArrayItem(MoreResponses).replace("_TIMELEFT_", `<t:${Math.floor(MemberData.RateLimits.Drink_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.embeds[0]!.thumbnail.url = `https://cdn.senko.gg/public/senko/${randomArrayItem(["huh", "think"])}.png`;

			return Interaction.followUp(MessageStruct);
		}

		MemberData.RateLimits.Drink_Rate.Amount++;
		MemberData.Stats.Drinks++;

		await updateSuperUser(Interaction.user, {
			Stats: MemberData.Stats,
			RateLimits: MemberData.RateLimits
		});

		if (MemberData.RateLimits.Drink_Rate.Amount >= 5) MessageStruct.embeds[0]!.description += `\n\n— ${Icons.bubble}  Senko-san says this should be our last drink for today`;

		if (randomNumber(100) > 75) {
			addYen(Interaction.user, 50);

			MessageStruct.embeds[0]!.description += `\n\n— ${Icons.yen}  50x added for Interaction`;
		}

		MessageStruct.embeds[0]!.title = randomArrayItem(Sounds);


		Interaction.followUp(MessageStruct);
	}
} as SenkoCommand;