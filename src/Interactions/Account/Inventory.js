const ShopItems = require("../../Data/Shop/Items.json");
const Paginate = require("../../API/Pagination/Main");
const Icons = require("../../Data/Icons.json");

module.exports = {
    name: "inventory",
    desc: "View the items you have collected",
    userData: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { Inventory }) => {
        var number = 0;
        const Pages = [];

        // class pageTemplate {
        //     title = `Page ${Pages.length + 1}`;
        //     fields = [];
        //     color =  SenkoClient.colors.dark;
        // }

        // return Paginate(interaction, Pages, 60000);

        const pages = {
            1: {
                title: "Page 1",
                fields: [],
                color: SenkoClient.colors.dark
            },
            2: {
                title: "Page 2",
                fields: [],
                color: SenkoClient.colors.dark
            },
            3: {
                title: "Page 3",
                fields: [],
                color: SenkoClient.colors.dark
            },
            4: {
                title: "Page 4",
                fields: [],
                color: SenkoClient.colors.dark
            },
            5: {
                title: "Page 5",
                fields: [],
                color: SenkoClient.colors.dark
            },
            6: {
                title: "Page 6",
                fields: [],
                color: SenkoClient.colors.dark
            },
            7: {
                title: "Page 7",
                fields: [],
                color: SenkoClient.colors.dark
            },
            8: {
                title: "Page 8",
                fields: [],
                color: SenkoClient.colors.dark
            },
            9: {
                title: "Page 9",
                fields: [],
                color: SenkoClient.colors.dark
            },
            10: {
                title: "Page 10",
                fields: [],
                color: SenkoClient.colors.dark
            },
            11: {
                title: "Page 11",
                fields: [],
                color: SenkoClient.colors.dark
            },
            12: {
                title: "Page 12",
                fields: [],
                color: SenkoClient.colors.dark
            },
            13: {
                title: "Page 13",
                fields: [],
                color: SenkoClient.colors.dark
            },
            14: {
                title: "Page 14",
                fields: [],
                color: SenkoClient.colors.dark
            },
            15: {
                title: "Page 15",
                fields: [],
                color: SenkoClient.colors.dark
            },
            16: {
                title: "Page 16",
                fields: [],
                color: SenkoClient.colors.dark
            },
            17: {
                title: "Page 17",
                fields: [],
                color: SenkoClient.colors.dark
            },
            18: {
                title: "Page 18",
                fields: [],
                color: SenkoClient.colors.dark
            },
            19: {
                title: "Page 19",
                fields: [],
                color: SenkoClient.colors.dark
            },
            20: {
                title: "Page 20",
                fields: [],
                color: SenkoClient.colors.dark
            }
        };

        for (var Item of Inventory) {
            const shopData = await ShopItems[Item.codename];

            const Field = {
                name: `Item ${number}`,
                value: `${Icons.tick}  Missing Data`
            };

            // ${shopData.name} [${Icons.yen}  ${shopData.price}]\n${shopData.desc}\n\n
            number++;

            if (shopData) {
                Field.name = `#${number} — ${shopData.name}`;
                Field.value = `${shopData.desc}`;
            }

            if (number <= 6) {
                pages[1].fields.push(Field);
            } else if (number <= 12 && number > 6) {
                pages[2].fields.push(Field);
            } else if (number <= 24 && number > 12) {
                pages[3].fields.push(Field);
            } else if (number <= 36 && number > 24) {
                pages[4].fields.push(Field);
            } else if (number <= 48 && number > 36) {
                pages[5].fields.push(Field);
            } else if (number <= 60 && number > 48) {
                pages[6].fields.push(Field);
            } else if (number <= 72 && number > 60) {
                pages[7].fields.push(Field);
            } else if (number <= 84 && number > 72) {
                pages[8].fields.push(Field);
            } else if (number <= 96 && number > 84) {
                pages[9].fields.push(Field);
            } else if (number <= 108 && number > 96) {
                pages[10].fields.push(Field);
            } else if (number <= 120 && number > 108) {
                pages[11].fields.push(Field);
            } else if (number <= 132 && number > 120) {
                pages[12].fields.push(Field);
            } else if (number <= 144 && number > 132) {
                pages[13].fields.push(Field);
            } else if (number <= 156 && number > 144) {
                pages[14].fields.push(Field);
            } else if (number <= 168 && number > 156) {
                pages[15].fields.push(Field);
            } else if (number <= 180 && number > 168) {
                pages[16].fields.push(Field);
            } else if (number <= 192 && number > 180) {
                pages[17].fields.push(Field);
            } else if (number <= 204 && number > 192) {
                pages[18].fields.push(Field);
            } else if (number <= 216 && number > 204) {
                pages[19].fields.push(Field);
            } else if (number <= 228 && number > 216) {
                pages[20].fields.push(Field);
            }
        }

        if (pages[1].fields.length > 1) Pages.push(pages[1]);
        if (pages[2].fields.length > 1) Pages.push(pages[2]);
        if (pages[3].fields.length > 1) Pages.push(pages[3]);
        if (pages[4].fields.length > 1) Pages.push(pages[4]);
        if (pages[5].fields.length > 1) Pages.push(pages[5]);
        if (pages[6].fields.length > 1) Pages.push(pages[6]);
        if (pages[7].fields.length > 1) Pages.push(pages[7]);
        if (pages[8].fields.length > 1) Pages.push(pages[8]);
        if (pages[9].fields.length > 1) Pages.push(pages[9]);
        if (pages[10].fields.length > 1) Pages.push(pages[10]);
        if (pages[11].fields.length > 1) Pages.push(pages[11]);
        if (pages[12].fields.length > 1) Pages.push(pages[12]);
        if (pages[13].fields.length > 1) Pages.push(pages[13]);
        if (pages[14].fields.length > 1) Pages.push(pages[14]);
        if (pages[15].fields.length > 1) Pages.push(pages[15]);
        if (pages[16].fields.length > 1) Pages.push(pages[16]);
        if (pages[17].fields.length > 1) Pages.push(pages[17]);
        if (pages[18].fields.length > 1) Pages.push(pages[18]);
        if (pages[19].fields.length > 1) Pages.push(pages[19]);
        if (pages[20].fields.length > 1) Pages.push(pages[20]);


        if (pages[2].fields.length <= 0) return interaction.reply({ embeds: [pages[1]], ephemeral: true });
        Paginate(interaction, Pages, 60000);
    }
};