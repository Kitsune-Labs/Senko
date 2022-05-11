// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client, MessageActionRow, MessageSelectMenu } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const ShopItems = require("../../Data/Shop/Items.json");

module.exports = {
    name: "read",
    desc: "Read the manga chapters you get from the market!",
    userData: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const OwnedChapters = [];
        // await interaction.deferReply();

        new Promise((resolve) => {
            for (var Item of AccountData.Inventory) {
                const ShopItem = ShopItems[Item.codename];
                if (ShopItem && ShopItem.manga) {
                    OwnedChapters.push({ label: `${ShopItem.name}`, value: `read_${ShopItem.manga}`, description: `${ShopItem.desc}`});
                }
            }

            resolve();
        }).then(() => {
            if (!OwnedChapters[0]) return interaction.reply({
                content: "You don't own any Tails of the Senko Manga, you can find them in the shop when they're onsale!",
                ephemeral: true
            });

            interaction.reply({
                content: "** **",
                components: [
                    new MessageActionRow().addComponents([
                    new MessageSelectMenu()
                    .setCustomId("read_manga")
                    .setPlaceholder("What should I read?")
                    .setOptions(OwnedChapters)
                ])]
            });
        });
    }
};
