const IDB = require("../Data/IDB.json");
const DataConfig = require("../Data/DataConfig.json");
const { getNewData, update } = require("../API/v4/Fire");
const { Bitfield } = require("bitfields");
const { CheckPermission } = require("../API/v5/Permissions");
const { getGuild } = require("../API/v2/FireData.js");
const AllowedCommands = ["ping", "channel", "channels", "avatar", "av", "prefix", "poll"];
const { print } = require("../API/Master");

// eslint-disable-next-line no-unused-vars
const { awardAchievement } = require("../API/v5/Achievement.js");



module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand()) return;
            if (!interaction.guild) return interaction.reply({ content: "I cannot be used in DM's!" });

            if (IDB.includes(interaction.user.id)) return;

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
                content: "This command isn't quite ready yet. Try again in a few minutes!",
                ephemeral: true
            });

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


            let AccountData = null;
            let GuildData = null;
            let ShopData = null;

            // if (InteractionCommand.shop_data) ShopData = (await Firestore.collection("config").doc("shop").get()).data();

            if (!InteractionCommand.no_data) {
                AccountData = await getNewData(interaction);
                GuildData = await getGuild(interaction.guild);

                // if (AccountData.Currency.Yen >= 500) awardAchievement(interaction.user, "PoorAccounting");
                // if (AccountData.Currency.Yen >= 10000) awardAchievement(interaction.user, "AdeptAccounting");
                // if (AccountData.Currency.Yen >= 100000) awardAchievement(interaction.user, "ProAccounting");

                if (IDB.includes(interaction.user.id) || Bitfield.fromHex(await AccountData.LocalUser.config.flags).get(2)) return;

                if (AccountData.LocalUser.version !== DataConfig.currentVersion) {
                    await update(interaction, {
                        LocalUser: {
                            version: DataConfig.currentVersion
                        }
                    });
                }

                if (GuildData.Channels && GuildData.Channels[0] && !GuildData.Channels.includes(interaction.channelId) && !AllowedCommands.includes(interaction.commandName)) return interaction.reply({
                    embeds: [
                        {
                            title: "Sorry!",
                            description: `${interaction.guild.name} has requested you use ${GuildData.Channels.map(i=>`<#${i}>`)}!`,
                            color: SenkoClient.colors.dark
                        }
                    ],
                    ephemeral: true
                });
            }

            print("teal", "DEBUG", `Running ${interaction.commandName}`);

            try {
                InteractionCommand.start(SenkoClient, interaction, GuildData, AccountData, ShopData);
            } catch (e) {
                interaction.reply({
                    content: "oh no Something went wrong!"
                });

                print("red", "ERROR", `${interaction.commandName} failed!`);

                console.log(e);
            }
        });
    }
};