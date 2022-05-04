// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Message } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { updateSuperGuild } = require("../../API/super");
const { v4: uuidv4 } = require("uuid");
const { Bitfield } = require("bitfields");
const bits = require("../../API/Bits.json");

const options = [
    {
        name: "user",
        description: "The user to warn",
        required: true,
        type: "USER"
    },
    {
        name: "reason",
        description: "Reason",
        type: "STRING"
    },
    {
        name: "note",
        description: "If you want to provide a note outside of the reason type it here",
        type: "STRING"
    }
];

module.exports = {
    name: "warn",
    desc: "warn",
    options: options,
    /**
     * @param {Client} SenkoClient
     * @param {CommandInteraction} interaction
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, { warns, ActionLogs, flags }) => {
        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No Reason Provided";
        const note = interaction.options.getString("note") || "No note(s) provided";

        if (!Bitfield.fromHex(flags).get(bits.ModCommands)) return interaction.reply({
            content: "Your guild has not enabled Mod Commands, ask your guild Administrator to enable them with `/server configuration`",
            ephemeral: true
        });

        if (!interaction.member.permissions.has("MODERATE_MEMBERS"))  return interaction.reply({
            embeds: [
                {
                    title: "Sorry dear!",
                    description: "You must be able to moderate members to use this!",
                    color: SenkoClient.colors.dark,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
            ephemeral: true
        });

        if (!user) return interaction.reply({ content: "I cannot find this user (ID's do not work)", ephemeral: true });
        if (user.id === interaction.user.id) return interaction.reply({ content: "You cannot warn yourself", ephemeral: true });
        if (user.roles.highest.rawPosition >= interaction.member.roles.highest.rawPosition) return interaction.reply({ content: "You can't warn members that have a higher role", ephemeral: true });
        if (user.user.bot) return interaction.reply({ content: `${Icons.exclamation}  You cannot warn bots`, ephemeral: true });

        await interaction.deferReply();

        /**
         * @type {Message} messageStruct
         */
        const messageStruct = {
            embeds: [
                {
                    title: "Warned Kitsune",
                    description: `I have warned __${user.user.tag}__ for __${reason}__`,
                    color: "#FF6699"
                }
            ]
        };

        if (note !== "No note(s) provided") messageStruct.embeds[0].footer = { text: "Your note has been attached" };

        const warnStruct = {
            userTag: user.user.tag,
            reason: reason,
            note: note,
            date: Date.now(),
            moderator: interaction.user.tag,
            moderatorId: interaction.user.id,
            uuid: uuidv4().slice(0, 8),
            userDmd: false
        };

        if (warns) {
            if (warns[user.id]) {
                await warns[user.id].push(warnStruct);
            } else {
                warns[user.id] = [warnStruct];
            }
        } else {
            warns = {
                [user.id]: [warnStruct]
            };
        }

        await updateSuperGuild(interaction.guild, { warns: warns });

        if (ActionLogs) {
            interaction.guild.channels.cache.get(ActionLogs).send({
                embeds: [
                    {
                        title: "Action Report - Kitsune Warned",
                        description: `${user.user.tag} [${user.id}]\nReason: ${warnStruct.reason}\nNote: ${warnStruct.note}`,
                        color: "YELLOW",
                        thumbnail: {
                            url: user.user.displayAvatarURL({ dynamic: true })
                        },
                        author: {
                            name: `${interaction.user.tag}  [${interaction.user.id}]`,
                            icon_url: `${interaction.user.displayAvatarURL({ dynamic: true })}`
                        }
                    }
                ]
            }).catch(err => {
                interaction.channel.send({
                    content: `There was an error sending the action report: ${err}`,
                });
            });
        }

        try {
            await user.send({
                embeds: [
                    {
                        title: `You have been warned in ${interaction.guild.name}`,
                        description: `Your reason: ${warnStruct.reason}\nNote: ${warnStruct.note}`,
                        color: "YELLOW"
                    }
                ]
            });

            warnStruct.userDmd = true;
            messageStruct.embeds[0].description += "\nUser has been DM'd";
        } catch (e) {
            warnStruct.userDmd = false;
            messageStruct.embeds[0].description += "\nUser has **not** been DM'd";
        }

        interaction.followUp(messageStruct);
    }
};