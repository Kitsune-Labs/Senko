import { ApplicationCommandOptionType as CommandOption, ChannelType } from "discord.js";
import type { SenkoCommand } from "../../../src/types/AllTypes";

export default {
	name: "counting",
	desc: "counting",
	category: "admin",
	options: [
		{
			name: "info",
			description: "Counting Information",
			type: CommandOption.Subcommand
		},
		{
			name: "edit",
			description: "Edit the counting settings",
			type: CommandOption.SubcommandGroup,
			options: [
				{
					name: "channel",
					description: "The channel to send the counting messages",
					type: CommandOption.Subcommand,
					options: [
						{
							name: "channel",
							description: "channel",
							type: CommandOption.Channel,
							channelTypes: [ChannelType.GuildText],
							required: true
						}
					]
				},
				{
					name: "number",
					description: "The number to start counting from",
					type: CommandOption.Subcommand,
					options: [
						{
							name: "number",
							description: "number",
							type: CommandOption.Number,
							minValue: 1,
							required: true
						}
					]
				}
			]
		}
	],
	start: async () => {
		// ...
	}
} as SenkoCommand;