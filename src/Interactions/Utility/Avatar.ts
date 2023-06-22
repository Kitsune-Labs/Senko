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
	start: async ({ Senko, Interaction }) => {
		const User: any = Interaction.options.getUser("user") || Interaction.member;
		// @ts-ignore
		const AvatarURL = User.user ? User.user.avatarURL({ size: 2048 }) : User.avatarURL({ size: 2048 }) as User;
		// const blur = Interaction.options.get("blur") ? "spoiler_" : "";

		const messageStruct = {
			embeds: [
				{
					author: {
						name: User.user ? User.user.tag : User.tag
					},
					title: "Avatar",
					description: AvatarURL ? null : "This user doesn't have an avatar",
					image: {
						url: AvatarURL ? AvatarURL : "https://cdn.senko.gg/public/DiscordAvatar.png"
					},
					color: Senko.Theme.light
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
			url: `https://discord.com/api/v9/users/${User.id}`,
			method: "GET",
			headers: {
				"User-Agent": Senko.UserAgent,
				"Authorization": `Bot ${Senko.token}`
			}
		}).then(async (response) => {
			if (response.data.banner) {
				const ext = await response.data.banner.startsWith("a_") ? ".gif" : ".png";

				// @ts-expect-error
				messageStruct.embeds.push({
					title: "Banner",
					color: Senko.Theme.dark,
					image: {
						url: `https://cdn.discordapp.com/banners/${User.id}/${response.data.banner}${ext}?size=2048`
					}
				});

				messageStruct.components[0]!.components[1]!.disabled = false;
				messageStruct.components[0]!.components[1]!.url = `https://cdn.discordapp.com/banners/${User.id}/${response.data.banner}${ext}?size=2048`;
			}

			// @ts-expect-error
			Interaction.followUp(messageStruct);
		});
	}
} as SenkoCommand;