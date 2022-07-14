require("dotenv/config");

const { Client } = require("discord.js");

const SenkoClient = new Client({
	intents: ["GUILDS", "GUILD_BANS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]
});

SenkoClient.login(process.env.NIGHTLY_TOKEN);

SenkoClient.once("ready", async () => {
	let commands = SenkoClient.application.commands;
	if (process.env.NIGHTLY === "true") commands = SenkoClient.guilds.cache.get("777251087592718336").commands;

	commands.set([])//.then(process.exit());
});
