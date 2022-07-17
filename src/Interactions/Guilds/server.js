// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
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
	options: [
		{
			name: "info",
			description: "Server info",
			type: 1
		},
		{
			name: "configuration",
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
							type: "CHANNEL",
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
							type: "CHANNEL",
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
	usableAnywhere: true,
	category: "admin",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, AccountData) => {
		function checkAdmin() {
			if (!interaction.member.permissions.has("ADMINISTRATOR")) {
				interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  Sorry dear!`,
							description: "I have to restrict this to Administrator's only",
							color: SenkoClient.colors.dark,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/heh.png" }
						}
					],
					ephemeral: true
				});
				return false;
			}
			return true;
		}

		const guildFlags = Bitfield.fromHex(GuildData.flags);

		switch (interaction.options.getSubcommand()) {
		case "configuration":
			if (!checkAdmin()) return;

			interaction.reply({
				embeds: [
					{
						title: "Server Configuration",
						description: `${Icons.exclamation}  We recommend you [update Senko with this invite](https://discord.com/api/oauth2/authorize?client_id=${SenkoClient.user.id}&guild_id=${interaction.guildId}&permissions=1099511637126&scope=bot%20applications.commands) if you haven't\n\nAction Reports: ${GuildData.ActionLogs !== null ? `<#${GuildData.ActionLogs}>` : `${Icons.tick}  Not set`}\nMessage Logging: ${GuildData.MessageLogs !== null ? `<#${GuildData.MessageLogs}>` : `${Icons.tick}  Not set`}\nMember Logging: ${GuildData.MemberLogging ? `<#${GuildData.MemberLogging}>` : `${Icons.tick}  Not set`}`,
						color: SenkoClient.colors.dark,
						fields: [
							{ name: `Moderation Commands ${Icons.beta}`, value: `\`\`\`diff\n${guildFlags.get(bits.BETAs.ModCommands) ? "+ Enabled" : "- Disabled"}\`\`\`` }
						]
					},
					{
						title: "Action log configuration",
						description: "Disabling an action will not log it in your Action Logging channel",
						color: SenkoClient.colors.light
					}
				],
				components: [
					{
						type: 1,
						components: [
							{ type: 2, label: guildFlags.get(bits.BETAs.ModCommands) ? "Disable Moderation Commands" :"Enable Moderation Commands", style: guildFlags.get(bits.BETAs.ModCommands) ? 4 : 3, custom_id: "guild_moderation" }
						]
					},
					{
						type: 1,
						components: [
							{ type: 2, label: guildFlags.get(bits.ActionLogs.BanActionDisabled) ? "Enable Ban Logs" : "Disable Ban Logs", style: guildFlags.get(bits.ActionLogs.BanActionDisabled) ? 3 : 4, custom_id: "g_disable_bans" },
							{ type: 2, label: guildFlags.get(bits.ActionLogs.KickActionDisabled) ? "Enable Kick Logs": "Disable Kick Logs", style: guildFlags.get(bits.ActionLogs.KickActionDisabled) ? 3 : 4, custom_id: "g_disable_kicks" },
							{ type: 2, label: guildFlags.get(bits.ActionLogs.TimeoutActionDisabled) ? "Enable Timeout Logs" : "Disable Timeout Logs", style: guildFlags.get(bits.ActionLogs.TimeoutActionDisabled) ? 3 : 4, custom_id: "g_disable_timeouts" }
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

				if (!actionChannel || actionChannel.type != "GUILD_TEXT") return interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  That doesn't seem correct...`,
							description: "You need to specify a text channel!",
							color: SenkoClient.colors.dark,
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
							color: SenkoClient.colors.light,
							thumbnail: { url: "https://assets.senkosworld.com/media/senko/talk.png" }
						}
					],
					content: "Action Reports channel set!",
					ephemeral: true
				});
				break;
			case "message-logging":
				var messageChannel = interaction.options.getChannel("channel");

				if (!messageChannel || messageChannel.type != "GUILD_TEXT") return interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  That doesn't seem correct...`,
							description: "You need to specify a text channel!",
							color: SenkoClient.colors.dark,
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
							color: SenkoClient.colors.light,
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
							color: SenkoClient.colors.dark,
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
							color: SenkoClient.colors.dark,
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
						description: `__**Required**__\nEmbed Links: ${CheckPermission(interaction, "EMBED_LINKS") ? Icons.check : Icons.tick }\nAttach Files: ${CheckPermission(interaction, "ATTACH_FILES") ? Icons.check : Icons.tick }\nSend Messages: ${CheckPermission(interaction, "SEND_MESSAGES") ? Icons.check : Icons.tick }\nUse External Emojis: ${CheckPermission(interaction, "USE_EXTERNAL_EMOJIS") ? Icons.check : Icons.tick}\n\n__**Moderation Requirements (Optional)**__\nBan Members: ${CheckPermission(interaction, "BAN_MEMBERS") ? Icons.check : Icons.tick}\nKick Members: ${CheckPermission(interaction, "KICK_MEMBERS") ? Icons.check : Icons.tick}\nModerate Members: ${CheckPermission(interaction, "MODERATE_MEMBERS") ? Icons.check : Icons.tick}\nManage Messages: ${CheckPermission(interaction, "MANAGE_MESSAGES") ? Icons.check : Icons.tick}\nView Audit Log: ${CheckPermission(interaction, "VIEW_AUDIT_LOG") ? Icons.check : Icons.tick}`,
						color: SenkoClient.colors.light
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
						color: SenkoClient.colors.light,
						thumbnail: { url: guild.iconURL({ dynamic: true }) }
						// image: { url: guild.bannerURL({ size: 4096 }) },
					}
				]
			});
			break;
		}
	}
};