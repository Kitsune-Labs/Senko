import type { SenkoCommand, SenkoMessageOptions } from "../../types/AllTypes";
import { updateSuperUser } from "../../API/super";
import { addYen, calcTimeLeft } from "../../API/Master";
import config from "../../Data/DataConfig.json";

import { randomArrayItem as randomArray, randomNumber } from "@kitsune-labs/utilities";

export default {
	name: "fluff",
	desc: "Mofumofu!",
	defer: true,
	category: "fun",
	description_localized: {
		"jp": "モフ モフ！"
	},
	start: async ({ senkoClient, interaction, userData, locale }) => {
		if (calcTimeLeft(userData.RateLimits.Fluff_Rate.Date, config.cooldowns.daily)) {
			userData.RateLimits.Fluff_Rate.Amount = 0;
			userData.RateLimits.Fluff_Rate.Date = Date.now();

			await updateSuperUser(interaction.user, {
				RateLimits: userData.RateLimits
			});

			userData.RateLimits.Fluff_Rate.Amount = 0;
		}

		if (userData.RateLimits.Fluff_Rate.Amount >= 50) return interaction.followUp({
			embeds: [{
				description: locale.RateLimit.replace("_TIME_", `<t:${Math.floor((userData.RateLimits.Fluff_Rate.Date + config.cooldowns.daily) / 1000)}:R>`), //`I don't want to right now! W-We can <t:${Math.floor((userData.RateLimits.Fluff_Rate.Date + config.cooldowns.daily) / 1000)}:R> though...`,
				thumbnail: { url: "https://cdn.senko.gg/public/senko/upset2.png" },
				color: senkoClient.api.Theme.light
			}]
		});

		userData.Stats.Fluffs++;
		userData.RateLimits.Fluff_Rate.Amount++;
		userData.RateLimits.Fluff_Rate.Date = Date.now();

		// await updateSuperUser(interaction.user, {
		// 	Stats: userData.Stats,
		// 	RateLimits: userData.RateLimits
		// });

		const MessageStruct: SenkoMessageOptions = {
			embeds: [{
				title: randomArray(locale.UserInput).replace("_USER_", interaction.user.username),
				description: randomArray(locale.Responses),
				color: senkoClient.api.Theme.light,
				thumbnail: {
					url: `https://cdn.senko.gg/public/senko/${randomArray(["fluffed", "fluffed2", "pout"])}.png`
				}
			}]
		};

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 10);

			// @ts-expect-error - TS says that "embeds[0].description" may be undefined, even though its right above it
			MessageStruct.embeds[0].description += locale.general.YenAwarded.replace("_AMOUNT_", "10"); // `\n\n— ${Icons.yen}  10x added for interaction`;
		}

		if (randomNumber(500) < 5) {
			// @ts-expect-error - TS says that "embeds[0].description" may be undefined, even though its right above it
			MessageStruct.embeds[0].description += locale.general.TofuAwarded.replace("_AMOUNT_", "1"); // `\n\nYou found a rare item!\n— ${Icons.tofu}  1x tofu added`;
			userData.LocalUser.profileConfig.Currency.Tofu++;
			await updateSuperUser(interaction.user, {
				LocalUser: userData.LocalUser
			});
		}

		interaction.followUp(MessageStruct);
	}
} as SenkoCommand;