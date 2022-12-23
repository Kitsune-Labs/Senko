// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, ApplicationCommandOptionType: CommandOption } = require("discord.js");
const _super = require("../API/super.js");

module.exports = {
	name: "make-data",
	desc: "developer tool",
	options: [
		{
			name: "user",
			description: "user",
			type: CommandOption.User,
			required: true
		}
	],
	usableAnywhere: true,
	category: "utility",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({interaction}) => {
		const check = await _super.makeSuperUser(interaction.options.getUser("user"));

		if (check) {
			await interaction.reply({content:`Done ${interaction.options.getUser("user").id}`, ephemeral: true});
		} else {
			await interaction.reply({content:"error", ephemeral: true});
		}
	}
};