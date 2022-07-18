require("dotenv/config");

const { Client } = require("discord.js");

const SenkoClient = new Client({
	intents: ["Guilds"]
});

SenkoClient.login(process.env.NIGHTLY_TOKEN);

SenkoClient.once("ready", async () => {
	let commands = SenkoClient.application.commands;
	if (process.env.NIGHTLY === "true") commands = SenkoClient.guilds.cache.get("777251087592718336").commands;

	commands.set([]);
});
