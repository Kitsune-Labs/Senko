const { updateGuild } = require("../../API/v2/FireData.js");
const { eRes } = require("../../API/v4/InteractionFunctions");
const { hasPerm } = require("../../API/v4/Guild.js");
const { CheckPermission } = require("../../API/v5/Permissions.js");

module.exports = {
    name: "channel",
    desc: "Add/Remove channels where Senko can be used in",
    options: [
        {
            name: "add_or_remove",
            description: "To add or remove the channel",
            type: 3,
            required: true,
            choices: [
                {
                    name: "add",
                    value: "add_channel",
                },
                {
                    name: "remove",
                    value: "remove_channel"
                },
                {
                    name: "list",
                    value: "list_channel"
                }
            ]
        },
        {
            name: "channel",
            description: "The channel to add/remove.",
            type: 7,
            required: false
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, { Channels }) => {
        const channel = interaction.options.getChannel("channel");
        const Type = interaction.options.getString("add_or_remove");

        function listChannel() {
            interaction.reply({
                embeds: [
                    {
                        title: "I will allow the use of my commands in:",
                        description: `${Channels[0] ? Channels.map(i => `<#${i}>`) : "Everywhere"}`,
                        color: SenkoClient.colors.light,
                        thumbnail: {
                            url: "attachment://image.png"
                        }
                    }
                ],
                files: [ { attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" } ]
            });
        }

        if (!CheckPermission(interaction, "MANAGE_CHANNELS", interaction.user)) return listChannel();

        if (Type === "list_channel") return listChannel();

        if (channel.type !== "GUILD_TEXT") return eRes({
            interaction: interaction,
            description: "Please use a Text channel."
        });

        if (Type === "add_channel") {
            if (!hasPerm(interaction, "MANAGE_CHANNELS")) return listChannel();

            if (!Channels) Channels = [];

            if (Channels.includes(channel.id)) return interaction.reply({
                embeds: [
                    {
                        title: "Unable to set channel",
                        description: `${channel} has already been added and cannot be set again.`,
                        color: SenkoClient.colors.dark
                    }
                ],
                ephemeral: true
            });

            Channels.push(channel.id);

            updateGuild(interaction.guild, {
                Channels: Channels
            });

            return interaction.reply({
                embeds: [
                    {
                        title: "Channel added",
                        description: `${channel} is now a whitelisted channel! I will be able to be used in ${Channels.map(i=>`<#${i}>`)}`,
                        color: SenkoClient.colors.light
                    }
                ],
                ephemeral: true
            });
        }

        if (!hasPerm(interaction, "MANAGE_CHANNELS")) return listChannel();

        if (!Channels.includes(channel.id)) return interaction.reply({
            embeds: [
                {
                    title: "Unable to remove channel",
                    description: `${channel} is not on the channel list!`,
                    color: SenkoClient.colors.dark
                }
            ],
            ephemeral: true
        });

        Channels.splice(Channels.indexOf(channel.id), 1);

        updateGuild(interaction.guild, {
            Channels: Channels
        });

        return interaction.reply({
            embeds: [
                {
                    title: "Channel removed",
                    description: `${channel} has been removed! I will be able to be used in ${Channels.map(i=>`<#${i}>`)}`,
                    color: SenkoClient.colors.light
                }
            ],
            ephemeral: true
        });
        
    }
};