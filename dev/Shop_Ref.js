/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");

const Firebase = require("firebase-admin");
const Firestore = Firebase.firestore();
const shopDoc = Firestore.collection("config").doc("shop");

const Shop_List = require("../src/Data/Shop/Items.json");
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

                const pull = require("../src/Interactions/Shop/Buy.js");

                SenkoClient.SlashCommands.set(`${pull.name}`, pull);

                let commandsToSet = [];

                async function setTheCommands() {
                    for (var cmd of SenkoClient.SlashCommands) {

                        const CommandData = {
                            name: `${cmd[0]}`,
                            description: `${cmd[1].desc}`,
                            defaultPermission: typeof cmd[1].defaultPermission === "boolean" ? cmd[1].defaultPermission : true,
                        };

                        if (cmd[1].options) CommandData.options = cmd[1].options;
                        if (cmd[1].permissions) CommandData.permissions = cmd[1].permissions;

                        if (!commandsToSet.includes(cmd[0])) commandsToSet.push(CommandData);
                    }
                }

                await setTheCommands();
                await SenkoClient.application.commands.set(commandsToSet);
                console.log("Updated buy");
            });
        });
    }
};