require("dotenv/config");

const { Client, Collection } = require("discord.js");

const Firebase = require("firebase-admin");
const { readdirSync } = require("fs");
const { print } = require("./API/dev/functions");

const SenkoClient = new Client({
    intents: ["GUILDS"],

    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: false
    }
});

if (process.env.NIGHTLY === "true") {
    Firebase.initializeApp({
        credential: Firebase.credential.cert({
            "projectId": process.env.NIGHTLY_FIREBASE_PROJECT_ID,
            "private_key": process.env.NIGHTLY_FIREBASE_PRIVATE_KEY,
            "client_email": process.env.NIGHTLY_FIREBASE_CLIENT_EMAIL
        })
    });

    SenkoClient.login(process.env.BETA_TOKEN);

    print("#FF6633", "Senko", "BETA Mode");
} else {
    Firebase.initializeApp({
        credential: Firebase.credential.cert({
            "projectId": process.env.FIREBASE_PROJECT_ID,
            "private_key": process.env.FIREBASE_PRIVATE_KEY,
            "client_email": process.env.FIREBASE_CLIENT_EMAIL
        })
    });

    SenkoClient.login(process.env.TOKEN);

    print("#5865F2", "Senko", "PRODUCTION Mode");
}

SenkoClient.Commands = new Collection();
SenkoClient.Aliases = new Collection();
SenkoClient.SlashCommands = new Collection();
SenkoClient.colors = require("./Data/Palettes/Main.js");

process.SenkoClient = SenkoClient;

process.on("unhandledRejection",async(reason)=>{console.log(reason);});

SenkoClient.once("ready", async () => {
    print("#FF6633", "Senko", "Started\n");

    for (let file of readdirSync("./src/Events/").filter(file => file.endsWith(".js"))) {
        require(`./Events/${file}`).execute(SenkoClient);
        print("#FFFB00", "EVENTS", `Running ${file}`);
    }

    let commands = SenkoClient.application.commands;

    // Used for debugging specific guilds that break for some reason (rarely gets used)
    // commands = SenkoClient.guilds.cache.get("000000000000").commands;

    if (process.env.NIGHTLY === "true") commands = SenkoClient.guilds.cache.get("887393173150777357").commands;

    await commands.set([]);

    // readdirSync("./src/Interactions/").forEach(async Folder => {
    //     const Interactions = readdirSync(`./src/Interactions/${Folder}/`).filter(f =>f .endsWith(".js"));

    //     for (let interact of Interactions) {
    //         let pull = require(`./Interactions/${Folder}/${interact}`);
    //         SenkoClient.SlashCommands.set(pull.name, pull);
    //     }
    // });

    readdirSync("./src/Interactions/").forEach(async Folder => {
        const Interactions = readdirSync(`./src/Interactions/${Folder}/`).filter(f =>f .endsWith(".js"));
        if (process.env.NIGHTLY === "true") return;

        for (let interact of Interactions) {
            let pull = require(`./Interactions/${Folder}/${interact}`);

            try {
                const CommandData = {
                    name: pull.name,
                    description: pull.desc || "No description",
                };

                // if (process.env.NIGHTLY === "true") CommandData.name = `dev-${pull.name}`;
                if (pull.options) CommandData.options = pull.options;

                await SenkoClient.SlashCommands.set(pull.name, pull);

                await commands.create(CommandData);
                print("#77FF2B", "SETUP", `Running ${pull.name}`);
            } catch(e) {
                print("#FF5454", "ERROR", `${interact} - ${e}`);
                console.log(e);
            }
        }
    });
});