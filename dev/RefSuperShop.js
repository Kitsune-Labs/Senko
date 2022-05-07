require("dotenv/config");

const ShopItems = require("../src/Data/Shop/Items.json");
const RawItems = [];
const SellableItems = [];
const newItems = [];

const { createClient } = require("@supabase/supabase-js");

const Supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
});

setInterval(() => {
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


    const avaliableItems = 16;

    for (var i = 0; i <= avaliableItems; i++) {
        let Item = getItem();

        newItems.push(Item);
    }

    (async () => {
        const { data, error } = await Supabase.from("config").upsert({
            "id": "all",
            "market": {
                "updates": Math.ceil((Date.now() + 86400000) / 1000),
                "items": new Array(...newItems)
            }
        });

        console.log(data);
        console.log(error);
    })();
}, 10000); // 86400000);