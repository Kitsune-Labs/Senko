import type { SenkoClientTypes } from "../types/AllTypes";
import { Attachment, Events, Sticker } from "discord.js";
import { Colors, Message } from "discord.js";
import { clean } from "../API/Master";
import { v4 as uuidv4 } from "uuid";
import { fetchSuperGuild } from "../API/super";
import fs from "fs";
import axios from "axios";
import { wait } from "@kitsune-labs/utilities";
import { winston } from "../SenkoClient";

export default class {
	async execute(senkoClient: SenkoClientTypes) {
		senkoClient.on(Events.MessageDelete, async (message: Message | any) => {
			if (!message.guild || message.author.bot || message.system) return;

			const guildData = await fetchSuperGuild(message.guild);

			if (!guildData) return;
			if (!guildData.MessageLogs && !guildData.AdvancedMessageLogging.message_deletions) return;

			const caseId = uuidv4().slice(0, 8);
			const linkedFiles: string[] = [];
			const emojis: string[] = [];
			const files: any[] = [];

			for (const possibleEmoji of message.content.split(" ")) {
				if (possibleEmoji.replaceAll("_", "").match(/<:?[a-zA-Z0-9].+?:\d+>/g)) {
					for (const e of possibleEmoji.match(/:\d+>/g)) {
						const emojiID = e.slice(1, e.length - 1);

						if (possibleEmoji.startsWith("<a:")) {
							emojis.push(`https://cdn.discordapp.com/emojis/${emojiID}.gif`);
						} else {
							emojis.push(`https://cdn.discordapp.com/emojis/${emojiID}.png`);
						}
					}
				}
			}

			const messageStructure = {
				embeds: [
					{
						title: "Message Deleted",
						description: `Message URL\n${message.url}\n\n${message.author.tag} in ${message.channel} (||user id: ${message.author.id}||) on <t:${Math.round(Date.now() / 1000)}:f>\n${message.content.length > 0 ? `\n__**Message Content**__\`\`\`diff\n- ${clean(message.content)}\`\`\`` : ""}${message.attachments.size > 0 ? `\nAttachment(s)\n\`\`\`${message.attachments.map((r: Attachment) => r.name)}\`\`\`` : ""}\n${emojis.length > 0 ? `\n__**Emoji's**__${emojis.map(em => `\n${em}`)}` : ""}${message.stickers.size > 0 ? `\n__**Stickers**__${message.stickers.map((s: Sticker) => `\n${s.url}`)}` : ""}`,
						color: Colors.Red,
						footer: {
							text: `Case ${caseId}`
						}
					}
				],
				files: []
			};

			if (guildData.AdvancedMessageLogging.message_deletions) {
				messageStructure.embeds[0]!.title = "";
				messageStructure.embeds[0]!.description = `Message URL\n${message.url}\n\n${message.author.tag} in ${message.channel} (||user id: ${message.author.id}||) on <t:${Math.round(Date.now() / 1000)}:f>\n${message.content.length > 0 ? `\n\`\`\`diff\n- ${clean(message.content)}\`\`\`` : ""}${message.attachments.size > 0 ? `\nAttachment(s)\n\`\`\`${message.attachments.map((r: Attachment) => r.name)}\`\`\`` : ""}\n${emojis.length > 0 ? `\n__**Emoji's**__${emojis.map(em => `\n${em}`)}` : ""}${message.stickers.size > 0 ? `\n__**Stickers**__${message.stickers.map((s: Sticker) => `\n${s.url}`)}` : ""}`;
			}

			if (message.attachments.size == 0) messageStructure.embeds[0]!.footer.text = "";

			for (const rawAttachment of message.attachments) {
				const attachment = rawAttachment[1];

				await axios.request({
					url: attachment.url,
					method: "GET",
					responseType: "stream",
					headers: {
						"User-Agent": senkoClient.api.UserAgent
					}
				}).then(async (response) => {
					const fileId = `case-${caseId}_${attachment.name}`;

					const fileWrite = await response.data.pipe(fs.createWriteStream(`./src/temp/${fileId}`));

					await fileWrite.on("finish", async () => {
						linkedFiles.push(`./src/temp/${fileId}`);

						files.push({ attachment: `./src/temp/${fileId}`, name: `SPOILER_${fileId}` });
					});
				});
			}

			let channelToSendTo: any;

			try {
				channelToSendTo = await message.guild.channels.fetch(guildData.AdvancedMessageLogging.message_deletions || guildData.MessageLogs);
			} catch (err) {
				winston.log("error", err);
				return;
			}

			if (messageStructure.embeds[0]!.description.length >= 2048) {
				if (guildData.AdvancedMessageLogging.message_deletions) {
					messageStructure.embeds[0]!.description = `Message URL\n${message.url}\n\n${message.author.tag} in ${message.channel} (||user id: ${message.author.id}||) on <t:${Math.round(Date.now() / 1000)}:f>\n${message.content.length > 0 ? "\n__**Message Content**__```fix\nMessage is too big to fit in embed, see text file below (or above)```" : ""}${message.attachments.size > 0 ? `\nAttachment(s)\n\`\`\`${message.attachments.map((r: Attachment) => r.name)}\`\`\`` : ""}\n${emojis.length > 0 ? `\n__**Emoji's**__${emojis.map(em => `\n${em}`)}` : ""}${message.stickers.size > 0 ? `\n__**Stickers**__${message.stickers.map((s: Sticker) => `\n${s.url}`)}` : ""}`;
				} else {
					messageStructure.embeds[0]!.description = `Message URL\n${message.url}\n\n${message.author.tag} in ${message.channel} (||user id: ${message.author.id}||) on <t:${Math.round(Date.now() / 1000)}:f>\n${message.content.length > 0 ? "\n```fix\nMessage is too big to fit in embed, see text file below (or above)```" : ""}${message.attachments.size > 0 ? `\nAttachment(s)\n\`\`\`${message.attachments.map((r: Attachment) => r.name)}\`\`\`` : ""}\n${emojis.length > 0 ? `\n__**Emoji's**__${emojis.map(em => `\n${em}`)}` : ""}${message.stickers.size > 0 ? `\n__**Stickers**__${message.stickers.map((s: Sticker) => `\n${s.url}`)}` : ""}`;
				}
				fs.writeFileSync(`./src/temp/${caseId}.txt`, `> DELETED MESSAGE\n\n\n\n${message.content}`);
				linkedFiles.push(`./src/temp/${caseId}.txt`);

				// @ts-ignore
				messageStructure.files.push({ attachment: `./src/temp/${caseId}.txt`, name: "Message.txt" });
			}

			channelToSendTo.send(messageStructure).then(async (sentMessage: Message) => {
				while (message.attachments.size !== files.length) {
					await wait(500);
				}

				if (files.length > 0) await sentMessage.reply({ content: `Message attachments for case ${caseId}`, files: files });

				await wait(1000);

				if (linkedFiles.length > 0) {
					for (const linkedFile of linkedFiles) {
						fs.unlink(linkedFile, () => {
							winston.log("info", `Deleted ${linkedFile}`);
						});
					}
				}
			});
		});

		senkoClient.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
			if (!oldMessage.guild || oldMessage.author!.bot || oldMessage.system || oldMessage.content === newMessage.content) return;

			const guildData = await fetchSuperGuild(oldMessage.guild);
			if (!guildData) return;
			if (!guildData!.MessageLogs && !guildData!.AdvancedMessageLogging.message_deletions) return;

			const channelToSendTo: any = await newMessage.guild!.channels.fetch(guildData!.AdvancedMessageLogging.message_edits || guildData!.MessageLogs).catch(() => null);
			const caseId = uuidv4().slice(0, 8);
			const linkedFiles: Array<any> = [];
			const emojis = [];

			for (const possibleEmoji of oldMessage.content!.split(" ")) {
				if (possibleEmoji.replaceAll("_", "").match(/<:?[a-zA-Z0-9].+?:\d+>/g)) {
					for (const e of possibleEmoji.match(/:\d+>/g)!) {
						const emojiID = e.slice(1, e.length - 1);

						if (possibleEmoji.startsWith("<a:")) {
							emojis.push(`https://cdn.discordapp.com/emojis/${emojiID}.gif`);
						} else {
							emojis.push(`https://cdn.discordapp.com/emojis/${emojiID}.png`);
						}
					}
				}
			}

			const messageStructure = {
				embeds: [
					{
						title: "Message Updated",
						description: `${oldMessage.author!.tag} in ${oldMessage.channel} (||user id: ${oldMessage.author!.id}||)\n\n__**Old Message**__\`\`\`diff\n- ${clean(oldMessage.content!)}\`\`\`\n__**New Message**__\`\`\`diff\n+ ${clean(newMessage.content!)}\`\`\`\n${emojis.length > 0 ? `__**Emoji's in previous message**__${emojis.map(em => `\n${em}`)}` : ""}`,
						color: Colors.Yellow
						// footer: {
						// 	text: `Case ${caseId}`
						// }
					}
				],
				components: [
					{
						type: 1,
						components: [
							{ type: 2, label: "Go to Message", style: 5, url: newMessage.url }
						]
					}
				],
				files: []
			};

			if (guildData!.AdvancedMessageLogging.message_edits) {
				messageStructure.embeds[0]!.title = "";

				messageStructure.embeds[0]!.description = `${oldMessage.author!.tag} in ${oldMessage.channel} (||user id: [${oldMessage.author!.id}]||)\n\n\`\`\`diff\n- ${clean(oldMessage.content!)}\`\`\`\n\`\`\`diff\n+ ${clean(newMessage.content!)}\`\`\`\n${emojis.length > 0 ? `__**Emoji's in previous message**__${emojis.map(em => `\n${em}`)}` : ""}`;
			}

			if (messageStructure.embeds[0]!.description.length >= 2048) {
				if (guildData!.AdvancedMessageLogging.message_edits) {
					messageStructure.embeds[0]!.description = `${oldMessage.author!.tag} in ${oldMessage.channel} (||user id: [${oldMessage.author!.id}]||)\n\n\`\`\`fix\nMessage's are too big to fit in embed, view the messages below (or above)\`\`\`\n${emojis.length > 0 ? `__**Emoji's in previous message**__${emojis.map(em => `\n${em}`)}` : ""}`;
				} else {
					messageStructure.embeds[0]!.description = `${oldMessage.author!.tag} in ${oldMessage.channel} (||user id: ${oldMessage.author!.id}||)\n\n\`\`\`fix\nMessage's are too big to fit in embed, view the messages below (or above)\`\`\`\n${emojis.length > 0 ? `__**Emoji's in previous message**__${emojis.map(em => `\n${em}`)}` : ""}`;
				}

				fs.writeFileSync(`./src/temp/${caseId}.txt`, `> OLD MESSAGE\n\n\n\n${oldMessage.content}`);
				fs.writeFileSync(`./src/temp/${caseId}_2.txt`, `> UPDATED MESSAGE\n\n\n\n${newMessage.content}`);
				linkedFiles.push(`./src/temp/${caseId}.txt`);
				linkedFiles.push(`./src/temp/${caseId}_2.txt`);

				// @ts-ignore
				messageStructure.files.push({ attachment: `./src/temp/${caseId}.txt`, name: "Old Message.txt" });
				// @ts-ignore
				messageStructure.files.push({ attachment: `./src/temp/${caseId}_2.txt`, name: "Updated Message.txt" });
			}


			if (channelToSendTo) channelToSendTo.send(messageStructure).then(async () => {
				await wait(1000);

				if (linkedFiles.length > 0) {
					for (var file of linkedFiles) {
						fs.unlink(file, () => {
							winston.log("info", `Deleted ${file}`);
						});
					}
				}
			});
		});
	}
}