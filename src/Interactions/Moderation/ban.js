// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, ApplicationCommandOptionType: CommandOption, PermissionFlagsBits, Colors } = require("discord.js");
const {print, randomArrayItem} = require("@kitsune-labs/utilities");
const {stringEndsWithS} = require("../../API/Master");

module.exports = {
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
	permissions: [PermissionFlagsBits.BanMembers],
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, guildData, locale, generalLocale}) => {
		// It shouldn't need this but im hanging onto it just in case
		if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return;
		await interaction.deferReply({ephemeral: true});

		if (!senkoClient.api.Bitfield.fromHex(guildData.flags).get(senkoClient.api.BitData.BETAs.ModCommands)) return interaction.followUp({
			content: generalLocale.invalid_mod,
			ephemeral: true
		});

		if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({
			embeds: [
				{
					title: locale.Permissions.OhDear,
					description: locale.Permissions.Desc,
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		const Reason = interaction.options.getString("reason") || "No reason provided.";
		const Duration = interaction.options.getString("duration");
		const Accounts = [];
		const ActionLog = {
			embeds: []
		};
		const ActionLogChannel = await interaction.guild.channels.fetch(guildData.ActionLogs);


		for (var option of interaction.options._hoistedOptions) {
			if (option.name.startsWith("member")) Accounts.push(option);
		}

		const Reply = {
			content: "** **",
			embeds: []
		};

		function convertToMs() {
			var ms = 0;
			var duration = Duration ? Duration.split(" ") : [];
			for (var time of duration) {
				var number = parseInt(time);
				var unit = time.replace(number, "");
				switch (unit) {
				case "s":
					ms += number * 1000;
					break;
				case "m":
					ms += number * 60000;
					break;
				case "h":
					ms += number * 3600000;
					break;
				case "d":
					ms += number * 86400000;
					break;
				case "w":
					ms += number * 604800000;
					break;
				case "y":
					ms += number * 31536000000;
					break;
				}
			}
			return Math.fround((Date.now() + ms) / 1000);
		}

		function makeEmbed(member, sendFailed, customResponse) {
			const randomResponse = randomArrayItem( locale.randomResponse);
			const ReplyEmbed = {
				title: customResponse ? locale.Reply.BanErrorTitle : locale.Reply.Title,
				description: customResponse || locale.Reply.Desc,
				color: Colors.Red,
				thumbnail: { url: `https://assets.senkosworld.com/media/senko/${randomResponse.image}.png` }
			};

			if (!customResponse && Reason) ReplyEmbed.description = locale.Reply.Desc2;
			if (!customResponse && Duration && !Reason) ReplyEmbed.description = locale.Reply.Desc3;
			if (!customResponse && Duration && Reason) ReplyEmbed.description = locale.Reply.Desc4;

			if (!customResponse) ReplyEmbed.description = ReplyEmbed.description.replace("_USER_", member.user.tag || member).replace("_REASON_", Reason || locale.Reply.NoReason).replace("_TIME_", `<t:${convertToMs(Duration || "")}>`).replace("_TIME2_", `<t:${convertToMs(Duration || "")}:R>`);
			if (!customResponse) ReplyEmbed.description += `\n\n*${randomResponse.text}*`.replace(":KitsuneBi_Blue:", senkoClient.api.Icons.KitsuneBi_Blue);

			if (sendFailed) ReplyEmbed.footer = { text:  locale.Reply.NoDM };

			Reply.embeds.push(ReplyEmbed);
		}

		for (var account of Accounts) {
			if (account.user.id === senkoClient.user.id || account.member.roles.highest.position >= interaction.member.roles.highest.position || account.user.id === interaction.guild.ownerId) {
				makeEmbed(account, false, locale.Reply.BanError.replace("_USER_", account.user.tag || account));
			} else {
				await account.user.send({
					embeds: [
						{
							title: `You have been banned from ${interaction.guild.name}`,
							description: `Reason: ${Reason}${Duration ? `\n[__Banned until <t:${convertToMs()}>__]` : "\n[__Permanately Banned__]"} ${guildData.BanAppeal ? `\n\n${stringEndsWithS(interaction.guild.name)} ban appeal:\n${guildData.BanAppeal}` : ""}`,
							color: Colors.Red
						}
					]
				}).then(()=>makeEmbed(account, false)).catch(()=>makeEmbed(account, true));

				ActionLog.embeds.push({
					title: "Action Report - Kitsune Banned",
					description: `${account.user ? account.user.tag : account} [${account.user ? account.user.id : account}]\n> __${Reason}__\n${Duration ? `\n[__Banned until <t:${convertToMs()}>__]` : "\n[__Permanately Banned__]"}`,
					color: Colors.Red,
					author: {
						name: `${interaction.user.tag}  [${interaction.user.id}]`,
						icon_url: `${interaction.user.displayAvatarURL({ dynamic: true })}`
					}
				});
			}
		}

		if (guildData.ActionLogs) ActionLogChannel.send(ActionLog);

		interaction.followUp(Reply);
	}
};