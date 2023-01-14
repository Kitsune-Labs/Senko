module.exports = {
	name: "rate",
	desc: "Rate something",
	options: [
		{
			name: "thing",
			description: "What should I rate?",
			type: 3,
			required: true
		}
	],
	usableAnywhere: true,
	category: "fun",
	/**
     * @param {CommandInteraction} interaction
     */
	start: async ({senkoClient, interaction}) => {
		const Item = interaction.options.getString("thing");

		const MessageBuild = {
			embeds: [
				{
					title: "Let me think...",
					description: `I rate **${Item}** a ${Math.floor(Math.random() * 10)}/10!`,
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/think.png"
					}
				}
			]
		};

		if (Item.toLowerCase() === "senko" || Item.toLowerCase() === "senko-san") {
			MessageBuild.embeds[0].title = "I don't need to think!";
			MessageBuild.embeds[0].description = "I'm obviously a 10/10!";

			MessageBuild.embeds[0].thumbnail.url = "https://assets.senkosworld.com/media/senko/bless.png";
		}

		interaction.reply(MessageBuild);
	}
};