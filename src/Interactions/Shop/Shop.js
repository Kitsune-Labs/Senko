// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Message } = require("discord.js");
const ShopItems = require("../../Data/Shop/Items.json");
const Icons = require("../../Data/Icons.json");
const { fetchSupabaseApi, fetchConfig } = require("../../API/super.js");

const Supabase = fetchSupabaseApi();

module.exports = {
    name: "shop",
    desc: "Buy item's from Senko's Market",
    userData: true,
    defer: true,

    /**
     * @param {CommandInteraction} interaction
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const { data: rawShopData } = await Supabase.from("config").select("*").eq("id", "all");

        const superConfig = await fetchConfig();
        const shopData = rawShopData[0].market;

        shopData.items.push(...rawShopData[0].SpecialMarket);
        /**
         * @type {Message}
         */
        const Shop = {
            title: "Senko's Market",
            description: `Please take your time and review what is available in the market.\n\nYou can use \`/preview\` to view extended info about an item like it's description, price, banner, and color\n\n> ${Icons.package}  Market refresh <t:${shopData.updates}:R>\n> ${Icons.yen}  **${AccountData.Currency.Yen}** in your savings`,
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
        const MenuItems = [];

        superConfig.EventMarket.map(eventItem => {
            const eI = ShopItems[eventItem];

            if (eI) {
                EventItems += `[${Icons.yen}  ${eI.price}] **${eI.name}**`; // ${Icons.package}  —  **${eI.name}** [${Icons.yen}  ${eI.price}]\n`;

                MenuItems.push({ label: `${eI.name}`, value: `shopbuy_${Object.keys(ShopItems).indexOf(eventItem)}_${interaction.user.id}` });
            }
        });

        for (var Thing of shopData.items) {
            var Item = await ShopItems[Thing];

            let ItemString = `[${Icons.yen}  ${Item.price}] **${Item.name}**`;

            MenuItems.push({ label: `${Item.name}`, value: `shopbuy_${Object.keys(ShopItems).indexOf(Thing)}_${interaction.user.id}` });


            // if (superConfig.EventMarket.includes(Thing)) EventItems += `${Icons[Item.seasonal.season]}  ${Item.seasonal.season}  —  **${Item.name}** [${Icons.yen}  ${Item.price}x]\n`;

            switch(Item.class) {
                case "food":
                    FoodItems += `${ItemString}\n`;
                    break;
                case "material":
                    MaterialItems += `${ItemString}\n`;
                    break;
                case "profile":
                    ProfileItems += `${ItemString}\n`;
                    break;
                case "general":
                    GeneralItems += `${ItemString}\n`;
                    break;
                default:
                    console.log(`${Item.name} doesn't have a correct category.`);
            }
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
            files: [{ attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" }],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            placeholder: "Select an item to purchase",
                            custom_id: "shop_purchase",
                            options: MenuItems
                        },
                    ]
                }
            ]
        });
    }
};
