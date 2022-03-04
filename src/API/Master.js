// eslint-disable-next-line no-unused-vars
const { User, Guild, Interaction, Permissions } = require("discord.js");
const chalk = require("chalk");
const config = require("../Data/DataConfig.json");

const FirebaseAdmin = require("firebase-admin");
const DataBase = FirebaseAdmin.firestore();

const UserStore = DataBase.collection("Users");
const GuildStore = DataBase.collection("Guilds");

const DataConfig = config;
const { Bitfield } = require("bitfields");


/**
 * @param {String} Color
 * @param {String} Type
 * @param {String} content
 */
function print(Color, Type, content) {
    console.log(`[${chalk.hex(Color || "#252525").underline(Type)}]: ${content}`);
}

/**
 * @param {Number} time
 */
function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * @param {Array} Array
 * @param {String} item
 */
function spliceArray(Array, item) {
    return Array.splice(Array.indexOf(item), 1);
}

/**
 * @param {String} string
 */
function stringEndsWithS(string) {
    return string.endsWith("s") ? `${string}'` : `${string}'s`;
}

/**
 * @param {Interaction} interaction
 */
function getName(interaction) {
    return interaction.member.nickname || interaction.member.user.username;
}

/**
 * @param {User} User
 */
async function createUser(User) {
    await UserStore.doc(User.id).set({
        LocalUser: {
            user: null,
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
        this.print("#FF0000", "DATA ERROR", `Could not make USER data \n\n— ${err}`);
    });
}

/**
 * @param {User} user
 * @param {Number} returnType
 */
async function fetchData(user, returnType) {
    let Fetched = user.user || user;

    const UD = UserStore.doc(Fetched.id);
    let UserData = await UD.get().catch(err => {
        throw new Error(`USER DATA FETCH: ${err}`);
    });

    if (!UserData.exists && returnType === 1) return 0;

    if (!UserData.exists) await createUser(Fetched);

    while (!UserData.exists) {
        UserData = await UD.get();
    }

    return UserData.data();
}

/**
 * @param {User} User
 * @param {JSON} Data
 * @param {Number} merge
 */
 async function updateUser(User, Data, Merge) {
    const UD = UserStore.doc(User.id);

    let UserData = await UD.get();
    if (!UserData.exists) await createUser(User);

    if (!Merge) {
        UserStore.doc(User.id).set(Data, { merge: true }).catch(err => {
            throw new Error(`USER UPDATE: ${err}`);
        });
    } else {
        UserStore.doc(User.id).update(Data).catch(err => {
            throw new Error(`USER UPDATE: ${err}`);
        });
    }

    return true;
}

/**
 * @param {Guild} Guild
 */
async function createGuild(Guild) {
    await GuildStore.doc(Guild.id).set({
        ID: Guild.id,
        flags: new Bitfield(50).toHex(),
        WelcomeChannel: {
            id: null,
            message: ""
        },
        Channels: []
    }).catch(err => {
        this.print("#FF0000", "DATA ERROR", `Could not make GUILD data \n\n— ${err}`);
    });
}

/**
 * @param {Guild} Guild
 */
async function fetchGuild(Guild) {
    try {
        const GD = DataBase.collection("Guilds").doc(Guild.id);

        let GuildData = await GD.get().catch(err => {
            throw new Error(`GUILD FETCH: ${err}`);
        });

        if (!GuildData.exists) await createGuild(Guild);

        while (!GuildData.exists) {
            GuildData = await GD.get();
        }

        return GuildData.data();
    } catch(err) {
        console.error(`Guild Fetch Error: ${err}`);
    }
}

/**
 * @param {Guild} Guild
 */
async function deleteGuild(Guild) {
    await GuildStore.doc(Guild.id).delete();

    print("#FFFFF1", "GUILD", "Left and removed guild data");
}

/**
 * @param {Guild} Guild
 * @param {JSON} Data
 */
async function updateGuild(Guild, Data) {
    await fetchGuild(Guild);
    GuildStore.doc(Guild.id).set(Data, { merge: true }).catch(err => {
        throw new Error(`GUILD UPDATE: ${err}`);
    });
}

/**
 * @param {User} message.author
 * @param {Number} amount
 */
async function addYen(user, amount) {
    let Data = await fetchData(user);

    updateUser(user, {
        Currency: {
            Yen: Data.Currency.Yen + (amount * config.multiplier)
        }
    });
}

/**
 * @param {User} user
 * @param {Number} amount
 */
async function removeYen(user, amount) {
    let Data = await fetchData(user);

    updateUser(user, {
        Currency: {
            Yen: Data.Currency.Yen - amount
        }
    });
}

/**
 * @param {Interaction} interaction
 * @param {String} Permission
 */
function hasPerm(interaction, Permission) {
    if (interaction.member.permissions.has(Permission)) return true;
    return false;
}

/**
 * @param {Interaction} interaction
 * @param {String} Permission
 * @param {Number} ClientID
 */
function selfPerm(interaction, Permission, ClientID) {
    if (interaction.guild.members.cache.get((ClientID ? ClientID : process.SenkoClient.user.id)).permissions.has(Permission)) return true;
    return false;
}

/**
 * @param {Interaction} interaction
 * @returns String
 */
function getName(interaction) {
    return interaction.member.nickname || interaction.member.user.username;
}

/**
 * @param {Interaction} interaction
 * @param {String} Permission
 * @param {User} User
 */
async function CheckPermission(interaction, Permission, User) {
    let perms = interaction.channel.permissionsFor(User, Permission);
    const bitPermissions = new Permissions(perms.bitfield);
    const Result = bitPermissions.has([Permissions.FLAGS[Permission]]);

    if (Result) return true;
    return false;
}


module.exports = {
    print,
    wait,
    spliceArray,
    stringEndsWithS,
    createUser,
    createGuild,
    deleteGuild,
    updateUser,
    addYen,
    removeYen,
    hasPerm,
    selfPerm,
    getName,
    CheckPermission,
    fetchData,
    fetchGuild,
    updateGuild
};