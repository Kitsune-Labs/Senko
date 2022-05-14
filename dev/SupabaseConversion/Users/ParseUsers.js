require("dotenv/config");
const userData = require("./users.json");
// eslint-disable-next-line no-unused-vars
const { Guild } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");

const shopItems = require("../../../src/Data/Shop/Items.json");


const Supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
});

(async () => {
    for (var data of userData) {
        const newData = {
            "LocalUser": {
                "profileConfig": {
                    "title": null,
                    "aboutMe": null,
                    "banner": "DefaultBanner.png",
                    "cardColor": "#FF9933",
                    "badges": "00000000000000000000000000",
                    "achievements": []
                },
                "accountConfig": {
                    "activePowers": [],
                    "flags": "00000000000000000000000000",
                    "rank": "00000000000000",
                    "level": {
                        "level": 1,
                        "xp": 0
                    }
                }
            },
            "Stats": {
                "Rests": 0,
                "Fluffs": 0,
                "Pats": 0,
                "Steps": 0,
                "Hugs": 0,
                "Sleeps": 0,
                "Drinks": 0,
                "Smiles": 0
            },
            "Currency": {
                "Yen": 100,
                "Tofu": 0
            },
            "Inventory": {},
            "RateLimits": {
                "Rest_Rate": {
                    "Date": 1627710691,
                    "Amount": 0
                },
                "Pat_Rate": {
                    "Date": 1627710691,
                    "Amount": 0
                },
                "Step_Rate": {
                    "Date": 1627710691,
                    "Amount": 0
                },
                "Hug_Rate": {
                    "Date": 1627710691,
                    "Amount": 0
                },
                "Drink_Rate": {
                    "Date": 1627710691,
                    "Amount": 0
                },
                "Sleep_Rate": {
                    "Date": 1627710691,
                    "Amount": 0
                },
                "Smile_Rate": {
                    "Date": 1627710691,
                    "Amount": 0
                },
                "Eat_Rate": {
                    "Date": 1627710691,
                    "Amount": 0
                }
            },
            "Rewards": {
                "Daily": 1627604493201,
                "Weekly": 1627604493201,
                "Work": 1627604493201
            }
        };


        newData.LocalUser.profileConfig.title = data.LocalUser.config.title ? data.LocalUser.config.title : null;
        newData.LocalUser.profileConfig.aboutMe = data.LocalUser.AboutMe ? data.LocalUser.AboutMe : null;
        newData.LocalUser.profileConfig.banner = data.LocalUser.Banner ? data.LocalUser.Banner : "DefaultBanner.png";
        newData.LocalUser.profileConfig.cardColor = data.LocalUser.config.color ? data.LocalUser.config.color : "#FF9933";
        newData.LocalUser.accountConfig.flags = data.LocalUser.config.flags ? data.LocalUser.config.flags : "00000000000000000000000000";

        newData.Currency.Yen = data.Currency.Yen ? Math.ceil(data.Currency.Yen)  : 200;
        newData.Currency.Tofu = data.Currency.Tofu ? data.Currency.Tofu : 0;

        newData.Stats.Rests = data.Stats.Rests ? data.Stats.Rests : 0;
        newData.Stats.Fluffs = data.Stats.Fluffs ? data.Stats.Fluffs : 0;
        newData.Stats.Pats = data.Stats.Pats ? data.Stats.Pats : 0;
        newData.Stats.Steps = data.Stats.Steps ? data.Stats.Steps : 0;
        newData.Stats.Hugs = data.Stats.Hugs ? data.Stats.Hugs : 0;
        newData.Stats.Sleeps = data.Stats.Sleeps ? data.Stats.Sleeps : 0;
        newData.Stats.Drinks = data.Stats.Drinks ? data.Stats.Drinks : 0;
        newData.Stats.Smiles = data.Stats.Smiles ? data.Stats.Smiles : 0;

        newData.Rewards.Work = data.Rewards.Work ? data.Rewards.Work : 1627710691;
        newData.Rewards.Daily = data.Rewards.Daily ? data.Rewards.Daily : 1627710691;
        newData.Rewards.Weekly = data.Rewards.Weekly ? data.Rewards.Weekly : 1627710691;


        for (var item of data.Inventory) {
            newData.Inventory[item.codename] =  item.amount;
        }


        // console.log({ id: data.userId[0], ...newData });
        await Supabase.from("Users").insert([{ id: data.userId[0], ...newData }]);
    }
})();

// {"id":null,"message":null}