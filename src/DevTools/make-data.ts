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
	start: async ({interaction}) => {
		// @ts-ignore
		const check = await makeSuperUser(interaction.options.getUser("user"));

		if (check) {
			// @ts-ignore
			await interaction.reply({content:`Done ${interaction.options.getUser("user").id}`, ephemeral: true});
		} else {
			await interaction.reply({content:"error", ephemeral: true});
		}
	}
} as SenkoCommand;