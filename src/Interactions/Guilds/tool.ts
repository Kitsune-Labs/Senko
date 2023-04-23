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
	start: async ({ interaction, Theme }) => {
		switch (interaction.options.getSubcommand()) {
			case "channel-id": {
				return interaction.reply({
					embeds: [
						{
							title: "Channel ID",
							description: interaction.channelId.toString(),
							color: Theme.light
						}
					],
					ephemeral: true
				});
			}
		}
	}
} as SenkoCommand;