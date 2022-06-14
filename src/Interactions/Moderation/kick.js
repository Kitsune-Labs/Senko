// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
const { Bitfield } = require("bitfields");
const { CheckPermission } = require("../../API/Master.js");
const bits = require("../../API/Bits.json");


module.exports = {
	name: "kick",
	desc: "Kick a member",
	options: [
		{
			name: "user",
			description: "The user to kick",
			required: true,
			type: "USER"
		},
		{
			name: "reason",
			description: "The reason for the kick",
			type: "STRING"
		}
	],
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

		if (!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to kick members to use this!",
					color: SenkoClient.colors.dark,
					thumbnail: {
						url: "attachment://image.png"
					}
				}
			],
			files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
			ephemeral: true
		});

		if (!CheckPermission(interaction, "KICK_MEMBERS")) return interaction.reply({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't kick members! (Make sure I have the \"Kick Members\" permission)",
					color: SenkoClient.colors.dark,
					thumbnail: {
						url: "attachment://image.png"
					}
				}
			],
			files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }],
			ephemeral: true
		});

		const userToKick = interaction.options.getUser("user");
		const guildUser = interaction.options.getMember("user");
		const reason = interaction.options.getString("reason") || "No reason provided";

		if (userToKick.id === interaction.user.id) return interaction.reply({
			embeds: [
				{
					title: "Kick error",
					description: "You cannot kick yourself",
					color: "YELLOW"
				}
			],
			ephemeral: true
		});

		if (guildUser.roles.highest.rawPosition >= interaction.member.roles.highest.rawPosition) return interaction.reply({
			embeds: [
				{
					title: "Kick error",
					description: `You cannot kick ${guildUser.user.tag}, they either have a higher or equal role to yours.`,
					color: "YELLOW"
				}
			],
			ephemeral: true
		});

		if (userToKick.id === interaction.guild.ownerId) return interaction.reply({
			embeds: [
				{
					title: "Kick error",
					description: "You cannot kick the server owner",
					color: "YELLOW"
				}
			],
			ephemeral: true
		});

		await interaction.deferReply({ fetchReply: true });

		const kickStruct = {
			embeds: [
				{
					title: "Action Report - Kitsune Kicked",
					description: `${typeof userToKick != "string" ? userToKick.tag : userToKick} [${typeof userToKick != "string" ? userToKick.id : userToKick}]\nReason: __${reason}__`,
					color: "YELLOW",
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
					title: "Kicked Kitsune",
					description: `${typeof userToKick != "string" ? userToKick.tag : userToKick} has been kicked for __${reason}__`,
					color: "RED"
				}
			]
		};

		if (reason === "No reason provided") responseStruct.embeds[0].description = `${typeof userToKick != "string" ? userToKick.tag : userToKick} has been kicked!`;

		if (typeof userToKick != "string") {
			await userToKick.send({
				embeds: [
					{
						title: `You have been kicked from ${interaction.guild.name}`,
						description: `Reason: ${reason}`,
						color: "ORANGE"
					}
				]
			}).catch(err => {
				responseStruct.embeds[0].description += `\n\n${err}`;
			});

			interaction.guild.members.kick(userToKick.id, `${interaction.user.tag} : ${reason}`);
		} else {
			interaction.guild.members.kick(userToKick, `${interaction.user.tag} : ${reason}`);
		}

		if (typeof userToKick != "string") {
			kickStruct.embeds[0].thumbnail = {
				url: userToKick.displayAvatarURL({ dynamic: true })
			};
		}

		if (GuildData.ActionLogs) {
			interaction.guild.channels.cache.get(GuildData.ActionLogs).send(kickStruct).catch(err => {
				responseStruct.embeds[0].description += `Cannot send action log: \n\n${err}`;
			});
		}

		interaction.followUp(responseStruct);
	}
};