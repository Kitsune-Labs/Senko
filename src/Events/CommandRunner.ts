import type { SenkoClientTypes, SenkoCommand, SenkoMessageOptions } from "../types/AllTypes";

import { fetchSuperGuild, fetchConfig, fetchSuperUser, updateSuperUser } from "../API/super";
import { CommandInteractionOptionResolver, InteractionType, PermissionFlagsBits } from "discord.js";
import type { ApplicationCommand, Interaction, CommandInteraction } from "discord.js";
import { existsSync } from "fs";

import { print, error, randomNumber } from "@kitsune-labs/utilities";
import Icons from "../Data/Icons.json";

export const SenkoClientPermissions = [
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.AttachFiles,
	PermissionFlagsBits.UseExternalEmojis,
	PermissionFlagsBits.AddReactions,
	PermissionFlagsBits.ViewChannel
] as any;

export default class {
	async execute(SenkoClient: SenkoClientTypes) {
		SenkoClient.on("interactionCreate", async (interaction: ApplicationCommand | Interaction | CommandInteraction | CommandInteractionOptionResolver | any) => {
			if (!interaction || interaction.type !== InteractionType.ApplicationCommand || interaction.user.bot || interaction.replied || !interaction.guild) return;
			const dataConfig = await fetchConfig();
			const LoadedInteractionCommand = SenkoClient.api.Commands.get(interaction.commandName) as unknown as SenkoCommand;
			const superGuildData = await fetchSuperGuild(interaction.guild);
			const accountData = await fetchSuperUser(interaction.user);

			if (!LoadedInteractionCommand) return interaction.reply({ embeds: [{ title: "Woops!", description: `I can't seem to find "${interaction.commandName}", I will attempt to find it for you, come talk to me in a few minutes!`, color: SenkoClient.api.Theme.dark, thumbnail: { url: "https://assets.senkosworld.com/media/senko/heh.png" } }], ephemeral: true });

			if (dataConfig.OutlawedUsers[interaction.member.id] && !LoadedInteractionCommand.whitelist) return interaction.reply({
				embeds: [{
					title: `${Icons.exclamation} You have been banished!`,
					description: "You have been banished from using the Senko Bot for breaking our rules.",
					color: SenkoClient.api.Theme.dark_red,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/pout.png"
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
				if (!interaction.guild.members.me.permissions.has(permission)) {
					// @ts-expect-error
					permissionEmbed.embeds[0].description += `${permission}\n`;
					permissionMessage.content += `${permission}\n`;
				}
			}

			// @ts-expect-error
			if (!permissionEmbed.embeds[0].description.endsWith("\n")) {
				if (interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)) return interaction.reply(permissionEmbed);
				return interaction.reply(permissionMessage);
			}

			if (!superGuildData || !accountData) return interaction.reply({
				embeds: [{
					title: "Oh my!",
					description: "It looks like there was an issue retrieving data, please try again later!",
					color: SenkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}],
				ephemeral: true
			});

			if (superGuildData.Channels.length > 0 && !superGuildData.Channels.includes(interaction.channelId) && !LoadedInteractionCommand.usableAnywhere) {
				const messageStruct1 = {
					embeds: [{
						title: "S-Sorry dear!",
						description: `${interaction.guild.name} has requested you use ${superGuildData.Channels.map(i=>`<#${i}>`)}!`,
						color: SenkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/senko/heh.png"
						}
					}],
					ephemeral: true
				};

				await interaction.deferReply({ ephemeral: true });
				return interaction.followUp(messageStruct1);
			}

			print(`Command Ran: ${interaction.commandName}`);

			//! Start level
			let xp = accountData.LocalUser.accountConfig.level.xp;
			let level = accountData.LocalUser.accountConfig.level.level;
			const Amount = 300 * (level * 5);

			if (xp > Amount) {
				level += Math.floor(xp / Amount);
				xp = xp % Amount;
			} else {
				xp = xp + randomNumber(25);
			}

			if (level > accountData.LocalUser.accountConfig.level.level) {
				interaction.channel.send({
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
				generalLocale: existsSync(`./src/Data/Locales/${interaction.locale}.json`) ? require(`../Data/Locales/${interaction.locale}.json`).general : require("../Data/Locales/en-US.json").general
			}).catch(err => {
				const messageStruct = {
					embeds: [{
						title: "Woops!",
						description: `I seem to have dropped ${LoadedInteractionCommand.name}, I will attempt to fix it please come back soon!`,
						color: SenkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/senko/heh.png"
						}
					}],
					ephemeral: true
				};

				if (interaction.deferred) {
					interaction.followUp(messageStruct);
				} else {
					interaction.reply(messageStruct);
				}

				error(err.stack.toString());

				if (process.env["NIGHTLY"] !== "true") SenkoClient.api.statusLog.send({
					content: "<@609097445825052701>",
					embeds: [{
						title: "Senko - Command Error",
						description: err.stack.toString(),
						color: SenkoClient.api.Theme.light
					}]
				});
			});
		});
	}
}