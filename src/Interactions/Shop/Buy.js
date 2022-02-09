// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const Icons = require("../../Data/Icons.json");
const { update } = require("../../API/v4/Fire");
const { getName } = require("../../API/v4/Guild.js");

const ShopItems = require("../../Data/Shop/Items.json");
const ForSale = [];

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
    options: [
        {
            name: "onsale-item",
            description: "The item to buy.",
            type: 3,
            required: true,
            choices: ForSale
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { Inventory, Currency }) => {
        const ItemToBuy = interaction.options.getString("onsale-item");
        const ShopItem = await ShopItems[ItemToBuy];

        if (!ShopItem) return interaction.reply({ content: `I cant find this. Returned "${ShopItem}"`, ephemeral: true });
        if (Currency.Yen < ShopItem.price) return interaction.reply({ content: `You don't have enough ${Icons.yen} to buy this item.`, ephemeral: true });

        const MessageStructure = {
            embeds: [
                {
                    title: `${Icons.heart}  See you next time!`,
                    description: `And many thanks for purchasing __${ShopItem.name}__ for ${Icons.yen} __${ShopItem.price}x__!`,
                    color: SenkoClient.colors.dark,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],

            files: [ { attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" } ]
        };



        for (var Item of Inventory) {
            if (Item.codename === ItemToBuy) {
                if (Item.amount >= ShopItem.max) return interaction.reply({
                    embeds: [
                        {
                            title: `${Icons.exclamation}  Sorry about this ${getName(interaction)}.`,
                            description: `You can only have __${ShopItem.max} ${ShopItem.name}__!`,
                            color: SenkoClient.colors.dark,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    files: [ { attachment: "./src/Data/content/senko/heh.png", name: "image.png" } ],
                    ephemeral: true
                });

                // Continue

                Item.amount++;

                await update(interaction, {
                    Currency: {
                        Yen:  Currency.Yen - ShopItem.price
                    },
                    Inventory: Inventory
                });

                return interaction.reply(MessageStructure);
            }
        }

        Inventory.push({ codename: ItemToBuy, amount: ShopItem.amount });

        await update(interaction, {
            Currency: {
                Yen: Currency.Yen - ShopItem.price
            },
            Inventory: Inventory
        });

        interaction.reply(MessageStructure);
    }
};