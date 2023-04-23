import { randomArrayItem } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../../../src/types/AllTypes";

export default {
	name: "talk",
	desc: "Talk to Senko!",
	category: "fun",
	start: async ({ interaction }) => {
		const possibleResponses = [//{
		// 	embeds: [{
		// 		title: "Senko-san",
		// 		description: `Nanoja!\n\nDo you have a question ${interaction.user.username}?`,
		// 		color: SenkoClient.api.Theme.light,
		// 		thumbnail: {
		// 			url: "https://cdn.senko.gg/public/labs/placeholder.png"
		// 		},
		// 		footer: {
		// 			text: interaction.user.tag
		// 		}
		// 	}],
		// 	components: [{
		// 		type: 1,
		// 		components: [{
		// 			type: 2,
		// 			label: "I wanted to say hello!",
		// 			style: 1,
		// 			customId: "senko_talk_1_hello",
		// 			emoji: Icons.sparkle
		// 		},
		// 		{
		// 			type: 2,
		// 			label: "How are you?",
		// 			style: 1,
		// 			customId: "senko_talk_1_hru",
		// 			emoji: Icons.question
		// 		},
		// 		{
		// 			type: 2,
		// 			label: "What are you up to?",
		// 			style: 1,
		// 			customId: "senko_talk_1_wruu2",
		// 			emoji: Icons.question
		// 		}]
		// 	}]
		// },
			{
				embeds: [{
					description: "How have you been dear?",
					thumbnail: {
						url: "https://cdn.senko.gg/public/labs/placeholder.png"
					},
					footer: {
						text: interaction.user.tag
					}
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						label: "I'm fine, thanks!",
						style: 3,
						customId: "senko_talk_2_fine"
					},
					{
						type: 2,
						label: "Things could be better.",
						style: 2,
						customId: "senko_talk_2_doingwell"
					},
					{
						type: 2,
						label: "Not so great...",
						style: 4,
						customId: "senko_talk_2_notdoinggreat"
					}
					]
				}]
			}
		];

		interaction.reply(randomArrayItem(possibleResponses));
	}
} as SenkoCommand;