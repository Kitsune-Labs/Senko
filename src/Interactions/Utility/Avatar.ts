import { ApplicationCommandOptionType as CommandOption, User } from "discord.js";
import axios from "axios";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "avatar",
	desc: "View someone's avatar, and banner if they have one",
	options: [
		{
			name: "user",
			description: "User",
			type: CommandOption.User,
			required: false
		}
		// {
		// 	name: "blur",
		// 	description: "Blur media, useful for server mods",
		// 	type: CommandOption.Boolean
		// }
	],
	defer: true,
	usableAnywhere: true,
	category: "utility",
	whitelist: true,
	start: async ({senkoClient, interaction}) => {
		const User = interaction.options.getUser("user") || interaction.member;
		// @ts-ignore
		const AvatarURL = User.user ? User.user.avatarURL({ size: 2048 }) : User.avatarURL({ size: 2048 }) as User;
		// const blur = interaction.options.get("blur") ? "spoiler_" : "";

		const messageStruct = {
			embeds: [
				{
					author: {
						// @ts-expect-error
						name: User.user ? User.user.tag : User.tag
					},
					title: "Avatar",
					description: AvatarURL ? null : "This user doesn't have an avatar",
					image: {
						url: AvatarURL ? AvatarURL : "https://cdn.senko.gg/public/DiscordAvatar.png"
					},
					color: senkoClient.api.Theme.light
				}
			],
			components: [
				{
					type: 1,
					components: [
						{ type: 2, label: "Avatar", style: 5, url: AvatarURL ? AvatarURL : "https://discord.com/404", disabled: AvatarURL ? false : true },
						{ type: 2, label: "Banner", style: 5, url: "https://discord.com/404", disabled: true }
					]
				}
			]
		};

		axios({
			// @ts-expect-error
			url: `https://discord.com/api/v9/users/${User.id}`,
			method: "GET",
			headers: {
				"User-Agent": senkoClient.api.UserAgent,
				"Authorization": `Bot ${senkoClient.token}`
			}
		}).then(async (response) => {
			if (response.data.banner) {
				const ext = await response.data.banner.startsWith("a_") ? ".gif" : ".png";

				// @ts-expect-error
				messageStruct.embeds.push({
					title: "Banner",
					color: senkoClient.api.Theme.dark,
					image: {
						// @ts-expect-error
						url: `https://cdn.discordapp.com/banners/${User.id}/${response.data.banner}${ext}?size=2048`
					}
				});

				messageStruct.components[0]!.components[1]!.disabled = false;
				// @ts-expect-error
				messageStruct.components[0]!.components[1]!.url = `https://cdn.discordapp.com/banners/${User.id}/${response.data.banner}${ext}?size=2048`;
			}

			// @ts-expect-error
			interaction.followUp(messageStruct);
		});
	}
} as SenkoCommand;