// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
const { Bitfield } = require("bitfields");
const { CheckPermission } = require("../../API/Master.js");
const bits = require("../../API/Bits.json");
const Icons = require("../../Data/Icons.json");
const { randomArrayItem } = require("@kitsune-laboratories/utilities");

module.exports = {
	name: "ban",
	desc: "Ban's a user",
	options: [
		{
			name: "user",
			description: "The user to ban",
			required: true,
			type: "USER"
		},
		{
			name: "reason",
			description: "The reason for the ban",
			type: "STRING"
		},
		{
			name: "dm",
			description: "Send a DM to the user (Default True)",
			type: "BOOLEAN"
		},
		{
			name: "user2",
			description: "The 2nd user to ban",
			type: "USER"
		},
		{
			name: "user3",
			description: "The 3rd user to ban",
			type: "USER"
		},
		{
			name: "user4",
			description: "The 4th user to ban",
			type: "USER"
		},
		{
			name: "user5",
			description: "The 5th user to ban",
			type: "USER"
		}
	],
	usableAnywhere: true,
	/**
     * @param {Client} SenkoClient
     * @param {Interaction} interaction
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, AccountData) => {
		if (!Bitfield.fromHex(GuildData.flags).get(bits.ModCommands)) return interaction.reply({
			content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`",
			ephemeral: true
		});

		if (!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to ban members to use this!",
					color: SenkoClient.colors.dark,
					thumbnail: {
						url: "attachment://image.png"
					}
				}
			],
			files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
			ephemeral: true
		});

		if (!CheckPermission(interaction, "BAN_MEMBERS")) return interaction.reply({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't ban members! (Make sure I have the \"Ban Members\" permission)",
					color: SenkoClient.colors.dark,
					thumbnail: {
						url: "attachment://image.png"
					}
				}
			],
			files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
			ephemeral: true
		});

		await interaction.deferReply({ fetchReply: true });

		interaction.editReply({ content: "Starting" });

		const users = [];
		const reactions = [
			{
				text: `I'll use my Kitsune Fire to scare them away if they come back ${Icons.KitsuneBi_Blue}`,
				image: "kitsune_fire"
			},
			{
				text: "Don't ever come back!!!",
				image: "angry2"
			},
			{
				text: "You broke the rules?",
				image: "judgement"
			},
			{
				text: "Y-You did what?",
				image: "thinking_nervous"
			}
		];


		for (var Option1 of interaction.options._hoistedOptions) {
			if (Option1.name !== "reason" && Option1.name !== "dm") {
				users.push(Option1.value);
			}
		}

		interaction.editReply({ content: `Banning ${users.length} ${users.length == 1 ? "user" : "users"}` });

		for (var Option of interaction.options._hoistedOptions) {
			if (Option.name !== "reason") {
				let userToOutlaw = Option.value;
				const reason = interaction.options.getString("reason") || "No reason provided";
				const shouldDM = interaction.options.getBoolean("dm") || true;
				const randomResponse = randomArrayItem(reactions);

				if (Option.member) userToOutlaw = Option.member;

				if (Option.member && userToOutlaw.id === interaction.user.id) {
					interaction.channel.send({
						embeds: [
							{
								title: "Ban error",
								description: "You cannot ban yourself",
								color: "YELLOW"
							}
						]
					});
				} else if (Option.member && userToOutlaw.roles.highest.rawPosition >= interaction.member.roles.highest.rawPosition) {
					interaction.channel.send({
						embeds: [
							{
								title: "Ban error",
								description: `You cannot ban ${typeof userToOutlaw != "string" ? userToOutlaw.user.tag : userToOutlaw}, they either have a higher or equal role to yours.`,
								color: "YELLOW"
							}
						]
					});
				} else if (Option.member && userToOutlaw.id === interaction.guild.ownerId) {
					interaction.channel.send({
						embeds: [
							{
								title: "Ban error",
								description: `You cannot ban ${typeof userToOutlaw != "string" ? userToOutlaw.user.tag : userToOutlaw}, they are the server owner.`,
								color: "YELLOW"
							}
						]
					});
				} else if (Option.member && userToOutlaw.user.id === SenkoClient.user.id) {
					interaction.channel.send({
						embeds: [
							{
								title: "Ban error",
								description: "You cannot ban me.",
								color: "YELLOW"
							}
						]
					});
				} else {
					const banStruct = {
						embeds: [
							{
								title: "Action Report - Kitsune Banned",
								description: `${typeof userToOutlaw != "string" ? userToOutlaw.user.tag : userToOutlaw} [${typeof userToOutlaw != "string" ? userToOutlaw.user.id : userToOutlaw}]\nReason: __${reason}__`,
								color: "RED",
								author: {
									name: `${interaction.user.tag}  [${interaction.user.id}]`,
									icon_url: `${interaction.user.displayAvatarURL({ dynamic: true })}`
								}
							}
						]
					};

					const responseStruct = {
						embeds: [
							{
								title: "Banned Kitsune",
								description: `${typeof userToOutlaw != "string" ? userToOutlaw.user.tag : userToOutlaw} has been banned for __${reason}__\n\n${randomResponse.text}`,
								color: "RED",
								thumbnail: { url: "attachment://image.png" }
							}
						],
						files: [{ attachment: `./src/Data/content/senko/${randomResponse.image}.png`, name: "image.png" }]
					};

					if (reason === "No reason provided") responseStruct.embeds[0].description = `${typeof userToOutlaw != "string" ? userToOutlaw.user.tag : userToOutlaw} has been banned!`;

					if (typeof userToOutlaw != "string") {
						if (shouldDM === true) await userToOutlaw.send({
							embeds: [
								{
									title: `You have been banned from ${interaction.guild.name}`,
									description: `Reason: ${reason}`, //\n\nAppeal: ${GuildData.OutlawAppealForm.replaceAll("[", "\\[").replaceAll("]", "\\]")}`,
									color: "RED"
								}
							]
						}).catch(err => {
							responseStruct.embeds[0].description += `\n\nDM Unsent\n${err}`;
						});

						interaction.guild.members.ban(userToOutlaw.user.id, { reason: `${interaction.user.tag} : ${reason}`, days: 1 });
					} else {
						interaction.guild.members.ban(userToOutlaw, { reason: `${interaction.user.tag} : ${reason}`, days: 1 });

						if (typeof userToOutlaw != "string") {
							banStruct.embeds[0].thumbnail = {
								url: userToOutlaw.user.displayAvatarURL({ dynamic: true })
							};
						}

						if (GuildData.ActionLogs) {
							interaction.guild.channels.cache.get(GuildData.ActionLogs).send(banStruct).catch(err => {
								responseStruct.embeds[0].description += `Cannot send action log: \n\n${err}`;
							});
						}
					}

					interaction.channel.send(responseStruct);
				}
			}
		}

		interaction.editReply({ content: "Done" });
	}
};