import type { SenkoClientTypes, SenkoCommand, SenkoMessageOptions } from "../types/AllTypes";

import { fetchSuperGuild, fetchConfig, fetchSuperUser, updateSuperUser } from "../API/super";
import { PermissionFlagsBits, PermissionsBitField, Events, Interaction } from "discord.js";
import { existsSync } from "fs";

import { randomNumber } from "@kitsune-labs/utilities";
import Icons from "../Data/Icons.json";
import { senkoClient, winston } from "../SenkoClient";

export const SenkoClientPermissions = [
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.AttachFiles,
	PermissionFlagsBits.UseExternalEmojis,
	PermissionFlagsBits.AddReactions,
	PermissionFlagsBits.ViewChannel
];

export const SenkoClientModerationPermissions = [
	PermissionFlagsBits.KickMembers,
	PermissionFlagsBits.BanMembers,
	PermissionFlagsBits.ManageMessages,
	PermissionFlagsBits.ManageChannels,
	PermissionFlagsBits.ViewAuditLog,
	PermissionFlagsBits.ModerateMembers
];

export const SenkoClientPermissionBits = new PermissionsBitField(SenkoClientPermissions);
export const SenkoClientModerationPermissionBits = new PermissionsBitField(SenkoClientModerationPermissions);

winston.info("");
winston.log("senko", `Bot Invite: https://discord.com/oauth2/authorize?client_id=${senkoClient.user?.id}&scope=applications.commands%20bot&permissions=${SenkoClientPermissionBits.bitfield}`);
winston.log("senko", `Bot Invite w/ Mod: https://discord.com/oauth2/authorize?client_id=${senkoClient.user?.id}&scope=applications.commands%20bot&permissions=${SenkoClientModerationPermissionBits.bitfield}`);
winston.log("senko", `Combined Invite: https://discord.com/oauth2/authorize?client_id=${senkoClient.user?.id}&scope=applications.commands%20bot&permissions=${SenkoClientPermissionBits.bitfield + SenkoClientModerationPermissionBits.bitfield}`);
winston.info("");

