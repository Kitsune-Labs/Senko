import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import axios from "axios";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "whois",
	desc: "Account information",
	options: [
		{
			name: "user",
			description: "User",
			type: CommandOption.User,
			required: false
		},
		{
			name: "show-roles",
			description: "Shows the roles the member has",
			type: CommandOption.Boolean,
			default: false
		}
	],
	defer: true,
	usableAnywhere: true,
	category: "utility",
	whitelist: true,
	start: async ({senkoClient, interaction, guildData}) => {
		const whoUser = await interaction.options.getUser("user") || interaction.user;
		// @ts-expect-error
		const guildMember = interaction.guild!.members.cache.get(whoUser.id || whoUser);
		const AvatarURL = guildMember && guildMember.user ? guildMember.user.avatarURL({ size: 2048 }) : null;
		// @ts-expect-error
		const warns = guildData.warns[whoUser.id || whoUser] ? guildData.warns[whoUser.id || whoUser].length : 0;

		axios({
			url: `https://discord.com/api/users/${whoUser.id || whoUser}`,
			method: "GET",
			headers: {
				"User-Agent": senkoClient.api.UserAgent,
				"Authorization": `Bot ${senkoClient.token}`
			}
		}).then(async ({ data: userData }) => {
			const banStatus = await interaction.guild!.bans.fetch(userData.id).catch(()=>null);

			/**
			 * @type {Message}
			 */
			const messageStruct = {
				embeds: [
					{
						// @ts-ignore
						description: `${guildMember && guildMember.nickname ? guildMember.nickname : `<@${userData.id}> ${userData.username}#${userData.discriminator} [${userData.id}]`}\n\nBot: ${userData.bot ? "**Yes**" : "**No**"}\nBooster: ${guildMember && guildMember.premiumSinceTimestamp ? `**Yes**\n> **Booster since** <t:${Math.ceil(guildMember.premiumSinceTimestamp / 1000)}>` : "**No**"}\nRegistered on ${whoUser.createdTimestamp ? `<t:${parseInt(whoUser.createdTimestamp / 1000)}>` : "unknown (Most likely not in Guild)" }\nJoined: ${guildMember ? `<t:${parseInt(guildMember.joinedTimestamp / 1000)}>` : "**unknown (Most likely not in Guild)**"}\nBanned: ${banStatus ? `**Yes**\n> **Ban Reason:** ${banStatus.reason}` : "**No**"}\nWarnings Received: **${warns}**`,
						color: 0xfc844c,
						thumbnail: {
							url: AvatarURL ? AvatarURL : null
						},
						fields: [],
						image: {
							url: ""
						}
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

			// @ts-expect-error
			if (interaction.options.getBoolean("show-roles") === true && guildMember) messageStruct.embeds[0]!.fields.push([
				{ name: "Roles", value: `${guildMember.roles.cache.size === 1 ? "No Roles" : interaction.options.getBoolean("show-roles") ? `${guildMember.roles.cache.map(u=>u).join(" ").replace("@everyone", "")}` : `**${guildMember.roles.cache.size - 1}** roles`}`}
			]);

			if (userData.banner) {
				const extension = await userData.banner.startsWith("a_") ? ".gif" : ".png";

				messageStruct.embeds[0]!.image.url = `https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}${extension}?size=2048`;
				messageStruct.components[0]!.components[1]!.disabled = false;
				messageStruct.components[0]!.components[1]!.url = `https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}${extension}?size=2048`;
			}

			// @ts-expect-error
			return interaction.followUp(messageStruct);
		});
	}
} as SenkoCommand;