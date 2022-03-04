const Icons = require("../src/Data/Icons.json");
const ShopItems = require("../src/Data/Shop/Items.json");
const { updateUser } = require("../src/API/Master");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const { fetchData } = require("../src/API/Master");

module.exports = {
    name: "award-dev",
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
    permissions: [
        {
            id: "609097445825052701",
            type: "USER",
            permission: true
        }
    ],
    defaultPermission: false,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    start: async (SenkoClient, interaction) => {
        if (interaction.user.id !== "609097445825052701") return interaction.reply({ content: "🗿", ephemeral: true });
        interaction.deferReply({ ephemeral: true });

        const User = interaction.options.getString("user");
        const DevItem = ShopItems[interaction.options.getString("dev-item")];

        if (!DevItem) return interaction.followUp({ content: "item null", ephemeral: true });

        const FetchedUser = await SenkoClient.users.fetch(User);

        if (!FetchedUser) return interaction.followUp({ content: "user null", ephemeral: true });

        const { Inventory } = await fetchData(FetchedUser);

        for (var Item of Inventory) {
            if (Item.codename === DevItem) {
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

                return interaction.followUp({
                    content: `Added ${DevItem.name} to inventory`,
                    ephemeral: true
                });
            }
        }

        var InvItem = {
            codename: DevItem,
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

        interaction.followUp({
            content: `Added ${DevItem.name} to inventory (Created new)`,
            ephemeral: true
        });
    }
};