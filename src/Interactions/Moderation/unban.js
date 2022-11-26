// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Colors, PermissionFlagsBits } = require("discord.js");
const { Bitfield } = require("bitfields");
const bits = require("../../API/Bits.json");

module.exports = {
	name: "unban",
	desc: "Unban a user",
	usableAnywhere: true,
	category: "admin",
	permissions: ["BanMembers"],
	options: [
		{
			name: "user-id",
			description: "User Id",
			required: true,
			type: 3 //? Might make this an interger | https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandOptionType#Integer
		},
		{
			name: "reason",
			description: "Why is this user unbanned?",
			type: 3
		}
	],
	whitelist: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, guildData}) => {
		if (!Bitfield.fromHex(guildData.flags).get(bits.BETAs.ModCommands)) return interaction.reply({
			content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`",
			ephemeral: true
		});

		if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to ban members to use this!",
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't unban members! (Make sure I have the \"Ban Members\" permission)",
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		const userId = interaction.options.getString("user-id");
		const unbanReason = interaction.options.getString("reason");
		const bannedUser = await interaction.guild.bans.fetch(userId).catch(()=>{});

		if (!bannedUser) return interaction.reply({
			embeds: [
				{
					title: "I don't see anything",
					description: "This user is not banned from this server",
					color: senkoClient.api.Theme.dark,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/book.png" }
				}
			],
			ephemeral: true
		});

		await interaction.deferReply();

		await interaction.guild.members.unban(userId, unbanReason || "No reason given");

		if (guildData.ActionLogs) {
			(await interaction.guild.channels.fetch(guildData.ActionLogs)).send({
				embeds: [
					{
						title: "Action Report - Kitsune Pardoned",
						description: `${userId} [${userId || "000000000000000000"}]\nReason: ${unbanReason || "No reason given"}`,
						color: Colors.Green,
						author: {
							name: `${interaction.user.tag}  [${interaction.user.id}]`,
							icon_url: `${interaction.user.displayAvatarURL({ dynamic: true })}`
						}
					}
				]
			});
		}

		interaction.followUp({
			embeds: [
				{
					title: "All done dear!",
					description: `I've unbanned ${userId} for you!\n\n${unbanReason ? `Reason: ${unbanReason}` : ""}`,
					color: senkoClient.api.Theme.light,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/bless.png" }
				}
			]
		});
	}
};