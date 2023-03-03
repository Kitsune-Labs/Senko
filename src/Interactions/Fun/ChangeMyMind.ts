import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "change-my-mind",
	desc: "Change my mind about this!",
	options: [
		{
			name: "text",
			description: "text",
			required: true,
			type: CommandOption.String
		}
	],
	category: "fun",
	start: async ({senkoClient, interaction}) => {
		interaction.reply({
			embeds: [
				{
					image: {
						url: encodeURI(`https://vacefron.nl/api/changemymind?text=${interaction.options.getString("text")}`)
					},
					color: senkoClient.api.Theme.light
				}
			]
		});
	}
} as SenkoCommand;