import type { SenkoClientTypes, SenkoMessageOptions } from "../types/AllTypes";

import { PermissionFlagsBits, PermissionsBitField, Events, Interaction, GuildMember } from "discord.js";
import { Locales, senkoClient, winston } from "../SenkoClient";
import SenkoProfile from "../API/SenkoProfile";
import Icons from "../Data/Icons.json";
import SenkoGuild from "../API/Guild";

export const SenkoClientPermissions = [
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.AttachFiles,
	PermissionFlagsBits.UseExternalEmojis,
	PermissionFlagsBits.AddReactions
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
			if (!interaction.isChatInputCommand() || !interaction.guild || !interaction.member || !SenkoClient.isReady()) return;

			const LoadedInteractionCommand = SenkoClient.api.Commands.get(interaction.commandName);

			if (!LoadedInteractionCommand) {
				winston.log("warn", `User tried to run "${interaction.commandName}" but it doesn't exist in ${SenkoClient.api.Commands.keys}!`);

				return interaction.reply({
					embeds: [
						{
							title: "Oh dear...",
							description: `It seems that ${interaction.commandName} has gone missing! I'll do my best to find it, please check back soon.`,
							color: SenkoClient.Theme.dark,
							thumbnail: {
								url: "https://cdn.senko.gg/public/senko/heh.png"
							}
						}
					],
					ephemeral: true
				});
			}

			const RawMember = new SenkoProfile(interaction.member as GuildMember);
			const RawGuild = new SenkoGuild(interaction.guild);

			const [Member, Guild] = await Promise.all([
				RawMember.init(),
				RawGuild.init()
			]);

			const [GuildData, MemberData] = await Promise.all([
				Guild.data.fetch(),
				Member.data.fetch()
			]);

			if (!GuildData || !MemberData) return interaction.reply({
				embeds: [{
					title: "Oh my!",
					description: "It looks like there was an issue retrieving data, please try again later!",
					color: SenkoClient.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}],
				ephemeral: true
			});

			const CommandTime = Date.now();

			if (Member.Blacklisted && !LoadedInteractionCommand.whitelist) return interaction.reply({
				embeds: [{
					title: `${Icons.exclamation} You have been banished!`,
					description: "You have been banished from using the Senko Bot for breaking our rules.",
					color: SenkoClient.Theme.dark_red,
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
						color: SenkoClient.Theme.dark
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

			if (GuildData.Channels.length > 0 && !GuildData.Channels.includes(interaction.channelId) && !LoadedInteractionCommand.usableAnywhere) {
				const messageStruct1 = {
					embeds: [{
						title: "S-Sorry dear!",
						description: `${interaction.guild.name} has requested you use ${GuildData.Channels.map(i => `<#${i}>`)}!`,
						color: SenkoClient.Theme.dark,
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

			Member.activityTick();

			// print(`Locale: ${interaction.locale} | ${interaction.locale}.json exists = ${existsSync(`./src/Data/Locales/${interaction.locale}.json`)}`);

			LoadedInteractionCommand.start({
				Interaction: interaction,
				Senko: SenkoClient,
				Member: Member,
				MemberData: MemberData,
				Guild: Guild,
				GuildData: GuildData,
				CommandLocale: Member.Locale[interaction.commandName] || Locales["en-US"][interaction.commandName],
				GeneralLocale: Member.Locale.general || Locales["en-US"].general
			}).catch(err => {
				const messageStruct = {
					embeds: [{
						title: "Oh my...",
						description: `It seems that ${LoadedInteractionCommand.name} had an error functioning correctly... Let me try to resolve the issue!`,
						color: SenkoClient.Theme.dark,
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
			}).finally(() => {
				winston.log("info", `Command "${interaction.commandName}" finished in ${Date.now() - CommandTime}ms`);
			});
		});
	}
}