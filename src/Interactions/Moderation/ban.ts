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
	start: async ({ Senko, Interaction, GuildData, GeneralLocale, CommandLocale }) => {
		// It shouldn't need this but im hanging onto it just in case
		// @ts-ignore
		if (!Interaction.member?.permissions.has(Permissions.BanMembers)) return;
		await Interaction.deferReply({ ephemeral: true });

		if (!Bitfield.fromHex(GuildData.flags).get(Senko.api.BitData.BETAs.ModCommands)) return Interaction.followUp({
			content: GeneralLocale.invalid_mod,
			ephemeral: true
		});

		if (!Interaction.guild?.members.me!.permissions.has(Permissions.BanMembers)) return Interaction.reply({
			embeds: [
				{
					title: CommandLocale,
					description: CommandLocale.Permissions.Desc,
					color: Senko.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		const Reason = Interaction.options.getString("reason") || "No reason provided.";
		const Duration = Interaction.options.getString("duration");
		const Accounts = [];
		const ActionLog: SenkoMessageOptions = {
			embeds: []
		};
		const ActionLogChannel = await Interaction.guild!.channels.fetch(GuildData.ActionLogs);


		// @ts-expect-error
		for (var option of Interaction.options._hoistedOptions) {
			if (option.name.startsWith("member")) Accounts.push(option);
		}

		const Reply = {
			content: "** **",
			embeds: []
		};

		function makeEmbed(member: GuildMember, sendFailed: boolean, customResponse?: any) {
			const randomResponse = randomArrayItem(CommandLocale.randomResponse);
			const ReplyEmbed = {
				title: customResponse ? CommandLocale.Reply.BanErrorTitle : CommandLocale.Reply.Title,
				description: customResponse || CommandLocale.Reply.Desc,
				color: Colors.Red,
				thumbnail: { url: `https://cdn.senko.gg/public/senko/${randomResponse.image}.png` },
				footer: {}
			};

			if (!customResponse && Reason) ReplyEmbed.description = CommandLocale.Reply.Desc2;
			if (!customResponse && Duration && !Reason) ReplyEmbed.description = CommandLocale.Reply.Desc3;
			if (!customResponse && Duration && Reason) ReplyEmbed.description = CommandLocale.Reply.Desc4;

			if (!customResponse) ReplyEmbed.description = ReplyEmbed.description.replace("_USER_", member.user.tag || member).replace("_REASON_", Reason || CommandLocale.Reply.NoReason).replace("_TIME_", `<t:${convertToMs(Duration || "")}>`).replace("_TIME2_", `<t:${convertToMs(Duration || "")}:R>`);
			if (!customResponse) ReplyEmbed.description += `\n\n*${randomResponse.text}*`.replace(":KitsuneBi_Blue:", Senko.Icons.KitsuneBi_Blue);

			if (sendFailed) ReplyEmbed.footer = { text: CommandLocale.Reply.NoDM };

			// @ts-expect-error
			Reply.embeds.push(ReplyEmbed);
		}

		for (var account of Accounts) {
			if (account.user && account.member) {
				// @ts-ignore
				if (account.user.id === Senko.user!.id || account.member.roles.highest.position >= Interaction.member!.roles.highest.position || account.user.id === Interaction.guild!.ownerId) makeEmbed(account, false, locale.Reply.BanError.replace("_USER_", account.user.tag || account));
			} else {
				const isMember = await Interaction.guild!.members.fetch(account.value).catch(() => false);

				if (isMember) {
					await account.user.send({
						embeds: [
							{
								title: `You have been banned from ${Interaction.guild!.name}`,
								description: `Reason: ${Reason}${Duration ? `\n[__Banned until <t:${convertToMs(Duration)}>__]` : "\n[__Permanately Banned__]"} ${GuildData.BanAppeal ? `\n\n${stringEndsWithS(Interaction.guild!.name)} ban appeal:\n${GuildData.BanAppeal}` : ""}`,
								color: Colors.Red
							}
						]
					}).then(() => makeEmbed(account, false)).catch(() => makeEmbed(account, true));
				} else {
					makeEmbed(account, true);
				}

				await Interaction.guild!.members.ban(account.user.id || account, { reason: `${Interaction.user.tag} - ${Reason}`, deleteMessageSeconds: 24 * 60 * 60 });

				ActionLog.embeds!.push({
					title: "Action Report - Kitsune Banned",
					description: `${account.user ? account.user.tag : account} [${account.user ? account.user.id : account}]\n> __${Reason}__\n${Duration ? `\n[__Banned until <t:${convertToMs(Duration)}>__]` : "\n[__Permanately Banned__]"}`,
					color: Colors.Red,
					author: {
						name: `${Interaction.user.tag}  [${Interaction.user.id}]`,
						// eslint-disable-next-line camelcase
						icon_url: Interaction.user.displayAvatarURL()
					}
				});
			}
		}

		// @ts-expect-error
		if (GuildData.ActionLogs) ActionLogChannel!.send(ActionLog);

		Interaction.followUp(Reply);
	}
} as SenkoCommand;