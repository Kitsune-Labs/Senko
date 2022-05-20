// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
const { fetchData, updateUser, randomArray } = require("../API/Master");
const { updateSuperGuild } = require("../API/super");
const Icons = require("../Data/Icons.json");
const Market = require("../Data/Shop/Items.json");
const HardLinks = require("../Data/HardLinks.json");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async (interaction) => {
            if (interaction.isButton()) {
                switch (interaction.customId) {
                    case "confirm_super_channel_removal":
                        await updateSuperGuild(interaction.guild, {
                            Channels: []
                        });

                        interaction.update({
                            embeds: [
                                {
                                    title: `${Icons.exclamation}  Alright dear`,
                                    description: "All of the channels have been removed",
                                    color: SenkoClient.colors.light,
                                    thumbnail: {
                                        url: "attachment://image.png"
                                    }
                                }
                            ],
                            components: []
                        });
                        break;
                }


                if (interaction.customId.startsWith("eat-")) {
                    console.log(interaction.customId);

                    const foodItem = interaction.customId.split("-")[1];

                    if (interaction.user.id !== interaction.customId.split("-")[2]) return interaction.reply({
                        embeds: [
                            {
                                title: `${Icons.exclamation}  You can't eat that!`,
                                description: "That is not your food",
                                color: SenkoClient.colors.dark,
                                thumbnail: {
                                    url: "attachment://image.png"
                                }
                            }
                        ],
                        files: [{ attachment: "./src/Data/content/senko/pout.png", name: "image.png" }],
                        ephemeral: true
                    });

                    const item = Market[foodItem];
                    const AccountData = await fetchData(interaction.user);

                    new Promise((resolve) => {
                        for (var index in AccountData.Inventory) {
                            const Item = AccountData.Inventory[index];

                            if (Item.codename === foodItem) {
                                if (Item.amount > 1) {
                                    Item.amount--;

                                    updateUser(interaction.user, {
                                        Inventory: AccountData.Inventory
                                    });

                                    return resolve();
                                }

                                AccountData.Inventory.splice(index, 1);
                                updateUser(interaction.user, {
                                    Inventory: AccountData.Inventory
                                });

                                return resolve();
                            }
                        }
                    }).then(() => {
                        const reactions = ["good"];

                        interaction.update({
                            embeds: [
                                {
                                    title: `You and Senko ate ${item.name}!`,
                                    description: `Senko says it was ${reactions[Math.floor(Math.random() * reactions.length)]}\n\n— 1x ${item.name} removed`,
                                    color: SenkoClient.colors.light,
                                    thumbnail: {
                                        url: randomArray([HardLinks.senkoBless, HardLinks.senkoEat, HardLinks.senkoDrink])
                                    }
                                }
                            ],
                            components: []
                        });
                    });
                }
            }
        });
    }
};