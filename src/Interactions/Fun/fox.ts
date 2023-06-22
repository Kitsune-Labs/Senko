import type { SenkoCommand } from "../../types/AllTypes";
import { getFox } from "foxtrove";

export default {
	name: "fox",
	desc: "Random fox pictures!",
	category: "fun",
	start: async ({ Senko, Interaction }) => {
		Interaction.reply({
			embeds: [
				{
					image: {
						url: getFox()
					},
					color: Senko.Theme.light
				}
			]
		});
	}
} as SenkoCommand;