// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Message } = require("discord.js");
const Icons = require("../../src/Data/Icons.json");
const { getName, randomArray } = require("../../src/API/Master");

const ShopItems = require("../../src/Data/Shop/Items.json");
const { updateUser } = require("../../src/API/Master");
const ForSale = [];

const SpecialImages = require("../../src/Data/content/Special.json");


for (var item of Object.keys(ShopItems)) {
    const Item = ShopItems[item];

    if (Item.onsale) {
        ForSale.push({
            name: `${Item.name}`,
            value: `${item}`
        });
    }
}

module.exports = {
    name: "buy",
    desc: "Buy an item from the shop",
    userData: true,
    options: [
        {
            name: "onsale-item",
            description: "The item to buy.",
            type: 3,
            required: true,
            choices: ForSale
        }
    ],
    defer: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { Inventory, Currency }) => {
        const givenItem = interaction.options.getString("onsale-item");
        const shopItem = await ShopItems[givenItem];


        SenkoClient.on("interactionCreate", async specialInteraction => {
            if (specialInteraction.isButton() && specialInteraction.user.id === interaction.user.id) {
                switch (specialInteraction.customId) {
                    case "shop_purchase":
                        for (var Item of Inventory) {
                            if (Item.codename === givenItem) {

                                if (Item.amount < shopItem.amount) {
                                    Item.amount++;
                                } else {
                                    await Inventory.push({
                                        codename: givenItem,
                                        amount: shopItem.amount
                                    });
                                }

                                await updateUser(interaction.user, {
                                    Currency: {
                                        Yen:  Currency.Yen - shopItem.price
                                    },
                                    Inventory: Inventory
                                });
                            }
                        }

                        specialInteraction.update({
                            embeds: [
                                {
                                    title: `${Icons.exclamation}  Thank you for your purchase ${getName(interaction)}`,
                                    description: `You have purchased ${shopItem.name} for ${shopItem.price} Yen.`,
                                    color: SenkoClient.colors.light,
                                    thumbnail: {
                                        url: `${SpecialImages.senko.senko_hat_tip}`
                                    }
                                }
                            ],
                            components: []
                        });
                        break;
                    case "shop_decline":
                        specialInteraction.update({
                            embeds: [
                                {
                                    title: `${Icons.tears}  I-I see...`,
                                    description: "I'll be here if you change your mind",
                                    color: SenkoClient.colors.dark,
                                    thumbnail: {
                                        url: `${randomArray([SpecialImages.senko.bummed, SpecialImages.senko.nervous_thinking])}`
                                    }
                                }
                            ],
                            components: []
                        });
                    break;
                }
            }
        });

        /**
         * @type {Message}
         */
        const messageStruct = {
            embeds: [
                {
                    title: `${Icons.exclamation}  Please confirm`,
                    description: `Are you sure you want to buy __${shopItem.name}__ for ${Icons.yen} __${shopItem.price}x__?`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: `${SpecialImages.senko.package_hold}`
                    }
                }
            ],

            // files: [{ attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" }],
            components: [
                {
                    type: 1,
                    components: [
                        { type: 2, label: "Purchase", style: 3, custom_id: "shop_purchase" },
                        { type: 2, label: "Decline", style: 4, custom_id: "shop_decline" }
                    ]
                }
            ],
        };

        Object.setPrototypeOf(messageStruct.prototype, {
            custom_data: {
                shop_data: {
                    codename: givenItem,
                }
            }
        });

        if (Currency.Yen < shopItem.price) return interaction.followUp({
            embeds: [
                {
                    description: `${Icons.exclamation} Im sorry dear\n\nYou do not seem to have enough Yen to purchase this, Interact with me and I can give you some!`,
                    color: SenkoClient.colors.dark,
                    image: {
                        url: `${randomArray([SpecialImages.senko.bummed, SpecialImages.senko.heh])}`
                    }
                }
            ],
            content: `You don't have enough ${Icons.yen} to buy this item.`,
            ephemeral: true,
            // files: [{ attachment: `./src/Data/content/senko/${randomArray(["senko_package", "heh"])}.png`, name: "image.png" }]
        });

        for (var Item of Inventory) {
            if (Item.codename === givenItem) {
                if (Item.amount >= shopItem.max) return interaction.followUp({
                    embeds: [
                        {
                            title: `${Icons.exclamation}  Sorry ${getName(interaction)}.`,
                            description: `You can only have __${shopItem.max} ${shopItem.name}__!`,
                            color: SenkoClient.colors.dark,
                            thumbnail: {
                                url: `${randomArray([SpecialImages.senko.nervous_thinking, SpecialImages.senko.heh])}`
                            }
                        }
                    ],
                    // files: [{ attachment: `./src/Data/content/senko/${randomArray(["SenkoNervousSpeak", "heh"])}.png`, name: "image.png" }],
                    ephemeral: true
                });

                return interaction.followUp(messageStruct);
            }
        }

        interaction.followUp(messageStruct);
    }
};