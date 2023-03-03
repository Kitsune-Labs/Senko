import type { SenkoCommand } from "../types/AllTypes";
import { ApplicationCommandOptionType as CommandOption, ChannelType } from "discord.js";

export default {
	name: "test",
	desc: "Test TS command!",
	category: "admin",
	options: [
		{
			name: "subcommand",
			description: "Subcommand",
			type: CommandOption.Subcommand
		},
		{
			name: "subcommand-group",
			description: "Subcommand group",
			type: CommandOption.SubcommandGroup,
			options: [
				{
					name: "subcommand55",
					description: "Subcommand55",
					type: CommandOption.Subcommand
				},
				{
					name: "subcommand22",
					description: "Subcommand 22",
					type: CommandOption.Subcommand,
					options: [
						{
							name: "string",
							description: "String",
							type: CommandOption.String,
							required: true
						},
						{
							name: "integer",
							description: "Integer",
							type: CommandOption.Integer,
							required: true
						},
						{
							name: "boolean",
							description: "Boolean",
							type: CommandOption.Boolean,
							required: true
						},
						{
							name: "user",
							description: "User",
							type: CommandOption.User,
							required: true
						},
						{
							name: "channel",
							description: "Channel",
							type: CommandOption.Channel,
							required: true,
							channelTypes: [ChannelType.GuildText]
						},
						{
							name: "role",
							description: "Role",
							type: CommandOption.Role,
							required: true
						}
					]
				}
			]
		}
	],
	start: async ({ interaction }) => {
		console.log(
			interaction.options.getSubcommand(),
			interaction.options.get("subcommand"),
			// interaction.options.get("subcommandgroup"),
			interaction.options.get("string")
			// interaction.options.get("integer"),
			// interaction.options.get("boolean"),
			// interaction.options.get("user"),
			// interaction.options.get("channel"),
			// interaction.options.get("role")
		);

		interaction.reply({
			content: "<:Sb:1080039600526987294><:Eb:1080039053807845418><:Nb:1080039470981718016><:Kb:1080039468435787787><:Ob:1080039472789471282><:hifin:1080041916558757929><:Sb:1080039600526987294><:Ab:1080039048363638847><:Nb:1080039470981718016>",
			embeds: [
				{
					description: "<:Sb:1080039600526987294><:Eb:1080039053807845418><:Nb:1080039470981718016><:Kb:1080039468435787787><:Ob:1080039472789471282><:hifin:1080041916558757929><:Sb:1080039600526987294><:Ab:1080039048363638847><:Nb:1080039470981718016>"
				}
			],
			ephemeral: true
		});
	}
} as SenkoCommand;