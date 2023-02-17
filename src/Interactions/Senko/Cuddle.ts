import Icons from "../../Data/Icons.json";
import { addYen } from "../../API/Master";
import { randomNumber, randomArrayItem } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../../types/AllTypes";

const Responses = [
	"There there _USER_, everything will be okay...",
	"Oh dear you're so spoiled!",
	"*Senko-san starts to hum*",
	`${Icons.heart}  Everything is fine, I'm sure.`
];

export default {
	name: "cuddle",
	desc: "Cuddle with Senko-san!",
	category: "fun",
	start: async ({senkoClient, interaction}) => {
		const MessageStruct = {
			embeds: [
				{
					description: `**${randomArrayItem(Responses).replace("_USER_", interaction.user.username)}**`,
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/cuddle.png"
					}
				}
			]
		};

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 10);

			MessageStruct.embeds[0]!.description += `\n\n— ${Icons.yen}  10x added for interaction`;
		}


		interaction.reply(MessageStruct);
	}
} as SenkoCommand;