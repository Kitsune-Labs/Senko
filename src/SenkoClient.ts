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
				format.timestamp({format: "HH:mm:ss"}),
				format.colorize(),
				format.errors({stack: true}),
				printf(({ level, message, timestamp, stack }) => {
					return `${timestamp} ${level}: ${stack || message}`;
				})
			)
		}),
		new Winston.transports.File({
			format: format.combine(
				format.timestamp({format: "MM:DD:YYYY HH:mm:ss"}),
				format.json()
			),
			filename: `src/temp/combined-${Date.now()}.log`
		})
	]
});

import type { ExtendedProcess, SenkoClientTypes, SenkoCommand } from "./types/AllTypes";
import { Client, Collection, PermissionsBitField, GatewayIntentBits as GatewayIntents, WebhookClient, Guild } from "discord.js";
import { readdirSync } from "fs";

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
	rest: {
		timeout: 100000,
		userAgentAppendix: `Kitsune-Labs/Senko (v${require("../package.json").version})`
	}
}) as SenkoClientTypes;

SenkoClient.setMaxListeners(20);

// eslint-disable-next-line no-extra-parens
(process as ExtendedProcess).SenkoClient = SenkoClient;

if (process.env["NIGHTLY"] === "true") {
	SenkoClient.login(process.env["NIGHTLY_TOKEN"]);

	winston.log("senko", "SENKO NIGHTLY Mode");
} else {
	SenkoClient.login(process.env["TOKEN"]);

	winston.log("senko", "SENKO PRODUCTION Mode");
}

const StartupTime = Date.now();

Reflect.set(SenkoClient, "api", {
	Commands: new Collection(),

	Icons: require("./Data/Icons.json"),
	UserAgent: `DiscordBot (https://discord.js.org, v${require("../package.json")["discord.js"]}) Kitsune-Labs/Senko, v${require("../package.json").version}`,
	Theme: require("./Data/Palettes/Main").default,
	BitData: require("./API/Bits.json"),
	loadedCommands: null,
	// @ts-ignore
	statusLog: new WebhookClient({ url: process.env["STATUS_URL"] }),
	SenkosWorld: async function (): Promise<Guild> {
		return await SenkoClient.guilds.fetch("777251087592718336");
	}
});


process.on("unhandledRejection", async (reason: any) => {
	SenkoClient.api.statusLog.send({
		content: "<@609097445825052701>",
		embeds: [
			{
				title: SenkoClient.user!.username,
				description: reason.stack.toString(),
				color: SenkoClient.api.Theme.light
			}
		]
	});

	winston.log("fatal", reason.stack);
});

process.on("uncaughtException", async (reason: any) => {
	SenkoClient.api.statusLog.send({
		content: "<@609097445825052701>",
		embeds: [
			{
				title: SenkoClient.user!.username,
				description: reason.stack.toString(),
				color: SenkoClient.api.Theme.light
			}
		]
	});

	winston.log("error", reason.stack);
});

SenkoClient.once("ready", async () => {
	winston.log("info", "Starting Senko...");

	// @ts-expect-error
	let commands = SenkoClient.application.commands;
	// @ts-expect-error
	if (process.env["NIGHTLY"] === "true") commands = SenkoClient.guilds.cache.get("777251087592718336").commands;

	// await commands.set([]);

	// return commands.set([]);

	for (const file of readdirSync("./src/Events/").filter(file => file.endsWith(".ts" || ".js"))) {
		const eventModule = require(`./Events/${file}`);
		new eventModule.default().execute(SenkoClient);
	}

	winston.log("info", "Events ready");

	const commandsToSet = [];

	if (process.env["NIGHTLY"] !== "true") {
		readdirSync("./src/Interactions/").forEach(async Folder => {
			const Interactions = readdirSync(`./src/Interactions/${Folder}/`).filter(f => f.endsWith(".ts" || ".js"));

			for (const interact of Interactions) {
				const pull = require(`./Interactions/${Folder}/${interact}`).default;

				SenkoClient.api.Commands.set(`${pull.name}`, pull);
			}
		});
	} else {
		winston.log("warn", "Development mode is enabled, no regular interactions will be loaded.");

		for (const file of readdirSync("./src/DevInteractions/")) {
			const pull = require(`./DevInteractions/${file}`).default;

			SenkoClient.api.Commands.set(`${pull.name}`, pull);
		}
	}

	for (const cmd of SenkoClient.api.Commands) {
		const command = cmd[1] as unknown as SenkoCommand;

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

	await commands.set(commandsToSet).then(async cmds => {
		SenkoClient.api.loadedCommands = cmds;

		winston.log("info", "Commands Ready");
	}).catch(err => {
		winston.log("error", err);
	});

	if (process.env["NIGHTLY"] === "true") {
		const devTools: any = [];
		for (const file of readdirSync("./src/DevTools/")) {
			const pull = require(`./DevTools/${file}`) as SenkoCommand;

			const commandData = {
				name: pull.name || `devtool-${file.split(".")[0]}`,
				description: "Developer Tool",
				dm_permission: false,
				permissions: "0"
			} as any;

			if (pull.options) commandData.options = pull.options;
			if (pull.name_localized) commandData.name_localized = pull.name_localized;
			if (pull.description_localized) commandData.description_localized = pull.description_localized;

			// @ts-expect-error
			SenkoClient.api.Commands.set(pull.name, pull);
			devTools.push(commandData);
		}


		SenkoClient.guilds.fetch("777251087592718336").then(async guild => {
			await guild.commands.set(devTools);
		});
		// await SenkoClient.guilds.cache.get("777251087592718336").commands.set(devTools);

		winston.log("info", "Developer Tools Ready");
	}

	// require("./ServerApi/Server")(SenkoClient);
	winston.log("senko", `Ready in ${Date.now() - StartupTime}ms!`);
});