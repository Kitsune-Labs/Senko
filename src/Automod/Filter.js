/* eslint-disable no-unused-vars */
const { Client, Message } = require("discord.js");
const Icons = require("../Data/Icons.json");
const { fetchSupabaseApi } = require("../API/super");
const config = require("../Data/DataConfig.json");
const { Bitfield } = require("bitfields");
const Supabase = fetchSupabaseApi();
const bits = require("../API/Bits.json");
const { charvert } = require("charverter");
const { clean, strip } = require("../API/Master.js");
const fs = require("fs");

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	execute: async (SenkoClient) => {
		/**
         * @type {Message} message
         */
		SenkoClient.on("messageCreate", async (message) => {
			if (message.channel.parentId === "885623626316013651" || message.author.id === SenkoClient.user.id || !message.guild || message.system) return;

			let { data, error } = await Supabase.from("Guilds").select("*").eq("guildId", message.guildId);
			if (error || data[0] === undefined) return;
			const { flags, filter: filterData } = data[0];
			const guildFlags = Bitfield.fromHex(flags);
			if (!guildFlags.get(bits.FilterEnabled)) return;

			const CharvertedMessage = charvert(message.content);
			const CleanedMessage = clean(CharvertedMessage);
			const StrippedMessage = strip(CleanedMessage);
			const Message = StrippedMessage.toLowerCase();

			const StandardMessage = Message.split(/ +/g);
			const StrictMessage = Message.replaceAll(" ", "");


			new Promise((resolve, reject) => {
				async function doBan() {
					// await message.delete();
					// await message.member.ban({ reason: "AUTOMOD: Blacklisted Word", days: 1 });

					if (filterData.filterLogs) {
						SenkoClient.channels.cache.get(filterData.filterLogs).send({
							embeds: [
								{
									title: "Action Report - Kitsune Banned",
									description: `${message.author.tag} [${message.author.id}]\nReason: Blacklisted Word`,
									color: "RED",
									thumbnail: {
										url: message.author.displayAvatarURL({ dynamic: true })
									},
									author: {
										name: `${SenkoClient.user.tag}  [${SenkoClient.user.id}]`,
										icon_url: SenkoClient.user.displayAvatarURL({ dynamic: true })
									}
								}
							]
						});
					}
				}

				for (var word of filterData.banned_words) {
					for (var sticker of message.stickers) {
						if (sticker[1].name.toLowerCase().replaceAll(" ", "").includes(word)) {
							doBan();
							reject();
						}
					}

					if (StrictMessage.match(word)) {
						doBan();
						reject();
					}
				}
				resolve();
			}).then(async () => {
				if (guildFlags.get(bits.BlockSpecialCharacters)) {

					for (var i = 0; i < Message.length; i++) {
						let char = Message.charAt(i);

						console.log(char);

						if (!config.charSet.includes(char) && config.emojis.includes(char)) {
							// await message.delete();

							if (filterData.filterLogs) {
								SenkoClient.channels.cache.get(filterData.filterLogs).send({
									embeds: [
										{
											title: "Filter Report",
											description: `Triggered: **Special Characters**\n\n${message.author.tag} on <t:${Math.round(Date.now() / 1000)}:f> in ${message.channel}\n\`\`\`\n${clean(message.content)}\`\`\``,
											color: "#FF4F4F"
										}
									]
								});
							}

							break;
						}
					}
				}
			});

		});
	}
};