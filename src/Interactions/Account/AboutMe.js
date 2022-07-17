// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Modal } = require("discord.js");
const { updateSuperUser } = require("../../API/super");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

module.exports = {
	name: "about-me",
	desc: "Modify your about me message!",
	options: [
		{
			name: "change",
			description: "Update your about me message",
			type: 1
		},
		{
			name: "remove",
			description: "Remove your about me",
			type: 1
		}
	],
	usableAnywhere: true,
	category: "account",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, guildData, accountData) => {
		const commandType = interaction.options.getSubcommand();

		if (commandType === "change") {
			interaction.showModal(new Modal({
				title: "About Me",
				customId: "submit_about_me",
				components: [
					{
						type: 1,
						components: [
							{
								type: 4,
								style: 2,
								label: "Enter your new about me",
								custom_id: "submit_about_me_1",
								required: true,
								maxLength: 100,
								minLength: 1
							}
						]
					}
				]
			}));
		}

		if (commandType === "remove") {
			accountData.LocalUser.profileConfig.aboutMe = null;

			await updateSuperUser(interaction.user, {
				LocalUser: accountData.LocalUser
			});

			interaction.reply({
				embeds: [
					{
						title: `${Icons.question}  I have removed your About Me ${interaction.user.username}`,
						description: "But I am confused on why you would remove it!",
						color: SenkoClient.colors.light,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/senko/smile2.png"
						}
					}
				]
			});
		}
	}
};