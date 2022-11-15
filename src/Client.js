require("dotenv/config");
const { print, error, fatal } = require("@kitsune-labs/utilities");

const { Client, Collection, PermissionsBitField, GatewayIntentBits: gIntents } = require("discord.js");
const { readdirSync } = require("fs");

const SenkoClient = new Client({
	intents: [gIntents.MessageContent, gIntents.GuildMessages, gIntents.Guilds, gIntents.GuildBans, gIntents.GuildMembers],

	allowedMentions: {
		parse: ["users", "roles", "everyone"],
		repliedUser: false
	},
	restRequestTimeout: 100000,
	userAgentSuffix: [`Kitsune-Labs/Senko (v${require("../package.json").version})`]
});

SenkoClient.setMaxListeners(20);

if (process.env.NIGHTLY === "true") {
	SenkoClient.login(process.env.NIGHTLY_TOKEN);

	print("SENKO", "NIGHTLY Mode");
} else {
	SenkoClient.login(process.env.TOKEN);

	print("SENKO", "PRODUCTION Mode");
}

Reflect.set(SenkoClient, "tools", {
	UserAgent: `${require("discord.js/src/util/Constants").UserAgent} (Kitsune-Labs/Senko, v${require("../package.json").version})`,
	colors: require("./Data/Palettes/Main.js")
});

Reflect.set(SenkoClient, "api", {
	Commands: new Collection(),

	UserAgent: `${require("discord.js/src/util/Constants").UserAgent} (Kitsune-Labs/Senko, v${require("../package.json").version})`,
	Theme: require("./Data/Palettes/Main.js")
});

print("UserAgent", SenkoClient.tools.UserAgent);

process.SenkoClient = SenkoClient;

process.on("unhandledRejection", async(reason)=>{
	error(reason);
});

process.on("uncaughtException", async(reason)=>{
	fatal(reason);
});

SenkoClient.once("ready", async () => {
	print("#FF6633", "Senko", "Started\n");

	let commands = SenkoClient.application.commands;
	if (process.env.NIGHTLY === "true") commands = SenkoClient.guilds.cache.get("777251087592718336").commands;

	// return commands.set([]);


	for (let file of readdirSync("./src/Events/").filter(file => file.endsWith(".js"))) {
		require(`./Events/${file}`).execute(SenkoClient);
	}

	print("#FFFB00", "EVENTS", "Ready");

	const commandsToSet = [];

	if (process.env.NIGHTLY !== "true") {
		readdirSync("./src/Interactions/").forEach(async Folder => {
			const Interactions = readdirSync(`./src/Interactions/${Folder}/`).filter(f =>f .endsWith(".js"));

			for (let interact of Interactions) {
				let pull = require(`./Interactions/${Folder}/${interact}`);

				SenkoClient.api.Commands.set(`${pull.name}`, pull);
			}
		});
	} else {
		print("#FF6633", "SENKO", "Development mode is enabled, no regular interactions will be loaded.");

		for (var file of readdirSync("./src/DevInteractions/")) {
			const pull = require(`./DevInteractions/${file}`);
			SenkoClient.api.Commands.set(`${pull.name}`, pull);
		}
	}

	for (var cmd of SenkoClient.api.Commands) {
		if (!cmd[1].noGlobal || cmd[1].noGlobal === false) {
			const commandStruct = {
				name: `${cmd[0]}`,
				description: `${cmd[1].desc}`,
				dm_permission: false
			};

			if (cmd[1].options) commandStruct.options = cmd[1].options;
			if (cmd[1].permissions) commandStruct.defaultMemberPermissions = new PermissionsBitField(cmd[1].permissions);
			if (!commandsToSet.includes(cmd[0])) commandsToSet.push(commandStruct);
		}
	}

	await commands.set(commandsToSet).then(cmds => {
		Reflect.set(SenkoClient.application.commands, "fetchAll", cmds);

		print("#F39800", "INTERACTIONS", "Ready");
	});


	if (process.env.NIGHTLY !== "true") {
		const devTools = [];
		for (let file of readdirSync("./src/SenkosWorld/")) {
			const pull = require(`./SenkosWorld/${file}`);

			const commandData = {
				name: pull.name,
				description: pull.desc,
				dm_permission: false,
				permissions: "0"
			};

			if (pull.options) commandData.options = pull.options;

			SenkoClient.api.Commands.set(pull.name, pull);
			devTools.push(commandData);
		}

		await SenkoClient.guilds.cache.get("777251087592718336").commands.set(devTools);

		print("#FFFB00", "Developer Tools", "Ready");
	}
});
