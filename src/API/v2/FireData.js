const Master = require("../Master.js");


const FirebaseAdmin = require("firebase-admin");
const DataBase = FirebaseAdmin.firestore();
const UserStore = DataBase.collection("Users");
const GuildStore = DataBase.collection("Guilds");

/**
 * @param {User} User
 * @deprecated
 */
async function newUser(User) {
    await Master.createUser(User);
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
 * @param {User} User
 * @param {JSON} Data
 * @param {Number} merge
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

/**
 * @deprecated
 */
async function makeGuild(Guild) {
    await Master.makeGuild(Guild);
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