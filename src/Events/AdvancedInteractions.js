const { getNewData, update } = require("../API/v4/Fire");
const { Bitfield } = require("bitfields");
const BitData = require("../API/Bits.json");
const Icons = require("../Data/Icons.json");
const { print } = require("../API/Master.js");
const ShopItems = require("../Data/Shop/Items.json");
const BannerList = require("../Data/Banners.json");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async Interaction => {
            const AccountData = await getNewData(Interaction);
            const AccountFlags = Bitfield.fromHex(await AccountData.LocalUser.config.flags);

            if (Interaction.isButton()) {
                switch (Interaction.customId) {
                    case "user_privacy":
                        if (AccountFlags.get(BitData.privacy)) {
                            AccountFlags.set(BitData.privacy, false);
                            await update(Interaction, {
                                LocalUser: {
                                    config: {
                                        flags: AccountFlags.toHex().toString()
                                    }
                                },
                            });

                            Interaction.message.embeds[0].fields[0].value = `${Icons.tick} not private. Everyone can view your profile.`;

                            Interaction.update({
                                embeds: [ Interaction.message.embeds[0] ],
                                ephemeral: true,
                                components: [
                                    {
                                        type: 1,
                                        components: [
                                            { type: 2, label: "Change Privacy", style: 3, custom_id: "user_privacy" }
                                        ]
                                    }
                                ]
                            });
                        } else {
                            AccountFlags.set(BitData.privacy, true);
                            await update(Interaction, {
                                LocalUser: {
                                    config: {
                                        flags: AccountFlags.toHex().toString()
                                    }
                                },
                            });

                            Interaction.message.embeds[0].fields[0].value = `${Icons.check} private. Only you can view your profile.`;

                            Interaction.update({
                                embeds: [ Interaction.message.embeds[0] ],
                                ephemeral: true,
                                components: [
                                    {
                                        type: 1,
                                        components: [
                                            { type: 2, label: "Change Privacy", style: 4, custom_id: "user_privacy" }
                                        ]
                                    }
                                ]
                            });
                        }

                        break;
                }
            }

            if (Interaction.isSelectMenu()) {
                print("teal", "Select Menu's", "Started new menu");

                const ReplyEmbed = {
                    content: null,
                    embeds: [
                        {
                            title: "Profile Updated!",
                            color: SenkoClient.colors.light
                        }
                    ],
                    components: []
                };

                switch (Interaction.values[0]) {
                    case "banner_change_default":
                        console.log("Banner change default");
                        await update(Interaction, {
                            LocalUser: {
                                Banner: BannerList.defaultbanner
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your banner is now set to __Default__!";

                        Interaction.update(ReplyEmbed);
                        break;
                    case "banner_change_Christmas_Banner_21":
                        await update(Interaction, {
                            LocalUser: {
                                Banner: BannerList.Christmas_Banner_21
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your banner is now set to __Senko's Christmas Present__!";

                        Interaction.update(ReplyEmbed);
                        break;
                    case "banner_change_sakurashiro":
                        await update(Interaction, {
                            LocalUser: {
                                Banner: BannerList.sakurashiro
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your banner is now set to __Shiro Sakura__!";

                        Interaction.update(ReplyEmbed);
                        break;
                    case "banner_change_thehelpfulfoxsenko":
                        await update(Interaction, {
                            LocalUser: {
                                Banner: BannerList.thehelpfulfoxsenko
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your banner is now set to __The Helpful Fox Senko__!";

                        Interaction.update(ReplyEmbed);
                        break;
                    case "banner_change_senkobanner_1":
                        await update(Interaction, {
                            LocalUser: {
                                Banner: BannerList.senkobanner_1
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your banner is now set to __Senko Banner 1__!";

                        Interaction.update(ReplyEmbed);
                        break;
                    case "banner_change_leaningbanner":
                        await update(Interaction, {
                            LocalUser: {
                                Banner: BannerList.sakurashiro
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your banner is now set to __Leaning's Banner__!";

                        Interaction.update(ReplyEmbed);
                        break;
                    case "banner_change_Transgender_Pride_Flag":
                        await update(Interaction, {
                            LocalUser: {
                                Banner: BannerList.Transgender_Pride_Flag
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your banner is now set to __Transgender Pride Flag Banner__!";

                        Interaction.update(ReplyEmbed);
                        break;

                    case "banner_change_MooseKaiBanner":
                        await update(Interaction, {
                            LocalUser: {
                                Banner: BannerList.MooseKaiBanner
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your banner is now set to __MooseKai's Snowsgiving 2021 Banner__!";

                        Interaction.update(ReplyEmbed);
                        break;
                    // Profile Colors

                    case "color_change_color_white":
                        await update(Interaction, {
                            LocalUser: {
                                config: {
                                    color: ShopItems.color_white.color
                                }
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your color is now set to __White__!";

                        Interaction.update(ReplyEmbed);
                        break;
                    case "color_change_color_purple":
                        await update(Interaction, {
                            LocalUser: {
                                config: {
                                    color: ShopItems.color_purple.color
                                }
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your color is now set to __Purple__!";

                        Interaction.update(ReplyEmbed);
                    break;



                    // Profile Titles

                    case "title_developer_kitsune_title":
                        await update(Interaction, {
                            LocalUser: {
                                config: {
                                    title: ShopItems.developer_kitsune_title.title
                                }
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your title is now set to __${ShopItems.developer_kitsune_title.name}__!";

                        Interaction.update(ReplyEmbed);
                    break;

                    case "title_divine_title":
                        await update(Interaction, {
                            LocalUser: {
                                config: {
                                    title: ShopItems.divine_title.title
                                }
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your title is now set to __${ShopItems.divine_title.name}__!";

                        Interaction.update(ReplyEmbed);
                    break;

                    case "title_master_thrower":
                        await update(Interaction, {
                            LocalUser: {
                                config: {
                                    title: ShopItems.master_thrower.title
                                }
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your title is now set to __${ShopItems.master_thrower.name}__!";

                        Interaction.update(ReplyEmbed);
                    break;
                }
            }
        });
    }
};