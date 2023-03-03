import type { SenkoCommand } from "../../types/AllTypes";
import { ChannelType, GuildMember, GuildTextBasedChannel } from "discord.js";
import { PermissionFlagsBits as Permissions, ApplicationCommandOptionType as CommandOption, Colors } from "discord.js";
import Icons from "../../Data/Icons.json";
import { updateSuperGuild } from "../../API/super";
import { v4 as uuidv4 } from "uuid";
import { Bitfield } from "bitfields";
import bits from "../../API/Bits.json";
import type { GuildWarn } from "../../types/SupabaseTypes";

export default {
	name: "warn",
	desc: "warn",
	category: "admin",
	permissions: [Permissions.ModerateMembers],
	options: [
		{
			name: "user",
			description: "The user to warn",
			required: true,
			type: CommandOption.User
		},
		{
			name: "reason",
			description: "Reason",
			type: CommandOption.String
		},
		{
			name: "note",
			description: "If you want to provide a note outside of the reason type it here",
			type: CommandOption.String
		}
	],
	whitelist: true,
	start: async ({senkoClient, interaction, guildData}) => {
		const guildWarns = guildData.warns;
		const ActionLogs = guildData.ActionLogs;
		const flags = guildData.flags;

		const user = interaction.options.getMember("user") as GuildMember;
		const reason = interaction.options.getString("reason") || "No Reason Provided";
		const note = interaction.options.getString("note") || "No note(s) provided";

		if (!Bitfield.fromHex(flags).get(bits.BETAs.ModCommands)) return interaction.reply({
			content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`",
			ephemeral: true
		});

		// @ts-ignore
		if (!interaction.member!.permissions.has(Permissions.ModerateMembers)) return interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to moderate members to use this!",
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});
		let roleSize = 1;

		await interaction.guild!.roles.fetch().then(roles => {
			roleSize = roles.size;
		});

		// @ts-ignore
		if (interaction.member!.id != interaction.guild!.ownerId && roleSize > 1 && user!.roles.highest.rawPosition >= interaction.member!.roles.highest.rawPosition) return interaction.reply({ content: "You can't warn members that have an equal or higher role", ephemeral: true });

		if (!user) return interaction.reply({ content: "I can't find this user!", ephemeral: true });
		if (user.id === interaction.user.id) return interaction.reply({ content: "You cannot warn yourself", ephemeral: true });
		if (user.user.bot) return interaction.reply({ content: `${Icons.exclamation}  You cannot warn bots`, ephemeral: true });

		await interaction.deferReply();

		const messageStruct = {
			content: "",
			embeds: [
				{
					title: "Warned Kitsune",
					description: `I have warned __${user.user.tag}__ for __${reason}__`,
					footer: {},
					color: 0xFF6699
				}
			]
		};

		if (note !== "No note provided") messageStruct.embeds[0]!.footer = { text: "Your note has been attached" };

		const warnStruct: GuildWarn = {
			userTag: user.user.tag,
			userId: user.user.id,
			reason: reason,
			note: note,
			date: Date.now(),
			moderator: interaction.user.tag,
			moderatorId: interaction.user.id,
			uuid: uuidv4().slice(0, 8),
			userDmd: false
		};

		if (user.id in guildWarns) {
			guildWarns[user.id]!.push(warnStruct);
		} else {
			guildWarns[user.id] = [warnStruct];
		}

		await updateSuperGuild(interaction.guild!, { warns: guildWarns });

		if (ActionLogs) {
			const channel = await interaction.guild!.channels.fetch(ActionLogs) as GuildTextBasedChannel;

			if (channel.type !== ChannelType.GuildText) return;
			if (!channel) return messageStruct.content = "I do not have access to the Action Logs channel or it does not exist!";

			channel.send({
				embeds: [
					{
						title: "Action Report - Kitsune Warned",
						description: `${user.user.tag} [${user.id}]\nReason: ${warnStruct.reason}\nNote: ${warnStruct.note}`,
						color: Colors.Yellow,
						thumbnail: {
							url: user.user.displayAvatarURL()
						},
						author: {
							name: `${interaction.user.tag}  [${interaction.user.id}]`,
							icon_url: `${interaction.user.displayAvatarURL()}`
						}
					}
				]
			}).catch(err => {
				// @ts-ignore
				interaction.channel?.send({
					content: `There was an error sending the action report: ${err}`
				});
			});
		}

		try {
			await user.send({
				embeds: [
					{
						title: `You have been warned in ${interaction.guild!.name}`,
						description: `Your reason: ${warnStruct.reason}\nNote: ${warnStruct.note}`,
						color: Colors.Yellow
					}
				]
			});

			warnStruct.userDmd = true;
			messageStruct.embeds[0]!.description += "\nUser has been DM'd";
		} catch (e) {
			warnStruct.userDmd = false;
			messageStruct.embeds[0]!.description += "\nUser has **not** been DM'd";
		}

		// @ts-expect-error
		interaction.followUp(messageStruct);
	}
} as SenkoCommand;