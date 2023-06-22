import { randomNumber } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../types/AllTypes";

export default {
	name: "walk",
	desc: "Go on a walk with Senko",
	category: "fun",
	start: async ({ Interaction, Member, MemberData, Senko }) => {
		// const chosenResponse = randomArrayItem([]);

		const messageResponse = {
			embeds: [
				{
					description: ""
				}
			]
		};

		if (randomNumber(100) > 90) {
			MemberData.LocalUser.profileConfig.Currency.Yen + 10;

			messageResponse.embeds[0]!.description += `\n\nSenko-san found ${Senko.Icons.yen}  10x on the ground and gave it to you`;
		}

		MemberData.RateLimits.Walk_Rate.Amount++;
		MemberData.RateLimits.Walk_Rate.Date = Date.now();

		await Member.data.update({
			LocalUser: MemberData.LocalUser,
			RateLimits: MemberData.RateLimits
		});

		Interaction.followUp(messageResponse);
	}
} as SenkoCommand;