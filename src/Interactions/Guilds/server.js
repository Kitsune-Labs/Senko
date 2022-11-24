// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits, ButtonStyle, PermissionsBitField } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
// eslint-disable-next-line no-unused-vars
const HardLinks = require("../../Data/HardLinks.json");
const { Bitfield } = require("bitfields");
const bits = require("../../API/Bits.json");
const { updateSuperGuild } = require("../../API/super");
const { CheckPermission } = require("../../API/Master");

module.exports = {
	name: "server",
	desc: "server",
	usableAnywhere: true,
	category: "admin",
	permissions: [PermissionFlagsBits.Administrator],
	options: [
		{
			name: "info",
			description: "Server info",
			type: 1
		},
		{
			name: "settings",
			description: "Guild Configuration",
			type: 1
		},
		{
			name: "permissions",
			description: "Display what permissions Senko needs",
			type: 1
		},
		{
			name: "action-reports",
			description: "set",
			type: 2,
			options: [
				{
					name: "set",
					description: "Set the Action Reports channel",
					type: 1,
					options: [
						{
							name: "channel",
							description: "Channel",
							type: 7,
							required: true
						}
					]
				},
				{
					name: "remove",
					description: "Set the Action Reports channel",
					type: 1
				}
			]
		},
		{
			name: "message-logging",
			description: "Message Logging",
			type: 2,
			options: [
				{
					name: "set",
					description: "Set the Message Logging channel",
					type: 1,
					options: [
						{
							name: "channel",
							description: "Channel",
							type: 7,
							required: true
						}
					]
				},
				{
					name: "remove",
					description: "Remove the Message Logging channel",
					type: 1
				}
			]
		}
	],
	whitelist: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, guildData}) => {
		function checkAdmin() {
			if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
				interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  Sorry dear!`,
							description: "I have to restrict this to Administrator's only",
							color: senkoClient.api.Theme.dark,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/heh.png" }
						}
					],
					ephemeral: true
				});
				return false;
			}
			return true;
		}
		const guildFlags = Bitfield.fromHex(guildData.flags);

		switch (interaction.options.getSubcommand()) {
		case "settings":
			if (!checkAdmin()) return;

			interaction.reply({
				embeds: [
					{
						title: "Server Configuration",
						description: `${Icons.exclamation}  We recommend you [update Senko with this invite](https://discord.com/api/oauth2/authorize?client_id=${senkoClient.user.id}&guild_id=${interaction.guildId}&permissions=1099511637126&scope=bot%20applications.commands) if you haven't\n\nAction Reports: ${guildData.ActionLogs !== null ? `<#${guildData.ActionLogs}>` : `${Icons.tick}  Not set`}\nMessage Logging: ${guildData.MessageLogs !== null ? `<#${guildData.MessageLogs}>` : `${Icons.tick}  Not set`}\nMember Logging: ${guildData.MemberLogging ? `<#${guildData.MemberLogging}>` : `${Icons.tick}  Not set`}`,
						color: senkoClient.api.Theme.dark,
						fields: [
							{name: `Moderation Commands ${Icons.beta}`, value: `\`\`\`diff\n${guildFlags.get(bits.BETAs.ModCommands) ? "+ Enabled" : "- Disabled"}\`\`\`` }
						]
					},
					{
						title: "Action log configuration",
						description: "Disabling an action will not log it in your Action Logging channel.",
						fields: [
							{name: "Ban Logs", value: `\`\`\`diff\n${guildFlags.get(bits.ActionLogs.BanActionDisabled) ? "- Disabled" : "+ Enabled"}\`\`\`\n`},
							{name: "Kick Logs", value: `\`\`\`diff\n${guildFlags.get(bits.ActionLogs.KickActionDisabled) ? "- Disabled" : "+ Enabled"}\`\`\`\n`},
							{name: "Timeout Logs", value: `\`\`\`diff\n${guildFlags.get(bits.ActionLogs.TimeoutActionDisabled) ? "- Disabled" : "+ Enabled"}\`\`\`\n`}
						],
						color: senkoClient.api.Theme.light
					}
				],
				components: [
					{
						type: 1,
						components: [
							{type: 2, label: "Update Moderation Commands", style: 2, custom_id: "mod:mod_beta"}
						]
					},
					{
						type: 1,
						components: [
							{type: 2, label: "Update Ban Logging", style: 1, custom_id: "mod:ban_log"},
							{type: 2, label: "Update Kick Logging", style: 1, custom_id: "mod:kick_log"},
							{type: 2, label: "Update Timeout Logging", style: 1, custom_id: "mod:timeout_log"}
						]
					}
				],
				ephemeral: true
			});
			break;
		case "set":
			if (!checkAdmin()) return;

			switch (interaction.options.getSubcommandGroup()) {
			case "action-reports":
				var actionChannel = interaction.options.getChannel("channel");

				if (!actionChannel || actionChannel.type != 0) return interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  That doesn't seem correct...`,
							description: "You need to specify a text channel!",
							color: senkoClient.api.Theme.dark,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/hat_think.png" }
						}
					],
					ephemeral: true
				});

				await updateSuperGuild(interaction.guild, {
					ActionLogs: actionChannel.id
				});

				interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  okay dear`,
							description: `I've set your Action Reports to ${actionChannel}`,
							color: senkoClient.api.Theme.light,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/talk.png" }
						}
					],
					content: "Action Reports channel set!",
					ephemeral: true
				});
				break;
			case "message-logging":
				var messageChannel = interaction.options.getChannel("channel");

				if (!messageChannel || messageChannel.type != 0) return interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  That doesn't seem correct...`,
							description: "You need to specify a text channel!",
							color: senkoClient.api.Theme.dark,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/hat_think.png" }
						}
					],
					ephemeral: true
				});

				await updateSuperGuild(interaction.guild, {
					MessageLogs: messageChannel.id
				});

				interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  okay dear`,
							description: `I will send Edited & Deleted messages in ${messageChannel}`,
							color: senkoClient.api.Theme.light,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/talk.png" }
						}
					],
					ephemeral: true
				});
				break;
			}
			break;
		case "remove":
			if (!checkAdmin()) return;

			switch (interaction.options.getSubcommandGroup()) {
			case "action-reports":
				await updateSuperGuild(interaction.guild, {
					ActionLogs: null
				});

				interaction.reply({
					embeds: [
						{
							title: `${Icons.question}  okay dear`,
							description: "I don't know your reasoning, but I've done what you said and removed your Action Reports channel!",
							color: senkoClient.api.Theme.dark,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/talk.png" }
						}
					],
					ephemeral: true
				});
				break;
			case "message-logging":
				await updateSuperGuild(interaction.guild, {
					MessageLogs: null
				});

				interaction.reply({
					embeds: [
						{
							title: `${Icons.question}  okay dear`,
							description: "If that's what you want I shall no longer look for edited or deleted messages",
							color: senkoClient.api.Theme.dark,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/talk.png" }
						}
					],
					ephemeral: true
				});
				break;
			}
			break;
		case "permissions":
			interaction.reply({
				embeds: [
					{
						title: "Senko's Required Permissions",
						description: `__**Required**__\nEmbed Links: ${CheckPermission(interaction.guild, "EmbedLinks") ? Icons.check : Icons.tick }\nAttach Files: ${CheckPermission(interaction.guild, "AttachFiles") ? Icons.check : Icons.tick }\nSend Messages: ${CheckPermission(interaction.guild, "SendMessages") ? Icons.check : Icons.tick }\nUse External Emojis: ${CheckPermission(interaction.guild, "UseExternalEmojis") ? Icons.check : Icons.tick}\n\n__**Moderation Requirements (Optional)**__\nBan Members: ${CheckPermission(interaction.guild, "BanMembers") ? Icons.check : Icons.tick}\nKick Members: ${CheckPermission(interaction.guild, "KickMembers") ? Icons.check : Icons.tick}\nModerate Members: ${CheckPermission(interaction.guild, "ModerateMembers") ? Icons.check : Icons.tick}\nManage Messages: ${CheckPermission(interaction.guild, "ManageMessages") ? Icons.check : Icons.tick}\nView Audit Log: ${CheckPermission(interaction.guild, "ViewAuditLog") ? Icons.check : Icons.tick}`,
						color: senkoClient.api.Theme.light
					}
				]
			});
			break;
		case "info":
			var guild = interaction.guild;

			interaction.reply({
				embeds: [
					{
						title: `${guild.name}`,
						description: `**Description**\n${guild.description ? `${interaction.guild.description}\n` : "No description"}\n**Vanity URL**: ${guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}  (${(await guild.fetchVanityData()).uses} uses)` : "None"}\n**Region**: ${guild.preferredLocale}\n**${guild.memberCount}** members\n**${guild.emojis.cache.size}** emojis\n**${guild.stickers.cache.size}** stickers\n**${guild.premiumSubscriptionCount}** boosts\n**${(await guild.bans.fetch()).size}** bans`,
						color: senkoClient.api.Theme.light,
						thumbnail: { url: guild.iconURL({ dynamic: true }) }
						// image: { url: guild.bannerURL({ size: 4096 }) },
					}
				]
			});
			break;
		}
	}
};