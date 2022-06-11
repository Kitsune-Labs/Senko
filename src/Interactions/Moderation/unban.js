// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const { CheckPermission } = require("../API/Master");
const { Bitfield } = require("bitfields");
const bits = require("../API/Bits.json");

module.exports = {
    name: "unban",
    desc: "Unban a user",
    options: [
        {
            name: "user-id",
            description: "User Id",
            required: true,
            type: "STRING"
        },
        {
            name: "reason",
            description: "Why is this user unbanned?",
            type: "STRING"
        }
    ],
    usableAnywhere: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        if (!Bitfield.fromHex(GuildData.flags).get(bits.ModCommands)) return interaction.reply({
            content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`",
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
                    description: "It looks like I can't unban members! (Make sure I have the \"Ban Members\" permission)",
                    color: SenkoClient.colors.dark,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
            ephemeral: true
        });

        const userId = interaction.options.getString("user-id");
        const unbanReason = interaction.options.getString("reason");

        if (!interaction.guild.bans.cache.get(userId)) return interaction.reply({
            embeds: [
                {
                    title: "I don't see anything",
                    description: "This user is not banned from this server",
                    color: SenkoClient.colors.dark,
                    thumbnail: { url: "attachment://image.png" }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/book.png", name: "image.png" }],
            ephemeral: true
        });

        await interaction.deferReply();

        await interaction.guild.members.unban(userId, unbanReason || "No reason given");

        interaction.followUp({
            embeds: [
                {
                    title: "All done dear!",
                    description: `I've unbanned ${userId} for you!\n\n${unbanReason ? `Reason: ${unbanReason}` : ""}`,
                    color: SenkoClient.colors.light,
                    thumbnail: { url: "attachment://image.png" }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/senko_bless.png", name: "image.png" }],
        });
    }
};