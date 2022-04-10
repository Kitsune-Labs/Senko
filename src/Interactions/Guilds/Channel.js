/* eslint-disable no-redeclare */
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const { updateGuild, spliceArray, CheckPermission } = require("../../API/Master");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

module.exports = {
    name: "channel",
    desc: "Add/Remove channels where Senko can be used in",
    options: [
        {
            name: "add",
            type: 1,
            description: "Add a channel",
            options: [
                {
                    name: "channel",
                    description: "channel",
                    type: 7,
                    required: true,
                    value: "add_channel"
                }
            ]
        },
        {
            name: "remove",
            description: "Remove a channel",
            type: 1,
            options: [
                {
                    name: "channel",
                    description: "channel",
                    type: 7,
                    required: true,
                    value: "remove_channel"
                }
            ]
        },
        {
            name: "list",
            description: "List all channels",
            type: 1
        },
        {
            name: "remove-all-channels",
            description: "Remove all channels",
            type: 1
        },
        {
            name: "remove-deleted-channels",
            description: "Remove deleted channels",
            type: 1
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
    start: async (SenkoClient, interaction, { Channels }) => {
        const command = interaction.options.getSubcommand();
        const command_permission = await CheckPermission(interaction, "MANAGE_CHANNELS");

        function listChannels() {
            interaction.followUp({
                embeds: [
                    {
                        title: "I have gathered my commands and you may use them in",
                        description: `${Channels[0] ? Channels.map(i => `<#${i}>`) : "every channel"}`,
                        color: SenkoClient.colors.light,
                        thumbnail: {
                            url: "attachment://image.png"
                        }
                    }
                ],
                files: [{ attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" }]
            });
        }

        switch (command) {
            case "add":
                if (!command_permission) return listChannels();
                var channel = interaction.options.getChannel("channel");

                if (channel.type != "GUILD_TEXT") return interaction.followUp({
                    content: "Invalid channel type, only text channels can be used"
                });

                if (Channels.includes(channel.id)) return interaction.followUp({
                    content: "This channel is already in the list"
                });

                Channels.push(channel.id);

                await updateGuild(interaction.guild, {
                    Channels: Channels
                });

                interaction.followUp({ content: `${channel} has been added` });
                break;
            case "remove":
                if (!command_permission) return listChannels();

                var channel = interaction.options.getChannel("channel");
                if (!Channels.includes(channel.id)) return interaction.followUp({
                    content: "This channel has not been added"
                });

                interaction.followUp({ content: "remove" });
                break;
            case "list":
                listChannels();
                break;
            case "remove-all-channels":
                if (!command_permission) return listChannels();
                if (!Channels[0]) return interaction.followUp({ content: "No channels to remove" });

                interaction.followUp({
                    embeds: [
                        {
                            title: "Are you sure you want to remove all these channels?",
                            description: `${Channels.map(i => `<#${i}>`)}\n\nThis cannot be undone`,
                            color: SenkoClient.colors.dark,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    files: [ { attachment: "./src/Data/content/senko/SenkoNervousSpeak.png", name: "image.png" } ],
                    components: [
                        {
                            type: 1,
                            components: [
                                { type: 2, label: "Remove channels", style: 4, custom_id: "confirm_channel_removal" },
                                { type: 2, label: "Cancel", style: 2, custom_id: "cancel_channel_removal" }
                            ]
                        }
                    ]
                });
                break;
            case "remove-deleted-channels":
                if (!command_permission) return listChannels();
                if (!Channels[0]) return interaction.followUp({ content: "No channels to remove" });

                var removed_channels = 0;

                for (var v_channel of Channels) {
                    var channel = interaction.guild.channels.cache.get(v_channel);
                    if (!channel) {
                        spliceArray(Channels, v_channel);
                        removed_channels++;
                    }
                }

                interaction.followUp({
                    embeds: [
                        {
                            title: "I have gathered your channels and reviewed them",
                            description: `I have found ${removed_channels} that no longer exist and have removed them!`,
                            color: SenkoClient.colors.light,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    files: [ { attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" } ]
                });
                break;
        }
    }
};