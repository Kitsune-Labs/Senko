import express from "express";
import { v4 as uuidv4 } from "uuid";
import { fetchSuperGuild, updateSuperGuild } from "../API/super";
import { print } from "@kitsune-labs/utilities";
import { Colors } from "discord.js";
import type { Response } from "express";
import type { SenkoClientTypes } from "../types/AllTypes";
import type { GuildWarn } from "../types/SupabaseTypes";

export default class {
	constructor() {
		print("💽 Senko API Server Started");
	}

	async execute(senkoClient: SenkoClientTypes) {
		const app = express();
		app.use(express.json());
		app.listen(process.env["NIGHTLY"] === "true" ? 8888 : 7777, () => print(`💽 Senko API Server running http://localhost:${process.env["NIGHTLY"] === "true" ? 8888 : 7777}`));

		app.get("/status", (res: Response) => {
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
			const warns = guild!.warns;
			const ActionLogs = guild!.ActionLogs;

			const warnStruct: GuildWarn = {
				userTag: user.tag,
				userId: user.id,
				reason: reason,
				note: "No note(s) provided",
				date: Date.now(),
				moderator: mod.tag,
				moderatorId: mod.id,
				uuid: uuidv4().slice(0, 8),
				userDmd: false
			};

			if (user.id in warns) {
				warns[user.id]!.push(warnStruct);
			} else {
				warns[user.id] = [warnStruct];
			}

			await updateSuperGuild(senkosWorld, {
				warns: warns
			});

			if (ActionLogs) {
				// @ts-ignore
				(await senkosWorld.channels.fetch(ActionLogs)).send({
					embeds: [
						{
							title: "Action Report - Kitsune Warned",
							description: `${user.tag} [${user.id}]\nReason: ${warnStruct.reason}\nNote: ${warnStruct.note}`,
							color: Colors.Yellow,
							thumbnail: {
								url: user.displayAvatarURL()
							},
							author: {
								name: `${mod.tag}  [${mod.id}]`,
								icon_url: `${mod.displayAvatarURL()}`
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
	}
}