import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "tool",
	desc: "Tools for server moderators.",
	category: "utility",
	options: [
		{
			name: "channel-id",
			description: "Returns the channel ID the command is used in.",
			type: CommandOption.Subcommand
		}
	],
	start: async ({ Interaction, Senko }) => {
		switch (Interaction.options.getSubcommand()) {
			case "channel-id": {
				return Interaction.reply({
					embeds: [
						{
							title: "Channel ID",
							description: Interaction.channelId.toString(),
							color: Senko.Theme.light
						}
					],
					ephemeral: true
				});
			}
		}
	}
} as SenkoCommand;