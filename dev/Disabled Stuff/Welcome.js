// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { print } = require("../../src/API/Master.jsster.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../src/Data/Icons.jsonns.json");
const axios = require("axios");
const { fetchSuperGuild } = require("../../src/API/super.jsuper.js");

// Constants
// _GUILD_ = Guild Name
// _USER_ = Member joined Name (e.g. Senko)
// _TAG_ = Member joined Username + tag (e.g. Senko#3349)
// _ACCENT_ = Member color accent
// _AVATAR_ = Member avatar (Dynamic)

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	execute: async (SenkoClient) => {
		// SenkoClient.on("guildMemberAdd", async (member) => {
		//     const guildData = await fetchSuperGuild(member.guild);

		//     axios.request({
		//         url: `https://discord.com/api/v9/users/${member.user.id}`,
		//         method: "GET",
		//         headers: {
		//             "User-Agent": SenkoClient.api.UserAgent,
		//             "Authorization": `Bot ${process.env.TOKEN}`
		//         }
		//     }).then(async (response) => {
		//         function replaceString(string) {
		//             return string.replaceAll("_GUILD_", member.guild.name).replaceAll("_USER_", member.user.username).replaceAll("_TAG_", member.user.tag).replaceAll("_ACCENT_", response.data.banner_color).replaceAll("_AVATAR_", member.user.displayAvatarURL({ dynamic: true }));
		//         }


		//         if (guildData.WelcomeChannel.config.channel !== null) {
		//             const welcomeMessage = guildData.WelcomeChannel.message;

		//             for (var embed of welcomeMessage.embeds) {

		//                 embed.title ? embed.title = replaceString(embed.title) : null;
		//                 embed.description ? embed.description = replaceString(embed.description) : null;
		//                 embed.color ? embed.color == "_ACCENT_" ? embed.color = response.data.banner_color : null : embed.color = SenkoClient.api.Theme.light;
		//                 embed.thumbnail ? embed.thumbnail.url == "_AVATAR_" ? embed.thumbnail.url = member.user.displayAvatarURL({ dynamic: true }) : embed.thumbnail.url : embed.thumbnail = null;
		//                 embed.image ? embed.image.url == "_AVATAR_" ? embed.image.url = member.user.displayAvatarURL({ dynamic: true }) : embed.image.url : embed.image = null;
		//                 embed.footer ? embed.footer.text = replaceString(embed.footer.text) : embed.footer = null;

		//                 embed.author = null;
		//             }

		//             member.guild.channels.cache.get(guildData.WelcomeChannel.config.channel).send(guildData.WelcomeChannel.message);
		//         }
		//     });
		// });
	}
};