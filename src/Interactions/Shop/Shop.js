// eslint-disable-next-line no-unused-vars
const { CommandInteraction, MessageAttachment } = require("discord.js");
const ShopItems = require("../../Data/Shop/Items.json");
const Icons = require("../../Data/Icons.json");

module.exports = {
    name: "shop",
    desc: "Buy an item from Senko's Market",
    userData: true,

    /**
     * @param {CommandInteraction} interaction
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const Shop = {
            title: "Senko's Market",
            description: `
                Please take your time and review what is available in the market.

                You can use these commands to interact with the market:
                > \`/buy <item>\` to buy an item
                > \`/preview <item>\` preview the item's description, price, and possible preview images


                __${Icons.yen}  ${AccountData.Currency.Yen}x in your savings__
            `,
            color: SenkoClient.colors.light,
            thumbnail: {
                url: "attachment://image.png"
            }
        };

        let ProfileItems = "";
        let FoodItems = "";
        let MaterialItems = "";
        let GeneralItems = "";

        let EventItems = "";

        for (var Thing in ShopItems) {
            var Item = ShopItems[Thing];

            if (Item.onsale) {
                let ItemString = "";

                if (Item.seasonal && Item.seasonal.isSeasonal === true) {
                    ItemString += `${Icons[Item.seasonal.season]}  ${Item.seasonal.season}  —  ${Item.name} [${Icons.yen}  ${Item.price}x]`;

                    EventItems += `${ItemString}\n`;
                } else {
                    switch(Item.class) {
                        case "food":
                            ItemString += `— ${Item.name} [${Icons.yen}  ${Item.price}x]`;

                            FoodItems += `${ItemString}\n`;
                        break;

                        case "material":
                            ItemString += `— ${Item.name} [${Icons.yen}  ${Item.price}x]`;

                            MaterialItems += `${ItemString}\n`;
                        break;

                        case "profile":
                            ItemString += `— ${Item.name} [${Icons.yen}  ${Item.price}x]`;

                            ProfileItems += `${ItemString}\n`;
                        break;

                        case "general":
                            ItemString += `— ${Item.name} [${Icons.yen}  ${Item.price}x]`;

                            GeneralItems += `${ItemString}\n`;
                        break;

                        default:
                            console.log(`${Item.name} doesn't have a correct category.`);
                    }
                }
            }
        }

        let ShopString = "";

        if (ProfileItems.length > 0) ShopString += `> **Cosmetic Booth**\n${ProfileItems}`;
        if (GeneralItems.length > 0) ShopString += `\n\n> **General Goods**\n${GeneralItems}`;
        if (FoodItems.length > 0) ShopString += `\n\n> **Food Items**\n${FoodItems}`;
        if (MaterialItems.length > 0) ShopString += `\n\n> **Material Booth**\n${MaterialItems}`;
        if (EventItems.length > 0) ShopString += `\n\n> **Event Booth**\n${EventItems}`;


        Shop.description += `\n\n${ShopString}`;

        interaction.reply({
            embeds: [ Shop ],
            files: [ new MessageAttachment("./src/Data/content/senko/senko_package.png", "image.png") ]
        });
    }
};
