// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
const { v4: uuidv4 } = require("uuid");
const { fetchSuperGuild } = require("./super");
const fs = require("fs");
const axios = require("axios");
const chalk = require("@kitsune-laboratories/chalk-node");
const { parentPort } = require("worker_threads");

function clean(Content) {
    return Content.toString().replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
}

function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function print(Color, Type, content) {
    console.log(`[${chalk.hex(Color || "#252525").underline(Type)}]: `, content);
}

parentPort.on("message", async ({ message, guild }) => {
    print("#B42025", "MLD", guild);
    if (!guild || message.author.bot || message.system) return;

    const guildData = await fetchSuperGuild(guild);

    if (!guildData.MessageLogs) return print("#E51D35", "MLD", "Message logging is disabled for this Guild.");
    print("#5865F2", "MLD", "Message logging is ENABLED for this Guild.");

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
        embeds: [{
            title: "Message Deleted",
            description: `Message URL\n${message.url}\n\n${message.author.tag} ||[\${message.author.id}]||\non <t:${Math.round(Date.now() / 1000)}:f>\nin ${message.channel} ||[\${message.channel.id}]||\n${message.content.length > 0 ? `\n__**Message Content**__\`\`\`diff\n- ${clean(message.content)}\`\`\`` : ""}${message.attachments.size > 0 ? `\nAttachment(s)\n\`\`\`${message.attachments.map(r=> r.name)}\`\`\`` : ""}\n${emojis.length > 0 ? `\n__**Emoji URLs**__${emojis.map(em => `\n${em}`)}` : ""}${message.stickers.size > 0 ? `\n__**Stickers**__${message.stickers.map(s => `\n${s.url}`)}` : ""}`,
            color: "RED",
            footer: {
                text: `Case ${caseId}`
            }
        }]
    };

    for (var rawAttachment of message.attachments) {
        const attachment = rawAttachment[1];

        await axios.request({
            url: attachment.url,
            method: "GET",
            responseType: "stream",
            headers: {
                "User-Agent": process.env.AGENT,
            }
        }).then(async (response) => {
            const fileId = `case-${caseId}_${attachment.name}`;
            const fileWrite = await response.data.pipe(fs.createWriteStream(`./src/temp/${fileId}`));

            await fileWrite.on("finish", async () => {
                linkedFiles.push(`./src/temp/${fileId}`);

                files.push({
                    attachment: `./src/temp/${fileId}`,
                    name: `SPOILER_${fileId}`
                });
            });
        });
    }

    guild.channels.cache.get(guildData.MessageLogs).send(messageStructure).then(async sentMessage => {
        while (message.attachments.size !== files.length) {
            await wait(500);
        }

        if (files.length > 0) await sentMessage.reply({
            content: `Message attachments from ${message.author.tag} ||[\${message.author.id}]|| for case ${caseId}`,
            files: files
        });

        for (var linkedFile of linkedFiles) {
            fs.unlink(linkedFile, () => {
                console.log(`Removed ${linkedFile}`);
            });
        }
    });
});