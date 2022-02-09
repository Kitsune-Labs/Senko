const FirebaseAdmin = require("firebase-admin");
const DataBase = FirebaseAdmin.firestore();

const UserStore = DataBase.collection("Users");
const GuildStore = DataBase.collection("Guilds");

const DataConfig = require("../../Data/DataConfig.json");
const uuid = require("uuid");
const { Bitfield } = require("bitfields");

/**
 * @param {User} User
 */
async function newUser(User) {
    await UserStore.doc(User.id).set({
        LocalUser: {
            user: `User_${uuid.v4()}`.slice(0, 13),
            version: DataConfig.currentVersion,
            userID: User.id,
            Banner: "DefaultBanner.png",
            badges: [],
            config: {
                language: "en-us",
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
            Drink_Rate: {
                Date: 1627710691,
                Amount: 0
            },
            Sleep_Rate: {
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
            Daily: 1627604493201,
            Weekly: 1627604493201,
            Work: 1627604493201
        },

        Inventory: [],
        Achievements: [],
        ActivePowers: []
    }).catch(err => {
        throw new Error(`USER CREATION: ${err}`);
    });
}

/**
 * @param user - message.author
 * @deprecated
 */
async function getData(user, returnType) {
    let Fetched = user.user ? user.user : user;

    const UD = UserStore.doc(Fetched.id);
    let UserData = await UD.get().catch(err => {
        throw new Error(`USER DATA FETCH: ${err}`);
    });

    if (!UserData.exists && returnType === 1) return 0;

    if (!UserData.exists) await newUser(Fetched);

    while (!UserData.exists) {
        UserData = await UD.get();
    }

    return UserData.data();
}

/**
 * @param User - message.author
 * @param Data - What to update (JSON)
 * @deprecated
 */
async function updateUser(User, Data, Merge) {
    let Fetched = User;

    const UD = UserStore.doc(Fetched.id);

    let UserData = await UD.get();
    if (!UserData.exists) await newUser(Fetched);

    if (!Merge) {
        UserStore.doc(Fetched.id).set(Data, { merge: true }).catch(err => {
            throw new Error(`USER UPDATE: ${err}`);
        });
    } else {
        UserStore.doc(Fetched.id).update(Data).catch(err => {
            throw new Error(`USER UPDATE: ${err}`);
        });
    }

    return true;
}

async function makeGuild(Guild) {
    await GuildStore.doc(Guild.id).set({
        ID: Guild.id,
        flags: new Bitfield(50).toHex(),
        WelcomeChannel: {
            id: null,
            message: ""
        },
        Channels: []
    }).catch(err => {
        throw new Error(`GUILD CREATION: ${err}`);
    });
}

/**
 * @deprecated
 */
async function getGuild(Guild) {
    try {
        if (!Guild) throw new Error("GUILD FETCH: No guild was given!");

        const GD = DataBase.collection("Guilds").doc(Guild.id);

        let GuildData = await GD.get().catch(err => {
            throw new Error(`GUILD FETCH: ${err}`);
        });

        if (!GuildData.exists) await makeGuild(Guild);

        while (!GuildData.exists) {
            GuildData = await GD.get();
        }

        return GuildData.data();
    } catch(err) {
        console.error(`Guild Fetch Error: ${err}`);
    }
}

async function updateGuild(Guild, Data){
    await getGuild(Guild);
    GuildStore.doc(Guild.id).set(Data, { merge: true }).catch(err => {
        throw new Error(`GUILD UPDATE: ${err}`);
    });
}

module.exports = { newUser, getData, updateUser, makeGuild, getGuild, updateGuild };