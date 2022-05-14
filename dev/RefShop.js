const ShopItems = require("../src/Data/Shop/Items.json");
const fs = require("fs");
const RawItems = [];
const SellableItems = [];

for (var index in ShopItems) {
    const Item = ShopItems[index];

    Item.onsale = false;

    if (Item.autoSale && Item.autoSale === true) {
        RawItems.push(index);
    }
}

function getItem() {
    const RNG = RawItems[Math.floor(Math.random() * RawItems.length)];
    SellableItems.splice(0, 0, RNG);
    SellableItems.push(RNG);
    return RNG;
}


const avaliableItems = 12;

for (var i = 0; i <= avaliableItems; i++) {
    let Item = getItem();
    ShopItems[Item].onsale = true;
    console.log(Item);
}

fs.writeFileSync("./src/Data/Shop/Items.json", JSON.stringify(ShopItems, null, 2));