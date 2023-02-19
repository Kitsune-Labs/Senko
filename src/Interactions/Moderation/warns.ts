import type { SenkoCommand } from "../../types/AllTypes";
import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import Icons from "../../Data/Icons.json";
import Paginate from "../../API/Pagination/Command";
import type { GuildWarn } from "../../types/SupabaseTypes";

export default {
	name: "warns",
	desc: "View warns for a user",
	defer: false,
	usableAnywhere: true,
	category: "admin",
	options: [
		{
			name: "user",
			description: "The user to view warns for",
			type: CommandOption.User
		}
	],
	whitelist: true,
	start: async ({senkoClient, interaction, guildData}) => {
		const user = interaction.options.getUser("user") || interaction.user;

		if (guildData.warns[user.id]) {
			const warns = guildData.warns[user.id] || [] as Array<GuildWarn>;
			const PageEstimate = Math.ceil(warns.length / 8) < 1 ? 1 : Math.ceil(warns.length / 8);
			const Pages = [];

			for (let i = 0; i < PageEstimate; i++) {
				const Page = {
					title: "",
					description: "",
					color: senkoClient.api.Theme.light
				};

				const start = i * 8;
				const end = Math.min(start + 8, warns.length);
				const warnings = warns.slice(start, end);

				for (const warn of warnings) {
					Page.title = `${warn.userTag}'s warnings`;
					Page.description += `Warn **${warn.uuid}**\n`;
					Page.description += `> Warned by ${warn.moderator} ||[${warn.moderatorId}]|| on <t:${Math.ceil(warn.date/1000)}> for "${warn.reason}"\n`;
					Page.description += `Note: ${warn.note}\n`;
					Page.description += `Received DM: ${warn.userDmd}\n\n`;
				}


				// for (let j = 0; j < 8; j++) {
				// 	for (let k = 0; k < warns.length; k++) {
				// 		if (k >= i * 8 + j) {
				// 			const warn = warns[k];

				// 			Page.title = `${warn.userTag}'s warnings`;
				// 			Page.description += `Warn **${warn.uuid}**\n> Warned by ${warn.moderator} ||[${warn.moderatorId}]|| on <t:${Math.ceil(warn.date/1000)}> for "${warn.reason}"\nNote: ${warn.note}\nReceived DM: ${warn.userDmd}\n\n`;
				// 			break;
				// 		}
				// 	}
				// }

				Pages.push(Page);
			}

			Paginate(interaction, Pages, 60000, false);
		} else {
			interaction.reply({
				embeds: [
					{
						title: `${Icons.exclamation}  All clean`,
						description: `${user.tag} doesn't have any warns!`,
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://cdn.senko.gg/public/senko/book.png" }
					}
				]
			});
		}
	}
} as SenkoCommand;