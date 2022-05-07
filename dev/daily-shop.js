// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../src/Data/Icons.json");
const { fetchSupabaseApi } = require("../src/API/super");
const ShopItems = require("../src/Data/Shop/Items.json");
const supabase = fetchSupabaseApi();

module.exports = {
    name: "daily-shop",
    desc: "daily-shop",
    userData: true,
    defer: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const { data } = await supabase.from("config").select("*").eq("id", "all");
        const { updates, items } = data[0].market;

        const Shop = {
            title: "Senko's Market",
            description: `Please take your time and review what is available in the market.\n\nYou can use these commands to interact with the market:\n> \`/buy <item>\` to buy an item\n> \`/preview <item>\` preview an item description, price, banner, and color\nMy market restocks <t:${updates}:R>\n\n__${Icons.yen}  ${AccountData.Currency.Yen}x in your savings__`,
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

        for (var Thing of items) {
            var Item = ShopItems[Thing];

            // if (Item.onsale) {
                let ItemString = "";

                if (Item.seasonal && Item.seasonal.isSeasonal === true)
                    EventItems += `${Icons[Item.seasonal.season]}  ${Item.seasonal.season}  —  **${Item.name}** [${Icons.yen}  ${Item.price}x]\n`;


                switch(Item.class) {
                    case "food":
                        ItemString += `— **${Item.name}** [${Icons.yen}  ${Item.price}x]`;

                        FoodItems += `${ItemString}\n`;
                    break;

                    case "material":
                        ItemString += `— **${Item.name}** [${Icons.yen}  ${Item.price}x]`;

                        MaterialItems += `${ItemString}\n`;
                    break;

                    case "profile":
                        ItemString += `— **${Item.name}** [${Icons.yen}  ${Item.price}x]`;

                        ProfileItems += `${ItemString}\n`;
                    break;

                    case "general":
                        ItemString += `— **${Item.name}** [${Icons.yen}  ${Item.price}x]`;

                        GeneralItems += `${ItemString}\n`;
                    break;

                    default:
                        console.log(`${Item.name} doesn't have a correct category.`);
                }
            // }
        }

        let ShopString = "";

        if (ProfileItems.length > 0) ShopString += `> **Cosmetic Booth**\n${ProfileItems}`;
        if (GeneralItems.length > 0) ShopString += `\n\n> **General Goods**\n${GeneralItems}`;
        if (FoodItems.length > 0) ShopString += `\n\n> **Food Items**\n${FoodItems}`;
        if (MaterialItems.length > 0) ShopString += `\n\n> **Material Booth**\n${MaterialItems}`;
        if (EventItems.length > 0) ShopString += `\n\n> **Event Booth**\n${EventItems}`;

        Shop.description += `\n\n${ShopString}`;

        interaction.followUp({
            embeds: [ Shop ],
            files: [{ attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" }]
        });
    }
};