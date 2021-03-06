// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const Paginate = require("../../API/Pagination/Main");

module.exports = {
	name: "warns",
	desc: "View warns for a user",
	defer: false,
	usableAnywhere: true,
	category: "admin",
	options: [
		{
			name: "user",
			description: "The user to view warns for",
			type: 6
		}
	],
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, AccountData) => {
		const user = interaction.options.getUser("user") || interaction.user;

		if (GuildData.warns[user.id]) {
			const warns = GuildData.warns[user.id];
			const PageEstimate = Math.ceil(warns.length / 8) < 1 ? 1 : Math.ceil(warns.length / 8);
			const Pages = [];

			for (let i = 0; i < PageEstimate; i++) {
				const Page = {
					description: "",
					color: SenkoClient.colors.light
				};

				for (let j = 0; j < 8; j++) {
					for (let k = 0; k < warns.length; k++) {
						if (k >= i * 8 + j) {
							const warn = warns[k];

							Page.title = `${warn.userTag}'s warnings`;
							Page.description += `Warn ${warn.uuid}\n> Warned by ${warn.moderator} ||[${warn.moderatorId}]|| on <t:${Math.ceil(warn.date/1000)}> for "${warn.reason}"\nNote: ${warn.note}\nReceived DM: ${warn.userDmd}\n\n`;
							break;
						}
					}
				}

				Pages.push(Page);
			}

			Paginate(interaction, Pages, 60000, false);
		} else {
			interaction.reply({
				embeds: [
					{
						title: `${Icons.exclamation}  All clean`,
						description: `${user.tag} doesn't have any warns!`,
						color: SenkoClient.colors.dark,
						thumbnail: { url: "https://assets.senkosworld.com/media/senko/book.png" }
					}
				]
			});
		}
	}
};