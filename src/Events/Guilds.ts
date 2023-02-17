import { Bitfield } from "bitfields";
import { deleteSuperGuild, fetchSuperGuild } from "../API/super";
import bits from "../API/Bits.json";
import { Colors, PermissionFlagsBits, AuditLogEvent, TextChannel } from "discord.js";
import { warn, error } from "@kitsune-labs/utilities";
import type { SenkoClientTypes } from "../types/AllTypes";


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
			if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return error("I do not have ViewAuditLog permission for this guild.");

			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberBanAdd
			});

			const banLog = fetchedLogs.entries.first();
			if (!banLog || banLog.executor!.id === senkoClient.user!.id) return;

			var guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData!.flags);

			if (guildData!.ActionLogs && !guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
				const loggingChannel = await member.guild.channels.fetch(guildData!.ActionLogs) as TextChannel;

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
					error(err);
				});
			}
		});

		senkoClient.on("guildBanRemove", async (member) => {
			// @ts-expect-error
			if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return error("I do not have ViewAuditLog permission for this guild.");

			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberBanRemove
			});

			const banLog = fetchedLogs.entries.first();

			if (!banLog || banLog.executor!.id === senkoClient.user!.id) return;

			const guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData!.flags);

			if (guildData!.ActionLogs && !guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
				const loggingChannel = await member.guild.channels.fetch(guildData!.ActionLogs) as TextChannel;

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
				}).catch((err) => {
					error(err);
				});
			}
		});


		senkoClient.on("guildMemberAdd", async (member) => {
			if (process.env["NIGHTLY"] === "true") return;
			var guildData = await fetchSuperGuild(member.guild);

			if (guildData!.MemberLogs) {
				const loggingChannel = await member.guild.channels.fetch(guildData!.MemberLogs) as TextChannel;

				loggingChannel.send({
					embeds: [
						{
							title: "New Kitsune",
							// @ts-ignore
							description: `${member} [${member.id} | ${member.user.tag}]\n${member.user.bot ? "**IS a bot**" : "Not a bot"}\nCreated on <t:${parseInt(member.user.createdTimestamp / 1000)}>`,
							color: senkoClient.api.Theme.light,
							thumbnail: { url: member.user.displayAvatarURL({ size: 4096 }) }
						}
					]
				}).catch((err) => {
					error(err);
				});
			}
		});

		senkoClient.on("guildMemberRemove", async (member) => {
			var guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData!.flags);
			const memberLoggingChannel = guildData!.MemberLogs ? await member.guild.channels.fetch(guildData!.MemberLogs) : null;
			const actionLoggingChannel = guildData!.MemberLogs ? await member.guild.channels.fetch(guildData!.MemberLogs) : null;

			// @ts-ignore
			if (memberLoggingChannel) memberLoggingChannel.send({
				embeds: [
					{
						title: "Kitsune Left",
						description: `${member.user.tag} [${member.user.id}]`,
						color: Colors.Yellow
					}
				]
			}).catch((err: any) => {
				error(err);
			});


			//! Kicks
			// @ts-expect-error
			if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return error("I do not have ViewAuditLog permission for this guild.");
			const fetchedLogs = await member.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.MemberKick});

			const kickLog = fetchedLogs.entries.first();
			if (!kickLog || kickLog.createdAt < member.joinedAt! || kickLog.executor!.id === senkoClient.user!.id || kickLog.target!.id !== member.id) return;

			if (actionLoggingChannel && !guildFlags.get(bits.ActionLogs.KickActionDisabled)) {
				// @ts-ignore
				actionLoggingChannel.send({
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
					error(err);
				});
			}
		});

		senkoClient.on("guildMemberUpdate", async (member) => {
			// @ts-expect-error
			if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return error("I do not have ViewAuditLog permission for this guild.");
			member = await member.guild.members.fetch(member.id);
			const guildData = await fetchSuperGuild(member.guild);
			const guildFlags = Bitfield.fromHex(guildData!.flags);
			const actionLoggingChannel = guildData!.ActionLogs ? await member.guild.channels.fetch(guildData!.ActionLogs) : null;

			if (guildFlags.get(bits.ActionLogs.TimeoutActionDisabled)) return warn("Timeout logs are disabled for this guild");

			const rawAudit = await member.guild.fetchAuditLogs({type: AuditLogEvent.MemberUpdate, limit: 1 });

			const audit = await rawAudit.entries.first();
			if (!audit || audit.changes[0]!.key !== "communication_disabled_until" || audit.target!.id !== member.id) return;

			if (member.communicationDisabledUntilTimestamp === null && guildData!.ActionLogs) {
				// @ts-ignore
				actionLoggingChannel.send({
					embeds: [
						{
							title: "Action Report - Timeout Removed",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]`,
							color: Colors.Yellow,
							thumbnail: {
								url: member.user.displayAvatarURL()
							}
						}
					]
				}).catch((err: any) => {
					error(err);
				});
			}

			if (member.communicationDisabledUntilTimestamp != null && guildData!.ActionLogs) {
				// @ts-ignore
				actionLoggingChannel.send({
					embeds: [
						{
							title: "Action Report - Kitsune Timed Out",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\n> ${audit.reason || "No reason provided."}\nEnds on <t:${Math.ceil(member.communicationDisabledUntilTimestamp / 1000)}> (<t:${Math.ceil(member.communicationDisabledUntilTimestamp / 1000)}:R>)`,
							color: Colors.Yellow,
							thumbnail: {
								url: member.user.displayAvatarURL()
							}
						}
					]
				}).catch((err: any) => {
					error(err);
				});
			}
		});
	}
}