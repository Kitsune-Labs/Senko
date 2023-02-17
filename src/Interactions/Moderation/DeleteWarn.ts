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
	start: async ({senkoClient, interaction, guildData}) => {
		// @ts-expect-error
		if (!interaction.member!.permissions.has(Permissions.ModerateMembers)) return interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to moderate members to use this!",
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		await interaction.deferReply();

		// @ts-expect-error
		const warnId = interaction.options.getString("warn-id");

		for (var key in guildData.warns) {
			const userWarn = guildData.warns[key];

			if (!userWarn) break;

			for (var warn of userWarn) {
				if (warn.uuid === warnId) {
					// @ts-expect-error
					spliceArray(userWarn, warn);

					await updateSuperGuild(interaction.guild!, {
						warns: guildData.warns
					});

					(await interaction.guild!.members.fetch(key)).send({
						embeds: [
							{
								title: `One of your warns has been deleted in ${interaction.guild!.name}!`,
								description: `Here is some info about what warn was deleted\nWarn id: **${warnId}**\nWarn reason: ${warn.reason}\nWarn note: ${warn.note}`,
								color: senkoClient.api.Theme.light,
								thumbnail: { url: "https://assets.senkosworld.com/media/senko/book.png" }
							}
						]
					}).catch();

					return interaction.followUp({
						embeds: [
							{
								title: "All done!",
								description: `I have deleted warn **${warnId}** from **${warn.userTag}**\n\n> ${warn.reason}\n> ${warn.note}`,
								color: senkoClient.api.Theme.light,
								thumbnail: { url: "https://assets.senkosworld.com/media/senko/book.png" }
							}
						]
					});
				}
			}
		}

		interaction.followUp({
			embeds: [
				{
					title: "I looked around",
					description: `But I cannot find a warning that has **${warnId}** for it's ID...`,
					color: senkoClient.api.Theme.dark,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/think.png" }
				}
			]
		});
	}
} as SenkoCommand;