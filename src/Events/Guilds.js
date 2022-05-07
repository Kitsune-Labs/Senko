const { Bitfield } = require("bitfields");
const { deleteSuperGuild, fetchSuperGuild, updateSuperGuild } = require("../API/super.js");
const bits = require("../API/Bits.json");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
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
            const fetchedLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: "MEMBER_BAN_ADD"
            });

            const banLog = fetchedLogs.entries.first();
            if (banLog.executor.id === SenkoClient.user.id) return;

            const guildData = await fetchSuperGuild(member.guild);

            if (guildData.ActionLogs) {
                member.guild.channels.cache.get(guildData.ActionLogs).send({
                    embeds: [
                        {
                            title: "Action Report - Kitsune Banned",
                            description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${banLog.reason || "None"}`,
                            color: "RED",
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

        SenkoClient.on("guildBanRemove", async (member) => {
            if (member.guild.id === "777251087592718336") {
                const fetchedLogs = await member.guild.fetchAuditLogs({
                    limit: 1,
                    type: "MEMBER_BAN_REMOVE"
                });

                const banLog = fetchedLogs.entries.first();

                const guildData = await fetchSuperGuild(member.guild);

                if (guildData.ActionLogs) {
                    member.guild.channels.cache.get(guildData.ActionLogs).send({
                        embeds: [
                            {
                                title: "Action Report - Kitsune Pardoned",
                                description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${banLog.reason || "None"}`,
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

        SenkoClient.on("guildMemberRemove", async member => {
            const fetchedLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: "MEMBER_KICK",
            });

            const kickLog = fetchedLogs.entries.first();
            if (kickLog.createdAt < member.joinedAt || !kickLog || kickLog.executor.id === SenkoClient.user.id || kickLog.target.id !== member.id) return;

            const guildData = await fetchSuperGuild(member.guild);

            if (guildData.ActionLogs) {
                member.guild.channels.cache.get(guildData.ActionLogs).send({
                    embeds: [
                        {
                            title: "Action Report - Kitsune Kicked",
                            description: `${member.user.tag || "Unknown"} [${member.user.id || "000000000000000000"}]\nReason: ${kickLog.reason || "None"}`,
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
    }
};
