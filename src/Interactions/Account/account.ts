import type { SenkoCommand } from "../../types/AllTypes";
import { ApplicationCommandOptionType as CommandOption, ButtonStyle } from "discord.js";
import jszip from "jszip";
import { fetchAllGuilds } from "../../API/super";
import type { GuildWarn } from "../../types/SupabaseTypes";
import { Bitfield } from "bitfields";
import type { DJSEmbedField } from "../../types/Discord.js";

export default {
	name: "account",
	desc: "Account related stuff",
	category: "account",
	options: [
		{
			name: "data",
			description: "Account data",
			type: CommandOption.SubcommandGroup,
			options: [
				{
					name: "request",
					description: "Request your account data",
					type: CommandOption.Subcommand
				},
				{
					name: "delete",
					description: "Delete your account data",
					type: CommandOption.Subcommand
				}
			]
		},
		{
			name: "settings",
			description: "Account settings",
			type: CommandOption.Subcommand
		}
	],
	usableAnywhere: true,
	whitelist: true,
	start: async ({ Senko, Interaction, MemberData }) => {
		switch (Interaction.options.getSubcommand()) {
			case "request":
				await Interaction.deferReply({ ephemeral: true });

				var zip = new jszip();

				zip.file("user.json", JSON.stringify(MemberData));

				var array: any = {};
				var data = await fetchAllGuilds();

				if (data && data.length == 0 || data == null) {
					Interaction.followUp({ content: "There was an error in fetching guild data!", ephemeral: true });
					return;
				}

				for (var index in data) {
					var guild = data[index];

					for (var index2 in guild!.warns) {
						// @ts-expect-error
						var warn: GuildWarn = guild!.warns[index2];

						if (index2 == Interaction.user.id || warn.moderatorId === Interaction.user.id) {
							// @ts-expect-error
							for (var warn2 of warn) {
								if (array[guild!.guildId]) {
									array[guild!.guildId].push(warn2);
								} else {
									array[guild!.guildId] = [warn2];
								}
							}
						}
					}
				}

				if (Object.keys(array).length > 0) {
					var guilds = zip.folder("guilds");

					for (var key in array) {
						guilds!.file(`${key}.json`, JSON.stringify(array[key]));
					}
				}

				zip.generateAsync({ type: "nodebuffer" }).then(async content => {
					await Interaction.followUp({
						files: [{
							attachment: content,
							name: "Account_Data.zip"
						}]
					});
				});
				break;
			case "delete":
				Interaction.reply({
					embeds: [
						{
							title: "Data Removal",
							description: "Please confirm that you want to delete all your data.\n\n**⚠️ This is irreversible! ⚠️**",
							color: Senko.Theme.dark,
							thumbnail: { url: "https://cdn.senko.gg/public/senko/upset2.png" }
						}
					],
					components: [
						{
							type: 1,
							components: [
								{ type: 2, label: "I wan't to delete ALL my data and I know this is irreversible.", style: 4, customId: "B0BB293E-C99E-467C-84DA-663BE1F5EF85" }
							]
						}
					],
					ephemeral: true
				});
				break;
			case "settings":
				var AccountFlags = Bitfield.fromHex(MemberData.LocalUser.accountConfig.flags);

				var AccountEmbed = {
					title: "Account Settings",
					fields: [] as DJSEmbedField[],
					color: Senko.Theme.light
				};
				var Components = [
					{
						type: 1,
						components: [
							{ type: 2, label: "Change Privacy", style: 3, customId: "user_privacy" },
							{ type: 2, label: "DM Achievements", style: 3, customId: "user_dm_achievements", disabled: true }
						]
					},
					{
						type: 1,
						components: [
							{ type: 2, label: "30 day removal (Default)", style: MemberData.DeletionDays == 30 ? ButtonStyle.Success : ButtonStyle.Primary, customId: "removal:30", disabled: MemberData.DeletionDays == 30 ? true : false },
							{ type: 2, label: "60 day removal", style: MemberData.DeletionDays == 60 ? ButtonStyle.Success : ButtonStyle.Primary, customId: "removal:60", disabled: MemberData.DeletionDays == 60 ? true : false },
							{ type: 2, label: "1 year removal", style: MemberData.DeletionDays == 365 ? ButtonStyle.Success : ButtonStyle.Primary, customId: "removal:365", disabled: MemberData.DeletionDays == 365 ? true : false }
						]
					}
				];

				var ReturnMessage = {
					embeds: [
						AccountEmbed,
						{
							title: "Data Settings",
							description: `Your data will be deleted in **__${MemberData.DeletionDays}__** days without use.`,
							color: Senko.Theme.light
						}
					],
					components: Components,
					ephemeral: true
				};

				if (AccountFlags.get(Senko.api.BitData.IndefiniteData)) {
					Components[1]!.components.push({ type: 2, label: "Keep Forever", style: MemberData.DeletionDays == 7777777 ? ButtonStyle.Success : ButtonStyle.Primary, customId: "removal:7777777", disabled: MemberData.DeletionDays == 7777777 ? true : false });
				}

				if (AccountFlags.get(Senko.api.BitData.Private)) {
					AccountEmbed.fields.push({ name: "Private Profile", value: Senko.Icons.enabled });
					Components[0]!.components[0]!.style = 3;
				} else {
					AccountEmbed.fields.push({ name: "Private Profile", value: Senko.Icons.disabled });
					Components[0]!.components[0]!.style = 4;
				}

				if (AccountFlags.get(Senko.api.BitData.DMAchievements)) {
					AccountEmbed.fields.push({ name: "DM Achievements", value: Senko.Icons.enabled });
					Components[0]!.components[1]!.style = 3;
				} else {
					AccountEmbed.fields.push({ name: "DM Achievements", value: Senko.Icons.disabled });
					Components[0]!.components[1]!.style = 4;
				}

				Interaction.reply(ReturnMessage);
				break;
		}
	}
} as SenkoCommand;