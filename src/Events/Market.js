// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { print, fetchData, updateUser, getName, disableComponents } = require("../API/Master.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");
const shopItems = require("../Data/Shop/Items.json");


module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async interaction => {
            if (interaction.isSelectMenu() && interaction.customId == "shop_purchase") {
                const item = interaction.values[0].split("_").splice(1, 3);

                const itemName = Object.keys(shopItems).at(item[0]);
                const shopItem = await shopItems[itemName];

                if (!shopItem.onsale) return interaction.reply({
                    embeds: [
                        {
                            title: `${Icons.exclamation}  Sorry!`,
                            description: "This item is out of stock right now check back next time!",
                            color: SenkoClient.colors.dark,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
                    ephemeral: true
                });

                const { Inventory } = await fetchData(interaction.user);

                for (let Item of Inventory) {
                    if (Item.codename === itemName && Item.amount >= shopItem.max) {
                        return interaction.reply({
                            embeds: [
                                {
                                    title: `${Icons.exclamation}  Sorry ${getName(interaction)}`,
                                    description: `You may only have **${shopItem.max}** total!`,
                                    color: SenkoClient.colors.dark,
                                    thumbnail: {
                                        url: "attachment://image.png"
                                    }
                                }
                            ],
                            files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
                            ephemeral: true
                        });
                    }
                }

                interaction.reply({
                    content: `${interaction.user}`,
                    embeds: [
                        {
                            title: "Confirm Purchase!",
                            description: `Are you sure you want to purchase __${shopItem.name}__ for ${Icons.yen} __${shopItem.price}x__?`,
                            color: SenkoClient.colors.light,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    files: [{ attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" }],
                    components: [
                        {
                            type: 1,
                            components: [
                                { type: 2, label: "Purchase", style: 3, custom_id: `shop_confirm-${Object.keys(shopItems).indexOf(itemName)}-${interaction.user.id}` },
                                { type: 2, label: "Put back", style: 4, custom_id: `shop_cancel-${interaction.user.id}` }
                            ]
                        }
                    ]
                });
            }

            if (interaction.isButton() && interaction.customId.startsWith("shop_confirm")) {
                const item = interaction.customId.split("-");
                const itemName = Object.keys(shopItems).at(item[1]);
                const shopItem = shopItems[itemName];

                if (item[2] != interaction.user.id) return interaction.reply({ content: "You cannot steal items, that's illegal!", ephemeral: true });

                const { Inventory, Currency } = await fetchData(interaction.user);

                const MessageStructure = {
                    embeds: [
                        {
                            title: `${Icons.heart}  See you next time!`,
                            description: `Thanks for purchasing **${shopItem.name}** for ${Icons.yen} ${shopItem.price}x!`,
                            color: SenkoClient.colors.dark,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    files: [ { attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" } ],
                    components: []
                };

                for (let Item of Inventory) {
                    if (Item.codename === itemName) {
                        Item.amount++;

                        await updateUser(interaction.user, {
                            Currency: {
                                Yen:  Currency.Yen - shopItem.price
                            },
                            Inventory: Inventory
                        });

                        return interaction.update(MessageStructure);
                    }
                }

                Inventory.push({ codename: itemName, amount: shopItem.amount });

                await updateUser(interaction.user, {
                    Currency: {
                        Yen: Currency.Yen - shopItem.price
                    },
                    Inventory: Inventory
                });

                interaction.update(MessageStructure);
            }

            if (interaction.isButton() && interaction.customId === `shop_cancel-${interaction.user.id}`) {
                interaction.update({
                    embeds: [
                        {
                            title: `${Icons.exclamation}  Very well then`,
                            description: "I'll put back your item and hopefully you can buy it next time!",
                            color: SenkoClient.colors.dark,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    components: []
                });
            } else {
                if (interaction.isButton() && interaction.customId.startsWith("shop_cancel-")) return interaction.reply({ content: "I can't put things back that aren't yours", ephemeral: true });
            }
        });
    }
};