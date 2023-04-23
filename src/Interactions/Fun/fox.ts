import type { SenkoCommand } from "../../types/AllTypes";
import { getFox } from "foxtrove";

export default {
	name: "fox",
	desc: "Random fox pictures!",
	category: "fun",
	start: async ({ interaction, Theme }) => {
		interaction.reply({
			embeds: [
				{
					image: {
						url: getFox()
					},
					color: Theme.light
				}
			]
		});
	}
} as SenkoCommand;