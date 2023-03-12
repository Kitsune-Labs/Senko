import "dotenv/config";

import { format } from "winston";
import * as Winston from "winston";
const { printf } = format;

Winston.addColors({
	fatal: ["white", "bold", "bgRed"],
	error: "red",
	warn: "yellow",
	info: "green",
	debug: "blue",
	trace: "magenta",
	senko: "yellow"
});

export const winston = Winston.createLogger({
	levels: {
		senko: 0,
		fatal: 1,
		error: 2,
		warn: 3,
		info: 4,
		debug: 5,
		trace: 6
	},

	transports: [
		new Winston.transports.Console({
			format: format.combine(
				format.timestamp({ format: "HH:mm:ss" }),
				format.colorize(),
				format.errors({ stack: true }),
				printf(({ level, message, timestamp, stack }) => {
					return `${timestamp} ${level}: ${stack || message}`;
				})
			)
		})
		// new Winston.transports.File({
		// 	format: format.combine(
		// 		format.timestamp({ format: "MM:DD:YYYY HH:mm:ss" }),
		// 		format.json()
		// 	),
		// 	filename: `src/temp/combined-${Date.now()}.log`
		// })
	]
});

import type { SenkoClientTypes, SenkoCommand } from "./types/AllTypes";
import { Client, Collection, PermissionsBitField, GatewayIntentBits as GatewayIntents, WebhookClient } from "discord.js";
import { readdirSync } from "fs";

export const senkoClient = new Client({
	intents: [
		GatewayIntents.MessageContent,
		GatewayIntents.GuildMessages,
		GatewayIntents.Guilds,
		GatewayIntents.GuildModeration,
		GatewayIntents.GuildMembers
		// GatewayIntents.GuildInvites
	],
	allowedMentions: {
		parse: ["users", "roles", "everyone"],
		repliedUser: false
	},
	rest: {
		timeout: 100000,
		userAgentAppendix: `Kitsune-Labs/Senko (v${require("../package.json").version})`
	}
}) as SenkoClientTypes;

senkoClient.setMaxListeners(20);

if (process.env["NIGHTLY"] === "true") {
	senkoClient.login(process.env["NIGHTLY_TOKEN"]);

	winston.log("senko", "SENKO NIGHTLY Mode");
} else {
	senkoClient.login(process.env["TOKEN"]);

	winston.log("senko", "SENKO PRODUCTION Mode");
}

const StartupTime = Date.now();

Reflect.set(senkoClient, "api", {
	Commands: new Collection(),

	Icons: require("./Data/Icons.json"),
	UserAgent: `DiscordBot (https://discord.js.org, v${require("../package.json")["discord.js"]}) Kitsune-Labs/Senko, v${require("../package.json").version}`,
	Theme: require("./Data/Palettes/Main").default,
	BitData: require("./API/Bits.json"),
	loadedCommands: null,
	statusLog: new WebhookClient({
		url: process.env["STATUS_URL"] as string
	}),
	SenkosWorld: senkoClient.guilds.fetch("777251087592718336")
});


process.on("unhandledRejection", async (reason: any) => {
	senkoClient.api.statusLog.send({
		content: "<@609097445825052701>",
		embeds: [
			{
				title: senkoClient.user!.username,
				description: reason.stack.toString(),
				color: senkoClient.api.Theme.light
			}
		]
	});

	winston.log("fatal", reason);
	console.log(reason);
});

process.on("uncaughtException", async (reason: any) => {
	senkoClient.api.statusLog.send({
		content: "<@609097445825052701>",
		embeds: [
			{
				title: senkoClient.user!.username,
				description: reason.stack.toString(),
				color: senkoClient.api.Theme.light
			}
		]
	});

	winston.log("error", reason);
	console.log(reason);
	console.log(reason.code);
});

senkoClient.once("ready", async () => {
	winston.log("info", "Starting Senko...");

	let commands;

	if (process.env["NIGHTLY"] === "true") {
		commands = senkoClient.guilds.cache.get("777251087592718336")?.commands;
	} else {
		commands = senkoClient.application?.commands;
	}

	// await commands.set([]);

	// return commands.set([]);

	for (const file of readdirSync("./src/Events/").filter(file => file.endsWith(".ts" || ".js"))) {
		const eventModule = require(`./Events/${file}`);
		new eventModule.default().execute(senkoClient);
	}

	winston.log("info", "Events ready");

	const commandsToSet = [];

	if (process.env["NIGHTLY"] === "true") {
		winston.log("warn", "Development mode is enabled, no regular interactions will be loaded.");

		for (const file of readdirSync("./src/DevInteractions/")) {
			const pull = require(`./DevInteractions/${file}`).default;

			senkoClient.api.Commands.set(`${pull.name}`, pull);
		}
	} else {
		readdirSync("./src/Interactions/").forEach(async Folder => {
			const Interactions = readdirSync(`./src/Interactions/${Folder}/`).filter(f => f.endsWith(".ts" || ".js"));

			for (const interact of Interactions) {
				const pull = require(`./Interactions/${Folder}/${interact}`).default;

				senkoClient.api.Commands.set(`${pull.name}`, pull);
			}
		});
	}

	for (const cmd of senkoClient.api.Commands) {
		const command = cmd[1] as SenkoCommand;

		const structure = {
			name: command.name,
			description: command.desc,
			dm_permission: false
		} as any;

		if (command.options) structure.options = command.options;
		if (command.permissions) structure.defaultMemberPermissions = new PermissionsBitField(command.permissions);
		if (command.name_localized) structure.name_localized = command.name_localized;
		if (command.description_localized) structure.description_localized = command.description_localized;

		commandsToSet.push(structure);
	}

	await commands?.set(commandsToSet).then(async cmds => {
		senkoClient.api.loadedCommands = cmds;

		winston.log("info", "Commands Ready");
	}).catch((err: any) => {
		console.log(err);
	});

	if (process.env["NIGHTLY"] === "true") {
		const devTools: any = [];
		for (const file of readdirSync("./src/DevTools/")) {
			const pull = require(`./DevTools/${file}`).default as SenkoCommand;

			const commandData = {
				name: pull.name || `devtool-${file.split(".")[0]}`,
				description: "Developer Tool",
				dm_permission: false,
				permissions: "0"
			} as any;

			if (pull.options) commandData.options = pull.options;
			if (pull.name_localized) commandData.name_localized = pull.name_localized;
			if (pull.description_localized) commandData.description_localized = pull.description_localized;

			senkoClient.api.Commands.set(pull.name, pull);
			devTools.push(commandData);
		}

		// senkoClient.guilds.fetch("777251087592718336").then(async guild => {
		// 	// await guild.commands.set(devTools);

		// 	winston.log("senko", "Developer Tools Loaded");
		// });
		// await senkoClient.guilds.cache.get("777251087592718336").commands.set(devTools);

		winston.log("info", "Developer Tools Ready");
	}

	// require("./ServerApi/Server")(senkoClient);
	winston.log("senko", `Ready in ${Date.now() - StartupTime}ms!`);
});