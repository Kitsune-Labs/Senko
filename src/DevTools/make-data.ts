import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import { makeSuperUser } from "../API/super";
import type { SenkoCommand } from "../types/AllTypes";

export default {
	name: "make-data",
	options: [
		{
			name: "user",
			description: "user",
			type: CommandOption.User,
			required: true
		}
	],
	start: async ({ Interaction }) => {
		const check = await makeSuperUser(Interaction.options.getUser("user", true));

		if (check) {
			await Interaction.reply({ content: `Done ${Interaction.options.getUser("user", true).id}`, ephemeral: true });
		} else {
			await Interaction.reply({ content: "error", ephemeral: true });
		}
	}
} as SenkoCommand;