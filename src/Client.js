require("dotenv/config");
const { print, warn, error, fatal } = require("@kitsune-labs/utilities");
const { v4: uuidv4 } = require("uuid");
const { Client, Collection, PermissionsBitField, GatewayIntentBits: gIntents, WebhookClient, Colors } = require("discord.js");
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

		commandsToSet.push(structure);
	}

	await commands.set(commandsToSet).then(async cmds => {
		SenkoClient.api.loadedCommands = cmds;

		print("Commands Ready");
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

		print("Developer Tools Ready");
	}
});



const express = require("express");
const { fetchSuperGuild, updateSuperGuild } = require("./API/super");
const app = express();
app.use(express.json());
app.listen(process.env.NIGHTLY === "true" ? 8888 : 7777, () => print(`Senko API Server running http://localhost:${process.env.NIGHTLY === "true" ? 8888 : 7777}`));

app.get("/status", (req, res) => {
	if (process.env.NIGHTLY === "true") return;
	res.status(200).send({
		uptime: SenkoClient.uptime,
		websocket_ping: SenkoClient.ws.ping
	});
});

app.post("/mod/warn", async (req, res) => {
	if (process.env.NIGHTLY === "true") return;


	const {userid, reason, mod: mod2} = req.body;

	if (!userid || !reason) return res.status(400).json({error: "Missing Parameters"});

	const user = await SenkoClient.users.fetch(userid);
	const mod = await SenkoClient.users.fetch(mod2);
	const senkosWorld = await SenkoClient.guilds.fetch("777251087592718336");

	if (!user) return res.status(400).json({error: "User not found"});

	const guild = await fetchSuperGuild(senkosWorld);
	let warns = guild.warns;
	const ActionLogs = guild.ActionLogs;

	const warnStruct = {
		userTag: user.tag,
		userId: user.id,
		reason: reason,
		note: "No note(s) provided",
		date: Date.now(),
		moderator: mod.tag,
		moderatorId: mod,
		uuid: uuidv4().slice(0, 8),
		userDmd: false
	};

	if (warns[user.id]) {
		warns[user.id].push(warnStruct);
	} else {
		warns[user.id] = [warnStruct];
	}

	await updateSuperGuild(senkosWorld, {
		warns: warns
	});

	if (ActionLogs) {
		(await senkosWorld.channels.fetch(ActionLogs)).send({
			embeds: [
				{
					title: "Action Report - Kitsune Warned",
					description: `${user.tag} [${user.id}]\nReason: ${warnStruct.reason}\nNote: ${warnStruct.note}`,
					color: Colors.Yellow,
					thumbnail: {
						url: user.displayAvatarURL({ dynamic: true })
					},
					author: {
						name: `${mod.tag}  [${mod.id}]`,
						icon_url: `${mod.displayAvatarURL({ dynamic: true })}`
					}
				}
			]
		});
	}

	try {
		await user.send({
			embeds: [
				{
					title: `You have been warned in ${senkosWorld.name}`,
					description: `Your reason: ${reason}\nNote: No note(s) provided`,
					color: SenkoClient.api.Theme.light
				}
			]
		}).then(()=> {
			warnStruct.userDmd = true;
		});
	} catch (e) { /* empty */ }

	res.status(200);
});