import type { SenkoCommand } from "../../types/AllTypes";
import { PermissionFlagsBits as Permissions, ApplicationCommandOptionType as CommandOption, Colors } from "discord.js";
import { Bitfield } from "bitfields";
import bits from "../../API/Bits.json";

export default {
	name: "unban",
	desc: "Unban a user",
	usableAnywhere: true,
	category: "admin",
	permissions: [Permissions.BanMembers],
	options: [
		{
			name: "user-id",
			description: "User Id",
			required: true,
			type: CommandOption.String
		},
		{
			name: "reason",
			description: "Why is this user unbanned?",
			type: CommandOption.String
		}
	],
	whitelist: true,
	start: async ({ Senko, Interaction, GuildData }) => {
		if (!Bitfield.fromHex(GuildData.flags).get(bits.BETAs.ModCommands)) return Interaction.reply({
			content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`",
			ephemeral: true
		});

		// @ts-ignore
		if (!Interaction.member!.permissions.has(Permissions.BanMembers)) return Interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to ban members to use this!",
					color: Senko.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		if (!Interaction.guild!.members.me!.permissions.has(Permissions.BanMembers)) return Interaction.reply({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't unban members! (Make sure I have the \"Ban Members\" permission)",
					color: Senko.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		const userId = Interaction.options.getString("user-id", true);
		const unbanReason = Interaction.options.getString("reason");
		const bannedUser = await Interaction.guild!.bans.fetch(userId).catch(() => null);

		if (!bannedUser) return Interaction.reply({
			embeds: [
				{
					title: "I don't see anything",
					description: "This user is not banned from this server",
					color: Senko.Theme.dark,
					thumbnail: { url: "https://cdn.senko.gg/public/senko/book.png" }
				}
			],
			ephemeral: true
		});

		await Interaction.deferReply();

		await Interaction.guild!.members.unban(userId, unbanReason || "No reason given");

		if (GuildData.ActionLogs) {
			// @ts-ignore
			(await Interaction.guild!.channels.fetch(GuildData.ActionLogs)).send({
				embeds: [
					{
						title: "Action Report - Kitsune Pardoned",
						description: `${userId} [${userId || "000000000000000000"}]\nReason: ${unbanReason || "No reason given"}`,
						color: Colors.Green,
						author: {
							name: `${Interaction.user.tag}  [${Interaction.user.id}]`,
							// eslint-disable-next-line camelcase
							icon_url: `${Interaction.user.displayAvatarURL()}`
						}
					}
				]
			});
		}

		Interaction.followUp({
			embeds: [
				{
					title: "All done dear!",
					description: `I've unbanned ${userId} for you!\n\n${unbanReason ? `Reason: ${unbanReason}` : ""}`,
					color: Senko.Theme.light,
					thumbnail: { url: "https://cdn.senko.gg/public/senko/bless.png" }
				}
			]
		});
	}
} as SenkoCommand;