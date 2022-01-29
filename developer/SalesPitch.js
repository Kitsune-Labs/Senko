// TODO remove this file and make the shop update daily on its own

const Shop_List = require("../src/Data/Shop/Items.json");
const fs = require("fs");

const Items = [];

for (var index in Shop_List) {
    var item = Shop_List[index];

    if (item.onsale == true) {
        Items.push({ ID: item.id, Name: item.name });

        item.onsale = false;
    }
}

const Item1 = Object.keys(Shop_List)[Math.floor(Math.random() * Object.keys(Shop_List).length)];
const Item2 = Object.keys(Shop_List)[Math.floor(Math.random() * Object.keys(Shop_List).length)];
const Item3 = Object.keys(Shop_List)[Math.floor(Math.random() * Object.keys(Shop_List).length)];
const Item4 = Object.keys(Shop_List)[Math.floor(Math.random() * Object.keys(Shop_List).length)];
const Item5 = Object.keys(Shop_List)[Math.floor(Math.random() * Object.keys(Shop_List).length)];
const Item6 = Object.keys(Shop_List)[Math.floor(Math.random() * Object.keys(Shop_List).length)];

console.log("\n\nLast sale");
console.table(Items);
console.log("\n\n");
console.log(`Suggested Items\n— ${Item1}\n— ${Item2}\n— ${Item3}\n— ${Item4}\n— ${Item5}\n— ${Item6}`);

fs.writeFileSync("./src/Data/Shop/Items.json", JSON.stringify(Shop_List, null, 2));