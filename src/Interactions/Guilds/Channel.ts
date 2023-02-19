
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
	start: async ({senkoClient, interaction, guildData}) => {
		const Channels = guildData.Channels;
		// @ts-expect-error
		const command = interaction.options.getSubcommand();
		// @ts-expect-error
		const command_permission = interaction.member!.permissions.has(Permissions.ManageChannels);

		function listChannels() {
			interaction.followUp({
				embeds: [
					{
						title: "I have gathered my commands and you may use them in",
						description: `${Channels[0] ? Channels.map(i => ` <#${i}>`) : "every channel"}`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/package.png"
						}
					}
				]
			});
		}

		switch (command) {
		case "add":
			if (!command_permission) return listChannels();
			// @ts-expect-error
			var channel = interaction.options.getChannel("channel");

			if (channel.type != 0) return interaction.followUp({
				embeds: [
					{
						title: "Oh dear...",
						description: "It appears that this channel is not a text channel!",
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://cdn.senko.gg/public/senko/heh.png" }
					}
				]
			});

			if (Channels.includes(channel.id)) return interaction.followUp({
				embeds: [
					{
						title: "Silly!",
						description: "This channel has already been added!",
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://cdn.senko.gg/public/senko/talk.png" }
					}
				]
			});

			Channels.push(channel.id);

			await updateSuperGuild(interaction.guild!, {
				Channels: Channels
			});

			interaction.followUp({
				embeds: [
					{
						title: "Done!",
						description: `People can now use my commands in ${channel}!`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/talk.png"
						}
					}
				]
			});
			break;
		case "remove":
			if (!command_permission) return listChannels();

			// @ts-expect-error
			var channel = interaction.options.getChannel("channel");

			if (!Channels.includes(channel.id)) return interaction.followUp({
				embeds: [
					{
						title: "Lets see...",
						description: "I can't seem to find this channel in my list!",
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://cdn.senko.gg/public/senko/talk.png" }
					}
				]
			});

			spliceArray(Channels, channel.id);

			await updateSuperGuild(interaction.guild!, {
				Channels: Channels
			});

			interaction.followUp({
				embeds: [
					{
						title: `${Icons.exclamation} Alright dear`,
						description: `I have removed ${channel} as per your request`,
						color: senkoClient.api.Theme.dark,
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
			if (!command_permission) return listChannels();
			if (!Channels[0]) return interaction.followUp({
				embeds: [
					{
						title: "Lets see...",
						description: "I can't find any channels to remove!",
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://cdn.senko.gg/public/senko/smile2.png" }
					}
				]
			});

			interaction.followUp({
				embeds: [
					{
						title: "Are you sure you want to remove all these channels?",
						description: `${Channels.map(i => `<#${i}>`)}\n\nThis **cannot** be undone`,
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/nervous.png"
						}
					}
				],
				components: [
					{
						type: 1,
						components: [
							{ type: 2, label: "Remove channels", style: 4, custom_id: "confirm_super_channel_removal" },
							{ type: 2, label: "Cancel", style: 2, custom_id: "cancel_channel_removal" }
						]
					}
				]
			});
			break;
		case "remove-deleted-channels":
			if (!command_permission) return listChannels();
			if (!Channels[0]) return interaction.followUp({
				embeds: [
					{
						title: "Lets see...",
						description: "I can't find any channels to remove!",
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://cdn.senko.gg/public/senko/smile2.png" }
					}
				]
			});

			var removed_channels = 0;

			for (var v_channel of Channels) {
				var channel = interaction.guild!.channels.cache.get(v_channel);

				if (!channel) {
					// @ts-ignore
					spliceArray(Channels, v_channel);
					removed_channels++;
				}
			}

			if (removed_channels === 0) return interaction.followUp({
				embeds: [
					{
						title: "Lets see...",
						description: "I can't find any deleted channels to remove!",
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://cdn.senko.gg/public/senko/smile2.png" }
					}
				]
			});

			await updateSuperGuild(interaction.guild!, {
				Channels: Channels
			});

			interaction.followUp({
				embeds: [
					{
						title: "I have gathered your channels and reviewed them",
						description: `I have found ${removed_channels > 1 ? " channel" : "channels"} that no longer exist${removed_channels > 1 ? " s" : ""} and have removed them!`,
						color: senkoClient.api.Theme.light,
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