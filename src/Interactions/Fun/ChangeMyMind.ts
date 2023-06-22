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
	start: async ({ Senko, Interaction }) => {
		Interaction.reply({
			embeds: [
				{
					image: {
						url: encodeURI(`https://vacefron.nl/api/changemymind?text=${Interaction.options.getString("text", true)}`)
					},
					color: Senko.Theme.light
				}
			]
		});
	}
} as SenkoCommand;