const Shop = require("../src/Data/Shop/Items.json");
const fs = require("fs");
const data = {};

for (var item of Object.keys(Shop)) {
    const DataStructure =  {
        // id: null,
        class: null,
        name: null,
        desc: null,
        price: 0,
        amount: 0,
        onsale: false
    };

    DataStructure.class = Shop[item].class || null;
    DataStructure.name = Shop[item].name || null;
    DataStructure.desc = Shop[item].desc || null;
    DataStructure.price = Shop[item].price || 0;
    DataStructure.amount = Shop[item].amount || 0;


    if (Shop[item].title) DataStructure.title = Shop[item].title;
    if (Shop[item].badge) DataStructure.badge = Shop[item].badge;
    if (Shop[item].color) DataStructure.color = Shop[item].color;
    if (Shop[item].banner) DataStructure.banner = Shop[item].banner;
    if (Shop[item].type) DataStructure.type = Shop[item].type; // Will redo at some point

    data[item] = DataStructure;
}


fs.writeFileSync("./src/Data/Shop/out.json", JSON.stringify(data, null, 4));