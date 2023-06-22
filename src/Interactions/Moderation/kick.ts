import type { SenkoCommand } from "../../types/AllTypes";
import { PermissionFlagsBits as Permissions, ApplicationCommandOptionType as CommandOption, Colors } from "discord.js";
import { Bitfield } from "bitfields";
import bits from "../../API/Bits.json";

export default {
	name: "kick",
	desc: "Kick a member",
	category: "admin",
	permissions: [Permissions.KickMembers],
	options: [
		{
			name: "user",
			description: "The user to kick",
			required: true,
			type: CommandOption.User
		},
		{
			name: "reason",
			description: "The reason for the kick",
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
		if (!Interaction.member!.permissions.has(Permissions.KickMembers)) return Interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to kick members to use this!",
					color: Senko.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		if (!Interaction.guild!.members.me!.permissions.has(Permissions.KickMembers)) return Interaction.reply({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't kick members! (Make sure I have the \"Kick Members\" permission)",
					color: Senko.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		const userToKick = Interaction.options.getUser("user");
		const guildUser = Interaction.options.getMember("user");
		const reason = Interaction.options.getString("reason") || "No reason provided";

		if (userToKick!.id === Interaction.user.id) return Interaction.reply({
			embeds: [
				{
					title: "Kick error",
					description: "You cannot kick yourself",
					color: Colors.Yellow
				}
			],
			ephemeral: true
		});

		// @ts-ignore
		if (guildUser!.roles.highest.rawPosition >= Interaction.member!.roles.highest.rawPosition) return Interaction.reply({
			embeds: [
				{
					title: "Kick error",
					// @ts-ignore
					description: `You cannot kick ${guildUser!.user.tag}, they either have a higher or equal role to yours.`,
					color: Colors.Yellow
				}
			],
			ephemeral: true
		});

		if (userToKick!.id === Interaction.guild!.ownerId) return Interaction.reply({
			embeds: [
				{
					title: "Kick error",
					description: "You cannot kick the server owner",
					color: Colors.Yellow
				}
			],
			ephemeral: true
		});

		await Interaction.deferReply({ fetchReply: true });

		const kickStruct = {
			embeds: [
				{
					title: "Action Report - Kitsune Kicked",
					description: `${typeof userToKick != "string" ? userToKick!.tag : userToKick} [${typeof userToKick != "string" ? userToKick!.id : userToKick}]\nReason: __${reason}__`,
					color: Colors.Yellow,
					author: {
						name: `${Interaction.user.tag}  [${Interaction.user.id}]`,
						// eslint-disable-next-line camelcase
						icon_url: Interaction.user.displayAvatarURL()
					},
					thumbnail: {}
				}
			]
		};

		const responseStruct = {
			embeds: [
				{
					title: "Kicked Kitsune",
					description: `${typeof userToKick != "string" ? userToKick!.tag : userToKick} has been kicked for __${reason}__`,
					color: Colors.Red
				}
			]
		};

		if (reason === "No reason provided") responseStruct.embeds[0]!.description = `${typeof userToKick != "string" ? userToKick!.tag : userToKick} has been kicked!`;

		if (typeof userToKick != "string") {
			await userToKick?.send({
				embeds: [
					{
						title: `You have been kicked from ${Interaction.guild!.name}`,
						description: `Reason: ${reason}`,
						color: Colors.Orange
					}
				]
			}).catch((err: any) => {
				responseStruct.embeds[0]!.description += `\n\n${err}`;
			});

			Interaction.guild!.members.kick(userToKick!.id, `${Interaction.user.tag} : ${reason}`);
		} else {
			Interaction.guild!.members.kick(userToKick, `${Interaction.user.tag} : ${reason}`);
		}

		if (typeof userToKick != "string") {
			kickStruct.embeds[0]!.thumbnail = {
				url: userToKick!.displayAvatarURL()
			};
		}

		if (GuildData.ActionLogs) {
			// @ts-ignore
			(await Interaction.guild.channels.fetch(GuildData.ActionLogs)).send(kickStruct).catch(err => {
				responseStruct.embeds[0]!.description += `Cannot send action log: \n\n${err}`;
			});
		}

		Interaction.followUp(responseStruct);
	}
} as SenkoCommand;