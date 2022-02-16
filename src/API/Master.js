// eslint-disable-next-line no-unused-vars
const { User, Guild, Interaction, Permissions } = require("discord.js");
const chalk = require("chalk");
const config = require("../Data/DataConfig.json");


const { getData, updateUser } = require("./v2/FireData.js");


const FirebaseAdmin = require("firebase-admin");
const DataBase = FirebaseAdmin.firestore();

const UserStore = DataBase.collection("Users");
const GuildStore = DataBase.collection("Guilds");

const DataConfig = config;
const uuid = require("uuid");
const {
    Bitfield
} = require("bitfields");


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
 * @param {User} User
 */
async function createUser(User) {
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
        this.print("#FF0000", "DATA ERROR", `Could not make USER data \n\n— ${err}`);
    });
}

/**
 * @param {Guild} Guild
 */
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
        this.print("#FF0000", "DATA ERROR", `Could not make GUILD data \n\n— ${err}`);
    });
}

/**
 * @param {Guild} Guild
 */
async function deleteGuild(Guild) {
    await GuildStore.doc(Guild.id).delete();

    this.print("#FFFFF1", "GUILD", "Left and removed guild data");
}

/**
 * @param {User} message.author
 * @param {Number} amount
 */
async function addYen(user, amount) {
    let Data = await getData(user);

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
    let Data = await getData(user);

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
    makeGuild,
    deleteGuild,
    addYen,
    removeYen,
    hasPerm,
    selfPerm,
    getName,
    CheckPermission
};