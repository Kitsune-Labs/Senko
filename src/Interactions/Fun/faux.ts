import type { SenkoCommand } from "../../types/AllTypes";
import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import faux from "@kitsune-labs/faux";

export default {
	name: "faux",
	desc: "Fox fooooxx",
	options: [
		{
			name: "translate",
			description: "Automatically decide for me",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "message",
					description: "The message that will be encoded or decoded with FAUX",
					type: CommandOption.String,
					required: true
				}
			]
		},
		{
			name: "encode",
			description: "Encode a FAUX message",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "message",
					description: "The message that will be encoded with FAUX",
					type: CommandOption.String,
					required: true
				}
			]
		},
		{
			name: "decode",
			description: "Decode a FAUX message",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "message",
					description: "The message that will be decoded with FAUX",
					type: CommandOption.String,
					required: true
				}
			]
		}
	],
	usableAnywhere: true,
	defer: true,
	ephemeral: true,
	category: "fun",
	start: async ({ Interaction }) => {
		switch (Interaction.options.getSubcommand()) {
			case "translate":
				Interaction.followUp({
					content: faux.translate(Interaction.options.getString("message", true))
				});
				break;
			case "encode":
				Interaction.followUp({
					content: faux.encode(Interaction.options.getString("message", true))
				});
				break;
			case "decode":
				Interaction.followUp({
					content: faux.decode(Interaction.options.getString("message", true))
				});
				break;
		}
	}
} as SenkoCommand;