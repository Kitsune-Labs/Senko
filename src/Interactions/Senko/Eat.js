// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const ShopItems = require("../../Data/Shop/Items.json");
const { updateUser, randomArray } = require("../../API/Master");

module.exports = {
    name: "eat",
    desc: "Eat something with Senko",
    userData: true,
    defer: true,
    /**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const EdibleItems = {};

        new Promise((Resolve, Reject) => {
            for (var Item of AccountData.Inventory) {
                if (ShopItems[Item.codename].class === "food") {
                    EdibleItems[Item.codename] = {
                        Item: ShopItems[Item.codename],
                        Amount: Item.amount
                    };
                }
            }

            if (Object.keys(EdibleItems).length === 0) return Reject();
            Resolve();
        }).then(() => {
            const RandomFoodItem = Object.keys(EdibleItems)[Math.floor(Math.random() * Object.keys(EdibleItems).length)];
            const SenkoReactions = ["delicious", "flavorful", "tastefull"];

            new Promise((resolve) => {
                for (var index in AccountData.Inventory) {
                    const Item = AccountData.Inventory[index];

                    if (Item.codename === RandomFoodItem) {
                        if (Item.amount > 1) {
                            Item.amount--;
                            updateUser(interaction.user, {
                                Inventory: AccountData.Inventory
                            });
                            return resolve(ShopItems[RandomFoodItem]);
                        }

                        AccountData.Inventory.splice(index, 1);
                        updateUser(interaction.user, {
                            Inventory: AccountData.Inventory
                        });

                        return resolve(ShopItems[RandomFoodItem]);
                    }
                }
            }).then((ShopItem) => {
                interaction.followUp({
                    embeds: [
                        {
                            title: `You ate ${ShopItem.name}!`,
                            description: `Senko thinks ${ShopItem.name} is ${SenkoReactions[Math.floor(Math.random() * SenkoReactions.length)]}!\n\n— 1x ${ShopItem.name} removed`,
                            color: SenkoClient.colors.light,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    files: [ { attachment: `./src/Data/content/senko/${randomArray(["SenkoEat", "SenkoBless"])}.png`, name: "image.png" } ]
                });
            }).catch(() => {
                interaction.followUp({ content: "You don't own any food Items, Buy some at Senko's Market when they're onsale!" });
            });
        }).catch(() => {
            interaction.followUp({ content: "You don't own any food Items, Buy some at Senko's Market when they're onsale!" });
        });
    }
};