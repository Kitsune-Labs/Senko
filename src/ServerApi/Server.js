const express = require("express");
const senkoClient = process.SenkoClient;
const { v4: uuidv4 } = require("uuid");
const { fetchSuperGuild, updateSuperGuild } = require("../API/super");
const { print } = require("@kitsune-labs/utilities");
const { Colors } = require("discord.js");



module.exports = function() {
	const app = express();
	app.use(express.json());
	app.listen(process.env.NIGHTLY === "true" ? 8888 : 7777, () => print(`Senko API Server running http://localhost:${process.env.NIGHTLY === "true" ? 8888 : 7777}`));

	app.get("/status", (req, res) => {
		res.status(200).send({
			uptime: senkoClient.uptime,
			websocket_ping: senkoClient.ws.ping
		});
	});

	app.post("/mod/warn", async (req, res) => {
		const {userid, reason, mod: mod2} = req.body;

		if (!userid || !reason) return res.status(400).json({error: "Missing Parameters"});

		const user = await senkoClient.users.fetch(userid);
		const mod = await senkoClient.users.fetch(mod2);
		const senkosWorld = await senkoClient.guilds.fetch("777251087592718336");

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
						color: senkoClient.api.Theme.light
					}
				]
			}).then(()=> {
				warnStruct.userDmd = true;
			});
		} catch (e) { /* empty */ }

		res.status(200);
	});
};

