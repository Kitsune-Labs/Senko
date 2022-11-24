const { Bitfield } = require("bitfields");
const { deleteSuperGuild, fetchSuperGuild } = require("../API/super.js");
const bits = require("../API/Bits.json");
const { cleanUserString, CheckPermission } = require("../API/Master.js");
const { Colors, PermissionFlagsBits } = require("discord.js");
const {print, warn, error} = require("@kitsune-labs/utilities");


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
			if (!CheckPermission(member.guild, "ViewAuditLog") || process.env.NIGHTLY === "true") return error("I do not have ViewAuditLog permission for this guild.");
			member = await member.guild.members.fetch(member.id);

			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: 22
			});

			const banLog = fetchedLogs.entries.first();
			if (banLog.executor.id === SenkoClient.user.id) return;

			var guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData.flags);

			if (guildData.ActionLogs && !guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
				(await member.guild.channels.fetch(guildData.ActionLogs)).send({
					embeds: [
						{
							title: "Action Report - Kitsune Banned",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${banLog.reason || "None"}`,
							color: Colors.Red,
							// thumbnail: {
							//     url: member.user.displayAvatarURL({ dynamic: true })
							// },
							author: {
								name: `${`${banLog.executor.username}#${banLog.executor.discriminator}` || "Unknown"}  [${banLog.executor.id || "000000000000000000"}]`,
								icon_url: `${banLog.executor.displayAvatarURL({ dynamic: true })}`
							}
						}
					]
				});
			}
		});

		SenkoClient.on("guildBanRemove", async (member) => {
			if (!CheckPermission(member.guild, "ViewAuditLog") || process.env.NIGHTLY === "true") return error("I do not have ViewAuditLog permission for this guild.");
			member = await member.guild.members.fetch(member.id);

			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: 23
			});

			const banLog = fetchedLogs.entries.first();

			if (banLog.executor.id === SenkoClient.user.id) return;

			const guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData.flags);

			if (guildData.ActionLogs && !guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
				(await member.guild.channels.fetch(guildData.ActionLogs)).send({
					embeds: [
						{
							title: "Action Report - Kitsune Pardoned",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${cleanUserString(banLog.reason) || "None"}`,
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
				});
			}
		});

		SenkoClient.on("guildMemberAdd", async (member) => {
			if (process.env.NIGHTLY === "true") return;
			var guildData = await fetchSuperGuild(member.guild);
			member = await member.guild.members.fetch(member.id);

			if (guildData.MemberLogs) {
				(await member.guild.channels.fetch(guildData.MemberLogs)).send({
					embeds: [
						{
							title: "New Kitsune",
							description: `${member} [${member.id} | ${member.user.tag}]\n${member.user.bot ? "IS a bot" : "Not a bot"}\nCreated on <t:${parseInt(member.user.createdTimestamp / 1000)}>`,
							color: SenkoClient.api.Theme.light,
							thumbnail: { url: member.user.displayAvatarURL({ dynamic: true, size: 4096 }) }
						}
					]
				});
			}
		});

		SenkoClient.on("guildMemberRemove", async member => {
			if (process.env.NIGHTLY === "true") return;
			var guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData.flags);
			member = await member.guild.members.fetch(member.id);

			if (guildData.MemberLogs) {
				(await member.guild.channels.fetch(guildData.MemberLogs)).send({
					embeds: [
						{
							title: "Kitsune Left",
							description: `${member.user.tag} [${member.user.id}]`,
							color: Colors.Yellow
						}
					]
				});
			}

			//! Kicks
			if (!CheckPermission(member.guild, "ViewAuditLog")) return error("I do not have ViewAuditLog permission for this guild.");
			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: 20
			});

			const kickLog = fetchedLogs.entries.first();
			if (kickLog.createdAt < member.joinedAt || !kickLog || kickLog.executor.id === SenkoClient.user.id || kickLog.target.id !== member.id) return;

			if (guildData.ActionLogs && !guildFlags.get(bits.ActionLogs.KickActionDisabled)) {
				(await member.guild.channels.fetch(guildData.ActionLogs)).send({
					embeds: [
						{
							title: "Action Report - Kitsune Kicked",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${cleanUserString(kickLog.reason) || "None"}`,
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
				});
			}
		});

		SenkoClient.on("guildMemberUpdate", async member => {
			if (!CheckPermission(member.guild, PermissionFlagsBits.ViewAuditLog) /*|| process.env.NIGHTLY === "true"*/) return error("I do not have ViewAuditLog permission for this guild.");
			const guildData = await fetchSuperGuild(member.guild);
			const guildFlags = Bitfield.fromHex(guildData.flags);
			member = await member.guild.members.fetch(member.id);

			if (guildFlags.get(bits.ActionLogs.TimeoutActionDisabled)) return warn("Timeout logs are disabled for this guild");

			const rawAudit = await member.guild.fetchAuditLogs({ limit: 1 });

			const audit = rawAudit.entries.first();
			if (audit.changes[0].key !== "communication_disabled_until" || audit.target.id !== member.id) return;

			if (member.communicationDisabledUntilTimestamp === null && guildData.ActionLogs) {
				(await member.guild.channels.fetch(guildData.ActionLogs)).send({
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
				});
			}

			if (member.communicationDisabledUntilTimestamp != null && guildData.ActionLogs) {
				(await member.guild.channels.fetch(guildData.ActionLogs)).send({
					embeds: [
						{
							title: "Action Report - Kitsune Timed Out",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${cleanUserString(audit.reason) || "None"}\nEnds on <t:${Math.ceil(member.communicationDisabledUntilTimestamp / 1000)}> (<t:${Math.ceil(member.communicationDisabledUntilTimestamp / 1000)}:R>)`,
							color: Colors.Yellow,
							thumbnail: {
								url: member.user.displayAvatarURL({ dynamic: true })
							}
						}
					]
				});
			}
		});
	}
};