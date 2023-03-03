import type { SenkoCommand, SenkoMessageOptions } from "../../types/AllTypes";
import { PermissionFlagsBits as Permissions, ApplicationCommandOptionType as CommandOption, Colors, GuildMember } from "discord.js";
import { randomArrayItem, convertToMs } from "@kitsune-labs/utilities";
import { stringEndsWithS } from "../../API/Master";
import { Bitfield } from "bitfields";

export default {
	name: "ban",
	desc: "Ban a member from your server",
	options: [
		{
			name: "member",
			description: "The member you want to ban",
			type: CommandOption.User,
			required: true
		},
		{
			name: "reason",
			description: "The reason for the ban",
			type: CommandOption.String
		},
		// {
		// 	name: "duration",
		// 	description: "When the ban should expire",
		// 	type: CommandOption.String
		// },
		{
			name: "member-2",
			description: "The member you want to ban",
			type: CommandOption.User
		},
		{
			name: "member-3",
			description: "The member you want to ban",
			type: CommandOption.User
		},
		{
			name: "member-4",
			description: "The member you want to ban",
			type: CommandOption.User
		},
		{
			name: "member-5",
			description: "The member you want to ban",
			type: CommandOption.User
		}
	],
	usableAnywhere: true,
	category: "admin",
	permissions: [Permissions.BanMembers],
	start: async ({ senkoClient, interaction, guildData, locale, generalLocale }) => {
		// It shouldn't need this but im hanging onto it just in case
		// @ts-ignore
		if (!interaction.member?.permissions.has(Permissions.BanMembers)) return;
		await interaction.deferReply({ ephemeral: true });

		if (!Bitfield.fromHex(guildData.flags).get(senkoClient.api.BitData.BETAs.ModCommands)) return interaction.followUp({
			content: generalLocale.invalid_mod,
			ephemeral: true
		});


		if (!interaction.guild?.members.me!.permissions.has(Permissions.BanMembers)) return interaction.reply({
			embeds: [
				{
					title: locale.Permissions.OhDear,
					description: locale.Permissions.Desc,
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		const Reason = interaction.options.getString("reason") || "No reason provided.";
		const Duration = interaction.options.getString("duration");
		const Accounts = [];
		const ActionLog: SenkoMessageOptions = {
			embeds: []
		};
		const ActionLogChannel = await interaction.guild!.channels.fetch(guildData.ActionLogs);


		// @ts-expect-error
		for (var option of interaction.options._hoistedOptions) {
			if (option.name.startsWith("member")) Accounts.push(option);
		}

		const Reply = {
			content: "** **",
			embeds: []
		};

		function makeEmbed(member: GuildMember, sendFailed: boolean, customResponse?: any) {
			const randomResponse = randomArrayItem(locale.randomResponse);
			const ReplyEmbed = {
				title: customResponse ? locale.Reply.BanErrorTitle : locale.Reply.Title,
				description: customResponse || locale.Reply.Desc,
				color: Colors.Red,
				thumbnail: { url: `https://cdn.senko.gg/public/senko/${randomResponse.image}.png` },
				footer: {}
			};

			if (!customResponse && Reason) ReplyEmbed.description = locale.Reply.Desc2;
			if (!customResponse && Duration && !Reason) ReplyEmbed.description = locale.Reply.Desc3;
			if (!customResponse && Duration && Reason) ReplyEmbed.description = locale.Reply.Desc4;

			if (!customResponse) ReplyEmbed.description = ReplyEmbed.description.replace("_USER_", member.user.tag || member).replace("_REASON_", Reason || locale.Reply.NoReason).replace("_TIME_", `<t:${convertToMs(Duration || "")}>`).replace("_TIME2_", `<t:${convertToMs(Duration || "")}:R>`);
			if (!customResponse) ReplyEmbed.description += `\n\n*${randomResponse.text}*`.replace(":KitsuneBi_Blue:", senkoClient.api.Icons.KitsuneBi_Blue);

			if (sendFailed) ReplyEmbed.footer = { text: locale.Reply.NoDM };

			// @ts-expect-error
			Reply.embeds.push(ReplyEmbed);
		}

		for (var account of Accounts) {
			if (account.user && account.member) {
				// @ts-ignore
				if (account.user.id === senkoClient.user!.id || account.member.roles.highest.position >= interaction.member!.roles.highest.position || account.user.id === interaction.guild!.ownerId) makeEmbed(account, false, locale.Reply.BanError.replace("_USER_", account.user.tag || account));
			} else {
				const isMember = await interaction.guild!.members.fetch(account.value).catch(() => false);

				if (isMember) {
					await account.user.send({
						embeds: [
							{
								title: `You have been banned from ${interaction.guild!.name}`,
								description: `Reason: ${Reason}${Duration ? `\n[__Banned until <t:${convertToMs(Duration)}>__]` : "\n[__Permanately Banned__]"} ${guildData.BanAppeal ? `\n\n${stringEndsWithS(interaction.guild!.name)} ban appeal:\n${guildData.BanAppeal}` : ""}`,
								color: Colors.Red
							}
						]
					}).then(() => makeEmbed(account, false)).catch(() => makeEmbed(account, true));
				} else {
					makeEmbed(account, true);
				}

				await interaction.guild!.members.ban(account.user.id || account, { reason: `${interaction.user.tag} - ${Reason}`, deleteMessageSeconds: 24 * 60 * 60 });

				ActionLog.embeds!.push({
					title: "Action Report - Kitsune Banned",
					description: `${account.user ? account.user.tag : account} [${account.user ? account.user.id : account}]\n> __${Reason}__\n${Duration ? `\n[__Banned until <t:${convertToMs(Duration)}>__]` : "\n[__Permanately Banned__]"}`,
					color: Colors.Red,
					author: {
						name: `${interaction.user.tag}  [${interaction.user.id}]`,
						// @ts-expect-error
						icon_url: `${interaction.user.displayAvatarURL({ dynamic: true })}`
					}
				});
			}
		}

		// @ts-expect-error
		if (guildData.ActionLogs) ActionLogChannel!.send(ActionLog);

		interaction.followUp(Reply);
	}
} as SenkoCommand;