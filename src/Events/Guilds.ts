import { Bitfield } from "bitfields";
import { deleteSuperGuild, fetchSuperGuild } from "../API/super";
import bits from "../API/Bits.json";
import { Colors, PermissionFlagsBits, AuditLogEvent, GuildTextBasedChannel, ChannelType, TextChannel } from "discord.js";
import type { SenkoClientTypes } from "../types/AllTypes";
import { winston } from "../SenkoClient";

export default class {
	async execute(senkoClient: SenkoClientTypes) {
		// SenkoClient.on("messageCreate", async message => {
		//     const guildData = await fetchSuperGuild(message.guild);
		//     const guildFlags = Bitfield.fromHex(guildData.flags);

		//     if (guildData.Counting.channel && guildData.Counting.channel === message.channelId) {
		//         guildData.Counting.number++;

		//         if (message.content !== guildData.Counting.number) return message.delete();

		//         await updateSuperGuild(message.guild, {
		//             Counting: guildData.Counting
		//         });
		//     }
		// });

		senkoClient.on("guildDelete", async guild => {
			await deleteSuperGuild(guild);
		});

		senkoClient.on("guildBanAdd", async (member) => {
			// @ts-expect-error
			if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;

			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberBanAdd
			});

			const banLog = fetchedLogs.entries.first();
			if (!banLog || banLog.executor!.id === senkoClient.user!.id) return;

			var guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData!.flags);

