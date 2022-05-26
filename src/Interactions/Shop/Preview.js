// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const ShopItems = require("../../Data/Shop/Items.json");
const Icons = require("../../Data/Icons.json");
const { fetchSupabaseApi } = require("../../API/super.js");

const Supabase = fetchSupabaseApi();

module.exports = {
    name: "preview",
    desc: "Preview an item from Senko's Market",
    usableAnywhere: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        const { data: rawShopData } = await Supabase.from("config").select("*").eq("id", "all");

        const shopData = rawShopData[0].market;

        shopData.items.push(...rawShopData[0].SpecialMarket);
        shopData.items.push(...rawShopData[0].EventMarket);

        const messageStruct = {
            ephemeral: true,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            placeholder: "Select an item to preview",
                            custom_id: "shop_preview",
                            options: []
                        }
                    ]
                }
            ]
        };


        shopData.items.map(item => {
            const Item = ShopItems[item];

            messageStruct.components[0].components[0].options.push({ label: `${Item.name}`, value: `preview_${Object.keys(ShopItems).indexOf(item)}` });
        });


        interaction.reply(messageStruct);
    }
};