// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { Bitfield } = require("bitfields");
const bits = require("../../API/Bits.json");
const { updateSuperGuild } = require("../../API/super");
const { CheckPermission } = require("../../API/master");

module.exports = {
    name: "server",
    desc: "server",
    options: [
        {
            name: "configuration",
            description: "Guild Configuration",
            type: 1
        },
        {
            name: "permissions",
            description: "Display what permissions Senko needs",
            type: 1
        },
        {
            name: "action-reports",
            description: "set",
            type: 2,
            options: [
                {
                    name: "set",
                    description: "Set the Action Reports channel",
                    type: 1,
                    options: [
                        {
                            name: "channel",
                            description: "Channel",
                            type: "CHANNEL",
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Set the Action Reports channel",
                    type: 1
                }
            ]
        },
        {
            name: "message-logging",
            description: "Message Logging",
            type: 2,
            options: [
                {
                    name: "set",
                    description: "Set the Message Logging channel",
                    type: 1,
                    options: [
                        {
                            name: "channel",
                            description: "Channel",
                            type: "CHANNEL",
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Remove the Message Logging channel",
                    type: 1
                }
            ]
        }
    ],
    defer: true,
    ephemeral: true,
    usableAnywhere: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "Only Guild Administrators can modify the server settings!", ephemeral: true });
        const guildFlags = Bitfield.fromHex(GuildData.flags);

        switch (interaction.options.getSubcommand()) {
            case "configuration":
                interaction.followUp({
                    embeds: [
                        {
                            title: "Server Configuration",
                            description: `${Icons.exclamation}  We recommend you [update Senko with this invite](https://discord.com/api/oauth2/authorize?client_id=${SenkoClient.user.id}&guild_id=${interaction.guildId}&permissions=1099511637126&scope=bot%20applications.commands) if you haven't\n\nAction Reports: ${GuildData.ActionLogs !== null ? `<#${GuildData.ActionLogs}>` : `${Icons.tick}  Not set`}\nMessage Logging: ${GuildData.MessageLogs !== null ? `<#${GuildData.MessageLogs}>` : `${Icons.tick}  Not set`}\nWelcome Channel: ${GuildData.WelcomeChannel.config.channel !== null ? `<#${GuildData.WelcomeChannel.config.channel}>` : `${Icons.tick}  Not set`}`,
                            color: SenkoClient.colors.dark,
                            fields: [
                                { name: `Moderation Commands ${Icons.beta}`, value: `\`\`\`diff\n${guildFlags.get(bits.ModCommands) ? "+ Enabled" : "- Disabled"}\`\`\`` }
                            ]
                        }
                    ],
                    components: [
                        {
                            type: 1,
                            components: [
                                { type: 2, label: guildFlags.get(bits.ModCommands) ? "Disabled Moderation Commands" :"Enable Moderation Commands", style: guildFlags.get(bits.ModCommands) ? 4 : 3, custom_id: "guild_moderation" }
                            ]
                        }
                    ]
                });
                break;
            case "set":
                switch (interaction.options.getSubcommandGroup()) {
                    case "action-reports":
                        var actionChannel = interaction.options.getChannel("channel");

                        if (!actionChannel) return interaction.followUp({ content: "You must specify a channel!" });
                        if (actionChannel.type != "GUILD_TEXT") return interaction.followUp({ content: "You must specify a text channel!" });

                        await updateSuperGuild(interaction.guild, {
                            ActionLogs: actionChannel.id
                        });

                        interaction.followUp({
                            content: "Action Reports channel set!"
                        });
                        break;
                    case "message-logging":
                        var messageChannel = interaction.options.getChannel("channel");

                        if (!messageChannel) return interaction.followUp({ content: "You must specify a channel!" });
                        if (messageChannel.type != "GUILD_TEXT") return interaction.followUp({ content: "You must specify a text channel!" });

                        await updateSuperGuild(interaction.guild, {
                            MessageLogs: messageChannel.id
                        });

                        interaction.followUp({
                            content: "Message Logging channel set!"
                        });
                        break;
                }
                break;
            case "remove":
                switch (interaction.options.getSubcommandGroup()) {
                    case "action-reports":
                        await updateSuperGuild(interaction.guild, {
                            ActionLogs: null
                        });

                        interaction.followUp({
                            content: "Action Reports channel removed!"
                        });
                        break;
                    case "message-logging":
                        await updateSuperGuild(interaction.guild, {
                            MessageLogs: null
                        });

                        interaction.followUp({
                            content: "Message Logging channel removed!"
                        });
                        break;
                }
                break;
            case "permissions":
                interaction.followUp({
                    embeds: [
                        {
                            title: "Senko's Required Permissions",
                            description: `__**Required**__\nEmbed Links: ${CheckPermission(interaction, "EMBED_LINKS") ? Icons.check : Icons.tick }\nAttach Files: ${CheckPermission(interaction, "ATTACH_FILES") ? Icons.check : Icons.tick }\nSend Messages: ${CheckPermission(interaction, "SEND_MESSAGES") ? Icons.check : Icons.tick }\n\n__**Moderation Requirements (Optional)**__\nBan Members: ${CheckPermission(interaction, "BAN_MEMBERS") ? Icons.check : Icons.tick}\nKick Members: ${CheckPermission(interaction, "KICK_MEMBERS") ? Icons.check : Icons.tick}\nModerate Members: ${CheckPermission(interaction, "MODERATE_MEMBERS") ? Icons.check : Icons.tick}\nManage Messages: ${CheckPermission(interaction, "MANAGE_MESSAGES") ? Icons.check : Icons.tick}\nView Audit Log: ${CheckPermission(interaction, "VIEW_AUDIT_LOG") ? Icons.check : Icons.tick}`,
                            color: SenkoClient.colors.light,
                        }
                    ]
                });
                break;
        }
    }
};