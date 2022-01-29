const Icons = require("../../Data/Icons.json");
const Achievements = require("../../Data/Achievements.json");
const Colors = require("../../Data/Palettes/Main.js");
const { addYen } = require("../v2/Currency.js");
const FirebaseAdmin = require("firebase-admin");
const Firestore = FirebaseAdmin.firestore();

const FirebaseFunctions = require("firebase-functions");


/**
 * @param {User} user
 * @param {String} ACHE
 * @deprecated literally dont use, its broken
 */
module.exports.awardAchievement = async function(user, ACHE) {
    let AwardEmbed = null;

    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (resolve, reject) => {
        const Achievement = Achievements[ACHE];

        const Document = Firestore.collection("Users").doc(user.id);
        const Data = await (await Document.get()).data().Achievements;
        if (Data.includes(ACHE)) return reject("Already has this achievement.");

        Data.push(ACHE);

        Document.update({
            Achievements: Data
        }).then(async () => {
            AwardEmbed = {
                title: `${Icons.package}  Senko-san gave you something!`,
                description: `I found __${Achievement.Name}__ at a store, and I had to give it to you!\n\nI hope you like it..!\n\n— ${Icons.medal}  __${Achievement.Name}__ achieved "${Achievement.Description}"`,
                color: Colors.light,
                thumbnail: {
                    url: "attachment://image.png"
                }
            };

            if (Achievement.YenReward) {
                await addYen(user, Achievement.YenReward);
                AwardEmbed.description += `\n— ${Icons.yen}  ${Achievement.YenReward}x gained`;
            }

        }).then(async () => {
            FirebaseFunctions.firestore.document(`Users/${user.id}`).onUpdate(event => {
                if (event.data().Achievements.includes(ACHE)) {
                    resolve();
                } else {
                    reject("Failed");
                }
            });
        });
    }).then(async () => {
        // await user.send({ embeds: [ AwardEmbed ], files: [ { attachment: "./src/Data/content/senko/senko_hat_tip.png", name: "image.png "}] });
    }).catch(console.log);
};