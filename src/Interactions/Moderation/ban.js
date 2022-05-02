// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
const { Bitfield } = require("bitfields");
const { CheckPermission } = require("../../API/Master.js");
const bits = require("../../API/Bits.json");


module.exports = {
    name: "ban",
    desc: "Ban's a user",
    options: [
        {
            name: "user",
            description: "The user to outlaw",
            required: true,
            type: "USER"
        },
        {
            name: "reason",
            description: "The reason for the ban",
            type: "STRING"
        },
        {
            name: "user2",
            description: "The user to outlaw",
            type: "USER"
        },
        {
            name: "user3",
            description: "The user to outlaw",
            type: "USER"
        },
        {
            name: "user4",
            description: "The user to outlaw",
            type: "USER"
        },
        {
            name: "user5",
            description: "The user to outlaw",
            type: "USER"
        }
    ],
    usableAnywhere: true,
    /**
     * @param {Client} SenkoClient
     * @param {Interaction} interaction
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        if (!Bitfield.fromHex(GuildData.flags).get(bits.ModCommands)) return interaction.reply({
            content: "Your guild has not enabled Mod Commands, ask your guild Administrator to enable them with `/server configuration`",
            ephemeral: true
        });

        if (!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({
            embeds: [
                {
                    title: "Sorry dear!",
                    description: "You must be able to ban members to use this!",
                    color: SenkoClient.colors.dark,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
            ephemeral: true
        });

        if (!CheckPermission(interaction, "BAN_MEMBERS")) return interaction.reply({
            embeds: [
                {
                    title: "Oh dear...",
                    description: "It looks like I can't ban members!",
                    color: SenkoClient.colors.dark,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
            ephemeral: true
        });

        await interaction.deferReply({ fetchReply: true });

        interaction.editReply({ content: "Starting" });

        const users = [];
        for (var Option1 of interaction.options._hoistedOptions) {
            if (Option1.name !== "reason") {
                users.push(Option1.value);
            }
        }

        interaction.editReply({ content: `Banning ${users.length} ${users.length == 1 ? "user" : "users"}` });

        for (var Option of interaction.options._hoistedOptions) {
            if (Option.name !== "reason") {
                let userToOutlaw = Option.value;
                const reason = interaction.options.getString("reason") || "No reason provided";

                if (Option.member) userToOutlaw = Option.member;

                const banStruct = {
                    embeds: [
                        {
                            title: "Action Report - Kitsune Banned",
                            description: `${typeof userToOutlaw != "string" ? userToOutlaw.user.tag : userToOutlaw} [${typeof userToOutlaw != "string" ? userToOutlaw.user.id : userToOutlaw}]\nReason: __${reason}__`,
                            color: "RED",
                            author: {
                                name: `${interaction.user.tag}  [${interaction.user.id}]`,
                                icon_url: `${interaction.user.displayAvatarURL({ dynamic: true })}`
                            }
                        }
                    ]
                };

                const responseStruct = {
                    embeds: [
                        {
                            title: "Banned Kitsune",
                            description: `${typeof userToOutlaw != "string" ? userToOutlaw.user.tag : userToOutlaw} has been banned for __${reason}__`,
                            color: "RED"
                        }
                    ]
                };

                if (reason === "No reason provided") responseStruct.embeds[0].description = `${typeof userToOutlaw != "string" ? userToOutlaw.user.tag : userToOutlaw} has been banned!`;

                if (typeof userToOutlaw != "string") {
                    await userToOutlaw.send({
                        embeds: [
                            {
                                title: `You have been banned from ${interaction.guild.name}`,
                                description: `Your ban reason: ${reason}`, //\n\nOutlaw appeal: ${config.OutlawAppealForm}`,
                                color: "RED"
                            }
                        ]
                    }).catch(err => {
                        responseStruct.embeds[0].description += `\n\n${err}`;
                    });

                    // SenkoClient.guilds.cache.get("777251087592718336").members.ban(ID, { reason: `${reason}`, days: 1 });

                    interaction.guild.members.ban(userToOutlaw.user.id, { reason: `${interaction.user.tag} : ${reason}`, days: 1 });

                    // banID(YozoraClient, userToOutlaw.user.id, reason);
                } else
                    interaction.guild.members.ban(userToOutlaw, { reason: `${interaction.user.tag} : ${reason}`, days: 1 });{
                    // banID(YozoraClient, userToOutlaw, reason);
                }

                if (typeof userToOutlaw != "string") {
                    banStruct.embeds[0].thumbnail = {
                        url: userToOutlaw.user.displayAvatarURL({ dynamic: true })
                    };
                }

                if (GuildData.ActionLogs) {
                    interaction.guild.channels.cache.get(GuildData.ActionLogs).send(banStruct).catch(err => {
                        responseStruct.embeds[0].description += `Cannot send action log: \n\n${err}`;
                    });
                }

                interaction.channel.send(responseStruct);
            }
        }

        interaction.editReply({ content: "Done", ephemeral: true });
    }
};