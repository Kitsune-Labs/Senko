/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");

const Firebase = require("firebase-admin");
const Firestore = Firebase.firestore();
const shopDoc = Firestore.collection("config").doc("shop");

const Shop_List = require("../Data/Shop/Items.json");
const fs = require("fs");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    execute: async (SenkoClient) => {
        shopDoc.onSnapshot(async (snapshot) => {
            const Data = snapshot.data();

            new Promise((resolve, reject) => {
                for (var index in Shop_List) {
                    var shItem = Shop_List[index];
                    shItem.onsale = false;
                }

                fs.writeFileSync("./src/Data/Shop/Items.json", JSON.stringify(Shop_List, null, 2));

                resolve();
            }).then(async () => {
                for (var NewItem of Data.Items) Shop_List[NewItem].onsale = true;

                fs.writeFileSync("./src/Data/Shop/Items.json", JSON.stringify(Shop_List, null, 2));

                const pull = require("../Interactions/Shop/Buy.js");

                SenkoClient.SlashCommands.set(`${pull.name}`, pull);

                const CommandData = {
                    name: `${pull.name}`,
                    description: `${pull.desc}`,
                    options: pull.options
                };

                let idRemove = null;

                // if (idRemove) {
                //     SenkoClient.guilds.cache.get("777251087592718336").commands.edit(idRemove, CommandData);
                // } else {
                    SenkoClient.application.commands.set([CommandData]);//.then(async data => {
                //         idRemove = data.id;

                //         console.log(data.entries);
                //     });
                // }

                console.log("Updated buy");
            });
        });
    }
};