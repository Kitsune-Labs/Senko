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
	// eslint-disable-next-line camelcase
	description_localized: {
		"jp": "モフ モフ！"
	},
	start: async ({ Senko, Interaction, MemberData, CommandLocale, GeneralLocale }) => {
		if (calcTimeLeft(MemberData.RateLimits.Fluff_Rate.Date, config.cooldowns.daily)) {
			MemberData.RateLimits.Fluff_Rate.Amount = 0;
			MemberData.RateLimits.Fluff_Rate.Date = Date.now();

			await updateSuperUser(Interaction.user, {
				RateLimits: MemberData.RateLimits
			});

			MemberData.RateLimits.Fluff_Rate.Amount = 0;
		}

		if (MemberData.RateLimits.Fluff_Rate.Amount >= 50) return Interaction.followUp({
			embeds: [{
				description: CommandLocale.RateLimit.replace("_TIME_", `<t:${Math.floor((MemberData.RateLimits.Fluff_Rate.Date + config.cooldowns.daily) / 1000)}:R>`), //`I don't want to right now! W-We can <t:${Math.floor((MemberData.RateLimits.Fluff_Rate.Date + config.cooldowns.daily) / 1000)}:R> though...`,
				thumbnail: { url: "https://cdn.senko.gg/public/senko/upset2.png" },
				color: Senko.Theme.light
			}]
		});

		MemberData.Stats.Fluffs++;
		MemberData.RateLimits.Fluff_Rate.Amount++;
		MemberData.RateLimits.Fluff_Rate.Date = Date.now();

		// await updateSuperUser(Interaction.user, {
		// 	Stats: MemberData.Stats,
		// 	RateLimits: MemberData.RateLimits
		// });

		const MessageStruct: SenkoMessageOptions = {
			embeds: [{
				title: randomArray(CommandLocale.UserInput).replace("_USER_", Interaction.user.username),
				description: randomArray(CommandLocale.Responses),
				color: Senko.Theme.light,
				thumbnail: {
					url: `https://cdn.senko.gg/public/senko/${randomArray(["fluffed", "fluffed2", "pout"])}.png`
				}
			}]
		};

		if (randomNumber(100) > 75) {
			addYen(Interaction.user, 10);

			// @ts-expect-error - TS says that "embeds[0].description" may be undefined, even though its right above it
			MessageStruct.embeds[0].description += GeneralLocale.YenAwarded.replace("_AMOUNT_", "10"); // `\n\n— ${Icons.yen}  10x added for Interaction`;
		}

		if (randomNumber(500) < 5) {
			// @ts-expect-error - TS says that "embeds[0].description" may be undefined, even though its right above it
			MessageStruct.embeds[0].description += GeneralLocale.TofuAwarded.replace("_AMOUNT_", "1"); // `\n\nYou found a rare item!\n— ${Icons.tofu}  1x tofu added`;
			MemberData.LocalUser.profileConfig.Currency.Tofu++;
			await updateSuperUser(Interaction.user, {
				LocalUser: MemberData.LocalUser
			});
		}

		Interaction.followUp(MessageStruct);
	}
} as SenkoCommand;