const FirebaseAdmin = require("firebase-admin");
const { newUser } = require("../v2/FireData");
const DataBase = FirebaseAdmin.firestore();

const UserStore = DataBase.collection("Users");
const GuildStore = DataBase.collection("Guilds");


/**
 *
 * @param {CommandInteraction} interaction
 */
async function update(interaction, Data, Merge) {
    const RawData = UserStore.doc(interaction.user.id);
    let FB_DATA = await RawData.get();
    if (!FB_DATA.exists) await newUser(interaction.user);

    if (!Merge) {
        UserStore.doc(interaction.user.id).set(Data, { merge: true }).catch(() => {
            return false && interaction.reply({
                content: "An error occurred with updating your data.",
                ephemeral: true
            });
        });
    } else {
        UserStore.doc(interaction.user.id).update(Data).catch(() => {
            return false && interaction.reply({
                content: "An error occurred with updating your data.",
                ephemeral: true
            });
        });
    }
}

/**
 * @param {CommandInteraction} interaction
 * @returns Data
 */
async function getNewData(interaction, NoDataCheck) {
    const RawData = UserStore.doc(interaction.user.id);

    let FB_DATA = await RawData.get();

    if (!FB_DATA.exists && NoDataCheck === true) return "nodata";

    if (!FB_DATA.exists) {
        await newUser(interaction.user);

        FB_DATA = await RawData.get();
        return FB_DATA.data();
    }

    return FB_DATA.data();
}

async function deleteGuild(Guild) {
    return GuildStore.doc(Guild.id).delete();
}

module.exports = { getNewData, update, deleteGuild };