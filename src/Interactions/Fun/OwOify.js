const { owoify } = require("@kitsune-labs/utilities");

module.exports = {
	name: "owoify",
	desc: "UwU OwO",
	options: [
		{
			name: "text",
			description: "Text to OwOify",
			type: 3,
			required: true
		}
	],
	usableAnywhere: true,
	category: "fun",
	/**
     * @param {CommandInteraction} interaction
     */
	start: async ({interaction}) => {
		interaction.reply({
			content: owoify(interaction.options.getString("text")),
			ephemeral: true
		});
	}
};