			if (guildData!.ActionLogs && !guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
				const loggingChannel = await member.guild.channels.fetch(guildData!.ActionLogs) as GuildTextBasedChannel;

				if (loggingChannel.type !== ChannelType.GuildText) return;

				loggingChannel.send({
					embeds: [
						{
							title: "Action Report - Kitsune Banned",
							description: `${member.user.tag || member} [${member.user.id || member}]\n> __${banLog.reason || "No reason provided."}__\n\n[__Permanately Banned__]`,
							color: Colors.Red,
							author: {
								name: `${`${banLog.executor!.username}#${banLog.executor!.discriminator}` || "Unknown"}  [${banLog.executor!.id || "000000000000000000"}]`,
								icon_url: `${banLog.executor!.displayAvatarURL()}`
							}
						}
					]
				}).catch((err: any) => {
					winston.log("error", err);
				});
			}
		});

		senkoClient.on("guildBanRemove", async (member) => {
			// @ts-expect-error
			if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;

			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberBanRemove
			});

			const banLog = fetchedLogs.entries.first();

			if (!banLog || banLog.executor!.id === senkoClient.user!.id) return;

			const guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData!.flags);

			if (guildData!.ActionLogs && !guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
				const loggingChannel = await member.guild.channels.fetch(guildData!.ActionLogs) as GuildTextBasedChannel;

				if (loggingChannel.type !== ChannelType.GuildText) return;

				loggingChannel.send({
					embeds: [
						{
							title: "Action Report - Kitsune Pardoned",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\n> ${banLog.reason || "No reason provided."}`,
							color: Colors.Green,
							thumbnail: {
								url: member.user.displayAvatarURL()
							},
							author: {
								name: `${`${banLog.executor!.username}#${banLog.executor!.discriminator}` || "Unknown"}  [${banLog.executor!.id || "000000000000000000"}]`,
								icon_url: `${banLog.executor!.displayAvatarURL()}`
							}
						}
					]
				}).catch((err: any) => {
					winston.log("error", err);
				});
			}
		});


		senkoClient.on("guildMemberAdd", async (member) => {
			if (process.env["NIGHTLY"] === "true") return;
			var guildData = await fetchSuperGuild(member.guild);

			if (guildData!.MemberLogs) {
				const loggingChannel = await member.guild.channels.fetch(guildData!.MemberLogs) as GuildTextBasedChannel;

				if (loggingChannel.type !== ChannelType.GuildText) return;

				loggingChannel.send({
					embeds: [
						{
							title: "New Kitsune",
							description: `${member} [${member.id} | ${member.user.tag}]\n${member.user.bot ? "**IS a bot**" : "Not a bot"}\nCreated on <t:${Math.round(member.user.createdTimestamp / 1000)}>`,
							color: senkoClient.api.Theme.light,
							thumbnail: { url: member.user.displayAvatarURL({ size: 4096 }) }
						}
					]
				}).catch((err: any) => {
					winston.log("error", err);
				});
			}
		});

		senkoClient.on("guildMemberRemove", async (member) => {
			var guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData!.flags);
			if (!guildData?.MemberLogs) return;

			const memberLogChannel = await member.guild.channels.fetch(guildData.MemberLogs) as TextChannel | null;

			if (!memberLogChannel) return;

			memberLogChannel.send({
				embeds: [
					{
						title: "Kitsune Left",
						description: `${member.user.tag} [${member.user.id}]`,
						color: Colors.Yellow
					}
				]
			}).catch((err: any) => {
				winston.log("error", err);
			});


			//! Kicks
			if (!member.guild?.members.me?.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
			const actionLogs = await member.guild.channels.fetch(guildData.ActionLogs) as TextChannel | null;

			if (!actionLogs) return;

			const fetchedLogs = await member.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.MemberKick});
			const kickLog = fetchedLogs.entries.first();

			if (!kickLog || kickLog.createdAt < member.joinedAt! || kickLog.executor!.id === senkoClient.user!.id || kickLog.target!.id !== member.id) return;

			if (!guildFlags.get(bits.ActionLogs.KickActionDisabled)) {
				actionLogs.send({
					embeds: [
						{
							title: "Action Report - Kitsune Kicked",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\n> ${kickLog.reason || "No reason provided."}`,
							color: Colors.Yellow,
							thumbnail: {
								url: member.user.displayAvatarURL()
							},
							author: {
								name: `${`${kickLog.executor!.username}#${kickLog.executor!.discriminator}` || "Unknown"}  [${kickLog.executor!.id || "000000000000000000"}]`,
								icon_url: `${kickLog.executor!.displayAvatarURL()}`
							}
						}
					]
				}).catch((err: any) => {
					winston.log("error", err);
				});
			}
		});

		senkoClient.on("guildMemberUpdate", async (oldMember, newMember) => {
			await newMember.fetch();

			if (!newMember.guild.members!.me!.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;
			const guildData = await fetchSuperGuild(newMember.guild);
			const guildFlags = Bitfield.fromHex(guildData!.flags);
			const actionLoggingChannel = guildData!.ActionLogs ? await newMember.guild.channels.fetch(guildData!.ActionLogs) as GuildTextBasedChannel : null;

			if (!actionLoggingChannel) return;
			if (guildFlags.get(bits.ActionLogs.TimeoutActionDisabled)) return;

			const rawAudit = await newMember.guild.fetchAuditLogs({type: AuditLogEvent.MemberUpdate, limit: 1 });
			const audit = rawAudit.entries.first();

			if (oldMember.communicationDisabledUntilTimestamp === newMember.communicationDisabledUntilTimestamp) return;
			if (!audit || audit.changes[0]!.key !== "communication_disabled_until" || audit.target!.id !== newMember.id) return;

			if (newMember.communicationDisabledUntilTimestamp === null && guildData!.ActionLogs && actionLoggingChannel.type !== ChannelType.GuildText) {
				// @ts-ignore
				actionLoggingChannel.send({
					embeds: [
						{
							title: "Action Report - Timeout Removed",
							description: `${newMember.user.tag || "Unknown"} [${newMember.user.id || "000000000000000000"}]`,
							color: Colors.Yellow,
							thumbnail: {
								url: newMember.user.displayAvatarURL()
							}
						}
					]
				}).catch((err: any) => {
					winston.log("error", err);
				});
			}

			if (newMember.communicationDisabledUntilTimestamp != null && guildData!.ActionLogs && actionLoggingChannel.type !== ChannelType.GuildText) {
				// @ts-ignore
				actionLoggingChannel.send({
					embeds: [
						{
							title: "Action Report - Kitsune Timed Out",
							description: `${newMember.user.tag || "Unknown"} [${newMember.user.id || "000000000000000000"}]\n> ${audit.reason || "No reason provided."}\nEnds on <t:${Math.ceil(newMember.communicationDisabledUntilTimestamp / 1000)}> (<t:${Math.ceil(newMember.communicationDisabledUntilTimestamp / 1000)}:R>)`,
							color: Colors.Yellow,
							thumbnail: {
								url: newMember.user.displayAvatarURL()
							}
						}
					]
				}).catch((err: any) => {
					winston.log("error", err);
				});
			}
		});
	}
}