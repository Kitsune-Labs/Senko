import type { SenkoCommand } from "../../types/AllTypes";
import { PermissionFlagsBits, ApplicationCommandOptionType as CommandOption, ChannelType, ButtonStyle, ComponentType } from "discord.js";
import Icons from "../../Data/Icons.json";
import { Bitfield } from "bitfields";
import bits from "../../API/Bits.json";
import { updateSuperGuild } from "../../API/super";

export default {
	name: "server",
	desc: "server",
	usableAnywhere: true,
	category: "admin",
	permissions: [PermissionFlagsBits.Administrator],
	options: [
		{
			name: "info",
			description: "Server info",
			type: CommandOption.Subcommand
		},
		{
			name: "settings",
			description: "Guild Configuration",
			type: CommandOption.Subcommand
		},
		{
			name: "permissions",
			description: "Display what permissions Senko needs",
			type: CommandOption.Subcommand
		},
		{
			name: "action-logs",
			description: "set",
			type: CommandOption.SubcommandGroup,
			options: [
				{
					name: "set",
					description: "Set the Action Log channel",
					type: CommandOption.Subcommand,
					options: [
						{
							name: "channel",
							description: "Channel",
							type: CommandOption.Channel,
							channelTypes: [ChannelType.GuildText],
							required: true
						}
					]
				},
				{
					name: "remove",
					description: "Set the Action Log channel",
					type: CommandOption.Subcommand
				}
			]
		},
		{
			name: "message-logging",
			description: "Message Logging",
			type: CommandOption.SubcommandGroup,
			options: [
				{
					name: "set",
					description: "Set the Message Logging channel",
					type: CommandOption.Subcommand,
					options: [
						{
							name: "channel",
							description: "Channel",
							type: CommandOption.Channel,
							channelTypes: [ChannelType.GuildText],
							required: true
						}
					]
				},
				{
					name: "remove",
					description: "Remove the Message Logging channel",
					type: CommandOption.Subcommand
				},
				{
					name: "advanced",
					description: "Advanced Message Logging settings",
					type: CommandOption.Subcommand
				}
			]
		}
	],
	whitelist: true,
	start: async ({ Senko, Interaction, GuildData }) => {
		function checkAdmin() {
			// @ts-ignore
			if (!Interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
				Interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  Sorry dear!`,
							description: "I have to restrict this to Administrator's only",
							color: Senko.Theme.dark,
							thumbnail: { url: "https://cdn.senko.gg/public/senko/heh.png" }
						}
					],
					ephemeral: true
				});
				return false;
			}
			return true;
		}
		const guildFlags = Bitfield.fromHex(GuildData.flags);

		switch (Interaction.options.getSubcommand()) {
			case "settings":
				if (!checkAdmin()) return;

				Interaction.reply({
					embeds: [
						{
							title: "Server Configuration",
							description: `${Icons.exclamation}  We recommend you [update Senko with this invite](https://discord.com/api/oauth2/authorize?client_id=${Senko.user!.id}&guild_id=${Interaction.guildId}&permissions=1099511637126&scope=bot%20applications.commands) if you haven't\n\nAction Logs: ${GuildData.ActionLogs !== null ? `<#${GuildData.ActionLogs}>` : `${Icons.tick}  Not set`}\nMessage Logging: ${GuildData.MessageLogs !== null ? `<#${GuildData.MessageLogs}>` : `${Icons.tick}  Not set`}\nMember Logging: ${GuildData.MemberLogs ? `<#${GuildData.MemberLogs}>` : `${Icons.tick}  Not set`}`,
							color: Senko.Theme.light_red,
							fields: [
								{ name: `Moderation Commands ${Icons.beta}`, value: `\`\`\`diff\n${guildFlags.get(bits.BETAs.ModCommands) ? "+ Enabled" : "- Disabled"}\`\`\`` }
							]
						},
						{
							title: "Action log configuration",
							description: "Disabling an action will not log it in your Action Logging channel.",
							fields: [
								{ name: "Ban Logs", value: `\`\`\`diff\n${guildFlags.get(bits.ActionLogs.BanActionDisabled) ? "- Disabled" : "+ Enabled"}\`\`\`\n` },
								{ name: "Kick Logs", value: `\`\`\`diff\n${guildFlags.get(bits.ActionLogs.KickActionDisabled) ? "- Disabled" : "+ Enabled"}\`\`\`\n` },
								{ name: "Timeout Logs", value: `\`\`\`diff\n${guildFlags.get(bits.ActionLogs.TimeoutActionDisabled) ? "- Disabled" : "+ Enabled"}\`\`\`\n` }
							],
							color: Senko.Theme.light_red
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "Update Moderation Commands", style: 2, customId: "mod:mod_beta" }
							]
						},
						{
							type: 1,
							components: [
								{ type: 2, label: "Update Ban Logging", style: 1, customId: "mod:ban_log" },
								{ type: 2, label: "Update Kick Logging", style: 1, customId: "mod:kick_log" },
								{ type: 2, label: "Update Timeout Logging", style: 1, customId: "mod:timeout_log" }
							]
						}
					],
					ephemeral: true
				});
				break;
			case "set":
				if (!checkAdmin()) return;

				switch (Interaction.options.getSubcommandGroup()) {
					case "action-logs":
						var actionChannel = Interaction.options.get("channel", true).channel;

						await updateSuperGuild(Interaction.guild!, {
							ActionLogs: actionChannel?.id
						});

						Interaction.reply({
							embeds: [
								{
									title: `${Icons.exclamation}  okay dear`,
									description: `I've set your Action Log channel to ${actionChannel}`,
									color: Senko.Theme.light,
									thumbnail: { url: "https://cdn.senko.gg/public/senko/talk.png" }
								}
							],
							content: "Action Log channel set!",
							ephemeral: true
						});
						break;
					case "message-logging":
						var messageChannel = Interaction.options.get("channel", true).channel;

						await updateSuperGuild(Interaction.guild!, {
							MessageLogs: messageChannel?.id
						});

						Interaction.reply({
							embeds: [
								{
									title: `${Icons.exclamation}  okay dear`,
									description: `I will send Edited & Deleted messages in ${messageChannel}`,
									color: Senko.Theme.light,
									thumbnail: { url: "https://cdn.senko.gg/public/senko/talk.png" }
								}
							],
							ephemeral: true
						});
						break;
				}
				break;
			case "remove":
				if (!checkAdmin()) return;
				switch (Interaction.options.getSubcommandGroup()) {
					case "action-logs":
						await updateSuperGuild(Interaction.guild!, {
							ActionLogs: null
						});

						Interaction.reply({
							embeds: [
								{
									title: `${Icons.question}  okay dear`,
									description: "I don't know your reasoning, but I've done what you said and removed your Action Log channel!",
									color: Senko.Theme.dark,
									thumbnail: { url: "https://cdn.senko.gg/public/senko/talk.png" }
								}
							],
							ephemeral: true
						});
						break;
					case "message-logging":
						await updateSuperGuild(Interaction.guild!, {
							MessageLogs: null,
							AdvancedMessageLogging: {
								// eslint-disable-next-line camelcase
								message_edits: null,
								// eslint-disable-next-line camelcase
								message_deletions: null
							}
						});

						Interaction.reply({
							embeds: [
								{
									title: `${Icons.question}  okay dear`,
									description: "If that's what you want I shall no longer look for edited or deleted messages",
									color: Senko.Theme.dark,
									thumbnail: { url: "https://cdn.senko.gg/public/senko/talk.png" }
								}
							],
							ephemeral: true
						});
						break;
				}
				break;
			case "permissions":
				Interaction.reply({
					embeds: [
						{
							title: "Senko's Required Permissions",
							description: `__**Required**__\nEmbed Links: ${Interaction.guild!.members.me!.permissions.has(PermissionFlagsBits.EmbedLinks) ? Icons.check : Icons.tick}\nAttach Files: ${Interaction.guild!.members.me!.permissions.has(PermissionFlagsBits.AttachFiles) ? Icons.check : Icons.tick}\nSend Messages: ${Interaction.guild!.members.me!.permissions.has(PermissionFlagsBits.SendMessages) ? Icons.check : Icons.tick}\nUse External Emojis: ${Interaction.guild!.members.me!.permissions.has(PermissionFlagsBits.UseExternalEmojis) ? Icons.check : Icons.tick}\n\n__**Moderation Requirements (Optional)**__\nBan Members: ${Interaction.guild!.members.me!.permissions.has(PermissionFlagsBits.BanMembers) ? Icons.check : Icons.tick}\nKick Members: ${Interaction.guild!.members.me!.permissions.has(PermissionFlagsBits.KickMembers) ? Icons.check : Icons.tick}\nModerate Members: ${Interaction.guild!.members.me!.permissions.has(PermissionFlagsBits.ModerateMembers) ? Icons.check : Icons.tick}\nManage Messages: ${Interaction.guild!.members.me!.permissions.has(PermissionFlagsBits.ManageMessages) ? Icons.check : Icons.tick}\nView Audit Log: ${Interaction.guild!.members.me!.permissions.has(PermissionFlagsBits.ViewAuditLog) ? Icons.check : Icons.tick}`,
							color: Senko.Theme.light
						}
					]
				});
				break;
			case "info":
				var guild = Interaction.guild;

				Interaction.reply({
					embeds: [
						{
							title: `${guild!.name}`,
							description: `**Description**\n${guild!.description ? `${Interaction.guild!.description}\n` : "No description"}\n**Vanity URL**: ${guild!.vanityURLCode ? `https://discord.gg/${guild!.vanityURLCode}  (${(await guild!.fetchVanityData()).uses} uses)` : "None"}\n**Region**: ${guild!.preferredLocale}\n**${guild!.memberCount}** members\n**${guild!.emojis.cache.size}** emojis\n**${guild!.stickers.cache.size}** stickers\n**${guild!.premiumSubscriptionCount}** boosts\n**${(await guild!.bans.fetch()).size}** bans`,
							color: Senko.Theme.light,
							thumbnail: {
								url: guild!.iconURL() as string
							}
							// image: { url: guild.bannerURL({ size: 4096 }) },
						}
					]
				});
				break;
			case "advanced":
				if (!checkAdmin()) return;
				var EditCheck = GuildData.AdvancedMessageLogging.message_edits ? true : false;
				var DeleteCheck = GuildData.AdvancedMessageLogging.message_deletions ? true : false;

				Interaction.reply({
					embeds: [
						{
							title: "Advanced Message Log Settings",
							description: `> ${DeleteCheck ? `Deleted messages will be sent to <#${GuildData.AdvancedMessageLogging.message_deletions}>` : "Deleted messages will be sent to the default message logging channel if applicable"}\n\n> ${EditCheck ? `Edited messages will be sent to <#${GuildData.AdvancedMessageLogging.message_edits}>` : "Edited messages will be sent to the default message logging channel if applicable"}`,
							color: Senko.Theme.light
						}
					],
					ephemeral: true,
					components: [
						{
							type: ComponentType.ActionRow,
							components: [
								{
									type: ComponentType.Button,
									label: DeleteCheck ? "Update Deleted Messages Channel" : "Setup Deleted Messages Channel",
									style: DeleteCheck ? ButtonStyle.Primary : ButtonStyle.Success,
									customId: "log:deleted-messages"
								},
								{
									type: ComponentType.Button,
									label: EditCheck ? "Update Edited Messages Channel" : "Setup Edited Messages Channel",
									style: EditCheck ? ButtonStyle.Primary : ButtonStyle.Success,
									customId: "log:edited-messages"
								}
							]
						},
						{
							type: ComponentType.ActionRow,
							components: [
								{
									type: ComponentType.Button,
									label: "Remove Deleted Messages Channel",
									style: ButtonStyle.Danger,
									customId: "log:remove-deleted-messages",
									disabled: DeleteCheck ? false : true
								},
								{
									type: ComponentType.Button,
									label: "Remove Edited Messages Channel",
									style: ButtonStyle.Danger,
									customId: "log:remove-edited-messages",
									disabled: EditCheck ? false : true
								}
							]
						},
						{
							type: ComponentType.ActionRow,
							components: [
								{
									type: ComponentType.Button,
									emoji: {
										name: "🔃"
									},
									style: ButtonStyle.Secondary,
									customId: "log:refresh"
								}
							]
						}
					]
				});
		}
	}
} as SenkoCommand;