const ShopItems = require("../../Data/Shop/Items.json");
const pagination = require("../../API/modules/discord-pagination-advanced");

//! prepare for a mess!

module.exports = {
    name: "inventory",
    desc: "View the items in your inventory",
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { Inventory }) => {
        var number = 0;
        const Pages = [];

        const Page1 = {
            title: "Page 1",
            fields: [],
            color: SenkoClient.colors.light
        };

        const Page2 = {
            title: "Page 2",
            fields: [],
            color: SenkoClient.colors.dark
        };

        const Page3 = {
            title: "Page 3",
            fields: [],
            color: SenkoClient.colors.light
        };

        const Page4 = {
            title: "Page 4",
            fields: [],
            color: SenkoClient.colors.dark
        };

        const Page5 = {
            title: "Page 5",
            fields: [],
            color: SenkoClient.colors.light
        };


        for (var Item of Inventory) {
            const ShopData = await ShopItems[Item.codename];

            if (number <= 6) {
                if (!ShopData) {
                    Page1.fields.push({ name: `${number}`, value: "Missing Data" });
                } else {
                    Page1.fields.push({ name: `${ShopData.name}`, value: `— ${ShopData.desc}` });
                }
                number++;
            } else if (number <= 12 && number > 6) {
                if (!ShopData) {
                    Page2.fields.push({ name: `${number}`, value: "Missing Data" });
                } else {
                    Page2.fields.push({ name: `${ShopData.name}`, value: `— ${ShopData.desc}` });
                }
                number++;
            } else if (number <= 24 && number > 12) {
                if (!ShopData) {
                    Page3.fields.push({ name: `${number}`, value: "Missing Data" });
                } else {
                    Page3.fields.push({ name: `${ShopData.name}`, value: `— ${ShopData.desc}` });
                }
                number++;
            } else if (number <= 30 && number > 24) {
                if (!ShopData) {
                    Page4.fields.push({ name: `${number}`, value: "Missing Data" });
                } else {
                    Page4.fields.push({ name: `${ShopData.name}`, value: `— ${ShopData.desc}` });
                }
                number++;
            } else if (number <= 36 && number > 30) {
                if (!ShopData) {
                    Page5.fields.push({ name: `${number}`, value: "Missing Data" });
                } else {
                    Page5.fields.push({ name: `${ShopData.name}`, value: `— ${ShopData.desc}` });
                }
                number++;
            }
        }

        if (Page1.fields.length >= 1) Pages.push(Page1);
        if (Page2.fields.length >= 1) Pages.push(Page2);
        if (Page3.fields.length >= 1) Pages.push(Page3);
        if (Page4.fields.length >= 1) Pages.push(Page4);
        if (Page5.fields.length >= 1) Pages.push(Page5);

        if (Page2.fields.length <= 0) {
            interaction.reply({
                embeds: [Page1],
                ephemeral: true
            });
        } else {
            pagination(interaction, Pages, { autoDelete: 1, ephemeral: true });
        }
    }
};