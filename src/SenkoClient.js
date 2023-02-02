require("dotenv/config");
const { print, warn, error, fatal } = require("@kitsune-labs/utilities");
const { Client, Collection, PermissionsBitField, GatewayIntentBits: GatewayIntents, WebhookClient } = require("discord.js");
const { readdirSync } = require("fs");

const SenkoClient = new Client({
	intents: [
		GatewayIntents.MessageContent,
		GatewayIntents.GuildMessages,
		GatewayIntents.Guilds,
		GatewayIntents.GuildBans,
		GatewayIntents.GuildMembers
	],

	allowedMentions: {
		parse: ["users", "roles", "everyone"],
		repliedUser: false
	},
	restRequestTimeout: 100000,
	userAgentSuffix: [`Kitsune-Labs/Senko (v${require("../package.json").version})`]
});

SenkoClient.setMaxListeners(20);
process.SenkoClient = SenkoClient;

if (process.env.NIGHTLY === "true") {
	SenkoClient.login(process.env.NIGHTLY_TOKEN);

	print("SENKO NIGHTLY Mode");
} else {
	SenkoClient.login(process.env.TOKEN);

	print("SENKO PRODUCTION Mode");
}

Reflect.set(SenkoClient, "api", {
	Commands: new Collection(),

	Icons: require("./Data/Icons.json"),
	UserAgent: `DiscordBot (Discord.js v${require("../package.json")["discord.js"]}) Kitsune-Labs/Senko, v${require("../package.json").version}`,
	Theme: require("./Data/Palettes/Main.js"),
	Bitfield: require("bitfields").Bitfield,
	BitData: require("./API/Bits.json"),
	loadedCommands: null,
	statusLog: new WebhookClient({ url: process.env.STATUS_URL}),
	SenkosWorld: async function() {
		return await SenkoClient.guilds.fetch("777251087592718336");
	}
});

// print(`User Agent: ${SenkoClient.api.UserAgent}`);


process.on("unhandledRejection", async(reason)=>{
	if (process.env.NIGHTLY !== "true") SenkoClient.api.statusLog.send({
		content: "<@609097445825052701>",
		embeds: [
			{
				title: "Error - Unhandled Rejection",
				description: reason.stack.toString(),
				color: SenkoClient.api.Theme.light
			}
		]
	});

	fatal(reason.stack.toString());
});

process.on("uncaughtException", async(reason)=>{
	if (process.env.NIGHTLY !== "true") SenkoClient.api.statusLog.send({
		content: "<@609097445825052701>",
		embeds: [
			{
				title: "Error - Uncaught Exception",
				description: reason.stack.toString(),
				color: SenkoClient.api.Theme.light
			}
		]
	});

	error(reason.stack.toString());
});

SenkoClient.once("ready", async () => {
	print("Senko Started");

	let commands = SenkoClient.application.commands;
	if (process.env.NIGHTLY === "true") commands = SenkoClient.guilds.cache.get("777251087592718336").commands;

	// return commands.set([]);

	for (let file of readdirSync("./src/Events/").filter(file => file.endsWith(".js"))) {
		require(`./Events/${file}`).execute(SenkoClient);
	}

	print("Events ready");

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
		warn("Development mode is enabled, no regular interactions will be loaded.");

		for (var file of readdirSync("./src/DevInteractions/")) {
			const pull = require(`./DevInteractions/${file}`);
			SenkoClient.api.Commands.set(`${pull.name}`, pull);
		}
	}

	for (var cmd of SenkoClient.api.Commands) {
		const command = cmd[1];

		const structure = {
			name: command.name,
			description: command.desc,
			dm_permission: false
		};

		if (command.options) structure.options = command.options;
		if (command.permissions) structure.defaultMemberPermissions = new PermissionsBitField(command.permissions);
		if (command.name_localized) structure.name_localized = command.name_localized;
		if (command.description_localized) structure.description_localized = command.description_localized;

		commandsToSet.push(structure);
	}

	await commands.set(commandsToSet).then(async cmds => {
		SenkoClient.api.loadedCommands = cmds;

		print("Commands Ready");
	});

	if (process.env.NIGHTLY !== "true") {
		const devTools = [];
		for (let file of readdirSync("./src/DevTools/")) {
			const pull = require(`./DevTools/${file}`);

			const commandData = {
				name: pull.name,
				description: "Developer Tool",
				dm_permission: false,
				permissions: "0"
			};

			if (pull.options) commandData.options = pull.options;
			if (pull.name_localized) commandData.name_localized = pull.name_localized;
			if (pull.description_localized) commandData.description_localized = pull.description_localized;

			SenkoClient.api.Commands.set(pull.name, pull);
			devTools.push(commandData);
		}

		await SenkoClient.guilds.cache.get("777251087592718336").commands.set(devTools);

		print("Developer Tools Ready");
	}

	require("./ServerApi/Server")(SenkoClient);
});