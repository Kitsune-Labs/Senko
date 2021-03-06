module.exports = {
	name: "delete",
	desc: "Delete all your Account data",
	options: [
		{
			name: "data",
			type: 1,
			description: "data"
		}
	],
	usableAnywhere: true,
	category: "account",
	/**
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction) => {
		interaction.reply({
			embeds: [
				{
					title: "Data Removal",
					description: "Please confirm that you want to delete all your data.\n\n**⚠️ This is irreversible! ⚠️**",
					color: SenkoClient.colors.dark,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/upset2.png" }
				}
			],
			components: [
				{
					type: 1,
					components: [
						{ type: 2, label: "I wan't to delete ALL my data and I know this is irreversible.", style: 4, custom_id: "B0BB293E-C99E-467C-84DA-663BE1F5EF85" }
					]
				}
			],
			ephemeral: true,
			fetchReply: true
		});
	}
};