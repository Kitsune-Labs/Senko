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
	userData: true,
	defer: true,
	category: "fun",
	start: async ({ senkoClient, interaction, userData }) => {
		const MessageStruct = {
			embeds: [
				{
					title: "",
					description: `${Icons.hojicha}  ${randomArrayItem(Responses)}`,
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/drink.png"
					}
				}
			]
		};

		if (calcTimeLeft(userData.RateLimits.Drink_Rate.Date, config.cooldowns.daily)) {
			userData.RateLimits.Drink_Rate.Amount = 0;
			userData.RateLimits.Drink_Rate.Date = Date.now();

			await updateSuperUser(interaction.user, {
				RateLimits: userData.RateLimits
			});

			userData.RateLimits.Drink_Rate.Amount = 0;
		}

		if (userData.RateLimits.Drink_Rate.Amount >= 5) {
			MessageStruct.embeds[0]!.description = `**${randomArrayItem(NoMore).replace("_USER_", interaction.user.username)}**\n\n${randomArrayItem(MoreResponses).replace("_TIMELEFT_", `<t:${Math.floor(userData.RateLimits.Drink_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
			MessageStruct.embeds[0]!.thumbnail.url = `https://cdn.senko.gg/public/senko/${randomArrayItem(["huh", "think"])}.png`;

			return interaction.followUp(MessageStruct);
		}

		userData.RateLimits.Drink_Rate.Amount++;
		userData.Stats.Drinks++;

		await updateSuperUser(interaction.user, {
			Stats: userData.Stats,
			RateLimits: userData.RateLimits
		});

		if (userData.RateLimits.Drink_Rate.Amount >= 5) MessageStruct.embeds[0]!.description += `\n\n— ${Icons.bubble}  Senko-san says this should be our last drink for today`;

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 50);

			MessageStruct.embeds[0]!.description += `\n\n— ${Icons.yen}  50x added for interaction`;
		}

		MessageStruct.embeds[0]!.title = randomArrayItem(Sounds);


		interaction.followUp(MessageStruct);
	}
} as SenkoCommand;