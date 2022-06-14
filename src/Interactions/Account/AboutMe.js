// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const { updateUser } = require("../../API/Master");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const DiscordModal = require("discord-modal");

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
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, AccountData) => {
		const commandType = interaction.options.getSubcommand();
		if (commandType === "change") {
			const textinput = new DiscordModal.TextInput()
				.setCustomId("submit_about_me")
				.setTitle("Change your About Me")
				.addComponents(
					new DiscordModal.TextInputField()
						.setLabel("About Me")
						.setStyle(2)
						.setPlaceholder("Enter your new about me")
						.setCustomId("submit_about_me_1")
						.setRequired(true)
						.setMax(100)
						.setMin(1)
				);

			await SenkoClient.TextInputs.open(interaction, textinput);
		}

		if (commandType === "remove") {
			await updateUser(interaction.user, {
				LocalUser: {
					AboutMe: null
				}
			});

			interaction.followUp({
				embeds: [
					{
						title: `${Icons.question}  I have removed your About Me ${interaction.user.username}`,
						description: "But I am confused on why you would remove it!",
						color: SenkoClient.colors.light,
						thumbnail: {
							url: "attachment://image.png"
						}
					}
				],
				files: [{ attachment: "./src/Data/content/senko/smile2.png", name: "image.png" }]
			});
		}
	}
};