// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../src/Data/Icons.json");
const { updateSuperGuild } = require("../src/API/super");

module.exports = {
    name: "server",
    desc: "Server config",
    options: [
        {
            name: "set-welcome-channel",
            description: "Set the welcome channel",
            type: 1,
            options: [
                {
                    name: "channel",
                    description: "channel",
                    type: "CHANNEL",
                    required: true,
                    value: "welcome_channel"
                }
            ]
        }
    ],
    usableAnywhere: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const command = interaction.options.getSubcommand();

        switch (command) {
            case "set-welcome-channel":
                var channel = interaction.options.getChannel("channel");

                console.log(channel.type);

                if (channel.type != "GUILD_TEXT") return interaction.followUp({
                    content: "Invalid channel type, only text channels can be used"
                });

                await updateSuperGuild(interaction.guild, {
                    WelcomeChannel: {
                        config: {
                            channel: channel.id
                        }
                    }
                });

                interaction.reply({
                    content: `Welcome channel set to <#${channel.id}>`,
                });
                break;
            default:
                interaction.reply({ content: "Invalid", ephemeral: true });
                break;
        }
    }
};