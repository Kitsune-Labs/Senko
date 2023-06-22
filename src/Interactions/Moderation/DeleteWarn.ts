import { PermissionFlagsBits as Permissions, ApplicationCommandOptionType as CommandOption } from "discord.js";
import { spliceArray } from "@kitsune-labs/utilities";
import { updateSuperGuild } from "../../API/super";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "delete-warn",
	desc: "delete a warn from a guild member",
	usableAnywhere: true,
	category: "admin",
	permissions: [Permissions.ManageGuild],
	options: [
		{
			name: "warn-id",
			description: "The warn ID",
			type: CommandOption.String,
			required: true
		}
	],
	whitelist: true,
	start: async ({ Senko, Interaction, GuildData }) => {
		// @ts-ignore
		if (!Interaction.member!.permissions.has(Permissions.ModerateMembers)) return Interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to moderate members to use this!",
					color: Senko.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		await Interaction.deferReply();

		const warnId = Interaction.options.getString("warn-id");

		for (var key in GuildData.warns) {
			const userWarn = GuildData.warns[key];

			if (!userWarn) break;

			for (var warn of userWarn) {
				if (warn.uuid === warnId) {
					spliceArray(userWarn, warn);

					await updateSuperGuild(Interaction.guild!, {
						warns: GuildData.warns
					});

					(await Interaction.guild!.members.fetch(key)).send({
						embeds: [
							{
								title: `One of your warns has been deleted in ${Interaction.guild!.name}!`,
								description: `Here is some info about what warn was deleted\nWarn id: **${warnId}**\nWarn reason: ${warn.reason}\nWarn note: ${warn.note}`,
								color: Senko.Theme.light,
								thumbnail: { url: "https://cdn.senko.gg/public/senko/book.png" }
							}
						]
					}).catch();

					return Interaction.followUp({
						embeds: [
							{
								title: "All done!",
								description: `I have deleted warn **${warnId}** from **${warn.userTag}**\n\n> ${warn.reason}\n> ${warn.note}`,
								color: Senko.Theme.light,
								thumbnail: { url: "https://cdn.senko.gg/public/senko/book.png" }
							}
						]
					});
				}
			}
		}

		Interaction.followUp({
			embeds: [
				{
					title: "I looked around",
					description: `But I cannot find a warning that has **${warnId}** for it's ID...`,
					color: Senko.Theme.dark,
					thumbnail: { url: "https://cdn.senko.gg/public/senko/think.png" }
				}
			]
		});
	}
} as SenkoCommand;