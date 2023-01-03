const { Bitfield } = require("bitfields");
const { deleteSuperGuild, fetchSuperGuild } = require("../API/super.js");
const bits = require("../API/Bits.json");
const { Colors, PermissionFlagsBits, AuditLogEvent } = require("discord.js");
const {warn, error} = require("@kitsune-labs/utilities");


module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
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

		SenkoClient.on("guildDelete", async guild => {
			await deleteSuperGuild(guild);
		});

		SenkoClient.on("guildBanAdd", async (member) => {
			if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return error("I do not have ViewAuditLog permission for this guild.");

			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberBanAdd
			});

			const banLog = fetchedLogs.entries.first();
			if (banLog.executor.id === SenkoClient.user.id) return;

			var guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData.flags);
			const loggingChannel = guildData.ActionLogs ? await member.guild.channels.fetch(guildData.ActionLogs) : null;

			if (guildData.ActionLogs && !guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
				loggingChannel.send({
					embeds: [
						{
							title: "Action Report - Kitsune Banned",
							description: `${member.user.tag || member} [${member.user.id || member}]\n> __${banLog.reason || "No reason provided."}__\n\n[__Permanately Banned__]`,
							color: Colors.Red,
							author: {
								name: `${`${banLog.executor.username}#${banLog.executor.discriminator}` || "Unknown"}  [${banLog.executor.id || "000000000000000000"}]`,
								icon_url: `${banLog.executor.displayAvatarURL({ dynamic: true })}`
							}
						}
					]
				}).catch((err) => {
					error(err);
				});
			}
		});

		SenkoClient.on("guildBanRemove", async (member) => {
			if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return error("I do not have ViewAuditLog permission for this guild.");

			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberBanRemove
			});

			const banLog = fetchedLogs.entries.first();

			if (banLog.executor.id === SenkoClient.user.id) return;

			const guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData.flags);
			const loggingChannel = guildData.ActionLogs ? await member.guild.channels.fetch(guildData.ActionLogs) : null;

			if (guildData.ActionLogs && !guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
				loggingChannel.send({
					embeds: [
						{
							title: "Action Report - Kitsune Pardoned",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\n> ${banLog.reason || "No reason provided."}`,
							color: Colors.Green,
							thumbnail: {
								url: member.user.displayAvatarURL({ dynamic: true })
							},
							author: {
								name: `${`${banLog.executor.username}#${banLog.executor.discriminator}` || "Unknown"}  [${banLog.executor.id || "000000000000000000"}]`,
								icon_url: `${banLog.executor.displayAvatarURL({ dynamic: true })}`
							}
						}
					]
				}).catch((err) => {
					error(err);
				});
			}
		});


		SenkoClient.on("guildMemberAdd", async (member) => {
			if (process.env.NIGHTLY === "true") return;
			var guildData = await fetchSuperGuild(member.guild);
			const loggingChannel = guildData.MemberLogs ? await member.guild.channels.fetch(guildData.MemberLogs) : null;

			if (guildData.MemberLogs) loggingChannel.send({
				embeds: [
					{
						title: "New Kitsune",
						description: `${member} [${member.id} | ${member.user.tag}]\n${member.user.bot ? "**IS a bot**" : "Not a bot"}\nCreated on <t:${parseInt(member.user.createdTimestamp / 1000)}>`,
						color: SenkoClient.api.Theme.light,
						thumbnail: { url: member.user.displayAvatarURL({ dynamic: true, size: 4096 }) }
					}
				]
			}).catch((err) => {
				error(err);
			});
		});

		SenkoClient.on("guildMemberRemove", async (member) => {
			var guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData.flags);
			const memberLoggingChannel = guildData.MemberLogs ? await member.guild.channels.fetch(guildData.MemberLogs) : null;
			const actionLoggingChannel = guildData.MemberLogs ? await member.guild.channels.fetch(guildData.MemberLogs) : null;


			if (memberLoggingChannel) memberLoggingChannel.send({
				embeds: [
					{
						title: "Kitsune Left",
						description: `${member.user.tag} [${member.user.id}]`,
						color: Colors.Yellow
					}
				]
			}).catch((err) => {
				error(err);
			});


			//! Kicks
			if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return error("I do not have ViewAuditLog permission for this guild.");
			const fetchedLogs = await member.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.MemberKick});

			const kickLog = fetchedLogs.entries.first();
			if (!kickLog || kickLog.createdAt < member.joinedAt || kickLog.executor.id === SenkoClient.user.id || kickLog.target.id !== member.id) return;

			if (actionLoggingChannel && !guildFlags.get(bits.ActionLogs.KickActionDisabled)) {
				actionLoggingChannel.send({
					embeds: [
						{
							title: "Action Report - Kitsune Kicked",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\n> ${kickLog.reason || "No reason provided."}`,
							color: Colors.Yellow,
							thumbnail: {
								url: member.user.displayAvatarURL({ dynamic: true })
							},
							author: {
								name: `${`${kickLog.executor.username}#${kickLog.executor.discriminator}` || "Unknown"}  [${kickLog.executor.id || "000000000000000000"}]`,
								icon_url: `${kickLog.executor.displayAvatarURL({ dynamic: true })}`
							}
						}
					]
				}).catch((err) => {
					error(err);
				});
			}
		});

		SenkoClient.on("guildMemberUpdate", async (member) => {
			if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return error("I do not have ViewAuditLog permission for this guild.");
			const guildData = await fetchSuperGuild(member.guild);
			const guildFlags = Bitfield.fromHex(guildData.flags);
			const actionLoggingChannel = guildData.ActionLogs ? await member.guild.channels.fetch(guildData.ActionLogs) : null;

			if (guildFlags.get(bits.ActionLogs.TimeoutActionDisabled)) return warn("Timeout logs are disabled for this guild");

			const rawAudit = await member.guild.fetchAuditLogs({type: AuditLogEvent.MemberUpdate, limit: 1 });

			const audit = await rawAudit.entries.first();
			if (audit.changes[0].key !== "communication_disabled_until" || audit.target.id !== member.id) return;

			if (member.communicationDisabledUntilTimestamp === null && guildData.ActionLogs) {
				actionLoggingChannel.send({
					embeds: [
						{
							title: "Action Report - Timeout Removed",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]`,
							color: Colors.Yellow,
							thumbnail: {
								url: member.user.displayAvatarURL({ dynamic: true })
							}
						}
					]
				}).catch((err) => {
					error(err);
				});
			}

			if (member.communicationDisabledUntilTimestamp != null && guildData.ActionLogs) {
				actionLoggingChannel.send({
					embeds: [
						{
							title: "Action Report - Kitsune Timed Out",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\n> ${audit.reason || "No reason provided."}\nEnds on <t:${Math.ceil(member.communicationDisabledUntilTimestamp / 1000)}> (<t:${Math.ceil(member.communicationDisabledUntilTimestamp / 1000)}:R>)`,
							color: Colors.Yellow,
							thumbnail: {
								url: member.user.displayAvatarURL({ dynamic: true })
							}
						}
					]
				}).catch((err) => {
					error(err);
				});
			}
		});
	}
};