export default class {
	async execute(SenkoClient: SenkoClientTypes) {
		SenkoClient.on(Events.InteractionCreate, async (interaction: Interaction) => {
			if (!interaction.isChatInputCommand() || !interaction.guild) return;

			const LoadedInteractionCommand = SenkoClient.api.Commands.get(interaction.commandName) as SenkoCommand;

			if (!LoadedInteractionCommand) {
				winston.log("warn", `User tried to run "${interaction.commandName}" but it doesn't exist in ${SenkoClient.api.Commands.keys}!`);

				return interaction.reply({
					embeds: [
						{
							title: "Oh dear...",
							description: `It seems that ${interaction.commandName} has gone missing! I'll do my best to find it, please check back soon.`,
							color: SenkoClient.api.Theme.dark,
							thumbnail: {
								url: "https://cdn.senko.gg/public/senko/heh.png"
							}
						}
					],
					ephemeral: true
				});
			}

			const dataConfig = await fetchConfig();
			const superGuildData = await fetchSuperGuild(interaction.guild);
			const accountData = await fetchSuperUser(interaction.user);

			if (!superGuildData || !accountData || !dataConfig) return interaction.reply({
				embeds: [{
					title: "Oh my!",
					description: "It looks like there was an issue retrieving data, please try again later!",
					color: SenkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}],
				ephemeral: true
			});

			const CommandTime = Date.now();

			if (dataConfig.OutlawedUsers[interaction.user.id] && !LoadedInteractionCommand.whitelist) return interaction.reply({
				embeds: [{
					title: `${Icons.exclamation} You have been banished!`,
					description: "You have been banished from using the Senko Bot for breaking our rules.",
					color: SenkoClient.api.Theme.dark_red,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/pout.png"
					}
				}],
				ephemeral: true
			});

			if (LoadedInteractionCommand.defer) {
				if (LoadedInteractionCommand.ephemeral && LoadedInteractionCommand.ephemeral === true) {
					await interaction.deferReply({ ephemeral: true });
				} else {
					await interaction.deferReply();
				}
			}

			if (!interaction.guild.members.me?.permissions.has(SenkoClientPermissionBits)) {
				const permissionEmbed: SenkoMessageOptions = {
					embeds: [{
						title: "Oh dear...",
						description: "It looks like im missing some permissions, here is what I am missing:\n\n",
						color: SenkoClient.api.Theme.dark
					}],
					ephemeral: true
				};

				const permissionMessage = {
					content: "Oh dear...\n\nIt looks like im missing some permissions, here is what I am missing:\n\n",
					ephemeral: true
				};

				for (const permission of SenkoClientPermissions) {
					if (!interaction.guild.members.me?.permissions.has(permission)) {
						// @ts-expect-error
						permissionEmbed.embeds[0].description += `${permission}\n`;
						permissionMessage.content += `${permission}\n`;
					}
				}

				// @ts-expect-error
				if (!permissionEmbed.embeds[0].description.endsWith("\n")) {
					if (interaction.guild.members.me?.permissions.has(PermissionFlagsBits.EmbedLinks)) return interaction.reply(permissionEmbed);
					return interaction.reply(permissionMessage);
				}
			}

			if (superGuildData.Channels.length > 0 && !superGuildData.Channels.includes(interaction.channelId) && !LoadedInteractionCommand.usableAnywhere) {
				const messageStruct1 = {
					embeds: [{
						title: "S-Sorry dear!",
						description: `${interaction.guild.name} has requested you use ${superGuildData.Channels.map(i => `<#${i}>`)}!`,
						color: SenkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/heh.png"
						}
					}],
					ephemeral: true
				};

				await interaction.deferReply({ ephemeral: true });
				return interaction.followUp(messageStruct1);
			}

			winston.log("info", `Running command "${interaction.commandName}"`);

			//! Start level
			let xp = accountData.LocalUser.accountConfig.level.xp;
			let level = accountData.LocalUser.accountConfig.level.level;
			const Amount = 1500 * level;

			if (xp > Amount) {
				level += Math.floor(xp / Amount);
				xp %= Amount;
				interaction.channel?.send({
					content: `${interaction.user}`,
					embeds: [{
						title: "Congratulations dear!",
						description: `You are now level **${level}**`,
						color: SenkoClient.api.Theme.light,
						thumbnail: {
							url: interaction.user.displayAvatarURL()
						}
					}]
				});
			} else {
				xp += randomNumber(25);
			}

			accountData.LocalUser.accountConfig.level.xp = xp;
			accountData.LocalUser.accountConfig.level.level = level;

			updateSuperUser(interaction.user, {
				LocalUser: accountData.LocalUser
			});

			//! End level

			updateSuperUser(interaction.user, {
				LastUsed: new Date().toISOString()
			});

			// print(`Locale: ${interaction.locale} | ${interaction.locale}.json exists = ${existsSync(`./src/Data/Locales/${interaction.locale}.json`)}`);

			LoadedInteractionCommand.start({
				senkoClient: SenkoClient,
				interaction: interaction,
				guildData: superGuildData,
				userData: accountData,
				xpAmount: Amount,
				locale: existsSync(`./src/Data/Locales/${interaction.locale}.json`) ? require(`../Data/Locales/${interaction.locale}.json`)[LoadedInteractionCommand.name] : require("../Data/Locales/en-US.json")[LoadedInteractionCommand.name],
				generalLocale: existsSync(`./src/Data/Locales/${interaction.locale}.json`) ? require(`../Data/Locales/${interaction.locale}.json`).general : require("../Data/Locales/en-US.json").general,
				Icons: Icons,
				Theme: senkoClient.api.Theme
			}).catch(err => {
				const messageStruct = {
					embeds: [{
						title: "Oh my...",
						description: `It seems that ${LoadedInteractionCommand.name} had an error functioning correctly... Let me try to resolve the issue!`,
						color: SenkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/heh.png"
						}
					}],
					ephemeral: true
				};

				if (interaction.deferred) {
					interaction.followUp(messageStruct);
				} else {
					interaction.reply(messageStruct);
				}

				winston.info("error", `Command ${LoadedInteractionCommand.name} encountered an error: ${err}`);

				SenkoClient.api.statusLog.send({
					content: "<@609097445825052701>",
					embeds: [{
						title: "Senko - Command Error",
						description: err.stack.toString(),
						color: SenkoClient.api.Theme.light
					}]
				});
			}).finally(() => {
				winston.log("info", `Command "${interaction.commandName}" finished in ${Date.now() - CommandTime}ms`);
			});
		});
	}
}