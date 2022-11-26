/* eslint-disable no-redeclare */
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits } = require("discord.js");
const { spliceArray } = require("../../API/Master");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { updateSuperGuild } = require("../../API/super");

module.exports = {
	name: "channel",
	desc: "Add/Remove channels where Senko can be used in",
	defer: true,
	ephemeral: true,
	usableAnywhere: true,
	category: "admin",
	permissions: [PermissionFlagsBits.Administrator],
	options: [
		{
			name: "add",
			type: 1,
			description: "Add a channel that commands can be used in",
			options: [
				{
					name: "channel",
					description: "channel",
					type: 7,
					required: true,
					value: "add_channel"
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
					type: 7,
					required: true,
					value: "remove_channel"
				}
			]
		},
		{
			name: "list",
			description: "List all channels that commands can be used in",
			type: 1
		},
		{
			name: "remove-all-channels",
			description: "Remove all channels that commands are used in",
			type: 1
		},
		{
			name: "remove-deleted-channels",
			description: "Remove deleted channels",
			type: 1
		}
	],
	whitelist: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, guildData}) => {
		const Channels = guildData.Channels;
		const command = interaction.options.getSubcommand();
		const command_permission = interaction.member.permissions.has(PermissionFlagsBits.ManageChannels);

		function listChannels() {
			interaction.followUp({
				embeds: [
					{
						title: "I have gathered my commands and you may use them in",
						description: `${Channels[0] ? Channels.map(i => ` <#${i}>`) : "every channel"}`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/senko/package.png"
						}
					}
				]
			});
		}

		switch (command) {
		case "add":
			if (!command_permission) return listChannels();
			var channel = interaction.options.getChannel("channel");

			if (channel.type != 0) return interaction.followUp({
				embeds: [
					{
						title: "Oh dear...",
						description: "It appears that this channel is not a text channel!",
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://assets.senkosworld.com/media/senko/heh.png" }
					}
				]
			});

			if (Channels.includes(channel.id)) return interaction.followUp({
				embeds: [
					{
						title: "Silly!",
						description: "This channel has already been added!",
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://assets.senkosworld.com/media/senko/talk.png" }
					}
				]
			});

			Channels.push(channel.id);

			await updateSuperGuild(interaction.guild, {
				Channels: Channels
			});

			interaction.followUp({
				embeds: [
					{
						title: "Done!",
						description: `People can now use my commands in ${channel}!`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/senko/talk.png"
						}
					}
				]
			});
			break;
		case "remove":
			if (!command_permission) return listChannels();

			var channel = interaction.options.getChannel("channel");

			if (!Channels.includes(channel.id)) return interaction.followUp({
				embeds: [
					{
						title: "Lets see...",
						description: "I can't seem to find this channel in my list!",
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://assets.senkosworld.com/media/senko/talk.png" }
					}
				]
			});

			spliceArray(Channels, channel.id);

			await updateSuperGuild(interaction.guild, {
				Channels: Channels
			});

			interaction.followUp({
				embeds: [
					{
						title: `${Icons.exclamation} Alright dear`,
						description: `I have removed ${channel} as per your request`,
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/senko/smile2.png"
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
						thumbnail: { url: "https://assets.senkosworld.com/media/senko/smile2.png" }
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
							url: "https://assets.senkosworld.com/media/senko/nervous.png"
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
						thumbnail: { url: "https://assets.senkosworld.com/media/senko/smile2.png" }
					}
				]
			});

			var removed_channels = 0;

			for (var v_channel of Channels) {
				var channel = interaction.guild.channels.cache.get(v_channel);

				if (!channel) {
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
						thumbnail: { url: "https://assets.senkosworld.com/media/senko/smile2.png" }
					}
				]
			});

			await updateSuperGuild(interaction.guild, {
				Channels: Channels
			});

			interaction.followUp({
				embeds: [
					{
						title: "I have gathered your channels and reviewed them",
						description: `I have found ${removed_channels > 1 ? " channel" : "channels"} that no longer exist${removed_channels > 1 ? " s" : ""} and have removed them!`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/senko/talk.png"
						}
					}
				]
			});
			break;
		}
	}
};