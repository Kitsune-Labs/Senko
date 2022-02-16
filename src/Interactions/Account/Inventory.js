const ShopItems = require("../../Data/Shop/Items.json");
const Paginate = require("../../API/Pagination/Main");
const Icons = require("../../Data/Icons.json");

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

            const Field = {
                name: `${number}`,
                value: `${Icons.tick}  Missing Data`,
                inline: true
            };

            if (ShopData) {
                Field.name = `${ShopData.name}`;
                Field.value = `${ShopData.desc}`;
            }

            number++;

            if (number <= 6) {
                Page1.fields.push(Field);
            } else if (number <= 12 && number > 6) {
                Page2.fields.push(Field);
            } else if (number <= 24 && number > 12) {
                Page3.fields.push(Field);
            } else if (number <= 30 && number > 24) {
                Page4.fields.push(Field);
            } else if (number <= 36 && number > 30) {
                Page5.fields.push(Field);
            }
        }

        if (Page1.fields.length >= 1) Pages.push(Page1);
        if (Page2.fields.length >= 1) Pages.push(Page2);
        if (Page3.fields.length >= 1) Pages.push(Page3);
        if (Page4.fields.length >= 1) Pages.push(Page4);
        if (Page5.fields.length >= 1) Pages.push(Page5);


        if (Page2.fields.length <= 0) return interaction.reply({ embeds: [Page1], ephemeral: true });
        Paginate(interaction, Pages, 60000);
    }
};