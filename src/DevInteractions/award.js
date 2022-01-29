const Icons = require("../Data/Icons.json");
const ShopItems = require("../Data/Shop/Items.json");
const { getData, updateUser } = require("../API/v2/FireData.js");

module.exports = {
    name: "award",
    desc: "dev",
    options: [
        {
            name: "user",
            description: "User",
            type: 3,
            required: true
        },
        {
            name: "dev-item",
            description: "Item ID from the shop",
            type: 3,
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        if (interaction.user.id !== "609097445825052701") return interaction.reply({ content: "🗿", ephemeral: true });

        const User = interaction.options.getString("user");
        const DevItem = ShopItems[interaction.options.getString("dev-item")];

        if (!DevItem) return interaction.reply({ content: "item null", ephemeral: true });

        const FetchedUser = await SenkoClient.users.cache.get(User);

        if (!FetchedUser) return interaction.reply({ content: "user null", ephemeral: true });

        const { Inventory } = await getData(FetchedUser);

        for (var Item of Inventory) {
            if (Item.codename === DevItem.id) {
                Item.amount++;

                await updateUser(FetchedUser, {
                    Inventory: Inventory
                });

                FetchedUser.send({
                    embeds: [
                        {
                            title: `${Icons.package}  You received an item from Senko-san!`,
                            description: `__${DevItem.name}__ has been added to your inventory!`,
                            color: SenkoClient.colors.light,
                        }
                    ]
                }).catch();

                return interaction.reply({
                    content: `Added ${DevItem.name} to inventory`,
                    ephemeral: true
                });
            }
        }

        var InvItem = {
            codename: DevItem.id,
            amount: DevItem.amount
        };

        Inventory.push(InvItem);

        await updateUser(FetchedUser, {
            Inventory: Inventory
        });

        FetchedUser.send({
            embeds: [
                {
                    title: `${Icons.package}  You received an item from Senko-san!`,
                    description: `__${DevItem.name}__ has been added to your inventory!`,
                    color: SenkoClient.colors.light,
                }
            ]
        }).catch();

        interaction.reply({
            content: `Added ${DevItem.name} to inventory (Created new)`,
            ephemeral: true
        });
    }
};