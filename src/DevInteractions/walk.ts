import { randomNumber } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../types/AllTypes";

export default {
	name: "walk",
	desc: "Go on a walk with Senko",
	category: "fun",
	start: async ({ interaction, userData, Icons, senkoMember }) => {
		// const chosenResponse = randomArrayItem([]);

		const messageResponse = {
			embeds: [
				{
					description: ""
				}
			]
		};

		if (randomNumber(100) > 90) {
			userData.LocalUser.profileConfig.Currency.Yen + 10;

			messageResponse.embeds[0]!.description += `\n\nSenko-san found ${Icons.yen}  10x on the ground and gave it to you`;
		}

		userData.RateLimits.Walk_Rate.Amount++;
		userData.RateLimits.Walk_Rate.Date = Date.now();

		await senkoMember.updateData({
			LocalUser: userData.LocalUser,
			RateLimits: userData.RateLimits
		});

		interaction.followUp(messageResponse);
	}
} as SenkoCommand;