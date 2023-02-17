import type { SenkoCommand } from "../../types/AllTypes";
import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import { owoify } from "@kitsune-labs/utilities";

export default {
	name: "owoify",
	desc: "UwU OwO",
	options: [
		{
			name: "text",
			description: "Text to OwOify",
			type: CommandOption.String,
			required: true
		}
	],
	usableAnywhere: true,
	category: "fun",
	start: async ({interaction}) => {
		interaction.reply({
			// @ts-expect-error
			content: owoify(interaction.options.getString("text")),
			ephemeral: true
		});
	}
} as SenkoCommand;