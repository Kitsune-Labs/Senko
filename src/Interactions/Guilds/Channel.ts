
import { PermissionFlagsBits as Permissions, ApplicationCommandOptionType as CommandOption, ChannelType } from "discord.js";
import { spliceArray } from "@kitsune-labs/utilities";
import Icons from "../../Data/Icons.json";
import { updateSuperGuild } from "../../API/super";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "channel",
	desc: "Add/Remove channels where Senko can be used in",
	defer: true,
	ephemeral: true,
	usableAnywhere: true,
	category: "admin",
	permissions: [Permissions.Administrator],
	options: [
		{
			name: "add",
			type: CommandOption.Subcommand,
			description: "Add a channel that commands can be used in",
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
			name: "remove",
			description: "Remove a channel that commands are used in",
			type: 1,
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
			name: "list",
			description: "List all channels that commands can be used in",
			type: CommandOption.Subcommand
		},
		{
			name: "remove-all-channels",
			description: "Remove all channels that commands are used in",
			type: CommandOption.Subcommand
		},
		{
			name: "remove-deleted-channels",
			description: "Remove deleted channels",
			type: CommandOption.Subcommand
		}
	],
	whitelist: true,
	start: async ({ Senko, Interaction, GuildData }) => {
		const Channels = GuildData.Channels;

		const command = Interaction.options.getSubcommand();
		// @ts-ignore
		const commandPermission = Interaction.member!.permissions.has(Permissions.ManageChannels);

		function listChannels() {
			Interaction.followUp({
				embeds: [
					{
						title: "I have gathered my commands and you may use them in",
						description: `${Channels[0] ? Channels.map((i: string) => ` <#${i}>`) : "every channel"}`,
						color: Senko.Theme.light,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/package.png"
						}
					}
				]
			});
		}

		switch (command) {
			case "add":
				if (!commandPermission) return listChannels();
				var addChannel = Interaction.options.getChannel("channel", true);

				if (addChannel.type != 0) return Interaction.followUp({
					embeds: [
						{
							title: "Oh dear...",
							description: "It appears that this channel is not a text channel!",
							color: Senko.Theme.dark,
							thumbnail: { url: "https://cdn.senko.gg/public/senko/heh.png" }
						}
					]
				});

				if (Channels.includes(addChannel.id)) return Interaction.followUp({
					embeds: [
						{
							title: "Silly!",
							description: "This channel has already been added!",
							color: Senko.Theme.dark,
							thumbnail: { url: "https://cdn.senko.gg/public/senko/talk.png" }
						}
					]
				});

				Channels.push(addChannel.id);

				await updateSuperGuild(Interaction.guild!, {
					Channels: Channels
				});

				Interaction.followUp({
					embeds: [
						{
							title: "Done!",
							description: `People can now use my commands in ${addChannel}!`,
							color: Senko.Theme.light,
							thumbnail: {
								url: "https://cdn.senko.gg/public/senko/talk.png"
							}
						}
					]
				});
				break;
			case "remove":
				if (!commandPermission) return listChannels();

				var rmChannel = Interaction.options.getChannel("channel", true);

				if (!Channels.includes(rmChannel.id)) return Interaction.followUp({
					embeds: [
						{
							title: "Lets see...",
							description: "I can't seem to find this channel in my list!",
							color: Senko.Theme.dark,
							thumbnail: { url: "https://cdn.senko.gg/public/senko/talk.png" }
						}
					]
				});

				// @ts-ignore
				spliceArray(Channels, channel.id);

				await updateSuperGuild(Interaction.guild!, {
					Channels: Channels
				});

				Interaction.followUp({
					embeds: [
						{
							title: `${Icons.exclamation} Alright dear`,
							description: `I have removed ${rmChannel} as per your request`,
							color: Senko.Theme.dark,
							thumbnail: {
								url: "https://cdn.senko.gg/public/senko/smile2.png"
							}
						}
					]
				});
				break;
			case "list":
				listChannels();
				break;
			case "remove-all-channels":
				if (!commandPermission) return listChannels();
				if (!Channels[0]) return Interaction.followUp({
					embeds: [
						{
							title: "Lets see...",
							description: "I can't find any channels to remove!",
							color: Senko.Theme.dark,
							thumbnail: { url: "https://cdn.senko.gg/public/senko/smile2.png" }
						}
					]
				});

				Interaction.followUp({
					embeds: [
						{
							title: "Are you sure you want to remove all these channels?",
							description: `${Channels.map((i: string) => `<#${i}>`)}\n\nThis **cannot** be undone`,
							color: Senko.Theme.dark,
							thumbnail: {
								url: "https://cdn.senko.gg/public/senko/nervous.png"
							}
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Remove channels", style: 4, customId: "confirm_super_channel_removal" },
								{ type: 2, label: "Cancel", style: 2, customId: "cancel_channel_removal" }
							]
						}
					]
				});
				break;
			case "remove-deleted-channels":
				if (!commandPermission) return listChannels();
				if (!Channels[0]) return Interaction.followUp({
					embeds: [
						{
							title: "Lets see...",
							description: "I can't find any channels to remove!",
							color: Senko.Theme.dark,
							thumbnail: { url: "https://cdn.senko.gg/public/senko/smile2.png" }
						}
					]
				});

				var removedChannels = 0;

				for (var vChannel of Channels) {
					var channel2 = Interaction.guild!.channels.cache.get(vChannel);

					if (!channel2) {
						// @ts-ignore
						spliceArray(Channels, v_channel);
						removedChannels++;
					}
				}

				if (removedChannels === 0) return Interaction.followUp({
					embeds: [
						{
							title: "Lets see...",
							description: "I can't find any deleted channels to remove!",
							color: Senko.Theme.dark,
							thumbnail: { url: "https://cdn.senko.gg/public/senko/smile2.png" }
						}
					]
				});

				await updateSuperGuild(Interaction.guild!, {
					Channels: Channels
				});

				Interaction.followUp({
					embeds: [
						{
							title: "I have gathered your channels and reviewed them",
							description: `I have found ${removedChannels > 1 ? " channel" : "channels"} that no longer exist${removedChannels > 1 ? " s" : ""} and have removed them!`,
							color: Senko.Theme.light,
							thumbnail: {
								url: "https://cdn.senko.gg/public/senko/talk.png"
							}
						}
					]
				});
				break;
		}
	}
} as SenkoCommand;