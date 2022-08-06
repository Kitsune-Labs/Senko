// eslint-disable-next-line no-unused-vars
const { Client, Colors } = require("discord.js");
const { print, clean, wait } = require("../API/Master.js");
const { v4: uuidv4 } = require("uuid");
const { fetchSuperGuild } = require("../API/super");
const fs = require("fs");
const axios = require("axios");

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	execute: async (SenkoClient) => {
		SenkoClient.on("messageDelete", async message => {
			if (!message.guild || message.author.bot || message.system) return;

			const guildData = await fetchSuperGuild(message.guild);

			if (!guildData.MessageLogs) return print("#ffff6", "MLD", "Message logging is disabled for this Guild.");

			const caseId = `${uuidv4().slice(0, 8)}`;
			const linkedFiles = [];
			const emojis = [];
			const files = [];

			for (var possibleEmoji of message.content.split(" ")) {
				if (possibleEmoji.replaceAll("_", "").match(/<:?[a-zA-Z0-9].+?:\d+>/g)) {
					for (var e of possibleEmoji.match(/:\d+>/g)) {
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
						description: `Message URL\n${message.url}\n\n${message.author.tag} ||[${message.author.id}]||\non <t:${Math.round(Date.now() / 1000)}:f>\nin ${message.channel} ||[${message.channel.id}]||\n\n__**Message Content**__\`\`\`diff\n- ${clean(message.content)}\`\`\`${message.attachments.size > 0 ? `\nAttachment(s)\n\`\`\`${message.attachments.map(r=> r.name)}\`\`\`` : ""}\n${emojis.length > 0 ? `\n__**Emoji URLs**__${emojis.map(em => `\n${em}`)}` : ""}${message.stickers.size > 0 ? `\n__**Stickers**__${message.stickers.map(s => `\n${s.url}`)}` : ""}`,
						color: Colors.Red,
						footer: {
							text: `Case ${caseId}`
						}
					}
				]
			};

			for (var rawAttachment of message.attachments) {
				const attachment = rawAttachment[1];

				await axios.request({
					url: attachment.url,
					method: "GET",
					responseType: "stream",
					headers: {
						"User-Agent": SenkoClient.tools.UserAgent
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

			message.guild.channels.cache.get(guildData.MessageLogs).send(messageStructure).then(async sentMessage => {
				while (message.attachments.size !== files.length) {
					await wait(500);
				}

				if (files.length > 0) await sentMessage.reply({ content: `Message attachments from ${message.author.tag} ||[${message.author.id}]|| for case ${caseId}`, files: files });

				for (var linkedFile of linkedFiles) {
					fs.unlink(linkedFile, () => {
						console.log(`Removed ${linkedFile}`);
					});
				}
			});
		});

		SenkoClient.on("messageUpdate", async (oldMessage, newMessage) => {
			if (!oldMessage.guild || oldMessage.author.bot || oldMessage.system || oldMessage.content === newMessage.content) return;

			const guildData = await fetchSuperGuild(oldMessage.guild);

			if (!guildData.MessageLogs) return print("#ffff6", "MLD", "Message logging is disabled for this Guild.");

			const caseId = `${uuidv4().slice(0, 8)}`;
			const emojis = [];

			for (var possibleEmoji of oldMessage.content.split(" ")) {
				if (possibleEmoji.replaceAll("_", "").match(/<:?[a-zA-Z0-9].+?:\d+>/g)) {
					for (var e of possibleEmoji.match(/:\d+>/g)) {
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
						description: `${oldMessage.author.tag} ||[${oldMessage.author.id}]||\non <t:${Math.round(Date.now() / 1000)}:f>\nin ${oldMessage.channel} ||[${oldMessage.channel.id}]||\n\n__**Old Message**__\`\`\`diff\n- ${clean(oldMessage.content)}\`\`\`\n__**New Message**__\`\`\`diff\n+ ${clean(newMessage.content)}\`\`\`\n${emojis.length > 0 ? `__**Old Message Emoji's**__${emojis.map(em => `\n${em}`)}` : ""}${oldMessage.stickers.size > 0 ? `\n__**Stickers**__${oldMessage.stickers.map(s => `\n${s.url}`)}` : ""}`,
						color: Colors.Yellow,
						footer: {
							text: `Case ${caseId}`
						}
					}
				],
				components: [
					{
						type: 1,
						components: [
							{ type: 2, label: "Go to Message", style: 5, url: newMessage.url }
						]
					}
				]
			};

			oldMessage.guild.channels.cache.get(guildData.MessageLogs).send(messageStructure);
		});
	}
};