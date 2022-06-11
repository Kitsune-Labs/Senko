// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
const { Bitfield } = require("bitfields");
const { CheckPermission } = require("../../API/Master.js");
const bits = require("../../API/Bits.json");

module.exports = {
    name: "clean",
    desc: "clean",
    options: [
        {
            name: "amount",
            description: "The amount of messages to delete",
            required: true,
            type: "NUMBER",
            minValue: 1,
            maxValue: 100
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
            content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`",
            ephemeral: true
        });

        if (!CheckPermission(interaction, "MANAGE_MESSAGES")) return interaction.reply({
            embeds: [
                {
                    title: "Oh dear...",
                    description: "It looks like I can't manage messsages! (Make sure I have the \"Manage Messages\" permission)",
                    color: SenkoClient.colors.dark,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
            ephemeral: true
        });

        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({
            embeds: [
                {
                    title: "Sorry dear!",
                    description: "You must be able to manage messages to use this!",
                    color: SenkoClient.colors.dark,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
            ephemeral: true
        });

        const amount = interaction.options.getNumber("amount");

        interaction.channel.bulkDelete(amount).then((data) => {
            interaction.reply({
                content: data.size > 1 ? `I have removed ${data.size} messages` : `I have removed ${data.size} message`
            }).then(()=>{
                setTimeout(() => {
                    interaction.deleteReply();
                }, 5000);
            });
        }).catch(error => {
            interaction.reply({
                content: `There was an error!\n\n__${error}__`,
                ephemeral: true
            });
        });
    }
};