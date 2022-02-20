// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const Icons = require("../../Data/Icons.json");

const ShopItems = require("../../Data/Shop/Items.json");
const PrevItems = [];
const Banners = require("../../Data/Banners.json");

for (var item of Object.keys(ShopItems)) {
    const Item = ShopItems[item];

    if (Item.onsale) {
        PrevItems.push({
            name: `${Item.name}`,
            value: `${item}`
        });
    }
}

module.exports = {
    name: "preview",
    desc: "Preview an item from the shop",
    options: [
        {
            name: "available-item",
            description: "The item to view",
            type: "STRING",
            required: true,
            choices: PrevItems
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        const ItemToView = interaction.options.getString("available-item");
        const ShopItem = await ShopItems[ItemToView];

        const MessageStructure = {
            embeds: [
                {
                    title: `${ShopItem.name}`,
                    description: `${ShopItem.desc}\n`,
                    color: ShopItem.color || SenkoClient.colors.dark,
                    fields: [
                        { name: `${Icons.yen}`, value: `${ShopItem.price}x`, inline: true },
                    ]
                }
            ],

            files: [],
            ephemeral: true
        };

        if (ShopItem.title) MessageStructure.embeds[0].fields.push({ name: "Title", value: `${ShopItem.title || Icons.tick}`, inline: true });
        if (ShopItem.badge) MessageStructure.embeds[0].fields.push({ name: "Badge", value: `${ShopItem.badge || Icons.tick}`, inline: true });
        if (ShopItem.color) MessageStructure.embeds[0].fields.push({ name: "Colored", value: "** **", inline: true });
        if (ShopItem.banner) {
            MessageStructure.embeds[0].image = { url: `attachment://${Banners[ItemToView].endsWith(".png") ? "banner.png" : "banner.gif"}` };
            MessageStructure.files.push({ attachment: `./src/Data/content/banners/${Banners[ItemToView]}`, name: `${Banners[ItemToView].endsWith(".png") ? "banner.png" : "banner.gif"}` });
        }

        interaction.reply(MessageStructure);
    }
};