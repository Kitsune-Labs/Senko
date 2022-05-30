// eslint-disable-next-line no-unused-vars
const { User, Guild, Interaction, Permissions } = require("discord.js");
// const chalk = require("chalk");
const config = require("../Data/DataConfig.json");
const Icons = require("../Data/Icons.json");

const FirebaseAdmin = require("firebase-admin");
const DataBase = FirebaseAdmin.firestore();

const UserStore = DataBase.collection("Users");
const Achievements = require("../Data/Achievements.json");

// const DataConfig = config;
const { Bitfield } = require("bitfields");
// const { updateSuperUser } = require("./super");
const bits = require("./Bits.json");
const { randomArrayItem: randomArray, randomNumber, wait, spliceArray } = require("@kitsune-softworks/utilities");
const chalk = require("@kitsune-softworks/chalk-node");

/**
 * @param {String} Color
 * @param {String} Type
 * @param {String} content
 */
function print(Color, Type, content) {
    console.log(`[${chalk.hex(Color || "#252525").underline(Type)}]: ${content}`);
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
            userID: User.id,
            Banner: "DefaultBanner.png",
            badges: [],
            AboutMe: null,
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
        ActivePowers: [],
        Rank: {
            XP: 0,
            Level: 1
        }
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
    // return await updateSuperUser(User, Data);

    const UD = UserStore.doc(User.id);

    let UserData = await UD.get();
    if (!UserData.exists) await createUser(User);

    if (Data.Currency) {
        if (UserData.data().Currency.Yen > 100000) {
            Data.Currency.Yen = 100000; // 99998
        }

        if (UserData.data().Currency.Tofu > 50) {
            Data.Currency.Tofu = 50;
        }
    }

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
 * @param {String} Permission
 */
async function CheckPermission(interaction, Permission) {
    let perms = interaction.channel.permissionsFor(interaction.user, Permission);
    const bitPermissions = new Permissions(perms.bitfield);
    const Result = bitPermissions.has([Permissions.FLAGS[Permission]]);

    if (Result) return true;
    return false;
}


async function rateLimitCoolDown(interaction, RateLimits, Stat) {
    const TimeStamp = Date.now();

    if (!config.cooldowns.daily - (TimeStamp - RateLimits[Stat].Date) >= 0) {
        await updateUser(interaction.user, {
            RateLimits: {
                [Stat]: {
                    Amount: 0,
                    Date: TimeStamp
                }
            }
        });

        RateLimits[Stat].Amount = 0;
        return {
            maxed: false,
            current: RateLimits[Stat].Amount,
            TimeStamp: TimeStamp
        };
    }

    return {
        maxed: true,
        current: RateLimits[Stat].Amount,
        TimeStamp: TimeStamp
    };
}

async function addStats(interaction, CurrentStats, Stat) {
    await updateUser(interaction.user, {
        RateLimits: {
            [Stat]: {
                Amount: CurrentStats.Amount++,
                Date: Date.now()
            }
        }
    });
}

function randomBummedImageName() {
    const Images = [
        "huh",
        "senko_think"
    ];

    return randomArray(Images);
}

function clean(Content) {
    return Content.toString().replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
}

const Characters = ["\"","'","\\","/","!","~","`","_","-","|","{","}","[","]",";",":",">","<",",",".","=","+","*","\n"];

function strip(Content) {
    for (var char of Characters) {
        Content = Content.replaceAll(char, "");
    }
    return Content;
}

async function disableComponents(interaction) {
    for (var component of interaction.message.components[0].components) {
        component.disabled = true;
    }

    interaction.channel.messages.cache.get(interaction.message.id).edit({
        components: interaction.message.components
    });
}

function calcTimeLeft(LastDate, Cooldown) {
    return Date.now() - LastDate > Cooldown;
}

function insertString(firstString, index, string) {
    if (index > 0) return firstString.substring(0, index) + string + firstString.substr(index);
    return string + firstString;
}


/**
 * @param {Interaction} interaction
 * @param {String} AchievementName
 * @returns {Boolean}
 */
async function awardAchievement(interaction, AchievementName) {
    await wait(300);

    new Promise(async (resolve, reject) => {
        const userData = await fetchData(interaction.user);

        if (userData.Achievements.includes(AchievementName) || !Object.keys(Achievements).at(AchievementName)) return reject(false);

        const userFlags = Bitfield.fromHex(userData.LocalUser.config.flags);
        const Achievement = Achievements[AchievementName];

        const messageStruct = {
            content: `${interaction.user}`,
            embeds: [
                {
                    title: `${Icons.medal}  Achievement Gained!`,
                    description: `**${Achievement.name}**\n\n${Achievement.description}`,
                    color: Achievement.color || "ORANGE"
                }
            ]
        };

        const data = {
            Achievements: [...userData.Achievements, AchievementName]
        };


        if (Achievement.yenReward) {
            data.Currency = {
                Yen: userData.Currency.Yen + Achievement.yenReward
            };

            messageStruct.embeds[0].description += `\n\n— ${Icons.yen}  ${Achievement.yenReward} rewarded`;
        }


        updateUser(interaction.user, data);


        if (userFlags.get(bits.DMAchievements)) {
            interaction.user.send(messageStruct);
        } else {
            interaction.channel.send(messageStruct);
        }

        return resolve(true);
    });
}

module.exports = {
    print,
    wait,
    spliceArray,
    stringEndsWithS,
    createUser,
    updateUser,
    addYen,
    removeYen,
    hasPerm,
    selfPerm,
    getName,
    CheckPermission,
    fetchData,
    rateLimitCoolDown,
    addStats,
    randomNumber,
    randomBummedImageName,
    randomArray,
    clean,
    strip,
    disableComponents,
    calcTimeLeft,
    insertString,
    awardAchievement
};