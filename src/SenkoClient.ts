import "dotenv/config";
import type { ExtendedProcess, SenkoClientTypes, SenkoCommand } from "./types/AllTypes";

import { print, warn, error, fatal } from "@kitsune-labs/utilities";
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

	print("SENKO NIGHTLY Mode");
} else {
	SenkoClient.login(process.env["TOKEN"]);

	print("SENKO PRODUCTION Mode");
}
console.time("Startup");

Reflect.set(SenkoClient, "api", {
	Commands: new Collection(),

	Icons: require("./Data/Icons.json"),
	UserAgent: `DiscordBot (https://discord.js.org, v${require("../package.json")["discord.js"]}) Kitsune-Labs/Senko, v${require("../package.json").version}`,
	Theme: require("./Data/Palettes/Main").default,
	BitData: require("./API/Bits.json"),
	loadedCommands: null,
	// @ts-ignore
	statusLog: new WebhookClient({url: process.env["STATUS_URL"]}),
	SenkosWorld: async function(): Promise<Guild> {
		return await SenkoClient.guilds.fetch("777251087592718336");
	}
});

// print(`User Agent: ${SenkoClient.api.UserAgent}`);


process.on("unhandledRejection", async (reason: any) =>{
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

	fatal(reason.stack.toString());
});

process.on("uncaughtException", async(reason: any)=>{
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

	error(reason);
});

SenkoClient.once("ready", async () => {
	print("Senko Started");

	// @ts-expect-error
	let commands = SenkoClient.application.commands;
	// @ts-expect-error
	if (process.env["NIGHTLY"] === "true") commands = SenkoClient.guilds.cache.get("777251087592718336").commands;

	// return commands.set([]);

	for (const file of readdirSync("./src/Events/").filter(file => file.endsWith(".ts" || ".js"))) {
		const eventModule = require(`./Events/${file}`);
		new eventModule.default().execute(SenkoClient);
	}

	print("Events ready");

	const commandsToSet = [];

	if (process.env["NIGHTLY"] !== "true") {
		readdirSync("./src/Interactions/").forEach(async Folder => {
			const Interactions = readdirSync(`./src/Interactions/${Folder}/`).filter(f =>f .endsWith(".ts" || ".js"));

			for (const interact of Interactions) {
				const pull = require(`./Interactions/${Folder}/${interact}`).default;

				SenkoClient.api.Commands.set(`${pull.name}`, pull);
			}
		});
	} else {
		warn("Development mode is enabled, no regular interactions will be loaded.");

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

		print("Commands Ready");
	}).catch(err => {
		error(err);
	});

	if (process.env["NIGHTLY"] !== "true") {
		const devTools = [];
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

		// @ts-expect-error
		await SenkoClient.guilds.cache.get("777251087592718336").commands.set(devTools);

		print("Developer Tools Ready");
	}

	// require("./ServerApi/Server")(SenkoClient);
	console.timeEnd("Startup");
});