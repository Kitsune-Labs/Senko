//* it works no touchy!!!1!


require("dotenv/config");

const Firebase = require("firebase-admin");

Firebase.initializeApp({
    credential: Firebase.credential.cert({
        "projectId": process.env.FIREBASE_PROJECT_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY,
        "client_email": process.env.FIREBASE_CLIENT_EMAIL
    })
});

const DataConfig = require("../src/Data/DataConfig.json");
const uuid = require("uuid");
const { Bitfield } = require("bitfields");

const Firestore = Firebase.firestore();

Firestore.collection("Users").get().then(async querySnapshot => {
    querySnapshot.docs.forEach(async doc => {
        const AccountData = doc.data();

        const DataStructure = {
            LocalUser: {
                user: `User_${uuid.v4()}`.slice(0, 13),
                version: DataConfig.currentVersion,
                userID: AccountData.LocalUser.userID,
                Banner: "DefaultBanner.png",
                badges: [],
                config: {
                    color: "#FF9933",
                    flags: new Bitfield(100).toHex(),
                    title: null
                }
            },

            Stats: {
                Rests: 0,
                Fluffs: 0,
                Pats: 0,
                Steps: 0,
                Hugs: 0,
                Sleeps: 0,
                Drinks: 0,
                Smiles: 0
            },

            Currency: {
                Yen: 100,
                Tofu: 0
            },

            RateLimits: {
                Rest_Rate: {
                    Date: 1627710691,
                    Amount: 0
                },
                Fluff_Rate: {
                    Date: 1627710691,
                    Amount: 0
                },
                Pat_Rate: {
                    Date: 1627710691,
                    Amount: 0
                },
                Step_Rate: {
                    Date: 1627710691,
                    Amount: 0
                },
                Hug_Rate: {
                    Date: 1627710691,
                    Amount: 0
                },
                Sleep_Rate: {
                    Date: 1627710691,
                    Amount: 0
                },
                Drink_Rate: {
                    Date: 1627710691,
                    Amount: 0
                },
                Smile_Rate: {
                    Date: 1627710691,
                    Amount: 0
                },
                Eat_Rate: {
                    Date: 1627710691,
                    Amount: 0
                }
            },

            Rewards: {
                Daily: 1627710691,
                Weekly: 1627710691,
                Work: 1627710691
            },

            Inventory: [],
            Achievements: [],
            ActivePowers: [],
            Claimables: []
        };

        if (AccountData.Inventory) DataStructure.Inventory.push(...AccountData.Inventory);
        if (AccountData.Achievements) DataStructure.Achievements.push(...AccountData.Achievements);
        if (AccountData.ActivePowers) DataStructure.ActivePowers.push(...AccountData.ActivePowers);

        if (AccountData.LocalUser) {
            if (AccountData.LocalUser.Banner) {
                DataStructure.LocalUser.Banner = AccountData.LocalUser.Banner;
            } else {
                DataStructure.LocalUser.Banner = "DefaultBanner.png";
            }

            if (AccountData.LocalUser.badges) DataStructure.LocalUser.badges.push(...AccountData.LocalUser.badges);

            if (AccountData.LocalUser.config) {
                if (AccountData.LocalUser.config.color !== null) DataStructure.LocalUser.config.color = AccountData.LocalUser.config.color;

                if (AccountData.LocalUser.config.flags) {
                    DataStructure.LocalUser.config.flags = AccountData.LocalUser.config.flags;
                } else {
                    DataStructure.LocalUser.config.flags = new Bitfield(100).toHex();
                }

                if (AccountData.LocalUser.config.title) {
                    DataStructure.LocalUser.config.title = AccountData.LocalUser.config.title;
                } else {
                    DataStructure.LocalUser.config.title = null;
                }
            } else {
                DataStructure.LocalUser.config.color = "#FF9933";
                DataStructure.LocalUser.config.flags = new Bitfield(100).toHex();
                DataStructure.LocalUser.config.title = null;
            }
        }

        if (AccountData.Stats) {
            if (AccountData.Stats.Rests) DataStructure.Stats.Rests = AccountData.Stats.Rests;
            if (AccountData.Stats.Fluffs) DataStructure.Stats.Fluffs = AccountData.Stats.Fluffs;
            if (AccountData.Stats.Pats) DataStructure.Stats.Pats = AccountData.Stats.Pats;
            if (AccountData.Stats.Steps) DataStructure.Stats.Steps = AccountData.Stats.Steps;
            if (AccountData.Stats.Hugs) DataStructure.Stats.Hugs = AccountData.Stats.Hugs;
            if (AccountData.Stats.Sleeps) DataStructure.Stats.Sleeps = AccountData.Stats.Sleeps;
        }

        if (AccountData.Currency && AccountData.Currency.Yen) DataStructure.Currency.Yen = AccountData.Currency.Yen;

        if (AccountData.RateLimits) {
            if (AccountData.RateLimits.Rest_Rate) {
                if (AccountData.RateLimits.Rest_Rate.Date) DataStructure.RateLimits.Rest_Rate.Date = AccountData.RateLimits.Rest_Rate.Date;
                if (AccountData.RateLimits.Rest_Rate.Amount) DataStructure.RateLimits.Rest_Rate.Amount = AccountData.RateLimits.Rest_Rate.Amount;
            }

            if (AccountData.RateLimits.Pat_Rate) {
                if (AccountData.RateLimits.Pat_Rate.Date) DataStructure.RateLimits.Pat_Rate.Date = AccountData.RateLimits.Pat_Rate.Date;
                if (AccountData.RateLimits.Pat_Rate.Amount) DataStructure.RateLimits.Pat_Rate.Amount = AccountData.RateLimits.Pat_Rate.Amount;
            }

            if (AccountData.RateLimits.Fluff_Rate) {
                if (AccountData.RateLimits.Fluff_Rate.Date) DataStructure.RateLimits.Fluff_Rate.Date = AccountData.RateLimits.Fluff_Rate.Date;
                if (AccountData.RateLimits.Fluff_Rate.Amount) DataStructure.RateLimits.Fluff_Rate.Amount = AccountData.RateLimits.Fluff_Rate.Amount;
            }

            if (AccountData.RateLimits.Step_Rate) {
                if (AccountData.RateLimits.Step_Rate.Date) DataStructure.RateLimits.Step_Rate.Date = AccountData.RateLimits.Step_Rate.Date;
                if (AccountData.RateLimits.Step_Rate.Amount) DataStructure.RateLimits.Step_Rate.Amount = AccountData.RateLimits.Step_Rate.Amount;
            }

            if (AccountData.RateLimits.Hug_Rate) {
                if (AccountData.RateLimits.Hug_Rate.Date) DataStructure.RateLimits.Hug_Rate.Date = AccountData.RateLimits.Hug_Rate.Date;
                if (AccountData.RateLimits.Hug_Rate.Amount) DataStructure.RateLimits.Hug_Rate.Amount = AccountData.RateLimits.Hug_Rate.Amount;
            }

            if (AccountData.RateLimits.Sleep_Rate) {
                if (AccountData.RateLimits.Sleep_Rate.Date) DataStructure.RateLimits.Sleep_Rate.Date = AccountData.RateLimits.Sleep_Rate.Date;
                if (AccountData.RateLimits.Sleep_Rate.Amount) DataStructure.RateLimits.Sleep_Rate.Amount = AccountData.RateLimits.Sleep_Rate.Amount;
            }

            if (AccountData.RateLimits.Drink_Rate) {
                if (AccountData.RateLimits.Drink_Rate.Date) DataStructure.RateLimits.Drink_Rate.Date = AccountData.RateLimits.Drink_Rate.Date;
                if (AccountData.RateLimits.Drink_Rate.Amount) DataStructure.RateLimits.Drink_Rate.Amount = AccountData.RateLimits.Drink_Rate.Amount;
            }

            if (AccountData.RateLimits.Smile_Rate) {
                if (AccountData.RateLimits.Smile_Rate.Date) DataStructure.RateLimits.Smile_Rate.Date = AccountData.RateLimits.Smile_Rate.Date;
                if (AccountData.RateLimits.Smile_Rate.Amount) DataStructure.RateLimits.Smile_Rate.Amount = AccountData.RateLimits.Smile_Rate.Amount;
            }
        }

        if (AccountData.Rewards) {
            if (AccountData.Rewards.Daily) DataStructure.Rewards.Daily = AccountData.Rewards.Daily;
            if (AccountData.Rewards.Weekly) DataStructure.Rewards.Weekly = AccountData.Rewards.Weekly;
            if (AccountData.Rewards.Work) DataStructure.Rewards.Work = AccountData.Rewards.Work;
        }

        console.log("Done");

        return;
        // Firestore.collection("Users").doc(DataStructure.LocalUser.userID).update(DataStructure).then(() =>{
        //     console.log(`Finished ${DataStructure.LocalUser.userID}`);
        // }).catch(err => {
        //     throw new Error(`USER UPDATE: ${err}`);
        // });
    });
});