require("dotenv/config");

const { Client, Collection } = require("discord.js");

const Firebase = require("firebase-admin");
const { readdirSync } = require("fs");


const SenkoClient = new Client({
    intents: ["GUILDS", "GUILD_MEMBERS"],

    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: false
    }
});

require("discord-modal")(SenkoClient);

if (process.env.NIGHTLY === "true") {
    Firebase.initializeApp({
        credential: Firebase.credential.cert({
            "projectId": process.env.NIGHTLY_FIREBASE_PROJECT_ID,
            "private_key": process.env.NIGHTLY_FIREBASE_PRIVATE_KEY,
            "client_email": process.env.NIGHTLY_FIREBASE_CLIENT_EMAIL
        })
    });
    let { print } = require("./API/Master");

    SenkoClient.login(process.env.NIGHTLY_TOKEN);

    print("#FF6633", "Senko", "NIGHTLY Mode");
} else {
    Firebase.initializeApp({
        credential: Firebase.credential.cert({
            "projectId": process.env.FIREBASE_PROJECT_ID,
            "private_key": process.env.FIREBASE_PRIVATE_KEY,
            "client_email": process.env.FIREBASE_CLIENT_EMAIL
        })
    });
    let { print } = require("./API/Master");

    SenkoClient.login(process.env.TOKEN);

    print("#5865F2", "Senko", "PRODUCTION Mode");
}

const { print } = require("./API/Master");

// SenkoClient.Commands = new Collection();
// SenkoClient.Aliases = new Collection();
SenkoClient.SlashCommands = new Collection();
SenkoClient.colors = require("./Data/Palettes/Main.js");

process.SenkoClient = SenkoClient;

process.on("unhandledRejection",async(reason)=>{console.log(reason);});


// ButtonInteraction.__custom = {
//     shop_id: null
// };

// Reflect.defineProperty(MessageComponentInteraction.prototype, "property", {
//     shop_id: null
// });

// Message.prototype.custom_data = {
//     shop_data: {}
// };

SenkoClient.once("ready", async () => {
    print("#FF6633", "Senko", "Started\n");

    let commands = SenkoClient.application.commands;
    // return commands.set([]);
    if (process.env.NIGHTLY === "true") commands = SenkoClient.guilds.cache.get("777251087592718336").commands;

    // return commands.set([]);

    const commandsToSet = [];

    async function setCommands() {
        if (process.env.NIGHTLY !== "true") {
            readdirSync("./src/Interactions/").forEach(async Folder => {
                const Interactions = readdirSync(`./src/Interactions/${Folder}/`).filter(f =>f .endsWith(".js"));

                for (let interact of Interactions) {
                    let pull = require(`./Interactions/${Folder}/${interact}`);

                    // if (pull.name !== "buy") {
                        SenkoClient.SlashCommands.set(`${pull.name}`, pull);
                    // }
                }
            });
        }

        if (process.env.NIGHTLY === "true") {
            for (var file of readdirSync("./src/DevInteractions/")) {
                const pull = require(`./DevInteractions/${file}`);

                SenkoClient.SlashCommands.set(`${pull.name}`, pull);
            }
        }

    }

    await setCommands();

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

    await commands.set(commandsToSet).then(async commandList => {
        commandList.forEach(async command => {
            const fCmd = await commandsToSet.find(cmd => cmd.name === command.name);

            if (fCmd.permissions) {
                let permissions  = fCmd.permissions;
                command.permissions.add({ permissions });
                console.log(`Added permissions to ${command.name}`);
            }
        });
    });

    console.log("Commands Ready");

    for (let file of readdirSync("./src/Events/").filter(file => file.endsWith(".js"))) {
        require(`./Events/${file}`).execute(SenkoClient);
        // print("#FFFB00", "EVENTS", `Running ${file}`);
    }

    console.log("Events Ready");
});
