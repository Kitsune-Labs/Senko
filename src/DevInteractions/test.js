module.exports = {
	name: "test",
	desc: "test",
	usableAnywhere: true,
	category: "utility",
	/**
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction) => {
		interaction.reply({
			content: "Test",
			ephemeral: true
		});
	}
};