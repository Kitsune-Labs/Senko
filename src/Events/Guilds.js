const { Bitfield } = require("bitfields");
const { deleteSuperGuild, fetchSuperGuild, updateSuperGuild } = require("../API/super.js");
const bits = require("../API/Bits.json");
const { print, cleanUserString } = require("../API/Master.js");

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

		SenkoClient.on("interactionCreate", async interaction => {
			if (interaction.isButton()) {
				const { flags } = await fetchSuperGuild(interaction.guild);
				const guildFlags = Bitfield.fromHex(flags);

				switch (interaction.customId) {
				case "guild_moderation":
					if (guildFlags.get(bits.ModCommands)) {
						guildFlags.set(bits.ModCommands, false);

						interaction.message.embeds[0].fields[0].value = "```diff\n- Disabled```";
						interaction.message.components[0].components[0].style = "SUCCESS";
						interaction.message.components[0].components[0].label = "Enable Moderation Commands";

						await updateSuperGuild(interaction.guild, {
							flags: guildFlags.toHex()
						});

						return interaction.update({
							embeds: interaction.message.embeds,
							components: interaction.message.components
						});
					}

					guildFlags.set(bits.ModCommands, true);
					interaction.message.embeds[0].fields[0].value = "```diff\n+ Enabled```";
					interaction.message.components[0].components[0].style = "DANGER";
					interaction.message.components[0].components[0].label = "Disable Moderation Commands";

					await updateSuperGuild(interaction.guild, {
						flags: guildFlags.toHex()
					});

					interaction.update({
						embeds: interaction.message.embeds,
						components: interaction.message.components
					});
					break;
				}
			}
		});

		SenkoClient.on("guildBanAdd", async (member) => {
			if (process.env.NIGHTLY === "true") return;

			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: "MEMBER_BAN_ADD"
			});

			const banLog = fetchedLogs.entries.first();
			if (banLog.executor.id === SenkoClient.user.id) return;

			var guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData.flags);


			if (guildData.ActionLogs && !guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
				member.guild.channels.cache.get(guildData.ActionLogs).send({
					embeds: [
						{
							title: "Action Report - Kitsune Banned",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${banLog.reason || "None"}`,
							color: "RED",
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
			if (process.env.NIGHTLY === "true") return;

			if (member.guild.id === "777251087592718336") {
				const fetchedLogs = await member.guild.fetchAuditLogs({
					limit: 1,
					type: "MEMBER_BAN_REMOVE"
				});

				const banLog = fetchedLogs.entries.first();

				const guildData = await fetchSuperGuild(member.guild);
				var guildFlags = Bitfield.fromHex(guildData.flags);

				if (guildData.ActionLogs && !guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
					member.guild.channels.cache.get(guildData.ActionLogs).send({
						embeds: [
							{
								title: "Action Report - Kitsune Pardoned",
								description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${cleanUserString(banLog.reason) || "None"}`,
								color: "GREEN",
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
			}
		});

		SenkoClient.on("guildMemberAdd", async (member) => {
			if (process.env.NIGHTLY === "true") return;

			var guildData = await fetchSuperGuild(member.guild);

			if (guildData.MemberLogs) {
				member.guild.channels.cache.get(guildData.MemberLogs).send({
					embeds: [
						{
							title: "New Kitsune",
							description: `${member} [${member.id} | ${member.user.tag}]\n${member.user.bot ? "IS a bot" : "Not a bot"}\nCreated on <t:${parseInt(member.user.createdTimestamp / 1000)}>`,
							color: SenkoClient.colors.light,
							thumbnail: { url: member.user.displayAvatarURL({ dynamic: true, size: 4096 }) }
						}
					]
				});
			}
		});

		SenkoClient.on("guildMemberRemove", async member => {
			var guildData = await fetchSuperGuild(member.guild);
			var guildFlags = Bitfield.fromHex(guildData.flags);

			if (guildData.MemberLogs /* && guildFlags.get(bits.ActionLogs.TimeoutActionDisabled)*/) {
				member.guild.channels.cache.get(guildData.MemberLogs).send({
					embeds: [
						{
							title: "Kitsune Left",
							description: `${member.user.tag} [${member.user.id}]`,
							color: "YELLOW"
						}
					]
				});
			}

			if (process.env.NIGHTLY === "true") return;
			//! Kicks

			const fetchedLogs = await member.guild.fetchAuditLogs({
				limit: 1,
				type: "MEMBER_KICK"
			});

			const kickLog = fetchedLogs.entries.first();
			if (kickLog.createdAt < member.joinedAt || !kickLog || kickLog.executor.id === SenkoClient.user.id || kickLog.target.id !== member.id) return;

			if (guildData.ActionLogs && !guildFlags.get(bits.ActionLogs.KickActionDisabled)) {
				member.guild.channels.cache.get(guildData.ActionLogs).send({
					embeds: [
						{
							title: "Action Report - Kitsune Kicked",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${cleanUserString(kickLog.reason) || "None"}`,
							color: "YELLOW",
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
			if (process.env.NIGHTLY === "true") return;

			const guildData = await fetchSuperGuild(member.guild);
			const guildFlags = await Bitfield.fromHex(guildData.flags);
			member = await member.guild.members.fetch(member.id);

			if (guildFlags.get(bits.ActionLogs.TimeoutActionDisabled)) return print("#FFFF66", "GUILD", "Member timeout's are disabled for this guild");

			const rawAudit = await member.guild.fetchAuditLogs({ limit: 1 });

			const audit = rawAudit.entries.first();
			if (audit.changes[0].key !== "communication_disabled_until") return;
			if (audit.target.id !== member.id) return;

			if (member.communicationDisabledUntilTimestamp === null && guildData.ActionLogs) {
				member.guild.channels.cache.get(guildData.ActionLogs).send({
					embeds: [
						{
							title: "Action Report - Timeout Removed",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]`,
							color: "GREEN",
							thumbnail: {
								url: member.user.displayAvatarURL({ dynamic: true })
							}
						}
					]
				});
			}

			if (member.communicationDisabledUntilTimestamp != null && guildData.ActionLogs) {
				member.guild.channels.cache.get(guildData.ActionLogs).send({
					embeds: [
						{
							title: "Action Report - Kitsune Timed Out",
							description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${cleanUserString(audit.reason) || "None"}\nEnds on <t:${Math.ceil(member.communicationDisabledUntilTimestamp / 1000)}> (<t:${Math.ceil(member.communicationDisabledUntilTimestamp / 1000)}:R>)`,
							color: "YELLOW",
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