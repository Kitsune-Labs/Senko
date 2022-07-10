require("dotenv/config");

const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");

const SenkoClient = new Client({
	intents: ["GUILDS", "GUILD_BANS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],

	allowedMentions: {
		parse: ["users", "roles"],
		repliedUser: false
	},
	restRequestTimeout: 60000,
	userAgentSuffix: [`Kitsune-Labs/Senko (v${require("../package.json").version})`]
});

SenkoClient.setMaxListeners(20);

if (process.env.NIGHTLY === "true") {
	SenkoClient.login(process.env.NIGHTLY_TOKEN);

	require("./API/Master").print("#FF6633", "SENKO", "NIGHTLY Mode");
} else {
	SenkoClient.login(process.env.TOKEN);

	require("./API/Master").print("#5865F2", "SENKO", "PRODUCTION Mode");
}

const { print } = require("./API/Master");

SenkoClient.SlashCommands = new Collection();
SenkoClient.colors = require("./Data/Palettes/Main.js");

Reflect.set(SenkoClient, "tools", {
	UserAgent: `${require("discord.js/src/util/Constants").UserAgent} (Kitsune-Labs/Senko, v${require("../package.json").version})`,
	colors: require("./Data/Palettes/Main.js")
});

// print("#5865F2", "UserAgent", SenkoClient.tools.UserAgent);

process.SenkoClient = SenkoClient;

process.on("unhandledRejection", async(reason)=>{
	console.log(reason);
});

SenkoClient.once("ready", async () => {
	print("#FF6633", "Senko", "Started\n");

	let commands = SenkoClient.application.commands;
	// return commands.set([]);
	if (process.env.NIGHTLY === "true") commands = SenkoClient.guilds.cache.get("777251087592718336").commands;

	// return commands.set([]);


	for (let file of readdirSync("./src/Events/").filter(file => file.endsWith(".js"))) {
		require(`./Events/${file}`).execute(SenkoClient);
	}

	print("#FFFB00", "EVENTS", "Ready");

	if (process.env.NIGHTLY !== "true") {
		for (let file of readdirSync("./src/SenkosWorld/")) {
			const pull = require(`./SenkosWorld/${file}`);

			const commandData = {
				name: pull.name,
				description: pull.desc
			};

			if (pull.options) commandData.options = pull.options;

			SenkoClient.SlashCommands.set(pull.name, pull);
			// await SenkoClient.guilds.cache.get("777251087592718336").commands.set([]);
			await SenkoClient.guilds.cache.get("777251087592718336").commands.set([ commandData ]);
		}

		print("#FFFB00", "Senko's_World!", "Ready");
	}

	const commandsToSet = [];

	if (process.env.NIGHTLY !== "true") {
		readdirSync("./src/Interactions/").forEach(async Folder => {
			const Interactions = readdirSync(`./src/Interactions/${Folder}/`).filter(f =>f .endsWith(".js"));

			for (let interact of Interactions) {
				let pull = require(`./Interactions/${Folder}/${interact}`);

				SenkoClient.SlashCommands.set(`${pull.name}`, pull);
			}
		});
	} else {
		print("#FF6633", "SENKO", "Development mode is enabled, no regular interactions will be loaded.");

		for (var file of readdirSync("./src/DevInteractions/")) {
			const pull = require(`./DevInteractions/${file}`);
			SenkoClient.SlashCommands.set(`${pull.name}`, pull);
		}
	}

	for (var cmd of SenkoClient.SlashCommands) {
		if (cmd[0] !== "display" || cmd[0] !== "award") {
			const commandStruct = {
				name: `${cmd[0]}`,
				description: `${cmd[1].desc}`,
				dm_permission: false
			};

			if (cmd[1].options) commandStruct.options = cmd[1].options;
			if (!commandsToSet.includes(cmd[0])) commandsToSet.push(commandStruct);
		}
	}

	// await commands.set([]);
	await commands.set(commandsToSet);

	print("#F39800", "INTERACTIONS", "Ready");
});
