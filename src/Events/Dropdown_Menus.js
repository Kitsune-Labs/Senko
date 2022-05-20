const { Bitfield } = require("bitfields");
const BitData = require("../API/Bits.json");
const Icons = require("../Data/Icons.json");
const { print, fetchData, updateUser } = require("../API/Master.js");
const ShopItems = require("../Data/Shop/Items.json");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async Interaction => {
            const AccountData = await fetchData(Interaction.user);
            const AccountFlags = Bitfield.fromHex(await AccountData.LocalUser.config.flags);

            if (Interaction.isButton()) {
                switch (Interaction.customId) {
                    case "user_privacy":
                        if (AccountFlags.get(BitData.privacy)) {
                            AccountFlags.set(BitData.privacy, false);
                            await updateUser(Interaction.user, {
                                LocalUser: {
                                    config: {
                                        flags: AccountFlags.toHex().toString()
                                    }
                                },
                            });

                            Interaction.message.embeds[0].fields[0].value = Icons.tick;
                            Interaction.message.components[0].components[0].style = "DANGER";

                            Interaction.update({
                                embeds: [ Interaction.message.embeds[0] ],
                                ephemeral: true,
                                components: Interaction.message.components
                            });
                        } else {
                            AccountFlags.set(BitData.privacy, true);
                            await updateUser(Interaction.user, {
                                LocalUser: {
                                    config: {
                                        flags: AccountFlags.toHex().toString()
                                    }
                                },
                            });

                            Interaction.message.embeds[0].fields[0].value = Icons.check;
                            Interaction.message.components[0].components[0].style = "SUCCESS";

                            Interaction.update({
                                embeds: [ Interaction.message.embeds[0] ],
                                ephemeral: true,
                                components: Interaction.message.components
                            });
                        }

                        break;
                    case "user_dm_achievements":
                        if (AccountFlags.get(BitData.DMAchievements)) {
                            AccountFlags.set(BitData.DMAchievements, false);
                            await updateUser(Interaction.user, {
                                LocalUser: {
                                    config: {
                                        flags: AccountFlags.toHex().toString()
                                    }
                                },
                            });

                            Interaction.message.embeds[0].fields[1].value = Icons.tick;
                            Interaction.message.components[0].components[1].style = "DANGER";

                            Interaction.update({
                                embeds: [ Interaction.message.embeds[0] ],
                                ephemeral: true,
                                components: Interaction.message.components
                            });
                        } else {
                            AccountFlags.set(BitData.DMAchievements, true);
                            await updateUser(Interaction.user, {
                                LocalUser: {
                                    config: {
                                        flags: AccountFlags.toHex().toString()
                                    }
                                },
                            });

                            Interaction.message.embeds[0].fields[1].value = Icons.check;
                            Interaction.message.components[0].components[1].style = "SUCCESS";

                            Interaction.update({
                                embeds: [ Interaction.message.embeds[0] ],
                                ephemeral: true,
                                components: Interaction.message.components
                            });
                        }
                        break;
                }
            }

            if (Interaction.isSelectMenu()) {
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

                const InteractionValue = Interaction.values[0].replace("title_", "").replace("banner_change_", "").replace("color_change_", "");
                const ShopItem = ShopItems[InteractionValue];

                if (Interaction.values[0].startsWith("banner_")) {
                    if (InteractionValue === "default") {
                        await updateUser(Interaction.user, {
                            LocalUser: {
                                Banner: "DefaultBanner"
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your banner has been reset";
                        Interaction.update(ReplyEmbed);
                        return;
                    }

                    await updateUser(Interaction.user, {
                        LocalUser: {
                            Banner: InteractionValue
                        }
                    });

                    ReplyEmbed.embeds[0].description = `Your banner is now set to __${ShopItem.name}__!`;
                    Interaction.update(ReplyEmbed);
                } else if (Interaction.values[0].startsWith("color_")) {
                    if (InteractionValue === "default") {
                        await updateUser(Interaction.user, {
                            LocalUser: {
                                config: {
                                    color: "#FF9933"
                                }
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your color has been reset";
                        Interaction.update(ReplyEmbed);
                        return;
                    }

                    await updateUser(Interaction.user, {
                        LocalUser: {
                            config: {
                                color: ShopItem.color
                            }
                        }
                    });

                    ReplyEmbed.embeds[0].description = `Your color is now set to __${ShopItem.name}__`;
                    Interaction.update(ReplyEmbed);
                } else if (Interaction.values[0].startsWith("title_")) {
                    if (InteractionValue === "none") {
                        await updateUser(Interaction.user, {
                            LocalUser: {
                                config: {
                                    title: null
                                }
                            }
                        });

                        ReplyEmbed.embeds[0].description = "Your title has been removed";
                        Interaction.update(ReplyEmbed);
                        return;
                    }

                    await updateUser(Interaction.user, {
                        LocalUser: {
                            config: {
                                title: InteractionValue.toString()
                            }
                        }
                    });

                    ReplyEmbed.embeds[0].description = `Your title is now set to __${ShopItem.name}__!`;
                    Interaction.update(ReplyEmbed);
                }
            }
        });
    }
};