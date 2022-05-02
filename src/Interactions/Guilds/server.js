// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { Bitfield } = require("bitfields");
const bits = require("../../API/Bits.json");
const { updateSuperGuild } = require("../../API/super");

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
            name: "action-reports",
            description: "set",
            type: 2,
            options: [
                {
                    name: "remove",
                    description: "Set the Action Reports channel",
                    type: 1
                },
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
                            description: `${Icons.exclamation}  We recommend you [update Senko with this invite](https://discord.com/api/oauth2/authorize?client_id=${SenkoClient.user.id}&permissions=137439275200&scope=bot%20applications.commands) if you haven't\n\nAction Reports: ${GuildData.ActionLogs !== null ? `<#${GuildData.ActionLogs}>` : `${Icons.tick}  Not set`}\nMessage Logging: ${Icons.tick}  Not set\nWelcome Channel: ${Icons.tick}  Not set`,
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
            case "remove":
                await updateSuperGuild(interaction.guild, {
                    ActionLogs: null
                });

                interaction.followUp({
                    content: "Action Reports channel removed!"
                });
                break;
            default:
                interaction.followUp({ content: "Not found!" });
        }
    }
};