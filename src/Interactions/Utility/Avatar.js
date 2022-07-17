// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client, Message } = require("discord.js");
const axios = require("axios");

module.exports = {
	name: "avatar",
	desc: "View someone's avatar, and banner if they have one",
	options: [
		{
			name: "user",
			description: "User",
			type: 6,
			required: false
		}
	],
	defer: true,
	usableAnywhere: true,
	category: "utility",
	/**
     * @param {Client} SenkoClient
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction) => {
		const User = interaction.options.getUser("user") || interaction.member;
		const AvatarURL = User.user ? User.user.avatarURL({ dynamic: true, size: 2048 }) : User.avatarURL({ dynamic: true, size: 2048 });

		/**
         * @type {Message}
         */
		const messageStruct = {
			embeds: [
				{
					author: {
						name: User.user ? User.user.tag : User.tag
					},
					title: "Avatar",
					description: AvatarURL ? null : "This user doesn't have an avatar",
					image: {
						url: AvatarURL ? AvatarURL : "attachment://image.png"
					},
					color: SenkoClient.colors.light
				}
			],
			files: AvatarURL ? null : [{ attachment: "./src/Data/content/DiscordAvatar.png", name: "image.png" }],
			components: [
				{
					type: "ACTION_ROW",
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
				"User-Agent": SenkoClient.tools.UserAgent,
				"Authorization": `Bot ${SenkoClient.token}`
			}
		}).then(async (response) => {
			if (response.data.banner) {
				const ext = await response.data.banner.startsWith("a_") ? ".gif" : ".png";

				messageStruct.embeds.push({
					title: "Banner",
					color: SenkoClient.colors.dark,
					image: {
						url: `https://cdn.discordapp.com/banners/${User.id}/${response.data.banner}${ext}?size=2048`
					}
				});

				messageStruct.components[0].components[1].disabled = false;
				messageStruct.components[0].components[1].url = `https://cdn.discordapp.com/banners/${User.id}/${response.data.banner}${ext}?size=2048`;
			}

			interaction.followUp(messageStruct);
		});
	}
};