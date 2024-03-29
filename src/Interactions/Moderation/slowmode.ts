import type { SenkoCommand } from "../../types/AllTypes";
import { PermissionFlagsBits as Permissions, ApplicationCommandOptionType as CommandOption } from "discord.js";
import Icons from "../../Data/Icons.json";
import { Bitfield } from "bitfields";
import bits from "../../API/Bits.json";

export default {
	name: "slowmode",
	desc: "Change the slowmode of a channel",
	usableAnywhere: true,
	category: "admin",
	permissions: [Permissions.ManageChannels],
	options: [
		{
			name: "set",
			description: "Set the slowmode",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "seconds",
					description: "How long should the slowmode be in seconds",
					required: true,
					type: CommandOption.Number,
					minValue: 1,
					maxValue: 21600
				}
			]
		},
		{
			name: "remove",
			description: "Remove this channel's slowmode",
			type: CommandOption.Subcommand
		}
	],
	whitelist: true,
	start: async ({ Senko, Interaction, GuildData }) => {
		if (!Bitfield.fromHex(GuildData.flags).get(bits.BETAs.ModCommands)) return Interaction.reply({
			content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`",
			ephemeral: true
		});

		// @ts-ignore
		if (!Interaction.member!.permissions.has(Permissions.ManageChannels)) return Interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to manage channels to use this!",
					color: Senko.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/huh.png"
					}
				}
			],
			ephemeral: true
		});

		if (!Interaction.guild!.members.me!.permissions.has(Permissions.ManageChannels)) return Interaction.followUp({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't manage channels! (Make sure I have the \"Manage Channels\" permission)",
					color: Senko.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		await Interaction.deferReply();

		const time = Interaction.options.getNumber("seconds");

		switch (Interaction.options.getSubcommand()) {
			case "set":
				// @ts-expect-error
				Interaction.channel!.setRateLimitPerUser(time).then(() => {
					Interaction.followUp({
						embeds: [
							{
								title: `${Icons.exclamation} Alright dear!`,
								description: `I've set the channel slowmode to ${time} seconds!`,
								color: Senko.Theme.light,
								thumbnail: { url: "https://cdn.senko.gg/public/senko/hat_tip.png" }
							}
						],
						ephemeral: true
					});
				});
				break;
			case "remove":
				// @ts-expect-error
				Interaction.channel!.setRateLimitPerUser(0).then(() => {
					Interaction.followUp({
						embeds: [
							{
								title: `${Icons.exclamation} Alright dear!`,
								description: "I've removed the channel slowmode!",
								color: Senko.Theme.light,
								thumbnail: { url: "https://cdn.senko.gg/public/senko/what.png" }
							}
						],
						ephemeral: true
					});
				});
				break;
		}
	}
} as SenkoCommand;