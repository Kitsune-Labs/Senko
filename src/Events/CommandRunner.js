// const IDB = require("../Data/IDB.json");
const DataConfig = require("../Data/DataConfig.json");
const { CheckPermission } = require("../API/Master");
const AllowedCommands = ["ping", "channel", "channels", "avatar", "prefix", "poll", "whois", "config"];
const { print, fetchGuild, fetchData, updateUser } = require("../API/Master");
const Firebase = require("firebase-admin");
const Firestore = Firebase.firestore();
const LocalOutlaws = require("../Data/LocalOutlawed.json");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand() || interaction.user.bot) return;
            if (!interaction.guild) return interaction.reply({ content: "I cannot be used outside of guild channels!" });

            if (LocalOutlaws.includes(interaction.user.id)) {
                var messageStruct2 = {
                    embeds: [
                        {
                            title: "You are outlawed!",
                            description: "You have broken our ToS and no longer have access to Senko.\nThis cannot be appealed.",
                            color: "DARK_RED"
                        }
                    ],
                    ephemeral: true
                };

                await interaction.deferReply({ ephemeral: true });
                return interaction.followUp(messageStruct2);
            }

            const PermissionEmbed = {
                title: "Permission Error",
                description: "Please make sure I have the following permissions:\n\n",
                color: SenkoClient.colors.dark,
                footer: {
                    text: "This can include individual channel & category permissions."
                }
            };

            let MissingPermissions = [];

            const InteractionCommand = SenkoClient.SlashCommands.get(interaction.commandName);

            if (!InteractionCommand) return interaction.reply({
                embeds: [
                    {
                        title: "Woops!",
                        description: `I can't seem to find "${interaction.commandName}", I will attempt to find it for you, come talk to me in a few minutes!`,
                        color: SenkoClient.colors.dark,
                        thumbnail: {
                            url: "attachment://image.png"
                        }
                    }
                ],
                ephemeral: true,
                files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
            });

            let AccountData = null;
            let GuildData = await fetchGuild(interaction.guild);
            let ShopData = null;

            if (GuildData.Channels.length > 0 && !GuildData.Channels.includes(interaction.channelId) && !InteractionCommand.usableAnywhere) {
                var messageStruct1 = {
                    embeds: [
                        {
                            title: "S-Sorry dear!",
                            description: `${interaction.guild.name} has requested you use ${GuildData.Channels.map(i=>`<#${i}>`)}!`,
                            color: SenkoClient.colors.dark,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    ephemeral: true,
                    files: [ { attachment: "./src/Data/content/senko/heh.png", name: "image.png" } ],
                };

                await interaction.deferReply({ ephemeral: true });
                return interaction.followUp(messageStruct1);
            }

            if (InteractionCommand.defer) {
                if (InteractionCommand.ephemeral && InteractionCommand.ephemeral === true) {
                    await interaction.deferReply({ ephemeral: true });
                } else {
                    await interaction.deferReply();
                }
            }

            let Permissions = "";
            const GlobalPermissions = ["EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "VIEW_CHANNEL"];

            for (var GlobalPermission of GlobalPermissions) {
                if (!CheckPermission(interaction, GlobalPermission, SenkoClient.user)) {
                    Permissions += `${GlobalPermission}\n`;
                    MissingPermissions.push(GlobalPermission);
                }
            }

            if (InteractionCommand.permissions) {
                for (var permission of InteractionCommand.permissions) {
                    if (!CheckPermission(interaction, permission, SenkoClient.user)) {
                        Permissions += `${permission}\n`;
                        MissingPermissions.push(permission);
                    }
                }
            }

            if (Permissions !== "") {
                PermissionEmbed.description += Permissions;

                if (!CheckPermission(interaction, "EMBED_LINKS", SenkoClient.user)) {
                    return interaction.reply({
                        content: `Please make sure I have the following permissions:\n\n${MissingPermissions}`
                    });
                }

                return interaction.reply({
                    embeds: [PermissionEmbed]
                });
            }

            if (InteractionCommand.userData === true) AccountData = await fetchData(interaction.user);
            if (InteractionCommand.shopData === true) ShopData = (await Firestore.collection("config").doc("shop").get()).data();

            if (AccountData && AccountData.LocalUser.version !== DataConfig.currentVersion) {
                await updateUser(interaction.user, {
                    LocalUser: {
                        version: DataConfig.currentVersion
                    }
                });
            }

            print("teal", "CS", interaction.commandName);

            try {
                InteractionCommand.start(SenkoClient, interaction, GuildData, AccountData, ShopData);
            } catch (e) {
                interaction.reply({
                    embeds: [
                        {
                            title: "Woops!",
                            description: `I seem to have dropped ${InteractionCommand.name}, I will attempt to fix it please come back soon!`,
                            color: SenkoClient.colors.dark,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    ephemeral: true,
                    files: [ { attachment: "../Data/content/senko/SenkoHeh.png", name: "image.png" } ],
                });

                print("red", "ERROR", `${interaction.commandName} failed!`);

                console.log(e);
            }
        });
    }
};